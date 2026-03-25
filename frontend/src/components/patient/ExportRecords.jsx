import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Table, CheckCircle, FileSpreadsheet } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { exportPdf, exportExcel } from '../../api/patientApi';

const ExportRecords = () => {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleExportPDF = async () => {
    setExportingPdf(true);
    try {
      const blob = await exportPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HealthConnect_Medical_Records.pdf';
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
      const blob = await exportExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HealthConnect_Medical_Records.xlsx';
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

export default ExportRecords;
