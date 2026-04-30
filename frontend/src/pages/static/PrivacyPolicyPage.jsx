import StaticPageLayout from '../../components/landing/StaticPageLayout';

const sections = [
  { title: '1. Information We Collect', content: [
    { subtitle: 'Personal Information', text: 'When you register for an account, we collect your name, email address, phone number, date of birth, blood group, and other health-related details you voluntarily provide.' },
    { subtitle: 'Medical Information', text: 'Our platform stores treatment records, medication histories, diagnoses, doctor notes, and unsuitable medicine alerts. This data is provided by you or your healthcare provider as part of the care process.' },
    { subtitle: 'Usage Data', text: 'We automatically collect information about how you interact with our platform, including pages visited, features used, appointment bookings, and session duration.' },
    { subtitle: 'Technical Data', text: 'We collect device information, IP addresses, browser type, operating system, and cookies for security, analytics, and service improvement purposes.' },
  ]},
  { title: '2. How We Use Your Information', content: [
    { subtitle: 'Healthcare Services', text: 'To facilitate appointment booking, treatment tracking, medication management, real-time chat consultations, and medical record export.' },
    { subtitle: 'Account Management', text: 'To create and manage your account, authenticate your identity via JWT tokens and optional Multi-Factor Authentication (MFA), and maintain session security.' },
    { subtitle: 'Communication', text: 'To send appointment reminders, treatment updates, security alerts, and important platform notifications.' },
    { subtitle: 'Analytics & Improvement', text: 'To analyze usage patterns, improve platform performance, develop new features, and generate anonymized healthcare analytics for administrators.' },
    { subtitle: 'Security & Compliance', text: 'To detect and prevent unauthorized access, maintain audit logs, comply with healthcare regulations (HIPAA), and ensure data integrity.' },
  ]},
  { title: '3. Data Sharing & Disclosure', content: [
    { subtitle: 'With Healthcare Providers', text: 'Your medical data is shared with your assigned doctors and healthcare providers to deliver care. Doctors can view treatment histories, medication records, and relevant health data.' },
    { subtitle: 'With Administrators', text: 'Hospital administrators have limited access for operational oversight, user management, and compliance monitoring. All admin access is logged in the audit trail.' },
    { subtitle: 'Third-Party Services', text: 'We may use trusted third-party services for email delivery, cloud hosting, and analytics. These providers are contractually bound to protect your data.' },
    { subtitle: 'Legal Requirements', text: 'We may disclose information if required by law, court order, or governmental regulation, or to protect the rights, property, or safety of HealthConnect and its users.' },
  ]},
  { title: '4. Data Security', content: [
    { subtitle: 'Encryption', text: 'All data is encrypted in transit using TLS/SSL. Passwords are hashed using bcrypt with salt rounds, ensuring they cannot be reversed.' },
    { subtitle: 'Access Controls', text: 'Role-based access control (RBAC) ensures patients, doctors, and administrators can only access data appropriate to their role.' },
    { subtitle: 'Audit Logging', text: 'Every significant action on the platform — logins, data access, modifications, and exports — is recorded in a comprehensive audit trail with timestamps and IP addresses.' },
    { subtitle: 'Authentication', text: 'We use JWT-based authentication with httpOnly cookies. Optional MFA via email OTP adds an additional layer of account protection.' },
  ]},
  { title: '5. Data Retention', content: [
    { text: 'We retain your personal and medical data for as long as your account is active or as needed to provide services. Medical records are retained in accordance with applicable healthcare regulations. You may request data export or deletion at any time, subject to legal retention requirements.' },
  ]},
  { title: '6. Your Rights', content: [
    { subtitle: 'Access & Export', text: 'You have the right to access all your personal and medical data. Our Export Records feature allows you to download your complete health history at any time.' },
    { subtitle: 'Correction', text: 'You can update or correct your personal information through your profile settings.' },
    { subtitle: 'Deletion', text: 'You can request account deletion by contacting our support team. We will delete your data in accordance with our retention policies and legal obligations.' },
    { subtitle: 'Consent Withdrawal', text: 'You can withdraw consent for data processing at any time, though this may affect your ability to use certain platform features.' },
  ]},
  { title: '7. Contact Us', content: [
    { text: 'If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@healthconnect.app or through our Contact page.' },
  ]},
];

const PrivacyPolicyPage = () => (
  <StaticPageLayout title="Privacy Policy" subtitle="How we collect, use, protect, and share your personal and health information.">
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm mb-8">
      <p className="text-sm text-surface-400 mb-6">Last updated: April 30, 2026 &nbsp;|&nbsp; Effective: May 1, 2026</p>
      <p className="text-surface-600 leading-relaxed mb-8">
        At HealthConnect, we are committed to protecting the privacy and security of your personal
        and health information. This Privacy Policy explains how we collect, use, store, and share
        your data when you use our healthcare management platform. By using HealthConnect, you
        agree to the practices described in this policy.
      </p>

      {sections.map((section, i) => (
        <div key={i} className="mb-10 last:mb-0">
          <h2 className="text-xl font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100">{section.title}</h2>
          <div className="space-y-4">
            {section.content.map((item, j) => (
              <div key={j}>
                {item.subtitle && <h3 className="font-semibold text-surface-800 mb-1">{item.subtitle}</h3>}
                <p className="text-surface-600 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </StaticPageLayout>
);

export default PrivacyPolicyPage;
