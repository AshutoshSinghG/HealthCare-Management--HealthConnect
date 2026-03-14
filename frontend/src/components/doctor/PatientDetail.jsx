import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Droplets, Calendar, AlertTriangle, Heart, FileText, Pill, ShieldAlert, Edit, Trash2, Eye, EyeOff, Plus, Phone, Mail, X, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const CURRENT_DOCTOR = 'Dr. Chen';

const mockPatient = {
  id: 'P-1001',
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+1-555-0101',
  dob: '1990-05-15',
  age: 35,
  bloodGroup: 'O+',
  gender: 'Female',
  allergies: ['Penicillin', 'Peanuts'],
  chronicConditions: ['Hypertension', 'Mild Asthma'],
  emergencyContact: { name: 'John Johnson', phone: '+1-555-9999', relation: 'Spouse' },
};

const initialTreatments = [
  { id: 'T-1', date: '2026-03-05', diagnosis: 'Upper Respiratory Infection', outcome: 'improved', doctor: 'Dr. Chen', icdCode: 'J06.9', treatmentPlan: 'Antibiotics and rest', followUp: '2026-03-19', notes: 'Patient responded well', isDeleted: false },
  { id: 'T-2', date: '2026-02-20', diagnosis: 'Routine Checkup', outcome: 'recovered', doctor: 'Dr. Wilson', icdCode: 'Z00.0', treatmentPlan: 'No treatment needed', followUp: null, notes: 'All vitals normal', isDeleted: false },
  { id: 'T-3', date: '2026-01-28', diagnosis: 'Allergic Rhinitis', outcome: 'improved', doctor: 'Dr. Sharma', icdCode: 'J30.4', treatmentPlan: 'Antihistamines', followUp: '2026-02-28', notes: 'Seasonal allergy management', isDeleted: false },
  { id: 'T-4', date: '2026-01-15', diagnosis: 'Hypertension Follow-up', outcome: 'stable', doctor: 'Dr. Chen', icdCode: 'I10', treatmentPlan: 'Continue current medication', followUp: '2026-04-15', notes: 'BP well controlled', isDeleted: false },
];

const mockMedications = [
  { id: 1, name: 'Amlodipine', dosage: '5mg', frequency: 'Once Daily', duration: 'Ongoing', route: 'Oral', status: 'active', notes: 'Monitor BP weekly' },
  { id: 2, name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As Needed', duration: 'Ongoing', route: 'Inhalation', status: 'active', notes: 'Max 4 puffs/day' },
  { id: 3, name: 'Amoxicillin', dosage: '500mg', frequency: 'TDS', duration: '7 days', route: 'Oral', status: 'completed', notes: 'Course finished' },
];

const initialUnsuitableMeds = [
  { id: 1, name: 'Penicillin', reason: 'Documented allergy - anaphylaxis risk', severity: 'critical', flaggedBy: 'Dr. Chen', flagDate: '2025-11-20' },
  { id: 2, name: 'Aspirin', reason: 'Bleeding risk with current medication', severity: 'high', flaggedBy: 'Dr. Wilson', flagDate: '2026-01-15' },
];

const outcomeColors = { improved: 'success', recovered: 'success', stable: 'warning', worsened: 'danger' };
const severityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'default' };
const tabs = ['Treatment History', 'Medications', 'Unsuitable Medicines'];

const PatientDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [treatments, setTreatments] = useState(initialTreatments);
  const [unsuitableMeds, setUnsuitableMeds] = useState(initialUnsuitableMeds);
  const [deleteModal, setDeleteModal] = useState(null);
  const [flagModal, setFlagModal] = useState(false);
  const [newFlag, setNewFlag] = useState({ name: '', reason: '', severity: 'medium' });
  const { id } = useParams();
  const navigate = useNavigate();

  const visibleTreatments = treatments.filter(t => !t.isDeleted);

  const handleSoftDelete = (treatmentId) => {
    setTreatments(prev => prev.map(t => t.id === treatmentId ? { ...t, isDeleted: true } : t));
    setDeleteModal(null);
    toast.success('Treatment record archived (soft deleted)');
  };

  const handleFlagMedicine = () => {
    if (!newFlag.name || !newFlag.reason) {
      toast.error('Please fill in medicine name and reason');
      return;
    }
    setUnsuitableMeds(prev => [...prev, { id: Date.now(), ...newFlag, flaggedBy: CURRENT_DOCTOR, flagDate: new Date().toISOString().split('T')[0] }]);
    setNewFlag({ name: '', reason: '', severity: 'medium' });
    setFlagModal(false);
    toast.success('Medicine flagged as unsuitable');
  };

  const handleRemoveFlag = (medId, flaggedBy) => {
    if (flaggedBy !== CURRENT_DOCTOR) {
      toast.error('You can only remove your own flagged medicines');
      return;
    }
    setUnsuitableMeds(prev => prev.filter(m => m.id !== medId));
    toast.success('Medicine flag removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/doctor/patients"><Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button></Link>
          <div>
            <h1 className="page-title">Patient Profile</h1>
            <p className="text-sm text-surface-500">ID: {mockPatient.id} · Complete medical profile</p>
          </div>
        </div>
        <Link to="/doctor/treatments/create">
          <Button icon={Plus} size="sm">New Treatment</Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {mockPatient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Full Name</p>
                <p className="text-sm font-semibold text-surface-800">{mockPatient.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Age / Gender</p>
                <p className="text-sm text-surface-700">{mockPatient.age} yrs · {mockPatient.gender}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Blood Group</p>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-danger-400" />
                  <Badge variant="danger" size="sm">{mockPatient.bloodGroup}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Date of Birth</p>
                <p className="text-sm text-surface-700">{formatDate(mockPatient.dob)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Allergies</p>
                <div className="flex flex-wrap gap-1">{mockPatient.allergies.map((a, i) => <Badge key={i} variant="danger" size="sm">⚠ {a}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Chronic Conditions</p>
                <div className="flex flex-wrap gap-1">{mockPatient.chronicConditions.map((c, i) => <Badge key={i} variant="warning" size="sm">{c}</Badge>)}</div>
              </div>
            </div>
          </div>

          <div className="lg:w-56 lg:border-l lg:border-surface-100 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-danger-500" />
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Emergency Contact</h4>
            </div>
            <p className="text-sm font-semibold text-surface-800">{mockPatient.emergencyContact.name}</p>
            <p className="text-xs text-surface-500">{mockPatient.emergencyContact.relation}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-surface-600">
              <Phone className="w-3 h-3 text-surface-400" />{mockPatient.emergencyContact.phone}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-1">
          {tabs.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === i ? 'border-primary-500 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'}`}
            >{tab}</button>
          ))}
        </nav>
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>

        {/* Treatment History Tab */}
        {activeTab === 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Treatment History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <th className="table-header">Date</th>
                    <th className="table-header">Diagnosis</th>
                    <th className="table-header">Doctor</th>
                    <th className="table-header">Outcome</th>
                    <th className="table-header">Follow Up</th>
                    <th className="table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTreatments.map(t => {
                    const isOwn = t.doctor === CURRENT_DOCTOR;
                    return (
                      <tr key={t.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                        <td className="table-cell font-medium">{formatDate(t.date)}</td>
                        <td className="table-cell">
                          <div>
                            <p className="text-sm">{t.diagnosis}</p>
                            <p className="text-xs text-surface-400">{t.icdCode}</p>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{t.doctor}</span>
                            {isOwn && <Badge variant="info" size="sm">You</Badge>}
                          </div>
                        </td>
                        <td className="table-cell"><Badge variant={outcomeColors[t.outcome]} size="sm" dot>{t.outcome}</Badge></td>
                        <td className="table-cell text-sm">{t.followUp ? formatDate(t.followUp) : '—'}</td>
                        <td className="table-cell text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isOwn ? (
                              <>
                                <Link to={`/doctor/treatments/edit/${t.id}`}>
                                  <Button variant="ghost" size="sm" icon={Edit}>Edit</Button>
                                </Link>
                                <Button variant="ghost" size="sm" icon={Trash2} className="text-danger-500 hover:text-danger-600" onClick={() => setDeleteModal(t.id)}>
                                  Delete
                                </Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-surface-400">
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Only</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-surface-400 italic">💡 You can only edit/delete treatments you created. Other doctors' records are view-only.</p>
          </Card>
        )}

        {/* Medications Tab */}
        {activeTab === 1 && (
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-success-500" />
              Current Medications
            </h3>
            <div className="space-y-3">
              {mockMedications.map((med) => (
                <div key={med.id} className="p-4 rounded-xl border border-surface-100 bg-surface-50/50 hover:bg-surface-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-surface-800">{med.name}</p>
                      <Badge variant={med.status === 'active' ? 'success' : 'default'} size="sm" dot>{med.status}</Badge>
                    </div>
                    <Badge variant="info" size="sm">{med.dosage}</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-surface-600">
                    <p><span className="text-surface-400">Frequency:</span> {med.frequency}</p>
                    <p><span className="text-surface-400">Duration:</span> {med.duration}</p>
                    <p><span className="text-surface-400">Route:</span> {med.route}</p>
                    <p><span className="text-surface-400">Notes:</span> {med.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Unsuitable Medicines Tab */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-danger-500" />
                Unsuitable Medicines
              </h3>
              <Button size="sm" variant="outline" icon={Plus} onClick={() => setFlagModal(true)}>
                Flag Medicine
              </Button>
            </div>
            <div className="space-y-3">
              {unsuitableMeds.map((med) => {
                const isOwn = med.flaggedBy === CURRENT_DOCTOR;
                return (
                  <Card key={med.id} hover>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-surface-800">{med.name}</p>
                          <Badge variant={severityColors[med.severity]} size="sm">{med.severity}</Badge>
                        </div>
                        <p className="text-sm text-surface-600">{med.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                          <span>Flagged by <strong className="text-surface-700">{med.flaggedBy}</strong></span>
                          <span>{formatDate(med.flagDate)}</span>
                        </div>
                      </div>
                      {isOwn && (
                        <Button variant="ghost" size="sm" className="text-danger-500" onClick={() => handleRemoveFlag(med.id, med.flaggedBy)}>
                          <X className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
            <p className="text-xs text-surface-400 italic">💡 You can only remove medicines you flagged. Other doctors' flags are protected.</p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Archive Treatment Record" size="sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-xl border border-warning-100">
            <AlertTriangle className="w-5 h-5 text-warning-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning-800">Soft Delete</p>
              <p className="text-xs text-warning-700 mt-0.5">This record will be archived (marked as deleted), not permanently removed. It can be restored by an admin if needed.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleSoftDelete(deleteModal)} icon={Trash2}>Archive Record</Button>
          </div>
        </div>
      </Modal>

      {/* Flag Medicine Modal */}
      <Modal isOpen={flagModal} onClose={() => setFlagModal(false)} title="Flag Unsuitable Medicine" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Medicine Name</label>
            <input value={newFlag.name} onChange={e => setNewFlag(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="e.g., Ibuprofen" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Reason</label>
            <textarea value={newFlag.reason} onChange={e => setNewFlag(p => ({ ...p, reason: e.target.value }))} className="input-base resize-none" rows={3} placeholder="Why is this medicine unsuitable..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Severity</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'critical'].map(s => (
                <button key={s} onClick={() => setNewFlag(p => ({ ...p, severity: s }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${newFlag.severity === s ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100'}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setFlagModal(false)}>Cancel</Button>
            <Button onClick={handleFlagMedicine} icon={AlertTriangle}>Flag Medicine</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientDetail;
