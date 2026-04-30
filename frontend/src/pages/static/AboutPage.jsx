import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Target, Eye, Users, Award, Globe, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const values = [
  { icon: Heart, title: 'Patient-First Care', desc: 'Every feature we build is designed with patient outcomes and comfort as the top priority.' },
  { icon: ShieldCheck, title: 'Uncompromising Security', desc: 'We treat health data with the highest level of protection — HIPAA compliance is our baseline, not our ceiling.' },
  { icon: Zap, title: 'Continuous Innovation', desc: 'We constantly evolve our platform with the latest healthcare technology and user feedback.' },
  { icon: Users, title: 'Inclusive Access', desc: 'We believe quality healthcare management should be accessible to every hospital, clinic, and patient.' },
  { icon: Globe, title: 'Transparency', desc: 'Open communication with our users, partners, and team members guides everything we do.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards of code quality, design, and customer support.' },
];

const milestones = [
  { year: '2023', title: 'Founded', desc: 'HealthConnect was born from a vision to modernize healthcare management in India.' },
  { year: '2023', title: 'MVP Launch', desc: 'First version released with patient management, appointment booking, and treatment tracking.' },
  { year: '2024', title: 'Real-Time Chat', desc: 'Launched secure doctor-patient chat powered by Socket.IO for live consultations.' },
  { year: '2024', title: 'Admin Dashboard', desc: 'Introduced comprehensive admin portal with audit logs, security monitoring, and analytics.' },
  { year: '2025', title: '5,000+ Users', desc: 'Crossed 5,000 registered patients and 200+ verified doctors on the platform.' },
  { year: '2026', title: 'AI-Powered Insights', desc: 'Working on intelligent health analytics, predictive diagnostics, and smart scheduling.' },
];

const AboutPage = () => (
  <StaticPageLayout title="About Us" subtitle="Learn about our mission to transform healthcare management through technology.">
    {/* Mission & Vision */}
    <div className="grid md:grid-cols-2 gap-8 mb-20">
      <div className="bg-white rounded-3xl p-8 border border-surface-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5">
          <Target className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Our Mission</h2>
        <p className="text-surface-600 leading-relaxed">
          To empower healthcare providers and patients with an intuitive, secure, and comprehensive
          digital platform that streamlines every aspect of healthcare management — from scheduling
          and consultations to treatment tracking and medical record keeping.
        </p>
      </div>
      <div className="bg-white rounded-3xl p-8 border border-surface-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-5">
          <Eye className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-4">Our Vision</h2>
        <p className="text-surface-600 leading-relaxed">
          A world where healthcare is seamlessly connected — where patients can access their health
          data anytime, doctors can provide efficient care without administrative burden, and
          hospitals can operate with complete transparency and security.
        </p>
      </div>
    </div>

    {/* Story */}
    <div className="mb-20">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-6 text-center">Our Story</h2>
      <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm max-w-3xl mx-auto">
        <p className="text-surface-600 leading-relaxed mb-4">
          HealthConnect started with a simple observation: the healthcare industry was drowning in
          paperwork, fragmented systems, and poor communication channels. Patients struggled to
          track their treatments, doctors spent hours on administrative tasks instead of patient care,
          and administrators lacked real-time visibility into hospital operations.
        </p>
        <p className="text-surface-600 leading-relaxed mb-4">
          We set out to build a unified platform that brings patients, doctors, and administrators
          together on a single, secure, and beautifully designed system. Built with modern technologies
          like React, Node.js, MongoDB, and Socket.IO, HealthConnect delivers real-time performance
          with enterprise-grade security.
        </p>
        <p className="text-surface-600 leading-relaxed">
          Today, HealthConnect serves over 5,000 patients and 200+ doctors, facilitating 15,000+
          appointments with a 98.5% satisfaction rate. And we're just getting started.
        </p>
      </div>
    </div>

    {/* Values */}
    <div className="mb-20">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Our Core Values</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">The principles that guide every decision we make.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <v.icon className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="font-bold text-surface-900 mb-2">{v.title}</h3>
            <p className="text-sm text-surface-500 leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Timeline */}
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Our Journey</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Key milestones in the HealthConnect story.</p>
      <div className="max-w-2xl mx-auto space-y-6">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-5 items-start"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary-50 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-primary-400">{m.year}</span>
              <CheckCircle2 className="w-5 h-5 text-primary-600" />
            </div>
            <div className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm flex-1">
              <h3 className="font-bold text-surface-900 mb-1">{m.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10 lg:p-14">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">Join the HealthConnect Community</h2>
      <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">Whether you're a patient, doctor, or hospital — we're here to make healthcare better for everyone.</p>
      <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
        Get Started Free
      </Link>
    </div>
  </StaticPageLayout>
);

export default AboutPage;
