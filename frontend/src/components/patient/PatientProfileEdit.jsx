import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Droplets, Heart, Shield, Save, ArrowLeft, Plus, X, Camera, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';
import { usePatientProfile, useUpdatePatientProfile } from '../../hooks/usePatients';
import { isValidPhone, isValidEmail, digitsOnly } from '../../utils/validators';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PatientProfileEdit = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const [form, setForm] = useState(null);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile && !form) {
      setForm({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.userId?.email || '',
        phone: profile.phoneNumber || '',
        dob: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || 'Male',
        bloodGroup: profile.bloodGroup || 'O+',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          zipCode: profile.address?.zipCode || '',
          country: profile.address?.country || '',
        },
        allergies: profile.knownAllergies || [],
        chronicConditions: profile.chronicConditions || [],
        emergencyContact: {
          name: profile.emergencyContactName || '',
          relation: profile.emergencyContactRelation || '',
          phone: profile.emergencyContactPhone || '',
          address: profile.emergencyContactAddress || '',
        },
      });
    }
  }, [profile, form]);

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };
  const updateAddress = (field, value) => setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  const updateEmergency = (field, value) => {
    setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    if (errors[`emergency_${field}`]) setErrors(prev => ({ ...prev, [`emergency_${field}`]: '' }));
  };

  const addAllergy = () => {
    if (!newAllergy.trim()) {
      toast.error('Please enter an allergy name before adding');
      return;
    }
    if (form.allergies.includes(newAllergy.trim())) {
      toast.error('This allergy has already been added');
      return;
    }
    setForm(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
    setNewAllergy('');
  };

  const removeAllergy = (idx) => setForm(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== idx) }));

  const addCondition = () => {
    if (!newCondition.trim()) {
      toast.error('Please enter a condition name before adding');
      return;
    }
    if (form.chronicConditions.includes(newCondition.trim())) {
      toast.error('This condition has already been added');
      return;
    }
    setForm(prev => ({ ...prev, chronicConditions: [...prev.chronicConditions, newCondition.trim()] }));
    setNewCondition('');
  };

  const removeCondition = (idx) => setForm(prev => ({ ...prev, chronicConditions: prev.chronicConditions.filter((_, i) => i !== idx) }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Full name is required (at least 2 characters)';
    }
    if (form.phone && !isValidPhone(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    if (form.email && !isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.emergencyContact.phone && !isValidPhone(form.emergencyContact.phone)) {
      newErrors.emergency_phone = 'Please enter a valid emergency contact phone number';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors before saving');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const nameParts = form.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      phoneNumber: form.phone,
      dateOfBirth: form.dob,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      knownAllergies: form.allergies,
      chronicConditions: form.chronicConditions,
      address: form.address,
      emergencyContactName: form.emergencyContact.name,
      emergencyContactRelation: form.emergencyContact.relation,
      emergencyContactPhone: form.emergencyContact.phone,
      emergencyContactAddress: form.emergencyContact.address,
    };

    try {
      await updateMutation.mutateAsync(payload);
      toast.success('Profile updated successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to update profile.'));
    }
  };

  const inputError = (field) => errors[field] ? (
    <p className="text-xs text-danger-500 mt-1">{errors[field]}</p>
  ) : null;

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
                {form.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-800">{form.name}</h2>
              <p className="text-sm text-surface-500">{form.email}</p>
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
              <label className="block text-sm font-medium text-surface-700">Full Name <span className="text-danger-500">*</span></label>
              <input value={form.name} onChange={e => update('name', e.target.value)}
                className={`input-base ${errors.name ? 'border-danger-400 focus:ring-danger-500/20 focus:border-danger-500' : ''}`} />
              {inputError('name')}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Email Address<span className="text-danger-500">*</span></label>
              <input value={form.email} onChange={e => update('email', e.target.value)}
                className={`input-base ${errors.email ? 'border-danger-400 focus:ring-danger-500/20 focus:border-danger-500' : ''}`} type="email" />
              {inputError('email')}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Phone Number<span className="text-danger-500">*</span></label>
              <input value={form.phone}
                onChange={e => update('phone', digitsOnly(e.target.value))}
                className={`input-base ${errors.phone ? 'border-danger-400 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                type="tel" placeholder="e.g. 9876543210" maxLength={15} />
              {inputError('phone')}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Date of Birth<span className="text-danger-500">*</span></label>
              <input value={form.dob} onChange={e => update('dob', e.target.value)} className="input-base" type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Gender<span className="text-danger-500">*</span></label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-base">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Blood Group<span className="text-danger-500">*</span></label>
              <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className="input-base">
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Street Address</label>
                <input value={form.address.street} onChange={e => updateAddress('street', e.target.value)} className="input-base" placeholder="123 Main St" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">City</label>
                <input value={form.address.city} onChange={e => updateAddress('city', e.target.value)} className="input-base" placeholder="City" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">State / Province</label>
                <input value={form.address.state} onChange={e => updateAddress('state', e.target.value)} className="input-base" placeholder="State" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Zip / Postal Code</label>
                <input value={form.address.zipCode} onChange={e => updateAddress('zipCode', e.target.value)} className="input-base" placeholder="Zip Code" maxLength={10} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Country</label>
                <input value={form.address.country} onChange={e => updateAddress('country', e.target.value)} className="input-base" placeholder="Country" />
              </div>
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
              {form.allergies.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger-50 border border-danger-100 text-xs font-medium text-danger-700">
                  ⚠ {a}
                  <button onClick={() => removeAllergy(i)} className="ml-0.5 hover:text-danger-900"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
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
              <input value={newCondition} onChange={e => setNewCondition(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCondition())}
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
              <input value={form.emergencyContact.name} onChange={e => updateEmergency('name', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Relationship</label>
              <select value={form.emergencyContact.relation} onChange={e => updateEmergency('relation', e.target.value)} className="input-base">
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Contact Phone</label>
              <input value={form.emergencyContact.phone}
                onChange={e => updateEmergency('phone', digitsOnly(e.target.value))}
                className={`input-base ${errors.emergency_phone ? 'border-danger-400 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                type="tel" placeholder="e.g. 9876543210" maxLength={15} />
              {inputError('emergency_phone')}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Contact Address</label>
              <input value={form.emergencyContact.address} onChange={e => updateEmergency('address', e.target.value)} className="input-base" />
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
