import { motion } from 'framer-motion';
import { Users, Stethoscope, Activity, Server, ShieldCheck, Clock, TrendingUp, BarChart3, Heart, AlertTriangle, FileText, Download, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const systemStats = [
  { label: 'Total Users', value: '1,247', icon: Users, color: 'from-primary-500 to-primary-600', trend: '+12%' },
  { label: 'Active Patients', value: '1,102', icon: Heart, color: 'from-danger-400 to-danger-500', trend: '+25' },
  { label: 'Active Doctors', value: '38', icon: Stethoscope, color: 'from-success-500 to-success-600', trend: '+3' },
  { label: 'Total Treatments', value: '3,842', icon: Activity, color: 'from-warning-500 to-warning-600', trend: '+18%' },
  { label: 'System Uptime', value: '99.9%', icon: Server, color: 'from-violet-500 to-violet-600', trend: '' },
  { label: 'Security Alerts', value: '3', icon: Lock, color: 'from-danger-500 to-danger-600', trend: '-1' },
];

const activityData = [
  { hour: '00:00', logins: 5, actions: 12 },
  { hour: '04:00', logins: 2, actions: 8 },
  { hour: '08:00', logins: 45, actions: 120 },
  { hour: '12:00', logins: 38, actions: 95 },
  { hour: '16:00', logins: 52, actions: 140 },
  { hour: '20:00', logins: 20, actions: 45 },
];

const recentActivity = [
  { user: 'Dr. Michael Chen', action: 'Created treatment record', time: '2 min ago', role: 'doctor' },
  { user: 'Sarah Johnson', action: 'Viewed treatment history', time: '5 min ago', role: 'patient' },
  { user: 'Admin User', action: 'Exported audit logs', time: '15 min ago', role: 'admin' },
  { user: 'Dr. Priya Sharma', action: 'Flagged medication', time: '22 min ago', role: 'doctor' },
  { user: 'Robert Williams', action: 'Downloaded medical records', time: '30 min ago', role: 'patient' },
  { user: 'Dr. Sarah Wilson', action: 'Updated patient profile', time: '45 min ago', role: 'doctor' },
];

const quickActions = [
  { label: 'User Management', desc: 'Create, disable, manage users', icon: Users, to: '/admin/users', color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100' },
  { label: 'Doctor Management', desc: 'Add, update, manage doctors', icon: Stethoscope, to: '/admin/doctors', color: 'bg-success-50 text-success-600 group-hover:bg-success-100' },
  { label: 'Patient Records', desc: 'View all patient records', icon: Heart, to: '/admin/patients', color: 'bg-danger-50 text-danger-600 group-hover:bg-danger-100' },
  { label: 'Audit Logs', desc: 'System activity & history', icon: FileText, to: '/admin/audit-logs', color: 'bg-warning-50 text-warning-600 group-hover:bg-warning-100' },
  { label: 'Medicine Safety', desc: 'Unsuitable medicine flags', icon: AlertTriangle, to: '/admin/medicines', color: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' },
  { label: 'Security Monitor', desc: 'Login attempts & alerts', icon: ShieldCheck, to: '/admin/security', color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' },
];

const roleColors = { doctor: 'info', patient: 'success', admin: 'warning' };

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-surface-500 mt-1">System overview and management</p>
        </div>
        <Link to="/admin/export">
          <Button variant="outline" size="sm" icon={Download}>Export Records</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {systemStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-surface-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-success-500" />
                    <span className="text-xs font-medium text-success-500">{stat.trend}</span>
                  </div>
                )}
              </div>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <Link key={action.label} to={action.to} className="group">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
              <Card hover className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-surface-800">{action.label}</p>
                  <p className="text-xs text-surface-500">{action.desc}</p>
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-6">
          <h3 className="section-title mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            System Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="logins" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} name="Logins" />
                <Bar dataKey="actions" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} name="Actions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-surface-500">{a.user.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-800">
                    <span className="font-medium">{a.user}</span>{' '}
                    <span className="text-surface-500">{a.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-surface-400">{a.time}</span>
                    <Badge variant={roleColors[a.role]} size="sm">{a.role}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
