import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Unlock, Eye, Clock, MapPin, Search, XCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const mockFailedLogins = [
  { id: 1, user: 'unknown@hacker.com', ip: '185.220.101.45', time: '2026-03-05 15:30', attempts: 5, status: 'blocked', country: 'Unknown' },
  { id: 2, user: 'dr.chen@health.com', ip: '192.168.1.100', time: '2026-03-05 14:15', attempts: 3, status: 'resolved', country: 'US' },
  { id: 3, user: 'admin@health.com', ip: '103.21.244.0', time: '2026-03-05 12:00', attempts: 4, status: 'blocked', country: 'India' },
];

const mockLockouts = [
  { id: 1, user: 'Dr. James Park', email: 'dr.park@health.com', lockedAt: '2026-03-03 11:30', reason: 'Multiple failed login attempts', ip: '172.16.0.35' },
  { id: 2, user: 'Emily Davis', email: 'emily.d@email.com', lockedAt: '2026-03-01 09:15', reason: 'Suspicious login pattern detected', ip: '10.0.0.92' },
];

const mockMfaAttempts = [
  { id: 1, user: 'Dr. Michael Chen', time: '2026-03-05 14:30', status: 'success', method: 'TOTP' },
  { id: 2, user: 'Admin User', time: '2026-03-05 13:00', status: 'success', method: 'TOTP' },
  { id: 3, user: 'Dr. Sarah Wilson', time: '2026-03-05 12:15', status: 'failed', method: 'TOTP' },
  { id: 4, user: 'Dr. Priya Sharma', time: '2026-03-05 10:00', status: 'success', method: 'Email OTP' },
];

const mockSuspicious = [
  { id: 1, type: 'Unusual Location', desc: 'Login from new location for Dr. Michael Chen (Thailand)', severity: 'medium', time: '2 hours ago' },
  { id: 2, type: 'Multiple IP Changes', desc: 'User sarah.j@email.com changed IP 4 times in 1 hour', severity: 'low', time: '5 hours ago' },
  { id: 3, type: 'Brute Force Attempt', desc: '15 failed login attempts from IP 185.220.101.45', severity: 'critical', time: '1 hour ago' },
];

const securityStats = [
  { label: 'Failed Logins (24h)', value: 12, color: 'bg-danger-50 text-danger-700 border-danger-100' },
  { label: 'Account Lockouts', value: 2, color: 'bg-warning-50 text-warning-700 border-warning-100' },
  { label: 'MFA Attempts (24h)', value: 45, color: 'bg-primary-50 text-primary-700 border-primary-100' },
  { label: 'Active Alerts', value: 3, color: 'bg-violet-50 text-violet-700 border-violet-100' },
];

const severityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'default' };

const SecurityMonitoring = () => {
  const [tab, setTab] = useState(0);
  const tabNames = ['Failed Logins', 'Account Lockouts', 'MFA Attempts', 'Suspicious Activity'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Security Monitoring</h1>
        <p className="text-surface-500 mt-1">Track failed logins, lockouts, MFA attempts, and suspicious activity</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {securityStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="border-b border-surface-200">
        <nav className="flex gap-1">
          {tabNames.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === i ? 'border-primary-500 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >{t}</button>
          ))}
        </nav>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 0 && (
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-danger-500" />Failed Login Attempts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-surface-100">
                  <th className="table-header">Email</th><th className="table-header">IP Address</th><th className="table-header">Country</th><th className="table-header">Attempts</th><th className="table-header">Time</th><th className="table-header">Status</th>
                </tr></thead>
                <tbody>
                  {mockFailedLogins.map(l => (
                    <tr key={l.id} className="border-b border-surface-50 hover:bg-surface-50/50">
                      <td className="table-cell text-sm font-medium">{l.user}</td>
                      <td className="table-cell font-mono text-xs">{l.ip}</td>
                      <td className="table-cell text-xs">{l.country}</td>
                      <td className="table-cell"><Badge variant="danger" size="sm">{l.attempts} attempts</Badge></td>
                      <td className="table-cell text-xs text-surface-500">{l.time}</td>
                      <td className="table-cell"><Badge variant={l.status === 'blocked' ? 'danger' : 'success'} size="sm" dot>{l.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 1 && (
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-warning-500" />Account Lockouts</h3>
            <div className="space-y-3">
              {mockLockouts.map((l, i) => (
                <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-warning-50/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-surface-800">{l.user}</p>
                      <Badge variant="danger" size="sm">Locked</Badge>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">{l.email} · IP: {l.ip}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{l.reason}</p>
                    <p className="text-xs text-surface-400 mt-0.5">Locked at: {l.lockedAt}</p>
                  </div>
                  <Button variant="outline" size="sm" icon={Unlock}>Unlock</Button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {tab === 2 && (
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-500" />MFA Verification Attempts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-surface-100">
                  <th className="table-header">User</th><th className="table-header">Method</th><th className="table-header">Time</th><th className="table-header">Result</th>
                </tr></thead>
                <tbody>
                  {mockMfaAttempts.map(m => (
                    <tr key={m.id} className="border-b border-surface-50 hover:bg-surface-50/50">
                      <td className="table-cell text-sm font-medium">{m.user}</td>
                      <td className="table-cell"><Badge variant="info" size="sm">{m.method}</Badge></td>
                      <td className="table-cell text-xs text-surface-500">{m.time}</td>
                      <td className="table-cell">
                        {m.status === 'success' ? <Badge variant="success" size="sm" dot>Success</Badge> : <Badge variant="danger" size="sm" dot>Failed</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 3 && (
          <div className="space-y-3">
            {mockSuspicious.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card hover>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.severity === 'critical' ? 'bg-danger-50 border border-danger-200' : s.severity === 'medium' ? 'bg-warning-50 border border-warning-200' : 'bg-primary-50 border border-primary-200'}`}>
                      <AlertTriangle className={`w-5 h-5 ${s.severity === 'critical' ? 'text-danger-500' : s.severity === 'medium' ? 'text-warning-500' : 'text-primary-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-surface-800">{s.type}</p>
                        <Badge variant={severityColors[s.severity]} size="sm">{s.severity}</Badge>
                      </div>
                      <p className="text-sm text-surface-600 mt-1">{s.desc}</p>
                      <p className="text-xs text-surface-400 mt-1">{s.time}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SecurityMonitoring;
