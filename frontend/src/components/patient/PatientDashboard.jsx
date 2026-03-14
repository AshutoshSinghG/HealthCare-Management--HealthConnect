import { motion } from 'framer-motion';
import { Activity, Pill, AlertTriangle, Calendar, TrendingUp, ArrowUpRight, User, Droplets, Phone, Heart, MapPin, FileText, Download, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import TreatmentChart from '../../components/charts/TreatmentChart';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';

const mockProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+1-555-0101',
  dob: '1990-05-15',
  age: 35,
  bloodGroup: 'O+',
  gender: 'Female',
  address: '742 Evergreen Terrace, Springfield, IL 62704',
  allergies: ['Penicillin', 'Peanuts'],
  chronicConditions: ['Hypertension', 'Mild Asthma'],
  emergencyContact: { name: 'John Johnson', phone: '+1-555-9999', relation: 'Spouse' },
};

const mockStats = {
  totalTreatments: 24,
  activeMedicines: 5,
  flaggedMedicines: 2,
  lastVisit: '2026-03-05T10:30:00Z',
};

const mockRecentTreatments = [
  { id: 1, date: '2026-03-05', doctor: 'Dr. Michael Chen', diagnosis: 'Upper Respiratory Infection', outcome: 'improved' },
  { id: 2, date: '2026-02-20', doctor: 'Dr. Sarah Wilson', diagnosis: 'Routine Checkup', outcome: 'recovered' },
  { id: 3, date: '2026-02-10', doctor: 'Dr. Michael Chen', diagnosis: 'Hypertension Follow-up', outcome: 'stable' },
  { id: 4, date: '2026-01-28', doctor: 'Dr. Priya Sharma', diagnosis: 'Allergic Rhinitis', outcome: 'improved' },
];

const mockUnsuitableMedicines = [
  { id: 1, name: 'Aspirin', reason: 'Allergic reaction documented', severity: 'high' },
  { id: 2, name: 'Penicillin', reason: 'Drug interaction with current medication', severity: 'medium' },
];

const statCards = [
  { label: 'Total Treatments', value: mockStats.totalTreatments, icon: Activity, color: 'from-primary-500 to-primary-600', trend: '+12%' },
  { label: 'Active Medicines', value: mockStats.activeMedicines, icon: Pill, color: 'from-success-500 to-success-600', trend: '+2' },
  { label: 'Medicine Alerts', value: mockStats.flaggedMedicines, icon: AlertTriangle, color: 'from-warning-500 to-warning-600', trend: '0' },
  { label: 'Last Visit', value: formatDate(mockStats.lastVisit, 'MMM dd'), icon: Calendar, color: 'from-violet-500 to-violet-600', trend: '' },
];

const outcomeColors = {
  improved: 'success', recovered: 'success', stable: 'warning', worsened: 'danger', referred: 'info',
};

const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Patient Dashboard</h1>
          <p className="text-surface-500 mt-1">Welcome back, {mockProfile.name}! Here's your health overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/patient/profile">
            <Button variant="outline" size="sm" icon={Edit}>Edit Profile</Button>
          </Link>
          <Link to="/patient/export">
            <Button variant="outline" size="sm" icon={Download}>Export Records</Button>
          </Link>
          <Link to="/patient/book-appointment">
            <Button size="sm" icon={Calendar}>Book Appointment</Button>
          </Link>
        </div>
      </div>

      {/* Patient Profile Summary Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Main */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {mockProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-surface-900">{mockProfile.name}</h2>
                <p className="text-sm text-surface-500">{mockProfile.email}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-surface-600">
                    <Calendar className="w-4 h-4 text-surface-400" />
                    <span>{formatDate(mockProfile.dob)} ({mockProfile.age} yrs)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-danger-400" />
                    <Badge variant="danger" size="sm">{mockProfile.bloodGroup}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-surface-600">
                    <User className="w-4 h-4 text-surface-400" />
                    <span>{mockProfile.gender}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-surface-600">
                    <Phone className="w-4 h-4 text-surface-400" />
                    <span>{mockProfile.phone}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {mockProfile.allergies.map((a, i) => <Badge key={i} variant="danger" size="sm">⚠ {a}</Badge>)}
                  {mockProfile.chronicConditions.map((c, i) => <Badge key={i} variant="warning" size="sm">{c}</Badge>)}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="lg:w-64 lg:border-l lg:border-surface-100 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-danger-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-danger-500" />
                </div>
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Emergency Contact</h4>
              </div>
              <p className="text-sm font-semibold text-surface-800">{mockProfile.emergencyContact.name}</p>
              <p className="text-xs text-surface-500 mt-0.5">{mockProfile.emergencyContact.relation}</p>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-surface-600">
                <Phone className="w-3.5 h-3.5 text-surface-400" />
                <span>{mockProfile.emergencyContact.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-surface-500">
                <MapPin className="w-3.5 h-3.5 text-surface-400" />
                <span className="truncate">{mockProfile.address}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-surface-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-2">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3.5 h-3.5 text-success-500" />
                    <span className="text-xs font-medium text-success-500">{stat.trend}</span>
                    <span className="text-xs text-surface-400">vs last month</span>
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
      <TreatmentChart />

      {/* Recent Treatments & Unsuitable Medicines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Recent Treatments</h3>
              <Link to="/patient/treatments" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <th className="table-header">Date</th>
                    <th className="table-header">Doctor</th>
                    <th className="table-header">Diagnosis</th>
                    <th className="table-header">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentTreatments.map((t) => (
                    <tr key={t.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                      <td className="table-cell font-medium">{formatDate(t.date)}</td>
                      <td className="table-cell">{t.doctor}</td>
                      <td className="table-cell">{t.diagnosis}</td>
                      <td className="table-cell">
                        <Badge variant={outcomeColors[t.outcome]} size="sm" dot>{t.outcome}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Medicine Alerts</h3>
            <Link to="/patient/unsuitable-medicines">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockUnsuitableMedicines.map((med) => (
              <div key={med.id} className="p-3 rounded-xl bg-danger-50/50 border border-danger-100">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-surface-800">{med.name}</p>
                  <Badge variant="danger" size="sm">{med.severity}</Badge>
                </div>
                <p className="text-xs text-surface-500">{med.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/patient/treatments" className="group">
          <Card hover className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-surface-800">Treatment History</p>
              <p className="text-xs text-surface-500">View all treatment records</p>
            </div>
          </Card>
        </Link>
        <Link to="/patient/medications" className="group">
          <Card hover className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center group-hover:bg-success-100 transition-colors">
              <Pill className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-surface-800">My Medications</p>
              <p className="text-xs text-surface-500">Active & past prescriptions</p>
            </div>
          </Card>
        </Link>
        <Link to="/patient/unsuitable-medicines" className="group">
          <Card hover className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center group-hover:bg-warning-100 transition-colors">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-surface-800">Medicine Alerts</p>
              <p className="text-xs text-surface-500">{mockStats.flaggedMedicines} flagged medicines</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
