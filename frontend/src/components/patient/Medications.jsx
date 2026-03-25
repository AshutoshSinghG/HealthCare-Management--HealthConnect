import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, Filter, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useMedications } from '../../hooks/usePatients';

const statusConfig = {
  active: { color: 'success', icon: CheckCircle, label: 'Active' },
  completed: { color: 'info', icon: Clock, label: 'Completed' },
  discontinued: { color: 'danger', icon: XCircle, label: 'Discontinued' },
};

const Medications = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: medications = [], isLoading, isError } = useMedications();

  const filteredMeds = useMemo(() => {
    return medications.filter(m => {
      if (statusFilter && m.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return m.medicineName?.toLowerCase().includes(q) ||
               m.prescribedBy?.toLowerCase().includes(q) ||
               m.routeOfAdmin?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [medications, search, statusFilter]);

  const activeCount = medications.filter(m => m.status === 'active').length;
  const completedCount = medications.filter(m => m.status === 'completed').length;
  const discontinuedCount = medications.filter(m => m.status === 'discontinued').length;

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  if (isError) return (
    <div className="text-center py-20 text-surface-500">
      <p>Failed to load medications. Please try again.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Medications</h1>
        <p className="text-surface-500 mt-1">All your prescribed medications — active, completed, and discontinued</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-success-50 border border-success-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-success-700">{activeCount}</p>
          <p className="text-xs font-medium text-success-600 mt-1">Active</p>
        </div>
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-700">{completedCount}</p>
          <p className="text-xs font-medium text-primary-600 mt-1">Completed</p>
        </div>
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-danger-700">{discontinuedCount}</p>
          <p className="text-xs font-medium text-danger-600 mt-1">Discontinued</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medications..."
            className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2">
          {['', 'active', 'completed', 'discontinued'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Medication Cards */}
      <div className="space-y-3">
        {filteredMeds.length === 0 ? (
          <div className="text-center py-16 text-surface-400">
            <Pill className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No medications found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredMeds.map((med, i) => {
            const config = statusConfig[med.status] || statusConfig.completed;
            return (
              <motion.div
                key={med._id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-success-50 border border-success-100 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5 text-success-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-surface-800">{med.medicineName}</h3>
                            <Badge variant={config.color} size="sm" dot>{config.label}</Badge>
                          </div>
                          <p className="text-xs text-surface-500 mt-0.5">Prescribed by {med.prescribedBy}</p>
                        </div>
                        <Badge variant="info" size="sm">{med.dosage}</Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <div>
                          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Frequency</p>
                          <p className="text-sm text-surface-700 mt-0.5">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Duration</p>
                          <p className="text-sm text-surface-700 mt-0.5">{med.durationDays === 0 ? 'Ongoing' : `${med.durationDays} days`}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Route</p>
                          <p className="text-sm text-surface-700 mt-0.5">{med.routeOfAdmin}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider">Prescribed</p>
                          <p className="text-sm text-surface-700 mt-0.5">
                            {med.prescribedDate ? new Date(med.prescribedDate).toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </div>

                      {med.notes && (
                        <div className="mt-3 pt-3 border-t border-surface-100">
                          <p className="text-xs text-surface-500 italic">📝 {med.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Medications;
