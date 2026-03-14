import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Stethoscope, Award, Building, GraduationCap, Save, ArrowLeft, Camera, Clock, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const initialProfile = {
  name: 'Dr. Michael Chen',
  email: 'dr.chen@healthconnect.com',
  phone: '+1-555-2001',
  dob: '1980-03-12',
  gender: 'Male',
  specialty: 'General Medicine',
  department: 'Internal Medicine',
  qualifications: 'MD, MBBS',
  licenseNumber: 'MED-2015-78432',
  yearsOfExperience: 11,
  bio: 'Board-certified physician with over 10 years of experience in internal medicine. Special interest in preventive healthcare and chronic disease management.',
  consultationHours: '09:00 AM - 05:00 PM',
  languages: 'English, Mandarin',
  address: '350 Fifth Avenue, Suite 4200, New York, NY 10118',
};

const specializations = ['General Medicine', 'Cardiology', 'Pediatrics', 'Endocrinology', 'Neurology', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Ophthalmology', 'Radiology', 'Pulmonology', 'Nephrology'];

const DoctorProfileEdit = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    toast.success('Profile updated successfully!');
    navigate('/doctor/dashboard');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/doctor/dashboard">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="page-title">Edit My Profile</h1>
          <p className="text-sm text-surface-500">Update your professional and personal details</p>
        </div>
      </div>

      {/* Avatar & Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                <Stethoscope className="w-9 h-9" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-800">{form.name}</h2>
              <p className="text-sm text-surface-500">{form.specialty} · {form.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="info" size="sm">Doctor</Badge>
                <Badge variant="success" size="sm">{form.licenseNumber}</Badge>
              </div>
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
              <label className="block text-sm font-medium text-surface-700">Full Name</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Email Address</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} className="input-base" type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Phone Number</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Date of Birth</label>
              <input value={form.dob} onChange={e => update('dob', e.target.value)} className="input-base" type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Gender</label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-base">
                <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Address</label>
              <input value={form.address} onChange={e => update('address', e.target.value)} className="input-base" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Professional Details */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-success-500" />
            Professional Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Specialisation</label>
              <select value={form.specialty} onChange={e => update('specialty', e.target.value)} className="input-base">
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Department</label>
              <input value={form.department} onChange={e => update('department', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Qualifications</label>
              <input value={form.qualifications} onChange={e => update('qualifications', e.target.value)} className="input-base" placeholder="MD, MBBS, DM" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">License Number</label>
              <input value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value)} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Years of Experience</label>
              <input value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} className="input-base" type="number" min="0" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Consultation Hours</label>
              <input value={form.consultationHours} onChange={e => update('consultationHours', e.target.value)} className="input-base" placeholder="09:00 AM - 05:00 PM" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 flex items-center gap-1"><Globe className="w-3.5 h-3.5" />Languages</label>
              <input value={form.languages} onChange={e => update('languages', e.target.value)} className="input-base" placeholder="English, Hindi, Mandarin" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Professional Bio</label>
              <textarea value={form.bio} onChange={e => update('bio', e.target.value)} className="input-base resize-none" rows={3} placeholder="Write a short professional bio..." />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pb-6">
        <Link to="/doctor/dashboard">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button icon={Save} size="lg" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default DoctorProfileEdit;
