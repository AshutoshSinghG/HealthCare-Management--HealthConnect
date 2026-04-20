import { motion } from 'framer-motion';
import { Users, Calendar, AlertTriangle, Clock, TrendingUp, ArrowUpRight, Stethoscope, Bell, Mail, Phone, FileText, Pill, Edit, Loader2, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientsBarChart, OutcomePieChart } from '../../components/charts/PatientStatsChart';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';
import { useDoctorDashboard } from '../../hooks/useDoctors';
import { useDoctorAverageRating } from '../../hooks/useRatings';
import { Star } from 'lucide-react';

const statusColors = { ONGOING: 'info', FOLLOW_UP: 'warning', RESOLVED: 'success', REFERRED: 'warning' };

const DoctorDashboard = () => {
  const { data, isLoading, isError } = useDoctorDashboard();

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

  const { profile, stats, recentPatients, pendingFollowups, todaysAppointments } = data;
  const doctorName = `Dr. ${profile.firstName} ${profile.lastName}`;

  // Fetch rating separately so it doesn't block the dashboard if it takes longer
  const { data: ratingData } = useDoctorAverageRating(profile._id);
  const avgRating = ratingData?.averageRating || 0;

  const statCards = [
    { label: 'Today\'s Appts', value: stats.todayAppointmentsCount || 0, icon: CalendarCheck, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'from-primary-500 to-primary-600' },
    { label: 'Recent Visits', value: stats.recentVisits, icon: Calendar, color: 'from-success-500 to-success-600' },
    { label: 'Medicine Flags', value: stats.flaggedMedicines, icon: AlertTriangle, color: 'from-warning-500 to-warning-600' },
    { label: 'Followups Due', value: stats.followupsRequired, icon: Clock, color: 'from-violet-500 to-violet-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Doctor Dashboard</h1>
          <p className="text-surface-500 mt-1">Welcome back, {doctorName}</p>
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
                <p className="text-sm font-medium text-surface-800 mt-0.5">{doctorName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Specialty</p>
                <p className="text-sm text-surface-700 mt-0.5">{profile.specialisation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Department</p>
                <p className="text-sm text-surface-700 mt-0.5">{profile.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Reg. Number</p>
                <Badge variant="info" size="sm">{profile.registrationNumber}</Badge>
              </div>
              {profile.contactEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-xs text-surface-600">{profile.contactEmail}</span>
                </div>
              )}
              {profile.contactPhone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-xs text-surface-600">{profile.contactPhone}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Appointments */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-500" />
            Today's Appointments
          </h3>
          <Badge variant="info" size="sm">{(todaysAppointments || []).length} Pending</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="table-header">Patient Name</th>
                <th className="table-header">Diagnosis</th>
                <th className="table-header">Timing</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(todaysAppointments || []).length === 0 ? (
                <tr><td colSpan={5} className="table-cell text-center text-surface-400 py-8">No appointments remaining for today</td></tr>
              ) : (
                todaysAppointments.map((appt) => (
                  <tr key={appt.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                          {(appt.patientName || 'Unknown').split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{appt.patientName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="table-cell text-surface-600">{appt.diagnosis || 'New Patient'}</td>
                    <td className="table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-surface-700">{appt.time}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant="warning" size="sm" dot>{appt.status}</Badge>
                    </td>
                    <td className="table-cell text-right">
                      <Link to={`/doctor/treatments/create?patientId=${appt.patientId || ''}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 h-7">Treat</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientsBarChart />
        <OutcomePieChart />
      </div>

      {/* Pending Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              Pending Follow-ups
            </h3>
            <Badge variant="warning" size="sm">{(pendingFollowups || []).length} pending</Badge>
          </div>
          <div className="space-y-2">
            {(pendingFollowups || []).length === 0 ? (
              <p className="text-sm text-surface-400 py-4 text-center">No pending follow-ups</p>
            ) : (
              pendingFollowups.map((f, i) => {
                const daysUntil = Math.max(0, Math.ceil((new Date(f.followUpDate) - new Date()) / (1000 * 60 * 60 * 24)));
                const patientName = f.patientId ? `${f.patientId.firstName} ${f.patientId.lastName}` : 'Unknown';
                return (
                  <motion.div
                    key={f._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-surface-100 hover:bg-surface-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-800 truncate">{patientName}</p>
                        <p className="text-xs text-surface-500">{f.diagnosis}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-xs font-medium text-surface-700">{formatDate(f.followUpDate)}</p>
                      <Badge variant={daysUntil <= 2 ? 'danger' : daysUntil <= 5 ? 'warning' : 'default'} size="sm">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>

        {/* Empty right column for balance */}
        <Card>
          <h3 className="section-title flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary-500" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link to="/doctor/patients" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <Users className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-surface-700">View all patients</span>
            </Link>
            <Link to="/doctor/treatments/create" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <FileText className="w-5 h-5 text-success-500" />
              <span className="text-sm text-surface-700">Create new treatment</span>
            </Link>
            <Link to="/doctor/slots" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <Calendar className="w-5 h-5 text-violet-500" />
              <span className="text-sm text-surface-700">Manage appointment slots</span>
            </Link>
            <Link to="/doctor/ratings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
              <Star className="w-5 h-5 text-warning-500" />
              <span className="text-sm text-surface-700">View patient ratings</span>
            </Link>
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
              {(recentPatients || []).length === 0 ? (
                <tr><td colSpan={5} className="table-cell text-center text-surface-400 py-8">No patients yet</td></tr>
              ) : (
                recentPatients.map((p) => {
                  const pName = `${p.firstName} ${p.lastName}`;
                  return (
                    <tr key={p._id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors cursor-pointer">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                            {pName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{pName}</span>
                        </div>
                      </td>
                      <td className="table-cell"><Badge variant="default" size="sm">{p.bloodGroup || 'N/A'}</Badge></td>
                      <td className="table-cell">{p.lastTreatment ? formatDate(p.lastTreatment.visitDate) : 'N/A'}</td>
                      <td className="table-cell">{p.lastTreatment?.diagnosis || 'N/A'}</td>
                      <td className="table-cell">
                        <Badge variant={statusColors[p.lastTreatment?.outcomeStatus] || 'default'} size="sm" dot>
                          {p.lastTreatment?.outcomeStatus || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
