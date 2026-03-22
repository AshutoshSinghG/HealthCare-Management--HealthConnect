import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, AlertOctagon, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useUnsuitableMedicines } from '../../hooks/usePatients';

const severityConfig = {
  CRITICAL: { color: 'danger', icon: AlertOctagon, bg: 'bg-danger-50 border-danger-200' },
  HIGH: { color: 'warning', icon: ShieldAlert, bg: 'bg-warning-50 border-warning-200' },
  MODERATE: { color: 'info', icon: AlertTriangle, bg: 'bg-primary-50 border-primary-200' },
  LOW: { color: 'default', icon: AlertTriangle, bg: 'bg-surface-50 border-surface-200' },
};

const UnsuitableMedicines = () => {
  const { data: medicines, isLoading, isError } = useUnsuitableMedicines();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading medicine alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Medicine Alerts</h1>
        <p className="text-surface-500 mt-1">Medications flagged as unsuitable based on your medical history</p>
      </div>

      <div className="bg-danger-50 border border-danger-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-danger-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-sm text-danger-800">Important Safety Notice</p>
          <p className="text-sm text-danger-700 mt-0.5">The following medications have been flagged as potentially harmful. Always inform your healthcare provider about these alerts.</p>
        </div>
      </div>

      <div className="space-y-4">
        {(!medicines || medicines.length === 0) ? (
          <Card>
            <p className="text-center text-surface-400 py-8">No medicine alerts at this time.</p>
          </Card>
        ) : (
          medicines.map((med, i) => {
            const config = severityConfig[med.severity] || severityConfig.MODERATE;
            const SevIcon = config.icon;
            const doctorName = med.flaggedByDoctorId
              ? `Dr. ${med.flaggedByDoctorId.firstName} ${med.flaggedByDoctorId.lastName}`
              : 'Unknown Doctor';
            return (
              <motion.div
                key={med._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} border flex items-center justify-center flex-shrink-0`}>
                      <SevIcon className={`w-5 h-5 text-${config.color}-500`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-surface-800">{med.medicineName}</h3>
                            <Badge variant={config.color} size="sm">{med.severity}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-surface-600 mt-2">{med.reason}</p>
                      <div className="mt-3 pt-3 border-t border-surface-100 flex flex-wrap gap-4 text-xs text-surface-500">
                        <span>Flagged by <strong className="text-surface-700">{doctorName}</strong></span>
                      </div>
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

export default UnsuitableMedicines;
