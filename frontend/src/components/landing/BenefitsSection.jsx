import { motion } from 'framer-motion';
import { Clock, DollarSign, HeartPulse, Smartphone, TrendingUp, Users, ShieldCheck, Smile } from 'lucide-react';

const benefits = [
  { icon: Clock, title: 'Save Time', desc: 'Eliminate paperwork and waiting rooms. Book appointments, access records, and consult doctors in minutes.', color: 'from-blue-500 to-blue-600' },
  { icon: DollarSign, title: 'Reduce Costs', desc: 'Cut administrative overhead by 60% with automated scheduling, billing, and record management.', color: 'from-green-500 to-emerald-600' },
  { icon: HeartPulse, title: 'Better Outcomes', desc: 'Continuous treatment tracking and medication alerts lead to improved patient health outcomes.', color: 'from-red-500 to-rose-600' },
  { icon: Smartphone, title: 'Access Anywhere', desc: 'Fully responsive design works on any device — check your health data from phone, tablet, or desktop.', color: 'from-purple-500 to-purple-600' },
  { icon: TrendingUp, title: 'Data Insights', desc: 'Transform healthcare data into actionable insights with built-in analytics and reporting.', color: 'from-orange-500 to-orange-600' },
  { icon: Users, title: 'Better Communication', desc: 'Bridge the gap between patients and doctors with real-time chat and instant notifications.', color: 'from-cyan-500 to-cyan-600' },
  { icon: ShieldCheck, title: 'Peace of Mind', desc: 'Enterprise-grade security with HIPAA compliance ensures your health data is always safe.', color: 'from-teal-500 to-teal-600' },
  { icon: Smile, title: 'User-Friendly', desc: 'Intuitive, modern interface designed for all ages — no technical expertise required.', color: 'from-pink-500 to-pink-600' },
];

const BenefitsSection = () => (
  <section id="benefits" className="relative z-10 py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Benefits</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
          Why Healthcare Teams{' '}
          <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">Love Us</span>
        </h2>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto">HealthConnect delivers measurable value across the entire healthcare ecosystem.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative group bg-white rounded-3xl p-6 border border-surface-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${b.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <b.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-2">{b.title}</h3>
            <p className="text-sm text-surface-500 leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
