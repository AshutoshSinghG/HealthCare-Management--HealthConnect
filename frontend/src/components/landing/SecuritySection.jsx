import { motion } from 'framer-motion';
import { Shield, Lock, FileSearch, UserCheck, Eye, Server, Key, AlertTriangle } from 'lucide-react';

const securityFeatures = [
  { icon: Lock, title: 'JWT Authentication', desc: 'Secure token-based authentication with httpOnly cookies and automatic token refresh.' },
  { icon: Key, title: 'Multi-Factor Auth', desc: 'Email-based OTP verification adds an extra layer of protection to every account.' },
  { icon: UserCheck, title: 'Role-Based Access', desc: 'Granular permissions ensure users only access data relevant to their role.' },
  { icon: FileSearch, title: 'Complete Audit Trail', desc: 'Every action is logged — who, what, when, and where — for full accountability.' },
  { icon: Eye, title: 'Data Encryption', desc: 'Passwords hashed with bcrypt; sensitive data encrypted in transit and at rest.' },
  { icon: Server, title: '99.9% Uptime SLA', desc: 'Cloud-hosted infrastructure with redundancy and automatic failover.' },
  { icon: AlertTriangle, title: 'Threat Detection', desc: 'Real-time monitoring for suspicious login attempts and unusual activity patterns.' },
  { icon: Shield, title: 'HIPAA Compliance', desc: 'Designed to meet HIPAA privacy and security standards for protected health information.' },
];

const SecuritySection = () => (
  <section id="security" className="relative z-10 py-24 lg:py-32 overflow-hidden">
    {/* Dark background */}
    <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08),transparent_70%)]" />

    {/* ECG overlay */}
    <svg className="absolute top-1/2 left-0 w-full h-16 opacity-[0.05] -translate-y-1/2" viewBox="0 0 1600 60" fill="none">
      <path className="ecg-line" d="M0 30 L300 30 L340 8 L360 52 L380 5 L400 55 L420 25 L440 35 L480 30 L800 30 L840 8 L860 52 L880 5 L900 55 L920 25 L940 35 L980 30 L1300 30 L1340 8 L1360 52 L1380 5 L1400 55 L1420 25 L1440 35 L1480 30 L1600 30" stroke="white" strokeWidth="1.5" />
    </svg>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-300 rounded-full text-sm font-semibold mb-4 border border-white/10">Security & Compliance</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
          Your Data is{' '}
          <span className="bg-gradient-to-r from-primary-400 to-green-400 bg-clip-text text-transparent">Fort Knox Secure</span>
        </h2>
        <p className="text-lg text-surface-300 max-w-2xl mx-auto">We take security seriously. HealthConnect implements enterprise-grade security measures to protect every piece of health data.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {securityFeatures.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <f.icon className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 flex flex-wrap justify-center gap-6"
      >
        {['HIPAA Compliant', 'SOC 2 Type II', '256-bit Encryption', 'GDPR Ready'].map(badge => (
          <div key={badge} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-surface-300">{badge}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SecuritySection;
