import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Rocket, Users, Shield, CalendarCheck, MessageCircle, ClipboardList,
  Pill, FileDown, UserCog, BarChart3, Lock, ChevronRight, Search, ExternalLink,
} from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const gettingStarted = [
  { title: 'Create Your Account', desc: 'Sign up with your email, choose your role (Patient or Doctor), and verify your email address. Set up optional Multi-Factor Authentication for enhanced security.', link: '/signup' },
  { title: 'Complete Your Profile', desc: 'Add your personal details, blood group, emergency contacts, and medical history (patients) or specialization, qualifications, and experience (doctors).' },
  { title: 'Explore Your Dashboard', desc: 'Navigate your role-specific dashboard to access all features — appointments, treatments, medications, chat, and more.' },
  { title: 'Book Your First Appointment', desc: 'Browse verified doctors by specialization, view real-time slot availability, and book an appointment in just a few clicks.' },
];

const guides = [
  { icon: CalendarCheck, title: 'Appointment Booking', desc: 'Learn how to browse doctors, view available slots, book appointments, and manage your schedule.', category: 'Patient' },
  { icon: ClipboardList, title: 'Treatment Tracking', desc: 'Understand how to view your complete treatment history, diagnoses, outcomes, and follow-up notes.', category: 'Patient' },
  { icon: Pill, title: 'Medication Management', desc: 'Track all prescribed medications with dosage, frequency, route, and duration information.', category: 'Patient' },
  { icon: MessageCircle, title: 'Live Chat', desc: 'How to use the secure real-time messaging system during your appointment window.', category: 'Patient' },
  { icon: FileDown, title: 'Exporting Records', desc: 'Export your complete medical history as structured reports for personal records or referrals.', category: 'Patient' },
  { icon: UserCog, title: 'Slot Configuration', desc: 'Set up working hours, define appointment duration, and manage shift schedules including cross-midnight slots.', category: 'Doctor' },
  { icon: ClipboardList, title: 'Creating Treatments', desc: 'Step-by-step guide to creating treatment plans with diagnoses, prescriptions, and outcomes.', category: 'Doctor' },
  { icon: Users, title: 'Patient Management', desc: 'View assigned patients, access their profiles, treatment histories, and manage ongoing care.', category: 'Doctor' },
  { icon: BarChart3, title: 'Admin Analytics', desc: 'Use the admin dashboard to view system metrics, user statistics, and operational insights.', category: 'Admin' },
  { icon: Shield, title: 'Security & Audit Logs', desc: 'Monitor security events, review audit trails, and manage platform-wide security settings.', category: 'Admin' },
  { icon: Users, title: 'User Management', desc: 'Manage user accounts, verify doctors, handle activations/deactivations, and oversee roles.', category: 'Admin' },
  { icon: Lock, title: 'MFA Setup', desc: 'Enable and configure Multi-Factor Authentication for your account using email OTP verification.', category: 'All Users' },
];

const categoryColors = {
  Patient: 'bg-blue-50 text-blue-700',
  Doctor: 'bg-green-50 text-green-700',
  Admin: 'bg-purple-50 text-purple-700',
  'All Users': 'bg-orange-50 text-orange-700',
};

const DocumentationPage = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? guides : guides.filter(g => g.category === filter);

  return (
    <StaticPageLayout title="Documentation" subtitle="Everything you need to get started and make the most of HealthConnect.">
      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          { icon: Rocket, title: 'Quick Start Guide', desc: 'Get up and running in 5 minutes', anchor: '#getting-started' },
          { icon: BookOpen, title: 'Feature Guides', desc: 'Detailed guides for every feature', anchor: '#guides' },
          { icon: ExternalLink, title: 'API Reference', desc: 'Integrate with our REST API', link: '/api-reference' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            {item.link ? (
              <Link to={item.link} className="block bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group h-full">
                <item.icon className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-surface-900 mb-1">{item.title}</h3>
                <p className="text-sm text-surface-500">{item.desc}</p>
              </Link>
            ) : (
              <a href={item.anchor} className="block bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group h-full">
                <item.icon className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-surface-900 mb-1">{item.title}</h3>
                <p className="text-sm text-surface-500">{item.desc}</p>
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Getting Started */}
      <div id="getting-started" className="mb-20">
        <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Getting Started</h2>
        <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Follow these steps to set up your HealthConnect account and start managing your healthcare.</p>
        <div className="max-w-3xl mx-auto space-y-4">
          {gettingStarted.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 bg-white rounded-2xl p-6 border border-surface-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-surface-900 mb-1">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{step.desc}</p>
                {step.link && (
                  <Link to={step.link} className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 font-semibold hover:underline">
                    Go to Sign Up <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Guides */}
      <div id="guides" className="mb-12">
        <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Feature Guides</h2>
        <p className="text-surface-500 text-center mb-8 max-w-xl mx-auto">Detailed documentation for every feature, organized by user role.</p>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['All', 'Patient', 'Doctor', 'Admin', 'All Users'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g, i) => (
            <motion.div
              key={g.title + g.category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <g.icon className="w-7 h-7 text-primary-500 group-hover:scale-110 transition-transform" />
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[g.category]}`}>{g.category}</span>
              </div>
              <h3 className="font-bold text-surface-900 mb-1.5">{g.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Help CTA */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
        <Search className="w-10 h-10 text-white/80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Can't Find What You Need?</h2>
        <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">Our support team is here to help. Reach out and we'll get you sorted.</p>
        <Link to="/help-center" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
          Visit Help Center
        </Link>
      </div>
    </StaticPageLayout>
  );
};

export default DocumentationPage;
