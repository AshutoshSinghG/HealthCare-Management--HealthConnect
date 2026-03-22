import { motion } from 'framer-motion';
import { Users, Stethoscope, Activity, Server, ShieldCheck, Clock, TrendingUp, BarChart3, Heart, AlertTriangle, FileText, Download, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '../../api/adminApi';

const quickActions = [
  { label: 'User Management', desc: 'Create, disable, manage users', icon: Users, to: '/admin/users', color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100' },
  { label: 'Doctor Management', desc: 'Add, update, manage doctors', icon: Stethoscope, to: '/admin/doctors', color: 'bg-success-50 text-success-600 group-hover:bg-success-100' },
  { label: 'Patient Records', desc: 'View all patient records', icon: Heart, to: '/admin/patients', color: 'bg-danger-50 text-danger-600 group-hover:bg-danger-100' },
  { label: 'Audit Logs', desc: 'System activity & history', icon: FileText, to: '/admin/audit-logs', color: 'bg-warning-50 text-warning-600 group-hover:bg-warning-100' },
  { label: 'Medicine Safety', desc: 'Unsuitable medicine flags', icon: AlertTriangle, to: '/admin/medicines', color: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' },
  { label: 'Security Monitor', desc: 'Login attempts & alerts', icon: ShieldCheck, to: '/admin/security', color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' },
];

const roleColors = { DOCTOR: 'info', PATIENT: 'success', ADMIN: 'warning' };

const AdminDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-surface-800">Unable to load dashboard</h3>
          <p className="text-surface-500 text-sm mt-1">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = data;

  const systemStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-primary-500 to-primary-600' },
    { label: 'Active Patients', value: stats.totalPatients, icon: Heart, color: 'from-danger-400 to-danger-500' },
    { label: 'Active Doctors', value: stats.totalDoctors, icon: Stethoscope, color: 'from-success-500 to-success-600' },
    { label: 'Total Treatments', value: stats.totalTreatments, icon: Activity, color: 'from-warning-500 to-warning-600' },
    { label: 'Audit Logs', value: stats.totalAuditLogs, icon: FileText, color: 'from-violet-500 to-violet-600' },
    { label: 'System Status', value: 'Live', icon: Server, color: 'from-success-500 to-success-600' },
  ];

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

      {/* Recent Activity */}
      <Card>
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-500" />
          Recent Activity
        </h3>
        <div className="space-y-2">
          {(recentActivity || []).length === 0 ? (
            <p className="text-sm text-surface-400 py-4 text-center">No recent activity</p>
          ) : (
            recentActivity.map((a, i) => (
              <motion.div key={a._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-surface-500">
                    {a.actorUserId?.email?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-800">
                    <span className="font-medium">{a.actorUserId?.email || 'Unknown'}</span>{' '}
                    <span className="text-surface-500">{a.actionType} — {a.entityType}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-surface-400">
                      {a.occurredAt ? new Date(a.occurredAt).toLocaleString() : ''}
                    </span>
                    <Badge variant={roleColors[a.actorUserId?.role] || roleColors[a.actorRole] || 'default'} size="sm">
                      {a.actorUserId?.role || a.actorRole || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
