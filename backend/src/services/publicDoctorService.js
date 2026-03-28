const Doctor = require('../models/Doctor');
const DoctorSlot = require('../models/DoctorSlot');
const DoctorAvailability = require('../models/DoctorAvailability');

const pad = n => String(n).padStart(2, '0');
const SLOT_DURATION = 30; // minutes — matches frontend

/**
 * Generate 30-min slot times between startTime and endTime.
 */
const generateSlotTimes = (startTime, endTime) => {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  while (cur + SLOT_DURATION <= end) {
    const fromH = Math.floor(cur / 60), fromM = cur % 60;
    const toH = Math.floor((cur + SLOT_DURATION) / 60), toM = (cur + SLOT_DURATION) % 60;
    slots.push({ from: `${pad(fromH)}:${pad(fromM)}`, to: `${pad(toH)}:${pad(toM)}` });
    cur += SLOT_DURATION;
  }
  return slots;
};

/**
 * List doctors with availability info for patient booking.
 * Supports ?search= and ?specialty= filters.
 */
const listDoctors = async (query) => {
  const filter = {};

  if (query.specialty && query.specialty !== 'All') {
    filter.specialisation = query.specialty;
  }

  if (query.search) {
    const term = query.search;
    filter.$or = [
      { firstName: { $regex: term, $options: 'i' } },
      { lastName: { $regex: term, $options: 'i' } },
      { specialisation: { $regex: term, $options: 'i' } },
      { department: { $regex: term, $options: 'i' } },
    ];
  }

  const doctors = await Doctor.find(filter).lean();

  // Get all availability records for matched doctors
  const doctorIds = doctors.map(d => d._id);
  const availabilities = await DoctorAvailability.find({ doctorId: { $in: doctorIds } }).lean();
  const availMap = {};
  availabilities.forEach(a => { availMap[a.doctorId.toString()] = a; });

  return doctors.map(doc => {
    const avail = availMap[doc._id.toString()];
    return {
      id: doc._id,
      name: `Dr. ${doc.firstName} ${doc.lastName}`,
      specialty: doc.specialisation || '',
      illness: [],
      fee: avail?.consultationFee || 0,
      rating: 4.5,
      reviews: 0,
      exp: doc.yearsOfExperience || 0,
      hospital: doc.department || '',
      education: doc.qualifications || '',
      bio: doc.bio || '',
      img: `${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`,
    };
  });
};

/**
 * Get specialties list from all doctors.
 */
const getSpecialties = async () => {
  const specialties = await Doctor.distinct('specialisation');
  return ['All', ...specialties.filter(Boolean)];
};

/**
 * Get slots for a doctor on a given date.
 * 
 * This merges:
 *   1. Virtual slots generated from DoctorAvailability (30-min intervals)
 *   2. Actual DoctorSlot records from DB (booked/pending/rejected)
 *
 * For each time slot:
 *   - If a DoctorSlot record exists → show its status (booked/pending/rejected)
 *   - If no record exists → show as "vacant" (bookable)
 */
const getDoctorSlots = async (doctorId, date) => {
  if (!date || !date.includes('-')) {
    const err = new Error('Valid date query parameter (YYYY-MM-DD) is required');
    err.statusCode = 400;
    throw err;
  }

  // Check if this date falls on the doctor's working days using local time to avoid timezone offset issues
  const [y, m, d] = date.split('-').map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay(); // 0=Sun, 1=Mon, ...
  
  let avail = await DoctorAvailability.findOne({ doctorId });
  if (!avail) {
    // Create default availability if none exists
    avail = { startTime: '09:00', endTime: '17:00', consultationFee: 150, workingDays: [1, 2, 3, 4, 5] };
  }

  // If not a working day, return empty
  if (!avail.workingDays.includes(dayOfWeek)) {
    return [];
  }

  // Generate all possible slot times from availability
  const allSlotTimes = generateSlotTimes(avail.startTime, avail.endTime);

  // Get actual booked/pending/rejected slot records from DB for this date
  const existingSlots = await DoctorSlot.find({ doctorId, date }).lean();
  const slotMap = {};
  existingSlots.forEach(s => {
    slotMap[s.from] = s;
  });

  // Merge: for each generated time, check if a DB record exists
  return allSlotTimes.map(timeSlot => {
    const existing = slotMap[timeSlot.from];
    if (existing) {
      // Slot has a booking record. If rejected, it's considered vacant again.
      const isVacant = existing.status === 'vacant' || existing.status === 'rejected';
      return {
        id: existing._id,
        time: existing.from,
        status: isVacant ? 'vacant' : 'booked',
      };
    }
    // No record in DB → this is a vacant slot
    // We need to create a temporary ID so the frontend can book it
    return {
      id: `virtual_${doctorId}_${date}_${timeSlot.from}`,
      time: timeSlot.from,
      toTime: timeSlot.to,
      status: 'vacant',
      _isVirtual: true, // Flag for booking logic
    };
  });
};

module.exports = { listDoctors, getSpecialties, getDoctorSlots };
