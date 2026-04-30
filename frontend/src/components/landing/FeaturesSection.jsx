import { motion } from 'framer-motion';
import {
  CalendarCheck, MessageCircle, ClipboardList, Pill, FileDown, Shield,
  UserCog, Stethoscope, Clock, Bell, BarChart3, Lock,
} from 'lucide-react';

const features = [
  { icon: CalendarCheck, title: 'Smart Scheduling', desc: 'Real-time slot management with automatic conflict detection and cross-midnight shift support.', color: 'bg-blue-50 text-blue-600' },
  { icon: MessageCircle, title: 'Live Consultation Chat', desc: 'Secure, real-time messaging between doctors and patients during appointment windows via Socket.IO.', color: 'bg-green-50 text-green-600' },
  { icon: ClipboardList, title: 'Treatment Tracking', desc: 'Complete treatment histories with outcomes, diagnoses, notes, and follow-up scheduling.', color: 'bg-purple-50 text-purple-600' },
  { icon: Pill, title: 'Medication Management', desc: 'Track prescriptions with dosage, frequency, route, and unsuitable medicine alerts.', color: 'bg-orange-50 text-orange-600' },
  { icon: FileDown, title: 'Medical Record Export', desc: 'Export patient records as structured reports for insurance, referrals, or personal archives.', color: 'bg-pink-50 text-pink-600' },
  { icon: Shield, title: 'HIPAA-Compliant Security', desc: 'End-to-end encryption, JWT authentication, and complete audit trail logging.', color: 'bg-teal-50 text-teal-600' },
  { icon: UserCog, title: 'Multi-Role Access', desc: 'Dedicated dashboards for Patients, Doctors, and Administrators with role-based permissions.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Stethoscope, title: 'Doctor Profiles & Ratings', desc: 'Verified doctor profiles with specialization, experience, and patient rating system.', color: 'bg-cyan-50 text-cyan-600' },
  { icon: Clock, title: 'Appointment Reminders', desc: 'Automated notifications and status tracking for upcoming and past appointments.', color: 'bg-amber-50 text-amber-600' },
  { icon: Bell, title: 'Real-Time Notifications', desc: 'Instant alerts for bookings, cancellations, messages, and system updates.', color: 'bg-rose-50 text-rose-600' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Visual insights with charts for appointments, revenue, patient demographics, and trends.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Lock, title: 'Multi-Factor Auth (MFA)', desc: 'Optional two-factor authentication via email OTP for enhanced account security.', color: 'bg-violet-50 text-violet-600' },
];

const FeaturesSection = () => (
  <section id="features" className="relative z-10 py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Features</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
          Everything You Need,{' '}
          <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">All in One Place</span>
        </h2>
        <p className="text-lg text-surface-500 max-w-2xl mx-auto">HealthConnect combines powerful features that make healthcare management seamless for patients, doctors, and administrators.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-surface-900 mb-2">{f.title}</h3>
            <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
