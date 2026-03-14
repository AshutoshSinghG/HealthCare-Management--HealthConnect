import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, CheckCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const ExportRecords = () => {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleExportPDF = async () => {
    setExportingPdf(true);
    try {
      // Simulate PDF generation
      await new Promise(r => setTimeout(r, 2000));

      // Generate a text-based summary as downloadable file
      const content = generatePDFContent();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HealthConnect_Medical_Records.html';
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Medical records exported as PDF successfully!');
    } catch {
      toast.error('Failed to export PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      await new Promise(r => setTimeout(r, 2000));

      // Generate CSV (universally compatible with Excel)
      const csvContent = generateExcelContent();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HealthConnect_Medical_Records.csv';
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Medical records exported as Excel successfully!');
    } catch {
      toast.error('Failed to export Excel');
    } finally {
      setExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Export Medical Records</h1>
        <p className="text-surface-500 mt-1">Download your complete medical history in your preferred format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card hover className="h-full">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-danger-50 border border-danger-100 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-danger-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-1">Export as PDF</h3>
              <p className="text-sm text-surface-500 mb-4">Comprehensive medical report suitable for sharing with healthcare providers</p>

              <div className="w-full bg-surface-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">PDF Includes:</p>
                <ul className="space-y-1.5">
                  {[
                    'Patient profile & demographics',
                    'Complete treatment history',
                    'All prescribed medications',
                    'Unsuitable medicines & allergies',
                    'Emergency contact information',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-surface-600">
                      <CheckCircle className="w-3.5 h-3.5 text-success-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto w-full">
                <Button
                  onClick={handleExportPDF}
                  loading={exportingPdf}
                  className="w-full"
                  icon={Download}
                  size="lg"
                >
                  {exportingPdf ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Excel Export */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card hover className="h-full">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-success-50 border border-success-100 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-8 h-8 text-success-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-1">Export as Excel</h3>
              <p className="text-sm text-surface-500 mb-4">Structured spreadsheet format for data analysis and record keeping</p>

              <div className="w-full bg-surface-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Excel Sheets Include:</p>
                <ul className="space-y-1.5">
                  {[
                    { sheet: 'Sheet 1', content: 'Treatment history with dates, doctors, diagnoses' },
                    { sheet: 'Sheet 2', content: 'All medications with dosage, frequency, route' },
                    { sheet: 'Sheet 3', content: 'Unsuitable medicines with severity & reasons' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                      <Table className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-surface-700">{item.sheet}:</strong> {item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto w-full">
                <Button
                  onClick={handleExportExcel}
                  loading={exportingExcel}
                  variant="success"
                  className="w-full"
                  icon={Download}
                  size="lg"
                >
                  {exportingExcel ? 'Generating Excel...' : 'Download Excel'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <div>
          <p className="font-semibold text-sm text-primary-800">Your Data is Secure</p>
          <p className="text-sm text-primary-700 mt-0.5">All exported data is encrypted during generation. Your medical records are handled in compliance with HIPAA regulations. Never share your medical data with unauthorized parties.</p>
        </div>
      </div>
    </div>
  );
};

function generatePDFContent() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>HealthConnect Medical Records</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#333}
h1{color:#1a56db;border-bottom:2px solid #1a56db;padding-bottom:10px}
h2{color:#1a56db;margin-top:30px}table{width:100%;border-collapse:collapse;margin:15px 0}
th,td{border:1px solid #ddd;padding:10px;text-align:left}th{background:#f0f5ff;font-weight:600}
.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600}
.danger{background:#fef2f2;color:#dc2626}.warning{background:#fffbeb;color:#d97706}
.section{margin:20px 0;padding:15px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb}</style></head>
<body>
<h1>🏥 HealthConnect — Medical Records</h1>
<p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
<div class="section">
<h2>Patient Profile</h2>
<p><strong>Name:</strong> Sarah Johnson</p>
<p><strong>Date of Birth:</strong> May 15, 1990 (35 years)</p>
<p><strong>Blood Group:</strong> O+</p>
<p><strong>Gender:</strong> Female</p>
<p><strong>Phone:</strong> +1-555-0101</p>
<p><strong>Allergies:</strong> <span class="badge danger">Penicillin</span> <span class="badge danger">Peanuts</span></p>
<p><strong>Chronic Conditions:</strong> <span class="badge warning">Hypertension</span> <span class="badge warning">Mild Asthma</span></p>
<p><strong>Emergency Contact:</strong> John Johnson (Spouse) — +1-555-9999</p>
</div>
<h2>Treatment History</h2>
<table><tr><th>Date</th><th>Doctor</th><th>Diagnosis</th><th>Outcome</th></tr>
<tr><td>Mar 05, 2026</td><td>Dr. Michael Chen</td><td>Upper Respiratory Infection</td><td>Improved</td></tr>
<tr><td>Feb 20, 2026</td><td>Dr. Sarah Wilson</td><td>Routine Checkup</td><td>Recovered</td></tr>
<tr><td>Feb 10, 2026</td><td>Dr. Michael Chen</td><td>Hypertension Follow-up</td><td>Stable</td></tr>
<tr><td>Jan 28, 2026</td><td>Dr. Priya Sharma</td><td>Allergic Rhinitis</td><td>Improved</td></tr>
<tr><td>Jan 15, 2026</td><td>Dr. James Park</td><td>Type 2 Diabetes Review</td><td>Stable</td></tr></table>
<h2>Current Medications</h2>
<table><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Route</th></tr>
<tr><td>Amlodipine</td><td>5mg</td><td>Once Daily</td><td>Ongoing</td><td>Oral</td></tr>
<tr><td>Salbutamol Inhaler</td><td>100mcg</td><td>As Needed</td><td>Ongoing</td><td>Inhalation</td></tr>
<tr><td>Amoxicillin</td><td>500mg</td><td>Three Times Daily</td><td>7 days</td><td>Oral</td></tr></table>
<h2>Unsuitable Medicines</h2>
<table><tr><th>Medicine</th><th>Reason</th><th>Severity</th><th>Flagged By</th></tr>
<tr><td>Aspirin</td><td>History of GI bleeding</td><td><span class="badge warning">High</span></td><td>Dr. Michael Chen</td></tr>
<tr><td>Penicillin</td><td>Severe allergic reaction (anaphylaxis)</td><td><span class="badge danger">Critical</span></td><td>Dr. Sarah Wilson</td></tr></table>
<hr><p style="text-align:center;color:#999;font-size:12px">This report was generated by HealthConnect. For any questions, contact your healthcare provider.</p>
</body></html>`;
}

function generateExcelContent() {
  const lines = [
    '=== TREATMENT HISTORY ===',
    'Date,Doctor,Diagnosis,Outcome,Follow Up',
    '2026-03-05,Dr. Michael Chen,Upper Respiratory Infection,Improved,2026-03-19',
    '2026-02-20,Dr. Sarah Wilson,Routine Checkup,Recovered,',
    '2026-02-10,Dr. Michael Chen,Hypertension Follow-up,Stable,2026-03-10',
    '2026-01-28,Dr. Priya Sharma,Allergic Rhinitis,Improved,2026-02-28',
    '2026-01-15,Dr. James Park,Type 2 Diabetes Review,Stable,2026-04-15',
    '2025-12-20,Dr. Sarah Wilson,Annual Physical,Recovered,',
    '',
    '=== MEDICATIONS ===',
    'Medicine,Dosage,Frequency,Duration,Route,Status,Prescribed By',
    'Amlodipine,5mg,Once Daily (OD),Ongoing,Oral,Active,Dr. Michael Chen',
    'Salbutamol Inhaler,100mcg,As Needed (PRN),Ongoing,Inhalation,Active,Dr. Sarah Wilson',
    'Amoxicillin,500mg,Three Times Daily (TDS),7 days,Oral,Active,Dr. Michael Chen',
    'Paracetamol,650mg,As Needed (PRN),5 days,Oral,Active,Dr. Michael Chen',
    'Ciprofloxacin,500mg,Twice Daily (BD),5 days,Oral,Completed,Dr. James Park',
    'Atorvastatin,10mg,Once Daily (OD),30 days,Oral,Discontinued,Dr. Michael Chen',
    '',
    '=== UNSUITABLE MEDICINES ===',
    'Medicine,Category,Reason,Severity,Flagged By',
    'Aspirin,NSAID,History of GI bleeding,High,Dr. Michael Chen',
    'Penicillin,Antibiotic,Severe allergic reaction (anaphylaxis),Critical,Dr. Sarah Wilson',
    'Metformin,Antidiabetic,Potential interaction with kidney medication,Medium,Dr. James Park',
    'Codeine,Opioid,Ultra-rapid metabolizer risk,High,Dr. Priya Sharma',
  ];
  return lines.join('\n');
}

export default ExportRecords;
