import { motion } from 'framer-motion';
import { Activity, Zap, Globe, Clock } from 'lucide-react';

const highlights = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Instant access to patient records, appointments, and treatment histories.' },
  { icon: Globe, title: 'Access Anywhere', desc: 'Cloud-based platform accessible from any device, anytime, anywhere.' },
  { icon: Clock, title: 'Save 10+ Hours/Week', desc: 'Automate routine tasks so you can focus on what matters — patient care.' },
];

const AboutSection = () => (
  <section id="about" className="relative z-10 py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 to-green-100 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">HealthConnect</h3>
                  <p className="text-primary-200 text-sm">Healthcare Management System</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Patient Management', value: 98 },
                  { label: 'Appointment Efficiency', value: 95 },
                  { label: 'Data Security', value: 100 },
                  { label: 'User Satisfaction', value: 97 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-primary-100">{item.label}</span>
                      <span className="text-white font-bold">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-white/80 to-white rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini ECG */}
              <svg className="mt-8 w-full h-12 opacity-30" viewBox="0 0 400 40" fill="none">
                <path d="M0 20 L80 20 L100 5 L120 35 L140 8 L160 32 L180 20 L400 20" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
            About HealthConnect
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 leading-tight mb-6">
            The Complete Healthcare Platform{' '}
            <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">
              Built for the Future
            </span>
          </h2>
          <p className="text-lg text-surface-600 leading-relaxed mb-8">
            HealthConnect is a comprehensive healthcare management system designed to bridge
            the gap between patients, doctors, and hospital administrators. Our platform
            digitalizes every aspect of healthcare — from booking appointments and tracking
            treatments to secure real-time consultations and intelligent medicine management.
          </p>
          <p className="text-base text-surface-500 leading-relaxed mb-10">
            Built with cutting-edge technology, HealthConnect ensures HIPAA-compliant data
            security, role-based access control, multi-factor authentication, and complete
            audit trail logging. Whether you're a patient seeking convenient care, a doctor
            managing your practice, or an administrator overseeing hospital operations —
            HealthConnect empowers everyone.
          </p>

          <div className="space-y-5">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                  <h.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">{h.title}</h4>
                  <p className="text-sm text-surface-500 leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
