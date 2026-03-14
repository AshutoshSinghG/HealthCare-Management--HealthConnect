import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Search, CheckCircle, Table } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const patients = [
  { id: 'P-1001', name: 'Sarah Johnson', treatments: 24 },
  { id: 'P-1002', name: 'Robert Williams', treatments: 18 },
  { id: 'P-1003', name: 'Emily Davis', treatments: 31 },
  { id: 'P-1004', name: 'James Brown', treatments: 12 },
  { id: 'P-1005', name: 'Lisa Anderson', treatments: 8 },
  { id: 'P-1006', name: 'David Wilson', treatments: 15 },
  { id: 'P-1007', name: 'Maria Garcia', treatments: 9 },
];

const AdminExportRecords = () => {
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(null);

  const filtered = patients.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const exportPdf = async (patient) => {
    setExporting(`pdf-${patient.id}`);
    await new Promise(r => setTimeout(r, 1500));
    const blob = new Blob([`Medical Record PDF for ${patient.name}`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${patient.name.replace(' ', '_')}_Records.pdf`; a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
    toast.success(`PDF exported for ${patient.name}`);
  };

  const exportExcel = async (patient) => {
    setExporting(`excel-${patient.id}`);
    await new Promise(r => setTimeout(r, 1500));
    const blob = new Blob([`Medical Record CSV for ${patient.name}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${patient.name.replace(' ', '_')}_Records.csv`; a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
    toast.success(`Excel exported for ${patient.name}`);
  };

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
        {filtered.map((patient, i) => (
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
        ))}
      </div>
    </div>
  );
};

export default AdminExportRecords;
