import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Search, CheckCircle, Table, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useExportPatients, useAdminExportPdf, useAdminExportExcel } from '../../hooks/useAdmin';

const AdminExportRecords = () => {
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(null);

  const { data: patients = [], isLoading } = useExportPatients();
  const pdfMutation = useAdminExportPdf();
  const excelMutation = useAdminExportExcel();

  const filtered = patients.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const exportPdf = async (patient) => {
    setExporting(`pdf-${patient.id}`);
    try {
      const blob = await pdfMutation.mutateAsync(patient._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${patient.name.replace(/ /g, '_')}_Records.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`PDF exported for ${patient.name}`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to export PDF.'));
    }
    setExporting(null);
  };

  const exportExcel = async (patient) => {
    setExporting(`excel-${patient.id}`);
    try {
      const blob = await excelMutation.mutateAsync(patient._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${patient.name.replace(/ /g, '_')}_Records.xlsx`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`Excel exported for ${patient.name}`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to export Excel.'));
    }
    setExporting(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Export Patient Records</h1>
        <p className="text-surface-500 mt-1">Export any patient's complete medical records as PDF or Excel</p>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <div>
          <p className="font-semibold text-sm text-primary-800">Admin Export Access</p>
          <p className="text-sm text-primary-700 mt-0.5">As an admin, you can export any patient's records. All exports are logged in the audit trail for compliance.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient by name or ID..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-surface-400 py-8">No patients found.</p></Card>
        ) : (
          filtered.map((patient, i) => (
            <motion.div key={patient.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-surface-800">{patient.name}</p>
                      <p className="text-xs text-surface-500">{patient.id} · {patient.treatments} treatments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={FileText} loading={exporting === `pdf-${patient.id}`} onClick={() => exportPdf(patient)}>
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" icon={FileSpreadsheet} loading={exporting === `excel-${patient.id}`} onClick={() => exportExcel(patient)}>
                      Excel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExportRecords;
