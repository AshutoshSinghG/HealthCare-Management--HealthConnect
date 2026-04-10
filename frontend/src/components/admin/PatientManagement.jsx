import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Eye, Trash2, Edit, Droplets, Calendar, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { useAdminPatients, useUpdatePatient, useSoftDeletePatient, useRestorePatient } from '../../hooks/useAdmin';

const PatientManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { data: patients = [], isLoading } = useAdminPatients();
  const updateMutation = useUpdatePatient();
  const softDeleteMutation = useSoftDeletePatient();
  const restoreMutation = useRestorePatient();

  const filtered = useMemo(() => {
    return patients.filter(p => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [patients, search, statusFilter]);

  const softDelete = async (id) => {
    try {
      await softDeleteMutation.mutateAsync(id);
      toast.success('Patient soft deleted');
    } catch { toast.error('Failed to delete patient'); }
  };

  const restore = async (id) => {
    try {
      await restoreMutation.mutateAsync(id);
      toast.success('Patient restored');
    } catch { toast.error('Failed to restore patient'); }
  };

  const openEdit = (p) => { setEditForm({ name: p.name, email: p.email, phone: p.phone }); setEditModal(p); };

  const saveEdit = async () => {
    try {
      await updateMutation.mutateAsync({ id: editModal._id, ...editForm });
      setEditModal(null);
      toast.success('Patient details updated');
    } catch { toast.error('Failed to update patient'); }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Patient Management</h1>
        <p className="text-surface-500 mt-1">View all profiles, update details, manage records & soft delete</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, email..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
        <div className="flex gap-2">
          {['', 'active', 'deleted'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200'}`}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-surface-200/60 shadow-card">
        <table className="w-full">
          <thead className="bg-surface-50/80">
            <tr>
              <th className="table-header">Patient ID</th>
              <th className="table-header">Name</th>
              <th className="table-header">Blood</th>
              <th className="table-header">DOB</th>
              <th className="table-header">Conditions</th>
              <th className="table-header">Treatments</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id || p.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                <td className="table-cell font-mono text-xs text-surface-500">{p.id}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">{p.name.split(' ').map(n => n[0]).join('')}</div>
                    <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-surface-400">{p.email}</p></div>
                  </div>
                </td>
                <td className="table-cell"><Badge variant="danger" size="sm">{p.bloodGroup}</Badge></td>
                <td className="table-cell text-xs">{formatDate(p.dob)}</td>
                <td className="table-cell"><div className="flex flex-wrap gap-1">{p.conditions.length > 0 ? p.conditions.map((c,i) => <Badge key={i} variant="warning" size="sm">{c}</Badge>) : <span className="text-xs text-surface-400">None</span>}</div></td>
                <td className="table-cell text-sm font-medium">{p.treatments}</td>
                <td className="table-cell"><Badge variant={p.status === 'active' ? 'success' : 'danger'} size="sm" dot>{p.status}</Badge></td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEdit(p)} />
                    {p.status === 'active' ? (
                      <Button variant="ghost" size="sm" icon={Trash2} className="text-danger-500" onClick={() => softDelete(p._id)} />
                    ) : (
                      <Button variant="ghost" size="sm" className="text-success-500" onClick={() => restore(p._id)}>Restore</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Edit Patient Details" size="sm">
        <div className="space-y-3">
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
            <input value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input-base" /></div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
            <input value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="input-base" /></div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
            <input value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="input-base" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button onClick={saveEdit} icon={Edit} loading={updateMutation.isPending}>Update</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientManagement;
