const exportService = require('../services/exportService');

/**
 * GET /patients/me/export/pdf
 */
const exportPDF = async (req, res, next) => {
  try {
    await exportService.generatePDF(req.user.userId, res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /patients/me/export/excel
 */
const exportExcel = async (req, res, next) => {
  try {
    await exportService.generateExcel(req.user.userId, res);
  } catch (err) {
    next(err);
  }
};

module.exports = { exportPDF, exportExcel };
