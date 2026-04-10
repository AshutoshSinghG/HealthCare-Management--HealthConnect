import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Trash2, Eye, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useAdminMedicines, useRemoveMedicineFlag } from '../../hooks/useAdmin';

const severityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'default' };
const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

const MedicineControl = () => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const { data: medicines = [], isLoading } = useAdminMedicines();
  const removeMutation = useRemoveMedicineFlag();

  const filtered = medicines
    .filter(m => {
      if (severityFilter && m.severity !== severityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.medicine.toLowerCase().includes(q) || m.patient.toLowerCase().includes(q) || m.flaggedBy.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const removeFlag = async (id) => {
    try {
      await removeMutation.mutateAsync(id);
      toast.success('Medicine flag removed by admin');
    } catch { toast.error('Failed to remove flag'); }
  };

  const stats = {
    total: medicines.length,
    critical: medicines.filter(m => m.severity === 'critical').length,
    high: medicines.filter(m => m.severity === 'high').length,
    medium: medicines.filter(m => m.severity === 'medium').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading medicine flags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Unsuitable Medicine Control</h1>
        <p className="text-surface-500 mt-1">View all flagged medicines, remove flags, and monitor safety issues</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-surface-800">{stats.total}</p>
          <p className="text-xs font-medium text-surface-500 mt-1">Total Flags</p>
        </div>
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-danger-700">{stats.critical}</p>
          <p className="text-xs font-medium text-danger-600 mt-1">Critical</p>
        </div>
        <div className="bg-warning-50 border border-warning-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-warning-700">{stats.high}</p>
          <p className="text-xs font-medium text-warning-600 mt-1">High</p>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-700">{stats.medium}</p>
          <p className="text-xs font-medium text-primary-600 mt-1">Medium</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicine, patient, doctor..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
        <div className="flex gap-2">
          {['', 'critical', 'high', 'medium', 'low'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${severityFilter === s ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200'}`}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><p className="text-center text-surface-400 py-8">No medicine flags found.</p></Card>
        ) : (
          filtered.map((med, i) => (
            <motion.div key={med.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${med.severity === 'critical' ? 'bg-danger-50 border border-danger-200' : med.severity === 'high' ? 'bg-warning-50 border border-warning-200' : 'bg-primary-50 border border-primary-200'}`}>
                      <ShieldAlert className={`w-5 h-5 ${med.severity === 'critical' ? 'text-danger-500' : med.severity === 'high' ? 'text-warning-500' : 'text-primary-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-surface-800">{med.medicine}</p>
                        <Badge variant={severityColors[med.severity]} size="sm">{med.severity}</Badge>
                      </div>
                      <p className="text-sm text-surface-600 mt-1">{med.reason}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-500">
                        <span>Patient: <strong className="text-surface-700">{med.patient}</strong> ({med.patientId})</span>
                        <span>Flagged by: <strong className="text-surface-700">{med.flaggedBy}</strong></span>
                        <span>{med.flagDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-danger-500 flex-shrink-0" onClick={() => removeFlag(med.id)}>Remove Flag</Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicineControl;
