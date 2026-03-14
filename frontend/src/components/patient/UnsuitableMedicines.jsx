import { motion } from 'framer-motion';
import { AlertTriangle, Pill, ShieldAlert, AlertOctagon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const mockUnsuitableMedicines = [
  { id: 1, name: 'Aspirin', category: 'NSAID', reason: 'History of GI bleeding. Patient documented with aspirin sensitivity.', severity: 'high', flaggedBy: 'Dr. Michael Chen', flaggedDate: '2026-01-15', alternatives: ['Paracetamol', 'Ibuprofen (with caution)'] },
  { id: 2, name: 'Penicillin', category: 'Antibiotic', reason: 'Severe allergic reaction (anaphylaxis) documented in medical history.', severity: 'critical', flaggedBy: 'Dr. Sarah Wilson', flaggedDate: '2025-11-20', alternatives: ['Azithromycin', 'Ciprofloxacin'] },
  { id: 3, name: 'Metformin', category: 'Antidiabetic', reason: 'Potential interaction with current kidney medication regimen.', severity: 'medium', flaggedBy: 'Dr. James Park', flaggedDate: '2026-02-10', alternatives: ['Sitagliptin', 'Glimepiride'] },
  { id: 4, name: 'Codeine', category: 'Opioid', reason: 'Patient is a known ultra-rapid metabolizer. Risk of respiratory depression.', severity: 'high', flaggedBy: 'Dr. Priya Sharma', flaggedDate: '2025-09-05', alternatives: ['Tramadol', 'Hydromorphone'] },
];

const severityConfig = {
  critical: { color: 'danger', icon: AlertOctagon, bg: 'bg-danger-50 border-danger-200' },
  high: { color: 'warning', icon: ShieldAlert, bg: 'bg-warning-50 border-warning-200' },
  medium: { color: 'info', icon: AlertTriangle, bg: 'bg-primary-50 border-primary-200' },
};

const UnsuitableMedicines = () => {
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
        {mockUnsuitableMedicines.map((med, i) => {
          const config = severityConfig[med.severity] || severityConfig.medium;
          const SevIcon = config.icon;
          return (
            <motion.div
              key={med.id}
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
                          <h3 className="font-semibold text-surface-800">{med.name}</h3>
                          <Badge variant={config.color} size="sm">{med.severity}</Badge>
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5">{med.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-surface-600 mt-2">{med.reason}</p>
                    <div className="mt-3 pt-3 border-t border-surface-100 flex flex-wrap gap-4 text-xs text-surface-500">
                      <span>Flagged by <strong className="text-surface-700">{med.flaggedBy}</strong></span>
                      <span>Suggested alternatives: {med.alternatives.map((alt, j) => (
                        <Badge key={j} variant="default" size="sm" className="ml-1">{alt}</Badge>
                      ))}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UnsuitableMedicines;
