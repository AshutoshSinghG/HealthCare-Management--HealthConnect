import { motion } from 'framer-motion';
import { Newspaper, Calendar, Award, TrendingUp, ExternalLink } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const pressReleases = [
  { date: 'April 2026', title: 'HealthConnect Launches AI-Powered Health Insights', desc: 'New machine learning-based analytics feature provides predictive health insights and personalized wellness recommendations to patients.', tag: 'Product Launch' },
  { date: 'January 2026', title: 'HealthConnect Crosses 5,000 Registered Patients', desc: 'Platform milestone demonstrates growing trust among patients and healthcare providers across India.', tag: 'Milestone' },
  { date: 'October 2025', title: 'HealthConnect Partners with City Hospital Network', desc: 'Strategic partnership brings HealthConnect to 15 hospitals across 3 states, serving over 2,000 doctors.', tag: 'Partnership' },
  { date: 'July 2025', title: 'Real-Time Chat Feature Receives Healthcare Innovation Award', desc: 'Socket.IO-powered live consultation chat recognized at HealthTech Summit 2025 for improving patient-doctor communication.', tag: 'Award' },
  { date: 'March 2025', title: 'HealthConnect Achieves HIPAA Compliance Certification', desc: 'Platform meets all requirements for Health Insurance Portability and Accountability Act compliance, ensuring enterprise-grade data protection.', tag: 'Compliance' },
  { date: 'December 2024', title: 'HealthConnect Raises Seed Funding', desc: 'Secured seed funding to accelerate platform development, expand the team, and scale operations across India.', tag: 'Funding' },
];

const mediaKit = [
  { label: 'Brand Guidelines', desc: 'Logo usage, colors, typography, and brand assets.' },
  { label: 'Product Screenshots', desc: 'High-resolution screenshots of all dashboards and features.' },
  { label: 'Leadership Bios', desc: 'Founder and executive team biographies and headshots.' },
  { label: 'Fact Sheet', desc: 'Key statistics, milestones, and company overview.' },
];

const tagColors = {
  'Product Launch': 'bg-blue-50 text-blue-700',
  'Milestone': 'bg-green-50 text-green-700',
  'Partnership': 'bg-purple-50 text-purple-700',
  'Award': 'bg-orange-50 text-orange-700',
  'Compliance': 'bg-teal-50 text-teal-700',
  'Funding': 'bg-pink-50 text-pink-700',
};

const PressPage = () => (
  <StaticPageLayout title="Press & Media" subtitle="Latest news, press releases, and media resources from HealthConnect.">
    {/* Press Releases */}
    <div className="mb-16">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Press Releases</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Stay up to date with the latest HealthConnect news and announcements.</p>
      <div className="space-y-4">
        {pressReleases.map((pr, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary-600" />
                </div>
                <div className="sm:hidden">
                  <span className="text-xs font-medium text-surface-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {pr.date}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${tagColors[pr.tag]}`}>{pr.tag}</span>
                  <span className="hidden sm:inline-flex text-xs text-surface-400 items-center gap-1"><Calendar className="w-3 h-3" /> {pr.date}</span>
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-1.5 group-hover:text-primary-600 transition-colors">{pr.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{pr.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Media Kit */}
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Media Kit</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Resources for journalists, bloggers, and media professionals.</p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {mediaKit.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
          >
            <h3 className="font-bold text-surface-900 mb-1 flex items-center gap-2">
              {item.label}
              <ExternalLink className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
            </h3>
            <p className="text-sm text-surface-500">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Media Contact */}
    <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
      <Award className="w-10 h-10 text-white/80 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-3">Media Inquiries</h2>
      <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">For press inquiries, interviews, or media requests, please contact our communications team.</p>
      <a href="mailto:press@healthconnect.app" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
        press@healthconnect.app
      </a>
    </div>
  </StaticPageLayout>
);

export default PressPage;
