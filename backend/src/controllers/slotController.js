const slotService = require('../services/slotService');
const { success } = require('../utils/apiResponse');

const getSlots = async (req, res, next) => {
  try {
    const slots = await slotService.getSlots(req.user.userId, req.query);
    return success(res, 'Slots retrieved', slots);
  } catch (err) { next(err); }
};

const createSlot = async (req, res, next) => {
  try {
    const slot = await slotService.createSlot(req.user.userId, req.body);
    return success(res, 'Slot created', slot, 201);
  } catch (err) { next(err); }
};

const deleteSlot = async (req, res, next) => {
  try {
    await slotService.deleteSlot(req.user.userId, req.params.id);
    return success(res, 'Slot deleted');
  } catch (err) { next(err); }
};

const updateSlotStatus = async (req, res, next) => {
  try {
    const slot = await slotService.updateSlotStatus(req.user.userId, req.params.id, req.body.status);
    return success(res, 'Slot status updated', slot);
  } catch (err) { next(err); }
};

const getAvailability = async (req, res, next) => {
  try {
    const avail = await slotService.getAvailability(req.user.userId);
    return success(res, 'Availability retrieved', avail);
  } catch (err) { next(err); }
};

const updateAvailability = async (req, res, next) => {
  try {
    const avail = await slotService.updateAvailability(req.user.userId, req.body);
    return success(res, 'Availability updated', avail);
  } catch (err) { next(err); }
};

module.exports = { getSlots, createSlot, deleteSlot, updateSlotStatus, getAvailability, updateAvailability };
