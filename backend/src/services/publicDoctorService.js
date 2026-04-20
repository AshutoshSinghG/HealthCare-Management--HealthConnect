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
  let end = eh * 60 + em;
  
  if (end <= cur) {
    end += 24 * 60; // Handle spanning across midnight
  }
  
  while (cur + SLOT_DURATION <= end) {
    const fromH = Math.floor(cur / 60) % 24, fromM = cur % 60;
    const toH = Math.floor((cur + SLOT_DURATION) / 60) % 24, toM = (cur + SLOT_DURATION) % 60;
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

  const ratingService = require('./ratingService');
  const ratingMap = await ratingService.getMultipleDoctorAverages(doctorIds);

  return doctors.map(doc => {
    const avail = availMap[doc._id.toString()];
    const ratingData = ratingMap[doc._id.toString()] || { averageRating: 0, totalReviews: 0 };
    return {
      id: doc._id,
      name: `Dr. ${doc.firstName} ${doc.lastName}`,
      specialty: doc.specialisation || '',
      illness: [],
      fee: avail?.consultationFee || 0,
      rating: ratingData.averageRating,
      reviews: ratingData.totalReviews,
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
 * Returns an object with:
 *   - slots: array of slot objects
 *   - isWorkingDay: whether the selected date is a working day
 *   - workingDays: the doctor's configured working days
 *   - availability: start/end times and fee info
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

  // Normalize date to YYYY-MM-DD (strip any time portion or extra characters)
  const normalizedDate = date.trim().substring(0, 10);

  // Check if this date falls on the doctor's working days using local time to avoid timezone offset issues
  const [y, m, d] = normalizedDate.split('-').map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay(); // 0=Sun, 1=Mon, ...

  const dayNameMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  let avail = await DoctorAvailability.findOne({ doctorId });
  if (!avail) {
    // Persist default availability so it's consistent across the system
    avail = await DoctorAvailability.create({
      doctorId,
      startTime: '09:00',
      endTime: '17:00',
      consultationFee: 150,
      workingDays: [1, 2, 3, 4, 5],
    });
  }

  const isWorkingDay = avail.workingDays.includes(dayOfWeek);

  // If not a working day, return empty slots with context
  if (!isWorkingDay) {
    return {
      slots: [],
      isWorkingDay: false,
      selectedDay: dayNameMap[dayOfWeek],
      workingDays: avail.workingDays.map(wd => dayNameMap[wd]),
      availability: {
        startTime: avail.startTime,
        endTime: avail.endTime,
        consultationFee: avail.consultationFee,
      },
    };
  }

  // Generate all possible slot times from availability
  const allSlotTimes = generateSlotTimes(avail.startTime, avail.endTime);

  // Get actual booked/pending/rejected slot records from DB for this date
  const existingSlots = await DoctorSlot.find({ doctorId, date: normalizedDate }).lean();
  const slotMap = {};
  existingSlots.forEach(s => {
    slotMap[s.from] = s;
  });

  // Merge: for each generated time, check if a DB record exists
  const slots = allSlotTimes.map(timeSlot => {
    const existing = slotMap[timeSlot.from];
    if (existing) {
      // Slot has a booking record. If rejected, it's considered vacant again.
      const isVacant = existing.status === 'vacant' || existing.status === 'rejected';
      return {
        id: existing._id,
        time: existing.from,
        status: isVacant ? 'vacant' : existing.status === 'pending' ? 'pending' : 'booked',
      };
    }
    // No record in DB → this is a vacant slot
    // We need to create a temporary ID so the frontend can book it
    return {
      id: `virtual_${doctorId}_${normalizedDate}_${timeSlot.from}`,
      time: timeSlot.from,
      toTime: timeSlot.to,
      status: 'vacant',
      _isVirtual: true, // Flag for booking logic
    };
  });

  return {
    slots,
    isWorkingDay: true,
    selectedDay: dayNameMap[dayOfWeek],
    workingDays: avail.workingDays.map(wd => dayNameMap[wd]),
    availability: {
      startTime: avail.startTime,
      endTime: avail.endTime,
      consultationFee: avail.consultationFee,
    },
  };
};

module.exports = { listDoctors, getSpecialties, getDoctorSlots };
