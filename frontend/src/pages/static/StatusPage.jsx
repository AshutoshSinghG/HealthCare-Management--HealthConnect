import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock, Globe, Server, Shield, Database, Wifi, ArrowUpRight } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const services = [
  { name: 'Web Application', icon: Globe, status: 'operational', uptime: '99.97%' },
  { name: 'Authentication Service', icon: Shield, status: 'operational', uptime: '99.99%' },
  { name: 'API Gateway', icon: Server, status: 'operational', uptime: '99.95%' },
  { name: 'Database (MongoDB)', icon: Database, status: 'operational', uptime: '99.99%' },
  { name: 'Real-Time Chat (Socket.IO)', icon: Wifi, status: 'operational', uptime: '99.92%' },
  { name: 'Email Notifications', icon: Activity, status: 'operational', uptime: '99.88%' },
  { name: 'File Export Service', icon: ArrowUpRight, status: 'operational', uptime: '99.94%' },
];

const incidents = [
  { date: 'April 22, 2026', title: 'Scheduled Maintenance — Database Migration', status: 'resolved', desc: 'Planned 15-minute maintenance window for MongoDB index optimization. All services were restored successfully with zero data loss.', duration: '15 min' },
  { date: 'April 10, 2026', title: 'Elevated API Response Times', status: 'resolved', desc: 'Brief period of increased latency on API endpoints due to traffic spike. Auto-scaling resolved the issue within 8 minutes.', duration: '8 min' },
  { date: 'March 28, 2026', title: 'Email Notification Delays', status: 'resolved', desc: 'Email notifications experienced 3-5 minute delays due to third-party email provider rate limits. Queue was cleared and delivery normalized.', duration: '45 min' },
  { date: 'March 15, 2026', title: 'Scheduled Maintenance — Security Patches', status: 'resolved', desc: 'Planned maintenance to apply critical security patches across all services. No user impact during the 10-minute window.', duration: '10 min' },
  { date: 'February 20, 2026', title: 'Socket.IO Connection Drops', status: 'resolved', desc: 'Intermittent WebSocket disconnections affected real-time chat for ~2% of active sessions. Hotfix deployed within 20 minutes.', duration: '20 min' },
];

const statusConfig = {
  operational: { label: 'Operational', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', icon: CheckCircle },
  degraded: { label: 'Degraded', color: 'text-yellow-600', bg: 'bg-yellow-50', dot: 'bg-yellow-500', icon: AlertTriangle },
  outage: { label: 'Major Outage', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', icon: XCircle },
  resolved: { label: 'Resolved', color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', icon: CheckCircle },
};

const StatusPage = () => {
  const [lastUpdated, setLastUpdated] = useState('');
  useEffect(() => {
    setLastUpdated(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
  }, []);

  const allOperational = services.every(s => s.status === 'operational');

  return (
    <StaticPageLayout title="System Status" subtitle="Real-time operational status of all HealthConnect services.">
      {/* Overall Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-8 mb-12 text-center border ${allOperational ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
      >
        {allOperational ? (
          <>
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-green-800 mb-2">All Systems Operational</h2>
            <p className="text-green-600 text-sm">All HealthConnect services are running normally with no known issues.</p>
          </>
        ) : (
          <>
            <AlertTriangle className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-yellow-800 mb-2">Partial Service Disruption</h2>
            <p className="text-yellow-600 text-sm">Some services are experiencing issues. Our team is investigating.</p>
          </>
        )}
        <p className="text-xs text-surface-400 mt-4 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Last updated: {lastUpdated}
        </p>
      </motion.div>

      {/* Uptime Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Current Uptime', value: '99.96%', sub: 'Last 30 days' },
          { label: 'Avg Response Time', value: '142ms', sub: 'API endpoints' },
          { label: 'Incidents', value: '0', sub: 'Active right now' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm text-center">
            <p className="text-xs text-surface-400 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-surface-900">{stat.value}</p>
            <p className="text-xs text-surface-400">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Service Status Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-surface-900 mb-6">Service Status</h2>
        <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-surface-50">
            {services.map((svc, i) => {
              const cfg = statusConfig[svc.status];
              return (
                <motion.div
                  key={svc.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50/50 transition-colors"
                >
                  <svc.icon className="w-5 h-5 text-surface-400 flex-shrink-0" />
                  <span className="font-semibold text-surface-900 text-sm flex-1">{svc.name}</span>
                  <span className="text-xs font-mono text-surface-400 hidden sm:inline">{svc.uptime} uptime</span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.color}`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                    {cfg.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Uptime Chart (visual) */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-surface-900 mb-2">90-Day Uptime History</h2>
        <p className="text-surface-500 text-sm mb-6">Each bar represents one day. Green = fully operational.</p>
        <div className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm">
          <div className="flex gap-[2px] h-10 items-end">
            {Array.from({ length: 90 }, (_, i) => {
              const isIncident = [68, 59, 45, 30, 15].includes(i);
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all hover:opacity-80 cursor-pointer ${isIncident ? 'bg-yellow-400 h-6' : 'bg-green-400 h-full'}`}
                  title={isIncident ? 'Minor incident' : 'Fully operational'}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-surface-400 mt-2">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-surface-900 mb-6">Recent Incidents</h2>
        <div className="space-y-3">
          {incidents.map((inc, i) => {
            const cfg = statusConfig[inc.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-surface-900 text-sm">{inc.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-sm text-surface-500 leading-relaxed">{inc.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 flex-shrink-0">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {inc.duration}</span>
                    <span>{inc.date}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default StatusPage;
