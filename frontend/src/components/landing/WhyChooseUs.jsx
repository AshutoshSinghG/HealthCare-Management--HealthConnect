import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const comparisons = [
  { feature: 'Multi-Role Dashboards (Patient, Doctor, Admin)', us: true, others: false },
  { feature: 'Real-Time Doctor-Patient Chat', us: true, others: false },
  { feature: 'Smart Appointment Slot Management', us: true, others: 'partial' },
  { feature: 'Cross-Midnight Shift Support', us: true, others: false },
  { feature: 'Treatment & Medication Tracking', us: true, others: 'partial' },
  { feature: 'Unsuitable Medicine Alerts', us: true, others: false },
  { feature: 'Medical Record Export', us: true, others: 'partial' },
  { feature: 'Multi-Factor Authentication', us: true, others: 'partial' },
  { feature: 'Complete Audit Trail Logging', us: true, others: false },
  { feature: 'Doctor Rating & Review System', us: true, others: 'partial' },
  { feature: 'HIPAA-Compliant Architecture', us: true, others: 'partial' },
  { feature: 'Free to Get Started', us: true, others: false },
];

const StatusIcon = ({ value }) => {
  if (value === true) return <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></div>;
  if (value === 'partial') return <div className="w-7 h-7 rounded-full bg-yellow-50 flex items-center justify-center"><span className="text-yellow-600 text-xs font-bold">~</span></div>;
  return <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"><X className="w-4 h-4 text-red-400" /></div>;
};

const WhyChooseUs = () => (
  <section className="relative z-10 py-24 lg:py-32 bg-surface-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Why HealthConnect?</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
          How We <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">Stand Apart</span>
        </h2>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto">See how HealthConnect compares to traditional healthcare management solutions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl border border-surface-100 shadow-lg overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_150px_150px] bg-surface-50 border-b border-surface-100">
          <div className="p-4 lg:p-5 text-sm font-semibold text-surface-500 uppercase tracking-wider">Feature</div>
          <div className="p-4 lg:p-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold shadow">
              <Sparkles className="w-3.5 h-3.5" /> Ours
            </div>
          </div>
          <div className="p-4 lg:p-5 text-sm font-semibold text-surface-400 text-center">Others</div>
        </div>

        {/* Table Rows */}
        {comparisons.map((row, i) => (
          <div key={i} className={`grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_150px_150px] items-center ${i % 2 === 0 ? '' : 'bg-surface-50/50'} ${i < comparisons.length - 1 ? 'border-b border-surface-50' : ''}`}>
            <div className="p-4 lg:p-5 text-sm text-surface-700 font-medium">{row.feature}</div>
            <div className="p-4 lg:p-5 flex justify-center"><StatusIcon value={row.us} /></div>
            <div className="p-4 lg:p-5 flex justify-center"><StatusIcon value={row.others} /></div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyChooseUs;
