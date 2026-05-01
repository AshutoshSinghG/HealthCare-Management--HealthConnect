import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Mail,
  BookOpen, CalendarCheck, Shield, UserCog, Pill, FileDown, CreditCard,
  Smartphone, Lock,
} from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const faqCategories = [
  {
    title: 'Account & Registration',
    icon: UserCog,
    faqs: [
      { q: 'How do I create an account?', a: 'Click "Get Started Free" on the homepage or visit the Sign Up page. Choose your role (Patient or Doctor), fill in your details, and verify your email address. You can also set up optional Multi-Factor Authentication for extra security.' },
      { q: 'I forgot my password. How do I reset it?', a: 'Click "Forgot Password?" on the login page. Enter your registered email address and we\'ll send you a password reset link. The link expires after 1 hour for security.' },
      { q: 'Can I change my role after registration?', a: 'Roles are assigned at registration and cannot be self-changed. If you need a role change, please contact our support team with your account details and reason for the change.' },
      { q: 'How do I enable Multi-Factor Authentication (MFA)?', a: 'After logging in, go to your Profile settings. You\'ll find the MFA option where you can enable email-based OTP verification. Once enabled, you\'ll need to enter a code from your email each time you log in.' },
    ],
  },
  {
    title: 'Appointments',
    icon: CalendarCheck,
    faqs: [
      { q: 'How do I book an appointment?', a: 'Go to "Book Appointment" in your patient dashboard. Browse doctors by specialization, select a doctor, choose an available date, and pick a time slot. Confirm your booking and you\'re all set!' },
      { q: 'Can I cancel or reschedule an appointment?', a: 'Yes, go to "My Appointments" in your dashboard. You can cancel upcoming appointments. To reschedule, cancel the existing one and book a new slot.' },
      { q: 'Why are no slots showing for my doctor?', a: 'The doctor may not have configured slots for that date, or all slots may be booked. Try selecting a different date or checking back later.' },
      { q: 'How does cross-midnight scheduling work?', a: 'Our system supports shifts that span midnight (e.g., 10 PM to 6 AM). Slots are correctly generated across the date boundary, so you can book late-night or early-morning appointments seamlessly.' },
    ],
  },
  {
    title: 'Treatments & Medications',
    icon: Pill,
    faqs: [
      { q: 'How do I view my treatment history?', a: 'Navigate to "Treatments" in your patient dashboard. You\'ll see a complete list of all treatments with diagnoses, doctor notes, outcomes, and prescribed medications.' },
      { q: 'What are "Unsuitable Medicines"?', a: 'This feature lets you record medicines you\'re allergic to or that cause adverse reactions. Your doctors can see this list to avoid prescribing harmful medications.' },
      { q: 'Can I export my medical records?', a: 'Yes! Go to "Export Records" in your dashboard. You can download your complete medical history as a structured report for personal records, insurance, or referrals.' },
    ],
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    faqs: [
      { q: 'Is my health data secure?', a: 'Absolutely. We use end-to-end encryption (TLS/SSL), bcrypt password hashing, JWT authentication with httpOnly cookies, role-based access control, and comprehensive audit logging. Our platform is designed for HIPAA compliance.' },
      { q: 'Who can see my medical records?', a: 'Only you and your assigned healthcare providers can access your medical records. Administrators have limited, logged access for operational purposes. All data access is recorded in the audit trail.' },
      { q: 'How is my data stored?', a: 'Your data is stored on secure, enterprise-grade cloud infrastructure with automated backups and geographic redundancy. Sensitive data is encrypted at rest and in transit.' },
    ],
  },
  {
    title: 'Technical Issues',
    icon: Smartphone,
    faqs: [
      { q: 'The app isn\'t loading properly. What should I do?', a: 'Try clearing your browser cache and cookies, then reload the page. If the issue persists, try a different browser. For ongoing issues, contact our support team.' },
      { q: 'I\'m not receiving email notifications.', a: 'Check your spam/junk folder first. Make sure your email address is verified in your profile settings. If issues continue, whitelist support@healthconnect.app in your email client.' },
      { q: 'Which browsers are supported?', a: 'HealthConnect works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.' },
    ],
  },
];

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (catIdx, faqIdx) => {
    const key = `${catIdx}-${faqIdx}`;
    setOpenFaq(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = searchQuery
    ? faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(f =>
          f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.faqs.length > 0)
    : faqCategories;

  return (
    <StaticPageLayout title="Help Center" subtitle="Find answers to common questions and get the support you need.">
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for help topics..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-surface-200 rounded-2xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-base"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          { icon: BookOpen, title: 'Documentation', desc: 'Detailed guides for every feature', to: '/documentation' },
          { icon: MessageCircle, title: 'Contact Support', desc: 'Get help from our team', to: '/contact' },
          { icon: Lock, title: 'API Reference', desc: 'Technical integration docs', to: '/api-reference' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Link to={item.to} className="block bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group h-full">
              <item.icon className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-surface-900 mb-1">{item.title}</h3>
              <p className="text-sm text-surface-500">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* FAQ Sections */}
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Frequently Asked Questions</h2>
        <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Browse common questions organized by topic.</p>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-surface-100">
            <HelpCircle className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-surface-700 mb-2">No results found</h3>
            <p className="text-surface-500">Try a different search term or <Link to="/contact" className="text-primary-600 font-semibold hover:underline">contact us</Link> directly.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-5 bg-surface-50 border-b border-surface-100">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-900">{cat.title}</h3>
                  <span className="text-xs font-medium text-surface-400 bg-white px-2.5 py-1 rounded-lg border border-surface-200">{cat.faqs.length} questions</span>
                </div>
                <div className="divide-y divide-surface-50">
                  {cat.faqs.map((faq, faqIdx) => {
                    const isOpen = openFaq[`${catIdx}-${faqIdx}`];
                    return (
                      <div key={faqIdx}>
                        <button onClick={() => toggleFaq(catIdx, faqIdx)} className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-surface-50/50 transition-colors">
                          {isOpen ? <ChevronDown className="w-5 h-5 text-primary-500 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-surface-400 flex-shrink-0" />}
                          <span className={`text-sm font-semibold ${isOpen ? 'text-primary-600' : 'text-surface-800'}`}>{faq.q}</span>
                        </button>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 pb-4 pl-14">
                            <p className="text-sm text-surface-600 leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
        <Mail className="w-10 h-10 text-white/80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Still Need Help?</h2>
        <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">Our support team typically responds within 24 hours.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
          Contact Support
        </Link>
      </div>
    </StaticPageLayout>
  );
};

export default HelpCenterPage;
