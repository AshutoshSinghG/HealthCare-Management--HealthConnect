import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Droplets, Heart, Shield, Save, ArrowLeft, Plus, X, Camera, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { usePatientProfile, useUpdateProfile } from '../../hooks/usePatients';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientProfileEdit = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = usePatientProfile();
  const updateMutation = useUpdateProfile();

  const [form, setForm] = useState(null);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  // Populate form once profile loads
  useEffect(() => {
    if (profile && !form) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || 'Male',
        bloodGroup: profile.bloodGroup || '',
        address: profile.address || {},
        knownAllergies: profile.knownAllergies || [],
        chronicConditions: profile.chronicConditions || [],
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
      });
    }
  }, [profile, form]);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  if (isError || !form) return (
    <div className="text-center py-20 text-surface-500">
      <p>Failed to load profile. Please try again.</p>
      <Link to="/patient/dashboard"><Button variant="ghost" className="mt-4">Go Back</Button></Link>
    </div>
  );

  const fullName = `${form.firstName} ${form.lastName}`;
  const email = profile?.userId?.email || '';

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const updateAddress = (field, value) => setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setForm(prev => ({ ...prev, knownAllergies: [...prev.knownAllergies, newAllergy.trim()] }));
    setNewAllergy('');
  };

  const removeAllergy = (idx) => setForm(prev => ({ ...prev, knownAllergies: prev.knownAllergies.filter((_, i) => i !== idx) }));

  const addCondition = () => {
    if (!newCondition.trim()) return;
    setForm(prev => ({ ...prev, chronicConditions: [...prev.chronicConditions, newCondition.trim()] }));
    setNewCondition('');
  };

  const removeCondition = (idx) => setForm(prev => ({ ...prev, chronicConditions: prev.chronicConditions.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success('Profile updated successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/patient/dashboard">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="page-title">Edit My Profile</h1>
          <p className="text-sm text-surface-500">Update your personal and medical information</p>
        </div>
      </div>

      {/* Avatar & Name Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-800">{fullName}</h2>
              <p className="text-sm text-surface-500">{email}</p>
              <Badge variant="info" size="sm" className="mt-1">Patient</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">First Name</label>
              <input value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Last Name</label>
              <input value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Phone Number</label>
              <input value={form.phoneNumber} onChange={e => update('phoneNumber', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Date of Birth</label>
              <input value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className="input-base" type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Gender</label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-base">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Blood Group</label>
              <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className="input-base">
                <option value="">Select</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Street</label>
              <input value={form.address?.street || ''} onChange={e => updateAddress('street', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">City</label>
              <input value={form.address?.city || ''} onChange={e => updateAddress('city', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">State</label>
              <input value={form.address?.state || ''} onChange={e => updateAddress('state', e.target.value)} className="input-base" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Medical Information */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-danger-500" />
            Medical Information
          </h3>

          {/* Allergies */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-surface-700 mb-2">Allergies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.knownAllergies.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger-50 border border-danger-100 text-xs font-medium text-danger-700">
                  ⚠ {a}
                  <button onClick={() => removeAllergy(i)} className="ml-0.5 hover:text-danger-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAllergy()}
                className="input-base flex-1" placeholder="Add allergy (e.g., Sulfa drugs)" />
              <Button variant="outline" size="sm" icon={Plus} onClick={addAllergy}>Add</Button>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Chronic Conditions</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.chronicConditions.map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-warning-50 border border-warning-100 text-xs font-medium text-warning-700">
                  {c}
                  <button onClick={() => removeCondition(i)} className="ml-0.5 hover:text-warning-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCondition} onChange={e => setNewCondition(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCondition()}
                className="input-base flex-1" placeholder="Add condition (e.g., Diabetes)" />
              <Button variant="outline" size="sm" icon={Plus} onClick={addCondition}>Add</Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-danger-500" />
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Contact Name</label>
              <input value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Contact Phone</label>
              <input value={form.emergencyContactPhone} onChange={e => update('emergencyContactPhone', e.target.value)} className="input-base" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Link to="/patient/dashboard">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button icon={Save} size="lg" loading={updateMutation.isPending} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PatientProfileEdit;
