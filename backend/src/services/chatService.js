const DoctorSlot = require('../models/DoctorSlot');
const ChatMessage = require('../models/ChatMessage');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');

/**
 * Check if the current time is within a slot's time window.
 * Uses startDateTime/endDateTime if available, otherwise falls back to
 * date + from/to string comparison.
 */
const isTimeWithinSlot = (slot) => {
  const now = new Date();

  // Primary: use exact startDateTime and endDateTime if both are set
  if (slot.startDateTime && slot.endDateTime) {
    const start = new Date(slot.startDateTime);
    const end = new Date(slot.endDateTime);
    return now >= start && now <= end;
  }

  // Fallback: compare date string + from/to time strings
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (slot.date !== todayStr) return false;

  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const [fromHour, fromMin] = slot.from.split(':').map(Number);
  const fromTotalMins = fromHour * 60 + fromMin;

  const [toHour, toMin] = slot.to.split(':').map(Number);
  const toTotalMins = toHour * 60 + toMin;

  // Handle midnight crossing (e.g. from 23:30, to 00:00)
  if (toTotalMins <= fromTotalMins) {
    // Slot crosses midnight: valid if current >= from OR current <= to
    return currentTotalMins >= fromTotalMins || currentTotalMins <= toTotalMins;
  }

  return currentTotalMins >= fromTotalMins && currentTotalMins <= toTotalMins;
};

/**
 * Compute startDateTime and endDateTime from slot.date + slot.from/slot.to
 * and save them if missing. This backfills old slots.
 */
const ensureDateTimeFields = async (slot) => {
  if (slot.startDateTime && slot.endDateTime) return slot;

  const [y, mo, d] = slot.date.split('-').map(Number);
  const [fh, fm] = slot.from.split(':').map(Number);
  const [th, tm] = slot.to.split(':').map(Number);

  const startDT = new Date(y, mo - 1, d, fh, fm, 0);
  let endDT = new Date(y, mo - 1, d, th, tm, 0);

  // Handle midnight crossing
  if (endDT <= startDT) {
    endDT.setDate(endDT.getDate() + 1);
  }

  slot.startDateTime = startDT;
  slot.endDateTime = endDT;

  try {
    await slot.save();
    logger.info(`Backfilled DateTime for slot ${slot._id}`);
  } catch (err) {
    logger.error(`Failed to backfill DateTime for slot ${slot._id}: ${err.message}`);
  }

  return slot;
};

/**
 * Validates if a user can access a specific chat room (slot).
 */
const validateChatAccess = async (slotId, userId, userRole) => {
  let slot = await DoctorSlot.findById(slotId);
  if (!slot || !['booked', 'pending'].includes(slot.status)) {
    return { valid: false, message: 'Invalid or unbooked appointment slot.' };
  }

  // Ensure startDateTime/endDateTime are present
  slot = await ensureDateTimeFields(slot);

  // Check matching participants
  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor || slot.doctorId.toString() !== doctor._id.toString()) {
      return { valid: false, message: 'Unauthorized for this chat.' };
    }
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    if (!patient || slot.patientId !== patient._id.toString()) {
      return { valid: false, message: 'Unauthorized for this chat.' };
    }
  } else {
    return { valid: false, message: 'Invalid role for chat.' };
  }

  // Check time window
  if (!isTimeWithinSlot(slot)) {
    return { valid: false, message: 'Chat is only available during the scheduled appointment time window.' };
  }

  return { valid: true, slot };
};

/**
 * Get active chats (appointments currently happening).
 * Fetches all booked/pending slots for today and filters by time window.
 */
