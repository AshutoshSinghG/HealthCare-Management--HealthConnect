const DoctorSlot = require('../models/DoctorSlot');
const ChatMessage = require('../models/ChatMessage');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

/**
 * Check if the current time is within a slot's time window on the correct date.
 */
const isTimeWithinSlot = (slot) => {
  const now = new Date();

  // Primary exact match using startDateTime and endDateTime
  if (slot.startDateTime && slot.endDateTime) {
    return now >= new Date(slot.startDateTime) && now <= new Date(slot.endDateTime);
  }

  // Fallback for older slots lacking startDateTime/endDateTime
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (slot.date !== todayStr) return false;

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMinute;

  const [fromHour, fromMin] = slot.from.split(':').map(Number);
  const fromTotalMins = fromHour * 60 + fromMin;

  const [toHour, toMin] = slot.to.split(':').map(Number);
  const toTotalMins = toHour * 60 + toMin;

  return currentTotalMins >= fromTotalMins && currentTotalMins <= toTotalMins;
};

/**
 * Validates if a user can access a specific chat room (slot).
 */
const validateChatAccess = async (slotId, userId, userRole) => {
  const slot = await DoctorSlot.findById(slotId);
  if (!slot || !['booked', 'pending'].includes(slot.status)) {
    return { valid: false, message: 'Invalid or unbooked appointment slot.' };
  }

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
 * Get active chats (appointments currently happening)
 */
const getActiveChats = async (userId, userRole) => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let filter = { 
    status: { $in: ['booked', 'pending'] },
    $or: [
      { startDateTime: { $lte: now }, endDateTime: { $gte: now } },
      { date: todayStr } // Fallback for older records
    ]
  };

  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    filter.doctorId = doctor ? doctor._id : null;
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    filter.patientId = patient ? patient._id.toString() : null;
  } else {
    return [];
  }

  const slots = await DoctorSlot.find(filter).populate('doctorId', 'firstName lastName specialisation profilePicture');
  
  // Filter by time window and map data
  const activeChats = [];
  for (const slot of slots) {
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

  return activeChats;
};

/**
 * Get chat history (appointments that had chats)
 */
const getChatHistory = async (userId, userRole) => {
  let filter = {};

  if (userRole === 'DOCTOR') {
    const doctor = await Doctor.findOne({ userId });
    filter.doctorId = doctor ? doctor._id : null;
  } else if (userRole === 'PATIENT') {
    const patient = await Patient.findOne({ userId });
    filter.patientId = patient ? patient._id.toString() : null;
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
  // Can either be active or history, so we don't strictly enforce time window here,
  // but we must enforce authorization.
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
