import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Unlock, Eye, Clock, MapPin, Search, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useSecurityData } from '../../hooks/useAdmin';

const severityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'default' };

const SecurityMonitoring = () => {
  const [tab, setTab] = useState(0);
  const tabNames = ['Failed Logins', 'Account Lockouts', 'MFA Attempts', 'Suspicious Activity'];

  const { data, isLoading } = useSecurityData();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading security data...</p>
        </div>
      </div>
    );
  }

  const { stats, failedLogins, lockouts, mfaAttempts, suspicious } = data;

  const securityStats = [
    { label: 'Failed Logins (24h)', value: stats.failedLogins24h, color: 'bg-danger-50 text-danger-700 border-danger-100' },
    { label: 'Account Lockouts', value: stats.accountLockouts, color: 'bg-warning-50 text-warning-700 border-warning-100' },
    { label: 'MFA Attempts (24h)', value: stats.mfaAttempts24h, color: 'bg-primary-50 text-primary-700 border-primary-100' },
    { label: 'Active Alerts', value: stats.activeAlerts, color: 'bg-violet-50 text-violet-700 border-violet-100' },
  ];

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
                  {failedLogins.length === 0 ? (
                    <tr><td colSpan={6} className="table-cell text-center text-surface-400 py-8">No failed login attempts in the last 24 hours</td></tr>
                  ) : (
                    failedLogins.map(l => (
                      <tr key={l.id} className="border-b border-surface-50 hover:bg-surface-50/50">
                        <td className="table-cell text-sm font-medium">{l.user}</td>
                        <td className="table-cell font-mono text-xs">{l.ip}</td>
                        <td className="table-cell text-xs">{l.country}</td>
                        <td className="table-cell"><Badge variant="danger" size="sm">{l.attempts} attempts</Badge></td>
                        <td className="table-cell text-xs text-surface-500">{l.time}</td>
                        <td className="table-cell"><Badge variant={l.status === 'blocked' ? 'danger' : 'success'} size="sm" dot>{l.status}</Badge></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 1 && (
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-warning-500" />Account Lockouts</h3>
            <div className="space-y-3">
              {lockouts.length === 0 ? (
                <p className="text-center text-surface-400 py-8">No locked accounts</p>
              ) : (
                lockouts.map((l, i) => (
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
                ))
              )}
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
                  {mfaAttempts.length === 0 ? (
                    <tr><td colSpan={4} className="table-cell text-center text-surface-400 py-8">No MFA attempts in the last 24 hours</td></tr>
                  ) : (
                    mfaAttempts.map(m => (
                      <tr key={m.id} className="border-b border-surface-50 hover:bg-surface-50/50">
                        <td className="table-cell text-sm font-medium">{m.user}</td>
                        <td className="table-cell"><Badge variant="info" size="sm">{m.method}</Badge></td>
                        <td className="table-cell text-xs text-surface-500">{m.time}</td>
                        <td className="table-cell">
                          {m.status === 'success' ? <Badge variant="success" size="sm" dot>Success</Badge> : <Badge variant="danger" size="sm" dot>Failed</Badge>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 3 && (
          <div className="space-y-3">
            {suspicious.length === 0 ? (
              <Card><p className="text-center text-surface-400 py-8">No suspicious activity detected</p></Card>
            ) : (
              suspicious.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card hover>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.severity === 'critical' ? 'bg-danger-50 border border-danger-200' : s.severity === 'high' ? 'bg-warning-50 border border-warning-200' : s.severity === 'medium' ? 'bg-warning-50 border border-warning-200' : 'bg-primary-50 border border-primary-200'}`}>
                        <AlertTriangle className={`w-5 h-5 ${s.severity === 'critical' ? 'text-danger-500' : s.severity === 'high' ? 'text-warning-500' : s.severity === 'medium' ? 'text-warning-500' : 'text-primary-500'}`} />
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
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SecurityMonitoring;
