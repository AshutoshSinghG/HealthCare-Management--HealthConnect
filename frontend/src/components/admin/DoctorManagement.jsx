import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, Plus, Edit, Trash2, Eye, Mail, Phone, Award, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { useAdminDoctors, useCreateDoctor, useUpdateDoctor, useRemoveDoctor } from '../../hooks/useAdmin';

const specializations = ['General Medicine', 'Cardiology', 'Pediatrics', 'Endocrinology', 'Neurology', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Ophthalmology', 'Radiology'];

const DoctorManagement = () => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', doctor: null });
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialty: '', department: '', qualifications: '' });

  const { data: doctors = [], isLoading } = useAdminDoctors();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const removeMutation = useRemoveDoctor();

  const filtered = doctors.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
  });

  const openAdd = () => { setForm({ name: '', email: '', phone: '', specialty: '', department: '', qualifications: '' }); setModal({ open: true, mode: 'add', doctor: null }); };

  const openEdit = (doc) => { setForm({ name: doc.name, email: doc.email, phone: doc.phone, specialty: doc.specialty, department: doc.department, qualifications: doc.qualifications }); setModal({ open: true, mode: 'edit', doctor: doc }); };

  const save = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    try {
      if (modal.mode === 'add') {
        await createMutation.mutateAsync(form);
        toast.success('Doctor added successfully');
      } else {
        await updateMutation.mutateAsync({ id: modal.doctor.id, ...form });
        toast.success('Doctor updated successfully');
      }
      setModal({ open: false, mode: 'add', doctor: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    }
  };

  const remove = async (id) => {
    try {
      await removeMutation.mutateAsync(id);
      toast.success('Doctor removed');
    } catch { toast.error('Failed to remove doctor'); }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Doctor Management</h1>
          <p className="text-surface-500 mt-1">Add, update, remove doctors and manage specialisations</p>
        </div>
        <Button icon={Plus} size="sm" onClick={openAdd}>Add Doctor</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, specialty..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-surface-800">{doc.name}</p>
                      <Badge variant={doc.status === 'active' ? 'success' : 'default'} size="sm" dot>{doc.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                      <span className="flex items-center gap-1"><Award className="w-3 h-3" />{doc.specialty}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{doc.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{doc.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <Badge variant="info" size="sm">{doc.department}</Badge>
                      <span className="text-xs text-surface-500">{doc.qualifications}</span>
                      <span className="text-xs text-surface-400">· {doc.patients} patients · {doc.treatments} treatments</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEdit(doc)}>Edit</Button>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-danger-500" onClick={() => remove(doc.id)}>Remove</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, mode: 'add', doctor: null })} title={modal.mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'} size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="Dr. John Doe" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-base" type="email" /></div>
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-base" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Specialisation</label>
              <select value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))} className="input-base">
                <option value="">Select...</option>{specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-surface-700 mb-1">Department</label>
              <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="input-base" /></div>
          </div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Qualifications</label>
            <input value={form.qualifications} onChange={e => setForm(p => ({ ...p, qualifications: e.target.value }))} className="input-base" placeholder="MD, MBBS" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModal({ open: false, mode: 'add', doctor: null })}>Cancel</Button>
            <Button onClick={save} icon={modal.mode === 'add' ? Plus : Edit} loading={createMutation.isPending || updateMutation.isPending}>{modal.mode === 'add' ? 'Add Doctor' : 'Update Doctor'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorManagement;
