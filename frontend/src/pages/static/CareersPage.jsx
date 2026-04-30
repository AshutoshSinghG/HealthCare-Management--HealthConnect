import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Heart, Code2, Palette, Server, Users, Megaphone, Shield, ArrowRight } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const openings = [
  { title: 'Senior Frontend Engineer', dept: 'Engineering', type: 'Full-Time', location: 'Remote / India', icon: Code2, desc: 'Build beautiful, performant React interfaces for our healthcare platform. Expertise in React, TypeScript, and Tailwind CSS required.' },
  { title: 'Backend Engineer (Node.js)', dept: 'Engineering', type: 'Full-Time', location: 'Remote / India', icon: Server, desc: 'Design and implement scalable APIs with Node.js, Express, and MongoDB. Experience with real-time systems (Socket.IO) is a plus.' },
  { title: 'UI/UX Designer', dept: 'Design', type: 'Full-Time', location: 'Remote / India', icon: Palette, desc: 'Craft intuitive, accessible healthcare interfaces. Figma expertise and experience with healthcare or enterprise SaaS design preferred.' },
  { title: 'DevOps Engineer', dept: 'Engineering', type: 'Full-Time', location: 'Remote', icon: Shield, desc: 'Manage our cloud infrastructure, CI/CD pipelines, and security compliance. AWS/GCP and Docker experience required.' },
  { title: 'Product Manager', dept: 'Product', type: 'Full-Time', location: 'Hybrid — India', icon: Users, desc: 'Drive product strategy for our healthcare platform. Healthcare domain experience and data-driven decision-making are essential.' },
  { title: 'Marketing Lead', dept: 'Marketing', type: 'Full-Time', location: 'Remote / India', icon: Megaphone, desc: 'Lead our growth marketing efforts across digital channels. Experience in B2B SaaS or healthcare marketing preferred.' },
];

const perks = [
  '🏥 Health insurance for you & family',
  '🌍 Fully remote work flexibility',
  '📚 Learning & development budget',
  '💰 Competitive salary & equity',
  '🏖️ Generous PTO & mental health days',
  '🎯 Impact-driven work in healthcare',
  '🚀 Fast-growing startup culture',
  '🤝 Collaborative, inclusive team',
];

const CareersPage = () => (
  <StaticPageLayout title="Careers" subtitle="Join our mission to revolutionize healthcare management. We're hiring!">
    {/* Why Join */}
    <div className="mb-16">
      <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm">
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Why Work at HealthConnect?</h2>
        <p className="text-surface-600 leading-relaxed mb-6">
          At HealthConnect, you'll work on technology that directly improves people's lives. Our
          platform serves thousands of patients and doctors daily, and every feature you build
          has real-world impact on healthcare outcomes. We offer a collaborative, remote-first
          culture where your ideas matter and your growth is invested in.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {perks.map(perk => (
            <div key={perk} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-50 text-sm text-surface-700 font-medium">
              {perk}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Open Positions */}
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Open Positions</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Find your next opportunity. We'd love to hear from you.</p>
      <div className="space-y-4">
        {openings.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <job.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-surface-900 mb-1">{job.title}</h3>
                <p className="text-sm text-surface-500 mb-2">{job.desc}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-surface-500 bg-surface-50 px-2.5 py-1 rounded-lg">
                    <Briefcase className="w-3 h-3" /> {job.dept}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-surface-500 bg-surface-50 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-surface-500 bg-surface-50 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                </div>
              </div>
              <a href="mailto:careers@healthconnect.app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-50 text-primary-600 font-semibold text-sm hover:bg-primary-100 transition-colors flex-shrink-0">
                Apply <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* General CTA */}
    <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
      <Heart className="w-10 h-10 text-white/80 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-3">Don't See Your Role?</h2>
      <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">We're always looking for talented people. Send us your resume and let's start a conversation.</p>
      <a href="mailto:careers@healthconnect.app" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
        Send Your Resume
      </a>
    </div>
  </StaticPageLayout>
);

export default CareersPage;
