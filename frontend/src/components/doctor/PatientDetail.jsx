import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Droplets, Calendar, AlertTriangle, Heart, FileText, Pill, ShieldAlert, Edit, Trash2, Eye, EyeOff, Plus, Phone, Mail, X, CheckCircle, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { usePatientDetail, useFlagUnsuitableMedicine, useRemoveUnsuitableFlag } from '../../hooks/useDoctors';
import { useAuth } from '../../hooks/useAuth';

const outcomeColors = { improved: 'success', recovered: 'success', stable: 'warning', worsened: 'danger' };
const severityColors = { CRITICAL: 'danger', HIGH: 'warning', MODERATE: 'info', LOW: 'default' };
const tabs = ['Treatment History', 'Medications', 'Unsuitable Medicines'];

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: detail, isLoading, isError } = usePatientDetail(id);
  const flagMutation = useFlagUnsuitableMedicine();
  const removeFlagMutation = useRemoveUnsuitableFlag();
  const [activeTab, setActiveTab] = useState(0);
  const [flagModal, setFlagModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [newFlag, setNewFlag] = useState({ name: '', reason: '', severity: 'MODERATE' });

  const patient = useMemo(() => {
    if (!detail?.patient) return null;
    const p = detail.patient;
    return {
      id: p._id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.userId?.email || '',
      phone: p.phoneNumber || '',
      dob: p.dateOfBirth || '',
      age: p.dateOfBirth ? Math.floor((Date.now() - new Date(p.dateOfBirth)) / 31557600000) : 0,
      bloodGroup: p.bloodGroup || '',
      gender: p.gender || '',
      allergies: p.knownAllergies || [],
      chronicConditions: p.chronicConditions || [],
      emergencyContact: {
        name: p.emergencyContactName || 'N/A',
        phone: p.emergencyContactPhone || 'N/A',
        relation: ''
      },
    };
  }, [detail]);

  const treatments = useMemo(() => {
    if (!detail?.treatments) return [];
    return detail.treatments.map(t => ({
      id: t._id,
      date: t.visitDate,
      diagnosis: t.diagnosis,
      outcome: t.outcomeStatus?.toLowerCase() || 'stable',
      doctor: t.doctorId ? `Dr. ${t.doctorId.firstName} ${t.doctorId.lastName}` : 'Unknown',
      doctorId: t.doctorId ? t.doctorId.userId : null,
      icdCode: t.icdCode || '',
      treatmentPlan: t.treatmentPlan || '',
      followUp: t.followUpDate || null,
      notes: t.notes || '',
      isDeleted: t.isDeleted || false,
      medications: t.medications || [],
    }));
  }, [detail]);

  const medications = useMemo(() => {
    return treatments.flatMap(t => (t.medications || []).map(m => ({
      id: m._id || m.name,
      name: m.medicineName || m.name || '',
      dosage: m.dosage || '',
      frequency: m.frequency || '',
      duration: m.durationDays ? `${m.durationDays} days` : '',
      route: m.routeOfAdmin || m.route || '',
      status: 'active',
      notes: m.notes || '',
    })));
  }, [treatments]);

  const unsuitableMeds = useMemo(() => {
    if (!detail?.unsuitableMedicines) return [];
    return detail.unsuitableMedicines.map(m => ({
      id: m._id,
      name: m.medicineName,
      severity: m.severity,
      reason: m.reason,
      flaggedBy: m.flaggedByDoctorId ? `Dr. ${m.flaggedByDoctorId.firstName} ${m.flaggedByDoctorId.lastName}` : 'Unknown',
      flaggedByDoctorId: m.flaggedByDoctorId?.userId || m.flaggedByDoctorId?._id,
      flagDate: m.createdAt
    }));
  }, [detail]);
  const visibleTreatments = treatments.filter(t => !t.isDeleted);
  const CURRENT_DOCTOR_ID = user?.id; // For ownership checks

  const handleFlagMedicine = async () => {
    if (!newFlag.name || !newFlag.reason) {
      toast.error('Please fill in medicine name and reason');
      return;
    }
    try {
      await flagMutation.mutateAsync({ patientId: id, medicineName: newFlag.name, reason: newFlag.reason, severity: newFlag.severity });
      setNewFlag({ name: '', reason: '', severity: 'MODERATE' });
      setFlagModal(false);
      toast.success('Medicine flagged as unsuitable');
    } catch { toast.error('Failed to flag medicine'); }
  };

  const handleRemoveFlag = async (medId) => {
    try {
      await removeFlagMutation.mutateAsync(medId);
      toast.success('Medicine flag removed');
    } catch { toast.error('Failed to remove flag'); }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (isError || !patient) return <div className="text-center py-20 text-surface-500">Failed to load patient data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/doctor/patients"><Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button></Link>
          <div>
            <h1 className="page-title">Patient Profile</h1>
            <p className="text-sm text-surface-500">ID: {String(patient.id).slice(-8)} · Complete medical profile</p>
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
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Full Name</p>
                <p className="text-sm font-semibold text-surface-800">{patient.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Age / Gender</p>
                <p className="text-sm text-surface-700">{patient.age} yrs · {patient.gender}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Contact</p>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <span className="text-sm text-surface-700">{patient.phone || 'N/A'}</span>
                  <span className="text-xs text-surface-500">{patient.email || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Blood Group</p>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-danger-400" />
                  <Badge variant="danger" size="sm">{patient.bloodGroup}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Date of Birth</p>
                <p className="text-sm text-surface-700">{patient.dob ? formatDate(patient.dob) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Allergies</p>
                <div className="flex flex-wrap gap-1">{(patient.allergies || []).map((a, i) => <Badge key={i} variant="danger" size="sm">⚠ {a}</Badge>)}</div>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase">Chronic Conditions</p>
                <div className="flex flex-wrap gap-1">{(patient.chronicConditions || []).map((c, i) => <Badge key={i} variant="warning" size="sm">{c}</Badge>)}</div>
              </div>
            </div>
          </div>

          <div className="lg:w-56 lg:border-l lg:border-surface-100 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-danger-500" />
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Emergency Contact</h4>
            </div>
            <p className="text-sm font-semibold text-surface-800">{patient.emergencyContact?.name || 'N/A'}</p>
            <p className="text-xs text-surface-500">{patient.emergencyContact?.relation || ''}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-surface-600">
              <Phone className="w-3 h-3 text-surface-400" />{patient.emergencyContact?.phone || 'N/A'}
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
                    const isOwn = t.doctorId === CURRENT_DOCTOR_ID;
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
                            <Button variant="ghost" size="sm" icon={Eye} onClick={() => setViewModal(t)}>View</Button>
                            {isOwn && (
                              <Link to={`/doctor/treatments/edit/${t.id}`}>
                                <Button variant="ghost" size="sm" icon={Edit}>Edit</Button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-surface-400 italic">💡 You can only edit treatments you created. Other doctors' records are view-only.</p>
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
              {medications.map((med) => (
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
              {unsuitableMeds.length === 0 ? (
                <Card>
                  <p className="text-center text-surface-400 py-8">No unsuitable medicines found.</p>
                </Card>
              ) : (
                unsuitableMeds.map((med) => (
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
                      {med.flaggedByDoctorId === CURRENT_DOCTOR_ID && (
                        <Button variant="ghost" size="sm" className="text-danger-500" onClick={() => handleRemoveFlag(med.id)}>
                          <X className="w-4 h-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
            <p className="text-xs text-surface-400 italic">💡 You can only remove medicines you flagged. Other doctors' flags are protected.</p>
          </div>
        )}
      </motion.div>

      {/* View Treatment Modal */}
      {viewModal && (
        <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Treatment Details" size="lg">
          <div className="space-y-6 text-surface-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase">Diagnosis / ICD Code</p>
                <p className="font-semibold text-primary-600">{viewModal.diagnosis}</p>
                <p className="text-sm text-surface-500">{viewModal.icdCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase">Attending Doctor</p>
                <p className="font-semibold text-surface-800">{viewModal.doctor}</p>
                <p className="text-sm text-surface-500">{formatDate(viewModal.date)}</p>
              </div>
            </div>
            
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
              <p className="text-xs font-semibold text-surface-400 uppercase mb-2">Treatment Plan / Notes</p>
              <p className="text-sm text-surface-700 whitespace-pre-wrap">{viewModal.treatmentPlan || viewModal.notes || 'No treatment notes recorded.'}</p>
            </div>

            {viewModal.medications?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase mb-3">Prescribed Medications</p>
                <div className="space-y-2">
                  {viewModal.medications.map((m, i) => (
                    <div key={i} className="flex justify-between items-center bg-white border border-surface-100 p-3 rounded-lg">
                      <div className="flex gap-2 items-center">
                        <Pill className="text-primary-500 w-4 h-4" />
                        <span className="font-medium text-sm">{m.medicineName || m.name}</span>
                      </div>
                      <span className="text-xs text-surface-500">{m.dosage} - {m.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-surface-100">
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase">Outcome Status</p>
                <Badge variant={outcomeColors[viewModal.outcome] || 'default'}>{viewModal.outcome}</Badge>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-surface-400 uppercase">Follow-up Date</p>
                <p className="text-sm font-medium">{viewModal.followUp ? formatDate(viewModal.followUp) : 'Not required'}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

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
              {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(s => (
                <button key={s} onClick={() => setNewFlag(p => ({ ...p, severity: s }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${newFlag.severity === s ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100'}`}
                >{s.toLowerCase()}</button>
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
