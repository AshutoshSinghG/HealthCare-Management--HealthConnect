import StaticPageLayout from '../../components/landing/StaticPageLayout';

const sections = [
  { title: '1. What Are Cookies?', content: 'Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website recognize your device and remember certain information about your preferences and actions.' },
  { title: '2. How We Use Cookies', items: [
    { subtitle: 'Essential Cookies', text: 'These cookies are strictly necessary for the platform to function. They enable core features like user authentication (JWT session tokens), secure login, and navigation between protected pages. Without these cookies, HealthConnect cannot operate. These cookies do not store any personally identifiable information beyond your session token.', required: true },
    { subtitle: 'Security Cookies', text: 'Used for Multi-Factor Authentication (MFA) verification, CSRF protection, and detecting suspicious login activity. These cookies help us maintain the security of your account and comply with HIPAA requirements.', required: true },
    { subtitle: 'Preference Cookies', text: 'These cookies remember your settings and preferences, such as your dashboard layout, notification preferences, and language selection. They enhance your experience by not requiring you to re-enter settings each visit.', required: false },
    { subtitle: 'Analytics Cookies', text: 'We use analytics cookies to understand how users interact with our platform — which features are most popular, where users encounter issues, and how we can improve the user experience. This data is collected in anonymized, aggregated form and is never used to identify individual users.', required: false },
  ]},
  { title: '3. Third-Party Cookies', content: 'HealthConnect may use limited third-party services that place their own cookies on your device. These may include cloud hosting providers and anonymized analytics tools. We do not use advertising cookies or share cookie data with advertisers. All third-party cookie usage is governed by the respective providers\' privacy policies.' },
  { title: '4. Cookie Duration', items: [
    { subtitle: 'Session Cookies', text: 'Temporary cookies that are deleted when you close your browser. Used primarily for authentication and session management.' },
    { subtitle: 'Persistent Cookies', text: 'Cookies that remain on your device for a set period (typically 7-30 days). Used for remembering your preferences and keeping you logged in across sessions.' },
  ]},
  { title: '5. Managing Cookies', content: 'You can control and manage cookies through your browser settings. Most browsers allow you to view, delete, and block cookies from specific or all websites. Please note that disabling essential cookies will prevent you from using HealthConnect, as they are required for authentication and security. To manage cookies in your browser, visit your browser\'s help or settings menu. Common browsers include: Chrome (Settings → Privacy and Security → Cookies), Firefox (Settings → Privacy & Security → Cookies), Safari (Preferences → Privacy → Cookies), Edge (Settings → Privacy → Cookies).' },
  { title: '6. Cookie Consent', content: 'By using HealthConnect, you consent to the use of essential and security cookies, as they are required for the platform to function. For preference and analytics cookies, we respect your choices and provide options to opt out where applicable.' },
  { title: '7. Updates to This Policy', content: 'We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The "Last Updated" date at the top of this page indicates when the policy was most recently revised.' },
  { title: '8. Contact', content: 'If you have questions about our use of cookies, please contact us at privacy@healthconnect.app.' },
];

const CookiePolicyPage = () => (
  <StaticPageLayout title="Cookie Policy" subtitle="How HealthConnect uses cookies and similar technologies.">
    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-surface-100 shadow-sm">
      <p className="text-sm text-surface-400 mb-6">Last updated: April 30, 2026</p>
      <p className="text-surface-600 leading-relaxed mb-8">
        This Cookie Policy explains how HealthConnect uses cookies and similar tracking technologies
        when you access or use our healthcare management platform. It should be read alongside our
        Privacy Policy for a complete understanding of our data practices.
      </p>

      {sections.map((section, i) => (
        <div key={i} className="mb-10 last:mb-0">
          <h2 className="text-xl font-bold text-surface-900 mb-4 pb-2 border-b border-surface-100">{section.title}</h2>
          {section.content && <p className="text-surface-600 leading-relaxed text-sm">{section.content}</p>}
          {section.items && (
            <div className="space-y-4">
              {section.items.map((item, j) => (
                <div key={j} className="pl-4 border-l-2 border-surface-100">
                  <h3 className="font-semibold text-surface-800 mb-1 flex items-center gap-2">
                    {item.subtitle}
                    {'required' in item && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.required ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {item.required ? 'Required' : 'Optional'}
                      </span>
                    )}
                  </h3>
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

export default CookiePolicyPage;
