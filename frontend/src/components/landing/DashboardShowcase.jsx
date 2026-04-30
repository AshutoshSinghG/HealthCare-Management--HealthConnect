import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarCheck, ClipboardList, Pill, FileDown, MessageCircle,
  UserCog, Stethoscope, Users, ShieldCheck, BarChart3, BookOpen, AlertTriangle,
  Star, Clock, Settings,
} from 'lucide-react';

const dashboards = [
  {
    id: 'patient',
    label: 'Patient Dashboard',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    activeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'A comprehensive portal where patients manage their entire healthcare journey — from booking appointments to tracking treatments and exporting records.',
    features: [
      { icon: LayoutDashboard, title: 'Health Overview', desc: 'At-a-glance view of upcoming appointments, active treatments, and recent medications.' },
      { icon: CalendarCheck, title: 'Book Appointments', desc: 'Browse doctors by specialization, view real-time slot availability, and book instantly.' },
      { icon: ClipboardList, title: 'Treatment History', desc: 'View complete treatment records with diagnoses, outcomes, and doctor notes.' },
      { icon: Pill, title: 'Medication Tracker', desc: 'Track all prescribed medications with dosage, frequency, and duration details.' },
      { icon: AlertTriangle, title: 'Unsuitable Medicines', desc: 'Record and alert doctors about medicines you\'re allergic to or that cause adverse reactions.' },
      { icon: MessageCircle, title: 'Live Chat', desc: 'Real-time secure messaging with your doctor during appointment windows.' },
      { icon: FileDown, title: 'Export Records', desc: 'Download your complete medical history as structured reports.' },
      { icon: UserCog, title: 'Profile Management', desc: 'Update personal info, blood group, emergency contacts, and medical history.' },
    ],
  },
  {
    id: 'doctor',
    label: 'Doctor Dashboard',
    icon: Stethoscope,
    color: 'from-green-500 to-emerald-600',
    activeBg: 'bg-green-50 text-green-700 border-green-200',
    description: 'A powerful workspace where doctors manage patients, create treatments, configure appointment slots, and communicate in real-time.',
    features: [
      { icon: LayoutDashboard, title: 'Practice Overview', desc: 'Dashboard with today\'s appointments, patient count, and recent activity summary.' },
      { icon: Users, title: 'Patient Management', desc: 'View all assigned patients with detailed profiles and treatment histories.' },
      { icon: ClipboardList, title: 'Create Treatments', desc: 'Create and edit treatment plans with diagnoses, prescriptions, and outcomes.' },
      { icon: Clock, title: 'Slot Configuration', desc: 'Set working hours, define slot duration, and manage shift schedules including cross-midnight.' },
      { icon: MessageCircle, title: 'Patient Chat', desc: 'Secure real-time chat with patients during their booked appointment window.' },
      { icon: Star, title: 'Ratings & Reviews', desc: 'View patient ratings and feedback to improve service quality.' },
      { icon: UserCog, title: 'Profile & Credentials', desc: 'Manage specialization, experience, qualifications, and availability status.' },
      { icon: Pill, title: 'Prescribe Medications', desc: 'Add medications to treatments with route, dosage, frequency, and instructions.' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin Dashboard',
    icon: ShieldCheck,
    color: 'from-purple-500 to-purple-600',
    activeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'The command center for hospital administrators to oversee operations, manage users, monitor security, and maintain system integrity.',
    features: [
      { icon: LayoutDashboard, title: 'System Overview', desc: 'Key metrics: total users, active appointments, system health, and growth analytics.' },
      { icon: Users, title: 'User Management', desc: 'View, search, activate, deactivate, and manage all users across the platform.' },
      { icon: Stethoscope, title: 'Doctor Management', desc: 'Verify doctor credentials, manage specializations, and oversee doctor accounts.' },
      { icon: BookOpen, title: 'Patient Records', desc: 'Administrative access to patient data with full audit trail compliance.' },
      { icon: ShieldCheck, title: 'Security Monitor', desc: 'Real-time security dashboard with failed login attempts and suspicious activity alerts.' },
      { icon: BarChart3, title: 'Audit Logs', desc: 'Complete system-wide audit trail: who did what, when, and from where.' },
      { icon: Settings, title: 'Medicine Database', desc: 'Manage the platform-wide medicine inventory and drug interaction database.' },
      { icon: FileDown, title: 'Export & Reports', desc: 'Generate and export comprehensive reports for compliance and analytics.' },
    ],
  },
];

const DashboardShowcase = () => {
  const [active, setActive] = useState('patient');
  const current = dashboards.find(d => d.id === active);

  return (
    <section id="dashboards" className="relative z-10 py-24 lg:py-32 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">3 Powerful Dashboards</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
            Tailored for{' '}
            <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">Every Role</span>
          </h2>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">Each user role gets a dedicated, feature-rich dashboard designed for their specific needs.</p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dashboards.map(d => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm border transition-all duration-300 ${
                active === d.id
                  ? `${d.activeBg} shadow-md`
                  : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
              }`}
            >
              <d.icon className="w-5 h-5" />
              {d.label}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl border border-surface-100 shadow-lg overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${current.color} p-6 lg:p-8`}>
                <div className="flex items-center gap-3 mb-3">
                  <current.icon className="w-8 h-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">{current.label}</h3>
                </div>
                <p className="text-white/80 max-w-2xl">{current.description}</p>
              </div>

              {/* Features Grid */}
              <div className="p-6 lg:p-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {current.features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 rounded-2xl border border-surface-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 group"
                    >
                      <f.icon className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-surface-900 mb-1.5">{f.title}</h4>
                      <p className="text-xs text-surface-500 leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DashboardShowcase;
