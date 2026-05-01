import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Lock, Globe, Zap, Copy, Check, ChevronDown, ChevronRight, Server, Key, FileJson, Shield } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const CodeBlock = ({ method, path, desc }) => {
  const [copied, setCopied] = useState(false);
  const methodColors = { GET: 'bg-green-100 text-green-700', POST: 'bg-blue-100 text-blue-700', PUT: 'bg-orange-100 text-orange-700', DELETE: 'bg-red-100 text-red-700', PATCH: 'bg-purple-100 text-purple-700' };
  const handleCopy = () => { navigator.clipboard.writeText(`${method} /api${path}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex items-center gap-3 bg-surface-900 rounded-xl px-4 py-3 group">
      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${methodColors[method]}`}>{method}</span>
      <code className="text-sm text-green-400 font-mono flex-1">/api{path}</code>
      <span className="hidden sm:inline text-xs text-surface-400 max-w-[200px] truncate">{desc}</span>
      <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-surface-400">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const apiSections = [
  {
    title: 'Authentication', icon: Key, desc: 'Register, login, logout, and manage user sessions with JWT tokens.',
    endpoints: [
      { method: 'POST', path: '/auth/register', desc: 'Create a new account' },
      { method: 'POST', path: '/auth/login', desc: 'Login and receive JWT' },
      { method: 'POST', path: '/auth/logout', desc: 'Invalidate session' },
      { method: 'POST', path: '/auth/forgot-password', desc: 'Request password reset' },
      { method: 'POST', path: '/auth/reset-password', desc: 'Reset password with token' },
      { method: 'POST', path: '/auth/verify-mfa', desc: 'Verify MFA OTP code' },
    ],
  },
  {
    title: 'Appointments', icon: Globe, desc: 'Book, view, update, and cancel appointments between patients and doctors.',
    endpoints: [
      { method: 'GET', path: '/appointments', desc: 'List user appointments' },
      { method: 'POST', path: '/appointments', desc: 'Book new appointment' },
      { method: 'GET', path: '/appointments/:id', desc: 'Get appointment details' },
      { method: 'PATCH', path: '/appointments/:id/status', desc: 'Update status' },
      { method: 'DELETE', path: '/appointments/:id', desc: 'Cancel appointment' },
      { method: 'GET', path: '/appointments/slots/:doctorId', desc: 'Get available slots' },
    ],
  },
  {
    title: 'Treatments', icon: FileJson, desc: 'Create, view, and manage patient treatment records and histories.',
    endpoints: [
      { method: 'GET', path: '/treatments', desc: 'List treatments' },
      { method: 'POST', path: '/treatments', desc: 'Create treatment' },
      { method: 'GET', path: '/treatments/:id', desc: 'Get treatment detail' },
      { method: 'PUT', path: '/treatments/:id', desc: 'Update treatment' },
      { method: 'DELETE', path: '/treatments/:id', desc: 'Delete treatment' },
    ],
  },
  {
    title: 'Users & Profiles', icon: Shield, desc: 'Manage user profiles, doctor listings, and patient information.',
    endpoints: [
      { method: 'GET', path: '/users/me', desc: 'Get current user profile' },
      { method: 'PUT', path: '/users/me', desc: 'Update profile' },
      { method: 'GET', path: '/doctors', desc: 'List all doctors' },
      { method: 'GET', path: '/doctors/:id', desc: 'Get doctor profile' },
      { method: 'GET', path: '/patients', desc: 'List patients (doctor)' },
      { method: 'GET', path: '/patients/:id', desc: 'Get patient detail' },
    ],
  },
  {
    title: 'Medications', icon: Server, desc: 'Manage medications, prescriptions, and unsuitable medicine records.',
    endpoints: [
      { method: 'GET', path: '/medications', desc: 'List medications' },
      { method: 'POST', path: '/medications', desc: 'Add medication' },
      { method: 'GET', path: '/unsuitable-medicines', desc: 'List unsuitable meds' },
      { method: 'POST', path: '/unsuitable-medicines', desc: 'Add unsuitable med' },
      { method: 'DELETE', path: '/unsuitable-medicines/:id', desc: 'Remove entry' },
    ],
  },
  {
    title: 'Admin', icon: Lock, desc: 'Administrative endpoints for user management, audit logs, and system security.',
    endpoints: [
      { method: 'GET', path: '/admin/users', desc: 'List all users' },
      { method: 'PATCH', path: '/admin/users/:id', desc: 'Update user status' },
      { method: 'GET', path: '/admin/audit-logs', desc: 'Get audit trail' },
      { method: 'GET', path: '/admin/security', desc: 'Security dashboard' },
      { method: 'GET', path: '/admin/export', desc: 'Export system data' },
    ],
  },
];

const ApiReferencePage = () => {
  const [openSection, setOpenSection] = useState('Authentication');

  return (
    <StaticPageLayout title="API Reference" subtitle="Complete REST API documentation for integrating with HealthConnect.">
      {/* Overview Cards */}
      <div className="grid sm:grid-cols-4 gap-4 mb-16">
        {[
          { icon: Server, label: 'Base URL', value: '/api', sub: 'All endpoints prefixed' },
          { icon: Lock, label: 'Auth', value: 'JWT Bearer', sub: 'httpOnly cookies' },
          { icon: FileJson, label: 'Format', value: 'JSON', sub: 'Request & Response' },
          { icon: Zap, label: 'Rate Limit', value: '100 req/min', sub: 'Per API key' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm text-center">
            <item.icon className="w-7 h-7 text-primary-500 mx-auto mb-2" />
            <p className="text-xs text-surface-400 font-medium">{item.label}</p>
            <p className="text-lg font-bold text-surface-900">{item.value}</p>
            <p className="text-xs text-surface-400">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Auth Example */}
      <div className="bg-white rounded-3xl p-8 border border-surface-100 shadow-sm mb-16">
        <h2 className="text-xl font-bold text-surface-900 mb-4">Authentication Flow</h2>
        <p className="text-surface-600 text-sm leading-relaxed mb-6">
          All authenticated endpoints require a valid JWT token. Tokens are automatically sent via httpOnly cookies after login.
          For API integrations, include the token in the <code className="px-1.5 py-0.5 bg-surface-100 rounded text-sm font-mono">Authorization</code> header.
        </p>
        <div className="bg-surface-900 rounded-xl p-5 font-mono text-sm overflow-x-auto">
          <p className="text-surface-400 mb-1"># Login to get token</p>
          <p className="text-green-400 mb-3">POST /api/auth/login</p>
          <p className="text-surface-400 mb-1"># Request body</p>
          <p className="text-blue-300">{'{'}</p>
          <p className="text-blue-300 pl-4">"email": "doctor@gmail.com",</p>
          <p className="text-blue-300 pl-4">"password": "Test@123"</p>
          <p className="text-blue-300 mb-3">{'}'}</p>
          <p className="text-surface-400 mb-1"># Use token for authenticated requests</p>
          <p className="text-yellow-300">Authorization: Bearer {'<'}your-jwt-token{'>'}</p>
        </div>
      </div>

      {/* Endpoint Sections */}
      <div className="mb-12">
        <h2 className="text-3xl font-extrabold text-surface-900 mb-3 text-center">Endpoints</h2>
        <p className="text-surface-500 text-center mb-10 max-w-xl mx-auto">Browse all available API endpoints organized by resource.</p>
        <div className="space-y-3">
          {apiSections.map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === section.title ? '' : section.title)}
                className="w-full flex items-center gap-4 p-5 hover:bg-surface-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-surface-900">{section.title}</h3>
                  <p className="text-xs text-surface-500">{section.desc}</p>
                </div>
                <span className="text-xs font-medium text-surface-400 bg-surface-50 px-2.5 py-1 rounded-lg">{section.endpoints.length} endpoints</span>
                {openSection === section.title ? <ChevronDown className="w-5 h-5 text-surface-400" /> : <ChevronRight className="w-5 h-5 text-surface-400" />}
              </button>
              {openSection === section.title && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 space-y-2">
                  {section.endpoints.map((ep, i) => (
                    <CodeBlock key={i} {...ep} />
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limits & Errors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm">
          <Code2 className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-bold text-surface-900 mb-3">Error Responses</h3>
          <div className="space-y-2 text-sm">
            {[
              { code: '400', label: 'Bad Request', desc: 'Invalid input or validation error' },
              { code: '401', label: 'Unauthorized', desc: 'Missing or invalid JWT token' },
              { code: '403', label: 'Forbidden', desc: 'Insufficient role permissions' },
              { code: '404', label: 'Not Found', desc: 'Resource does not exist' },
              { code: '422', label: 'Unprocessable', desc: 'Validation schema mismatch' },
              { code: '500', label: 'Server Error', desc: 'Internal server failure' },
            ].map(err => (
              <div key={err.code} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-50">
                <span className="font-mono font-bold text-red-500 w-8">{err.code}</span>
                <span className="font-semibold text-surface-800 w-28">{err.label}</span>
                <span className="text-surface-500">{err.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm">
          <Zap className="w-8 h-8 text-primary-500 mb-3" />
          <h3 className="font-bold text-surface-900 mb-3">Rate Limiting</h3>
          <p className="text-sm text-surface-600 leading-relaxed mb-4">
            API requests are rate-limited to ensure fair usage and platform stability. Limits are applied per IP address and per authenticated user.
          </p>
          <div className="space-y-2 text-sm">
            {[
              { tier: 'Standard', limit: '100 requests/min', desc: 'Default for all users' },
              { tier: 'Authenticated', limit: '200 requests/min', desc: 'Logged-in users' },
              { tier: 'Admin', limit: '500 requests/min', desc: 'Admin API access' },
            ].map(t => (
              <div key={t.tier} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-50">
                <span className="font-semibold text-surface-800 w-28">{t.tier}</span>
                <span className="font-mono text-primary-600 w-36">{t.limit}</span>
                <span className="text-surface-500">{t.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-4">Exceeded limits return <code className="bg-surface-100 px-1 rounded">429 Too Many Requests</code>.</p>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default ApiReferencePage;
