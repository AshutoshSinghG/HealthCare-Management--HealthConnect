const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const Medication = require('../models/Medication');
const UnsuitableMedicine = require('../models/UnsuitableMedicine');
const { logAction } = require('./auditService');

/**
 * Get all export data for a patient.
 */
const getPatientExportData = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) {
    const err = new Error('Patient profile not found');
    err.statusCode = 404;
    throw err;
  }

  const treatments = await Treatment.find({ patientId: patient._id })
    .populate('doctorId', 'firstName lastName specialisation')
    .sort({ visitDate: -1 });

  const treatmentIds = treatments.map((t) => t._id);
  const medications = await Medication.find({ treatmentId: { $in: treatmentIds } });
  const unsuitableMeds = await UnsuitableMedicine.find({
    patientId: patient._id,
    isActive: true,
  }).populate('flaggedByDoctorId', 'firstName lastName');

  return { patient, treatments, medications, unsuitableMeds };
};

/**
 * Generate a PDF medical report for a patient.
 */
const generatePDF = async (userId, res) => {
  const { patient, treatments, medications, unsuitableMeds } = await getPatientExportData(userId);

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="medical_report_${patient.firstName}_${patient.lastName}.pdf"`
  );

  doc.pipe(res);

  // --- Title ---
  doc.fontSize(22).font('Helvetica-Bold').text('HealthConnect Medical Report', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(1.5);

  // --- Patient Demographics ---
  doc.fontSize(16).font('Helvetica-Bold').text('Patient Demographics');
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);

  doc.fontSize(11).font('Helvetica');
  const info = [
    ['Name', `${patient.firstName} ${patient.lastName}`],
    ['Date of Birth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'],
    ['Gender', patient.gender],
    ['Blood Group', patient.bloodGroup || 'N/A'],
    ['Phone', patient.phoneNumber || 'N/A'],
    ['Emergency Contact', patient.emergencyContactName ? `${patient.emergencyContactName} (${patient.emergencyContactPhone})` : 'N/A'],
    ['Chronic Conditions', patient.chronicConditions.length ? patient.chronicConditions.join(', ') : 'None'],
    ['Known Allergies', patient.knownAllergies.length ? patient.knownAllergies.join(', ') : 'None'],
  ];

  for (const [label, value] of info) {
    doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
    doc.font('Helvetica').text(value);
  }
  doc.moveDown(1);

  // --- Treatment History ---
  doc.fontSize(16).font('Helvetica-Bold').text('Treatment History');
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);

  if (treatments.length === 0) {
    doc.fontSize(11).font('Helvetica').text('No treatment records found.');
  } else {
    for (const treatment of treatments) {
      doc.fontSize(12).font('Helvetica-Bold').text(
        `Visit: ${new Date(treatment.visitDate).toLocaleDateString()} — ${treatment.diagnosis}`
      );
      doc.fontSize(10).font('Helvetica');
      doc.text(`Doctor: ${treatment.doctorId?.firstName || ''} ${treatment.doctorId?.lastName || ''} (${treatment.doctorId?.specialisation || ''})`);
      doc.text(`Complaint: ${treatment.chiefComplaint}`);
      if (treatment.icdCode) doc.text(`ICD Code: ${treatment.icdCode}`);
      if (treatment.treatmentPlan) doc.text(`Plan: ${treatment.treatmentPlan}`);
      doc.text(`Status: ${treatment.outcomeStatus}`);
      if (treatment.followUpDate) doc.text(`Follow-up: ${new Date(treatment.followUpDate).toLocaleDateString()}`);
      if (treatment.notes) doc.text(`Notes: ${treatment.notes}`);

      // Medications for this treatment
      const relatedMeds = medications.filter(
        (m) => m.treatmentId.toString() === treatment._id.toString()
      );
      if (relatedMeds.length) {
        doc.moveDown(0.3);
        doc.font('Helvetica-Bold').text('  Medications:');
        doc.font('Helvetica');
        for (const med of relatedMeds) {
          doc.text(`    • ${med.medicineName} — ${med.dosage}, ${med.frequency} for ${med.durationDays} days (${med.routeOfAdmin})`);
        }
      }

      doc.moveDown(0.8);
    }
  }

  // --- Unsuitable Medicines ---
  doc.fontSize(16).font('Helvetica-Bold').text('Unsuitable Medicines');
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);

  if (unsuitableMeds.length === 0) {
    doc.fontSize(11).font('Helvetica').text('No unsuitable medicines flagged.');
  } else {
    for (const flag of unsuitableMeds) {
      doc.fontSize(11).font('Helvetica');
      doc.text(`• ${flag.medicineName} — Severity: ${flag.severity}`);
      doc.text(`  Reason: ${flag.reason}`);
      doc.text(`  Flagged by: Dr. ${flag.flaggedByDoctorId?.firstName || ''} ${flag.flaggedByDoctorId?.lastName || ''}`);
      doc.moveDown(0.3);
    }
  }

  doc.end();

  // Audit log
  await logAction({
    actorUserId: userId,
    actorRole: 'PATIENT',
    actionType: 'EXPORT',
    entityType: 'MedicalReport',
    entityId: patient._id,
    newValues: { format: 'PDF' },
  });
};

/**
 * Generate an Excel workbook of medical records.
 */
const generateExcel = async (userId, res) => {
  const { patient, treatments, medications, unsuitableMeds } = await getPatientExportData(userId);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'HealthConnect';
  workbook.created = new Date();

  // --- Treatments Worksheet ---
  const treatmentSheet = workbook.addWorksheet('Treatments');
  treatmentSheet.columns = [
    { header: 'Visit Date', key: 'visitDate', width: 15 },
    { header: 'Doctor', key: 'doctor', width: 25 },
    { header: 'Complaint', key: 'chiefComplaint', width: 30 },
    { header: 'Diagnosis', key: 'diagnosis', width: 30 },
    { header: 'ICD Code', key: 'icdCode', width: 12 },
    { header: 'Treatment Plan', key: 'treatmentPlan', width: 30 },
    { header: 'Status', key: 'outcomeStatus', width: 15 },
    { header: 'Follow-up', key: 'followUpDate', width: 15 },
    { header: 'Notes', key: 'notes', width: 30 },
  ];

  // Style header row
  treatmentSheet.getRow(1).font = { bold: true };
  treatmentSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  treatmentSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  for (const t of treatments) {
    treatmentSheet.addRow({
      visitDate: t.visitDate ? new Date(t.visitDate).toLocaleDateString() : '',
      doctor: `${t.doctorId?.firstName || ''} ${t.doctorId?.lastName || ''}`,
      chiefComplaint: t.chiefComplaint,
      diagnosis: t.diagnosis,
      icdCode: t.icdCode,
      treatmentPlan: t.treatmentPlan,
      outcomeStatus: t.outcomeStatus,
      followUpDate: t.followUpDate ? new Date(t.followUpDate).toLocaleDateString() : '',
      notes: t.notes,
    });
  }

  // --- Medications Worksheet ---
  const medSheet = workbook.addWorksheet('Medications');
  medSheet.columns = [
    { header: 'Medicine Name', key: 'medicineName', width: 25 },
    { header: 'Dosage', key: 'dosage', width: 15 },
    { header: 'Frequency', key: 'frequency', width: 15 },
    { header: 'Duration (Days)', key: 'durationDays', width: 15 },
    { header: 'Route', key: 'routeOfAdmin', width: 15 },
    { header: 'Notes', key: 'notes', width: 25 },
  ];

  medSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  medSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };

  for (const m of medications) {
    medSheet.addRow({
      medicineName: m.medicineName,
      dosage: m.dosage,
      frequency: m.frequency,
      durationDays: m.durationDays,
      routeOfAdmin: m.routeOfAdmin,
      notes: m.notes,
    });
  }

  // --- Unsuitable Medicines Worksheet ---
  const unsuitableSheet = workbook.addWorksheet('Unsuitable Medicines');
  unsuitableSheet.columns = [
    { header: 'Medicine', key: 'medicineName', width: 25 },
    { header: 'Reason', key: 'reason', width: 35 },
    { header: 'Severity', key: 'severity', width: 12 },
    { header: 'Flagged By', key: 'flaggedBy', width: 25 },
    { header: 'Date', key: 'createdAt', width: 15 },
  ];

  unsuitableSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  unsuitableSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFED7D31' },
  };

  for (const u of unsuitableMeds) {
    unsuitableSheet.addRow({
      medicineName: u.medicineName,
      reason: u.reason,
      severity: u.severity,
      flaggedBy: `Dr. ${u.flaggedByDoctorId?.firstName || ''} ${u.flaggedByDoctorId?.lastName || ''}`,
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
    });
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="medical_records_${patient.firstName}_${patient.lastName}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();

  // Audit log
  await logAction({
    actorUserId: userId,
    actorRole: 'PATIENT',
    actionType: 'EXPORT',
    entityType: 'MedicalReport',
    entityId: patient._id,
    newValues: { format: 'Excel' },
  });
};

module.exports = { generatePDF, generateExcel };
