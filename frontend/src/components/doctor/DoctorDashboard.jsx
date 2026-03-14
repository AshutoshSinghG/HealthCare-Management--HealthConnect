import { motion } from 'framer-motion';
import { Users, Calendar, AlertTriangle, Clock, TrendingUp, ArrowUpRight, Stethoscope, Bell, Mail, Phone, FileText, Pill, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientsBarChart, OutcomePieChart } from '../../components/charts/PatientStatsChart';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';

const mockDoctorProfile = {
  name: 'Dr. Michael Chen',
  specialty: 'General Medicine',
  email: 'dr.chen@healthconnect.com',
  phone: '+1-555-2001',
  employeeId: 'DOC-2019-045',
  department: 'Internal Medicine',
  qualifications: 'MD, MBBS',
};

const mockStats = {
  totalPatients: 148,
  recentVisits: 12,
  medicineFlags: 5,
  followupsRequired: 8,
};

const mockNotifications = [
  { id: 1, message: 'Sarah Johnson follow-up due tomorrow', type: 'warning', time: '10 min ago' },
  { id: 2, message: 'New lab results available for Robert Williams', type: 'info', time: '30 min ago' },
  { id: 3, message: 'Treatment record updated for Emily Davis', type: 'success', time: '1 hour ago' },
  { id: 4, message: 'Medicine flag alert: Aspirin for James Brown', type: 'danger', time: '2 hours ago' },
];

const mockPendingFollowups = [
  { id: 1, patient: 'Sarah Johnson', date: '2026-03-07', diagnosis: 'Upper Respiratory Infection', daysUntil: 2 },
  { id: 2, patient: 'Robert Williams', date: '2026-03-08', diagnosis: 'Hypertension', daysUntil: 3 },
  { id: 3, patient: 'James Brown', date: '2026-03-10', diagnosis: 'Back Pain', daysUntil: 5 },
  { id: 4, patient: 'Emily Davis', date: '2026-03-10', diagnosis: 'Type 2 Diabetes', daysUntil: 5 },
  { id: 5, patient: 'Maria Garcia', date: '2026-03-12', diagnosis: 'Thyroid', daysUntil: 7 },
];

const mockRecentPatients = [
  { id: 1, name: 'Sarah Johnson', visitDate: '2026-03-05', diagnosis: 'URI', status: 'active', bloodGroup: 'O+' },
  { id: 2, name: 'Robert Williams', visitDate: '2026-03-04', diagnosis: 'Hypertension', status: 'follow-up', bloodGroup: 'A+' },
  { id: 3, name: 'Emily Davis', visitDate: '2026-03-03', diagnosis: 'Type 2 Diabetes', status: 'active', bloodGroup: 'B+' },
  { id: 4, name: 'James Brown', visitDate: '2026-03-02', diagnosis: 'Chronic Back Pain', status: 'stable', bloodGroup: 'AB-' },
  { id: 5, name: 'Lisa Anderson', visitDate: '2026-03-01', diagnosis: 'Migraine', status: 'recovered', bloodGroup: 'O-' },
];

const statCards = [
  { label: 'Total Patients', value: mockStats.totalPatients, icon: Users, color: 'from-primary-500 to-primary-600', trend: '+8%' },
  { label: 'Recent Visits', value: mockStats.recentVisits, icon: Calendar, color: 'from-success-500 to-success-600', trend: '+15%' },
  { label: 'Medicine Flags', value: mockStats.medicineFlags, icon: AlertTriangle, color: 'from-warning-500 to-warning-600', trend: '-2' },
  { label: 'Followups Due', value: mockStats.followupsRequired, icon: Clock, color: 'from-violet-500 to-violet-600', trend: '+3' },
];

const statusColors = { active: 'info', 'follow-up': 'warning', stable: 'success', recovered: 'success' };
const notifColors = { warning: 'bg-warning-50 text-warning-600', info: 'bg-primary-50 text-primary-600', success: 'bg-success-50 text-success-600', danger: 'bg-danger-50 text-danger-600' };

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Doctor Dashboard</h1>
          <p className="text-surface-500 mt-1">Welcome back, {mockDoctorProfile.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/doctor/profile">
            <Button variant="outline" size="sm" icon={Edit}>Edit Profile</Button>
          </Link>
          <Link to="/doctor/treatments/create">
            <Button icon={FileText} size="sm">+ New Treatment</Button>
          </Link>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Name</p>
                <p className="text-sm font-medium text-surface-800 mt-0.5">{mockDoctorProfile.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Specialty</p>
                <p className="text-sm text-surface-700 mt-0.5">{mockDoctorProfile.specialty}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Department</p>
                <p className="text-sm text-surface-700 mt-0.5">{mockDoctorProfile.department}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Employee ID</p>
                <Badge variant="info" size="sm">{mockDoctorProfile.employeeId}</Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-surface-400" />
                <span className="text-xs text-surface-600">{mockDoctorProfile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-surface-400" />
                <span className="text-xs text-surface-600">{mockDoctorProfile.phone}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Qualifications</p>
                <p className="text-xs text-surface-600 mt-0.5">{mockDoctorProfile.qualifications}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-2">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3.5 h-3.5 text-success-500" />
                    <span className="text-xs font-medium text-success-500">{stat.trend}</span>
                  </div>
                )}
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientsBarChart />
        <OutcomePieChart />
      </div>

      {/* Pending Follow-ups & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Follow-ups */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              Pending Follow-ups
            </h3>
            <Badge variant="warning" size="sm">{mockPendingFollowups.length} pending</Badge>
          </div>
          <div className="space-y-2">
            {mockPendingFollowups.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl border border-surface-100 hover:bg-surface-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {f.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-800 truncate">{f.patient}</p>
                    <p className="text-xs text-surface-500">{f.diagnosis}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xs font-medium text-surface-700">{formatDate(f.date)}</p>
                  <Badge variant={f.daysUntil <= 2 ? 'danger' : f.daysUntil <= 5 ? 'warning' : 'default'} size="sm">
                    {f.daysUntil === 0 ? 'Today' : f.daysUntil === 1 ? 'Tomorrow' : `In ${f.daysUntil} days`}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Notifications
            </h3>
            <Badge variant="info" size="sm">{mockNotifications.length} new</Badge>
          </div>
          <div className="space-y-2">
            {mockNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${notifColors[n.type]} flex items-center justify-center flex-shrink-0`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-700">{n.message}</p>
                  <p className="text-xs text-surface-400 mt-0.5">{n.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Recent Patients</h3>
          <Link to="/doctor/patients" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="table-header">Patient</th>
                <th className="table-header">Blood Group</th>
                <th className="table-header">Last Visit</th>
                <th className="table-header">Diagnosis</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentPatients.map((p) => (
                <tr key={p.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors cursor-pointer">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="table-cell"><Badge variant="default" size="sm">{p.bloodGroup}</Badge></td>
                  <td className="table-cell">{formatDate(p.visitDate)}</td>
                  <td className="table-cell">{p.diagnosis}</td>
                  <td className="table-cell"><Badge variant={statusColors[p.status]} size="sm" dot>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