const getActiveChats = async (userId, userRole) => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  // Also check yesterday for midnight-crossing slots
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  let filter = { 
    status: { $in: ['booked', 'pending'] },
    $or: [
      // Slots with proper DateTime fields that cover now
      { startDateTime: { $lte: now }, endDateTime: { $gte: now } },
      // Slots for today (will be time-filtered below)
      { date: todayStr },
      // Slots from yesterday that might cross midnight
      { date: yesterdayStr },
    ]
  };

  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) return [];
    filter.doctorId = doctor._id;
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    if (!patient) return [];
    filter.patientId = patient._id.toString();
  } else {
    return [];
  }

  logger.info(`getActiveChats filter: ${JSON.stringify(filter)}`);

  const slots = await DoctorSlot.find(filter).populate('doctorId', 'firstName lastName specialisation profilePicture');
  
  logger.info(`getActiveChats found ${slots.length} candidate slots`);

  // Filter by time window and map data
  const activeChats = [];
  for (let slot of slots) {
    // Backfill DateTime fields if missing
    slot = await ensureDateTimeFields(slot);

    if (isTimeWithinSlot(slot)) {
      let partnerName = '';
      let partnerId = '';
      let partnerRole = '';

      if (userRole === 'DOCTOR') {
        partnerName = slot.patient;
        partnerId = slot.patientId;
        partnerRole = 'PATIENT';
      } else {
        partnerName = `Dr. ${slot.doctorId?.firstName || ''} ${slot.doctorId?.lastName || ''}`;
        partnerId = slot.doctorId?._id.toString();
        partnerRole = 'DOCTOR';
      }

      activeChats.push({
        slotId: slot._id,
        date: slot.date,
        time: `${slot.from} - ${slot.to}`,
        partnerName,
        partnerId,
        partnerRole,
      });
    }
  }

  logger.info(`getActiveChats returning ${activeChats.length} active chats`);
  return activeChats;
};

/**
 * Get chat history (appointments that had chats)
 */
const getChatHistory = async (userId, userRole) => {
  let filter = {};

  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) return [];
    filter.doctorId = doctor._id;
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    if (!patient) return [];
    filter.patientId = patient._id.toString();
  } else {
    return [];
  }

  // Get all slots for this user where there might be chats
  const slots = await DoctorSlot.find(filter).populate('doctorId', 'firstName lastName specialisation').lean();
  const slotIds = slots.map(s => s._id);

  // Find all distinct slots that have messages
  const slotsWithMessages = await ChatMessage.distinct('appointmentSlotId', { appointmentSlotId: { $in: slotIds } });

  // Map the return data
  const history = slots.filter(s => slotsWithMessages.some(id => id.toString() === s._id.toString())).map(slot => {
    let partnerName = '';
    
    if (userRole === 'DOCTOR') {
      partnerName = slot.patient;
    } else {
      partnerName = `Dr. ${slot.doctorId?.firstName || ''} ${slot.doctorId?.lastName || ''}`;
    }

    return {
      slotId: slot._id,
      date: slot.date,
      time: `${slot.from} - ${slot.to}`,
      partnerName,
      status: slot.status,
    };
  });

  return history.sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * Get messages for a specific chat
 */
const getMessages = async (slotId, userId, userRole) => {
  const slot = await DoctorSlot.findById(slotId);
  if (!slot) {
    const err = new Error('Slot not found');
    err.statusCode = 404;
    throw err;
  }

  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor || slot.doctorId.toString() !== doctor._id.toString()) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    if (!patient || slot.patientId !== patient._id.toString()) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }
  }

  const messages = await ChatMessage.find({ appointmentSlotId: slotId })
    .sort({ sentAt: 1 })
    .populate('senderId', 'email');

  return messages.map(m => ({
    id: m._id,
    senderId: m.senderId._id,
    senderRole: m.senderRole,
    message: m.message,
    sentAt: m.sentAt,
  }));
};

/**
 * Save a new message
 */
const saveMessage = async (slotId, userId, userRole, messageText) => {
  const msg = await ChatMessage.create({
    appointmentSlotId: slotId,
    senderId: userId,
    senderRole: userRole,
    message: messageText,
  });

  return {
    id: msg._id,
    senderId: msg.senderId,
    senderRole: msg.senderRole,
    message: msg.message,
    sentAt: msg.sentAt,
  };
};

module.exports = {
  getActiveChats,
  getChatHistory,
  getMessages,
  saveMessage,
  validateChatAccess,
};
