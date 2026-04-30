import { Shield, Lock, FileSearch, UserCheck, Server, AlertTriangle, Eye, Key } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const safeguards = [
  { icon: Lock, title: 'Encryption', desc: 'All data transmitted between your device and our servers is encrypted using TLS/SSL (Transport Layer Security). Passwords are hashed using bcrypt with multiple salt rounds, making them computationally infeasible to reverse.' },
  { icon: Key, title: 'Authentication Controls', desc: 'JWT-based authentication with httpOnly cookies prevents token theft via XSS attacks. Optional Multi-Factor Authentication (MFA) via email OTP adds a second verification layer. Session tokens expire automatically and cannot be reused.' },
  { icon: UserCheck, title: 'Role-Based Access Control (RBAC)', desc: 'Granular permissions ensure that patients can only access their own records, doctors can only view assigned patients, and administrators have controlled operational access. No user role can exceed its authorized scope.' },
  { icon: FileSearch, title: 'Comprehensive Audit Trail', desc: 'Every significant action — logins, logouts, data creation, reads, updates, deletions, and exports — is logged with the user identity, timestamp, IP address, and action type. Audit logs are immutable and available for compliance review.' },
  { icon: Server, title: 'Infrastructure Security', desc: 'Our platform is hosted on enterprise-grade cloud infrastructure with built-in DDoS protection, automated backups, and geographic redundancy. We maintain a 99.9% uptime SLA with automatic failover capabilities.' },
  { icon: AlertTriangle, title: 'Threat Detection', desc: 'Real-time monitoring detects suspicious activities including repeated failed login attempts, unusual access patterns, and potential brute-force attacks. The admin security dashboard provides immediate visibility into threats.' },
  { icon: Eye, title: 'Data Minimization', desc: 'We collect only the minimum data necessary to provide healthcare services. Protected Health Information (PHI) is stored separately from non-sensitive data, and access is restricted on a need-to-know basis.' },
  { icon: Shield, title: 'Incident Response', desc: 'We maintain a documented incident response plan. In the event of a data breach, affected users and regulatory authorities will be notified within 72 hours as required by HIPAA and applicable laws.' },
];

const sections = [
  { title: 'Our Commitment to HIPAA', content: 'HealthConnect is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA) of 1996, including the Privacy Rule, Security Rule, and Breach Notification Rule. We treat all patient health information as Protected Health Information (PHI) and implement administrative, physical, and technical safeguards to ensure its confidentiality, integrity, and availability.' },
  { title: 'What is Protected Health Information (PHI)?', content: 'PHI includes any individually identifiable health information that is created, received, maintained, or transmitted by HealthConnect. This includes patient names, contact details, medical record numbers, treatment histories, medication records, appointment data, diagnoses, doctor notes, and any other health-related data associated with a specific individual.' },
  { title: 'Patient Rights Under HIPAA', items: [
    'Right to access your complete medical records stored on HealthConnect',
    'Right to request corrections to your health information',
    'Right to receive an accounting of disclosures of your PHI',
    'Right to request restrictions on certain uses of your PHI',
    'Right to receive a copy of this HIPAA Notice',
    'Right to export your medical records at any time using our Export feature',
    'Right to file a complaint if you believe your privacy rights have been violated',
  ]},
  { title: 'Business Associate Agreements', content: 'HealthConnect enters into Business Associate Agreements (BAAs) with all third-party service providers who may access, process, or store PHI on our behalf. These agreements ensure that our partners comply with the same HIPAA standards we uphold, including data encryption, access controls, and breach notification requirements.' },
  { title: 'Training & Awareness', content: 'All HealthConnect team members undergo HIPAA compliance training upon hiring and receive annual refresher training. Our development team follows secure coding practices, including regular security audits, penetration testing, and code reviews to identify and remediate vulnerabilities.' },
  { title: 'Filing a Complaint', content: 'If you believe that your privacy rights have been violated or that HealthConnect has not complied with HIPAA regulations, you may file a complaint with our Privacy Officer at hipaa@healthconnect.app or with the U.S. Department of Health and Human Services (HHS) Office for Civil Rights. We will not retaliate against you for filing a complaint.' },
];

const HipaaNoticePage = () => (
  <StaticPageLayout title="HIPAA Notice" subtitle="How HealthConnect protects your health information under HIPAA regulations.">
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm mb-10">
      <p className="text-sm text-surface-400 mb-6">Last updated: April 30, 2026 &nbsp;|&nbsp; Effective: May 1, 2026</p>
      <p className="text-surface-600 leading-relaxed mb-8">
        This HIPAA Notice of Privacy Practices describes how your health information may be used
        and disclosed by HealthConnect, and how you can access this information. Please review it carefully.
      </p>

      {sections.map((section, i) => (
        <div key={i} className="mb-10 last:mb-0">
          <h2 className="text-xl font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100">{section.title}</h2>
          {section.content && <p className="text-surface-600 leading-relaxed text-sm">{section.content}</p>}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-surface-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>

    {/* Technical Safeguards */}
    <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Technical & Administrative Safeguards</h2>
    <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">The security measures we implement to protect your PHI.</p>
    <div className="grid sm:grid-cols-2 gap-5 mb-10">
      {safeguards.map(s => (
        <div key={s.title} className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm">
          <s.icon className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-bold text-surface-900 mb-2">{s.title}</h3>
          <p className="text-sm text-surface-500 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>

    {/* Contact */}
    <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
      <Shield className="w-10 h-10 text-white/80 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-3">HIPAA Privacy Officer</h2>
      <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">For any HIPAA-related questions, requests, or complaints, please contact our designated Privacy Officer.</p>
      <a href="mailto:hipaa@healthconnect.app" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform">
        hipaa@healthconnect.app
      </a>
    </div>
  </StaticPageLayout>
);

export default HipaaNoticePage;
