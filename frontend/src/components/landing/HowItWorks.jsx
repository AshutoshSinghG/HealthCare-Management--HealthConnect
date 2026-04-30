import { motion } from 'framer-motion';
import { UserPlus, CalendarSearch, MessageCircle, HeartPulse, ArrowRight } from 'lucide-react';

const steps = [
  { icon: UserPlus, step: '01', title: 'Create Your Account', desc: 'Sign up as a Patient or Doctor in seconds. Verify your email and set up Multi-Factor Authentication for maximum security.', color: 'from-blue-500 to-blue-600' },
  { icon: CalendarSearch, step: '02', title: 'Book an Appointment', desc: 'Browse verified doctors by specialization, view available time slots in real-time, and book your appointment instantly.', color: 'from-green-500 to-emerald-600' },
  { icon: MessageCircle, step: '03', title: 'Consult & Chat Live', desc: 'Connect with your doctor through our secure, real-time chat during your appointment window. Discuss symptoms and get expert advice.', color: 'from-purple-500 to-purple-600' },
  { icon: HeartPulse, step: '04', title: 'Track Your Health', desc: 'Access your complete treatment history, medication records, and export medical reports anytime. Stay informed about your health journey.', color: 'from-orange-500 to-orange-600' },
];

const HowItWorks = () => (
  <section className="relative z-10 py-24 lg:py-32 bg-surface-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">How It Works</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
          Get Started in <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">4 Simple Steps</span>
        </h2>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto">From registration to ongoing health tracking — our streamlined process makes healthcare management effortless.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative group"
          >
            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-12 -right-4 z-20">
                <ArrowRight className="w-6 h-6 text-surface-300" />
              </div>
            )}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-surface-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-bold text-surface-300 uppercase tracking-widest">Step {s.step}</span>
              <h3 className="text-xl font-bold text-surface-900 mt-2 mb-3">{s.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
