import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Stethoscope, GraduationCap, FlaskConical, Wifi, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const partnerTypes = [
  { icon: Building2, title: 'Hospitals & Clinics', desc: 'Integrate HealthConnect into your existing infrastructure for seamless patient management, appointment scheduling, and staff coordination.', benefits: ['Custom deployment options', 'Dedicated onboarding support', 'Volume licensing'] },
  { icon: Stethoscope, title: 'Healthcare Providers', desc: 'Join our network of verified doctors and specialists. Expand your patient reach and streamline your practice management.', benefits: ['Enhanced visibility to patients', 'Integrated scheduling', 'Digital treatment records'] },
  { icon: GraduationCap, title: 'Medical Institutions', desc: 'Partner with us for research, training, and academic collaborations. Access anonymized health analytics for studies.', benefits: ['Research data partnerships', 'Student training programs', 'Academic discounts'] },
  { icon: FlaskConical, title: 'Pharma & Lab Partners', desc: 'Integrate your diagnostics, lab results, and medication databases directly into the HealthConnect ecosystem.', benefits: ['API integration support', 'Drug database sync', 'Lab report automation'] },
  { icon: Wifi, title: 'Technology Partners', desc: 'Build on top of HealthConnect with API access. Integrate wearables, IoT devices, and third-party health apps.', benefits: ['Developer API access', 'Technical documentation', 'Co-marketing opportunities'] },
];

const PartnersPage = () => (
  <StaticPageLayout title="Partners" subtitle="Join our ecosystem. Let's build the future of healthcare together.">
    {/* Intro */}
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm mb-16 max-w-3xl mx-auto text-center">
      <Heart className="w-10 h-10 text-primary-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-surface-900 mb-4">Partner With HealthConnect</h2>
      <p className="text-surface-600 leading-relaxed">
        We believe that healthcare transformation requires collaboration. Whether you're a hospital,
        a technology company, a pharmaceutical firm, or a medical institution, there's a partnership
        model tailored for you. Together, we can create better health outcomes for millions.
      </p>
    </div>

    {/* Partner Types */}
    <div className="mb-16">
      <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Partnership Opportunities</h2>
      <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Choose the partnership model that fits your organization.</p>
      <div className="space-y-5">
        {partnerTypes.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-6 lg:p-8 border border-surface-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <p.icon className="w-7 h-7 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-surface-900 mb-2">{p.title}</h3>
                <p className="text-surface-600 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.benefits.map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* CTA */}
    <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10 lg:p-14">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">Become a Partner Today</h2>
      <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">Reach out to our partnerships team and let's explore how we can work together.</p>
      <a href="mailto:partners@healthconnect.app" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
        Contact Partnerships <ArrowRight className="w-5 h-5" />
      </a>
    </div>
  </StaticPageLayout>
);

export default PartnersPage;
