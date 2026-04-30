import StaticPageLayout from '../../components/landing/StaticPageLayout';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By creating an account or using the HealthConnect platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you must not use our services. HealthConnect reserves the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.' },
  { title: '2. Account Registration', content: 'To use HealthConnect, you must register for an account by providing accurate and complete information, including your name, email address, and role (Patient, Doctor, or Administrator). You are responsible for maintaining the confidentiality of your login credentials, including any Multi-Factor Authentication (MFA) setup. You must notify us immediately of any unauthorized access to your account. HealthConnect is not liable for any loss resulting from unauthorized use of your account.' },
  { title: '3. User Roles & Responsibilities', items: [
    { subtitle: 'Patients', text: 'You are responsible for providing accurate personal and medical information. You must not misuse the platform to book fraudulent appointments or submit false medical data.' },
    { subtitle: 'Doctors', text: 'You must hold valid medical credentials and maintain professional standards when creating treatments, prescribing medications, and communicating with patients. All medical advice given through the platform is your professional responsibility.' },
    { subtitle: 'Administrators', text: 'You must use administrative access responsibly and only for authorized operational purposes. All administrative actions are logged in the audit trail.' },
  ]},
  { title: '4. Acceptable Use', content: 'You agree not to: (a) use the platform for any illegal purpose; (b) attempt to gain unauthorized access to other users\' accounts or data; (c) transmit malware, viruses, or harmful code; (d) interfere with the platform\'s operation or security; (e) scrape, harvest, or collect user data without authorization; (f) impersonate another person or entity; (g) use the real-time chat feature for harassment, abuse, or non-medical purposes.' },
  { title: '5. Healthcare Disclaimer', content: 'HealthConnect is a healthcare management platform, not a medical provider. The platform facilitates communication between patients and doctors, but does not provide medical diagnoses, treatment recommendations, or emergency medical services. Always consult a qualified healthcare professional for medical advice. In case of a medical emergency, contact your local emergency services immediately.' },
  { title: '6. Intellectual Property', content: 'All content, features, and functionality of the HealthConnect platform — including but not limited to software, design, text, graphics, logos, and icons — are the exclusive property of HealthConnect and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the platform without explicit written permission.' },
  { title: '7. Data & Privacy', content: 'Your use of HealthConnect is also governed by our Privacy Policy, which describes how we collect, use, and protect your data. By using the platform, you consent to our data practices as described in the Privacy Policy. You retain ownership of your personal and medical data and may export or request deletion at any time.' },
  { title: '8. Service Availability', content: 'We strive to maintain 99.9% uptime, but HealthConnect does not guarantee uninterrupted access to the platform. We may perform scheduled maintenance, updates, or upgrades that temporarily affect availability. We will provide advance notice whenever possible. We are not liable for any losses resulting from service interruptions beyond our reasonable control.' },
  { title: '9. Termination', content: 'You may terminate your account at any time by contacting our support team. HealthConnect reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a security risk. Upon termination, your access to the platform will be revoked, and your data will be handled in accordance with our Privacy Policy and data retention obligations.' },
  { title: '10. Limitation of Liability', content: 'To the maximum extent permitted by law, HealthConnect and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability for any claim shall not exceed the amount paid by you to HealthConnect in the 12 months preceding the claim. This limitation applies regardless of the theory of liability.' },
  { title: '11. Governing Law', content: 'These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be resolved exclusively in the courts of Bangalore, Karnataka, India.' },
  { title: '12. Contact', content: 'For questions about these Terms of Service, please contact us at legal@healthconnect.app or through our Contact page.' },
];

const TermsPage = () => (
  <StaticPageLayout title="Terms of Service" subtitle="Please read these terms carefully before using the HealthConnect platform.">
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm">
      <p className="text-sm text-surface-400 mb-6">Last updated: April 30, 2026 &nbsp;|&nbsp; Effective: May 1, 2026</p>
      <p className="text-surface-600 leading-relaxed mb-8">
        Welcome to HealthConnect. These Terms of Service ("Terms") govern your access to and use of
        the HealthConnect healthcare management platform, including all associated features, services,
        and applications. Please read these terms carefully.
      </p>

      {sections.map((section, i) => (
        <div key={i} className="mb-10 last:mb-0">
          <h2 className="text-xl font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100">{section.title}</h2>
          {section.content && <p className="text-surface-600 leading-relaxed text-sm">{section.content}</p>}
          {section.items && (
            <div className="space-y-4">
              {section.items.map((item, j) => (
                <div key={j}>
                  <h3 className="font-semibold text-surface-800 mb-1">{item.subtitle}</h3>
                  <p className="text-surface-600 leading-relaxed text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </StaticPageLayout>
);

export default TermsPage;
