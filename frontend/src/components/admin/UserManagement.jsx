import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Edit, Lock, Unlock, KeyRound, Shield, Trash2, X, CheckCircle, UserPlus, Mail, Phone } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const initialUsers = [
  { id: 1, name: 'Dr. Michael Chen', email: 'dr.chen@health.com', role: 'doctor', status: 'active', locked: false, lastLogin: '2026-03-05 14:30', mfa: true },
  { id: 2, name: 'Dr. Sarah Wilson', email: 'dr.wilson@health.com', role: 'doctor', status: 'active', locked: false, lastLogin: '2026-03-05 12:15', mfa: true },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'patient', status: 'active', locked: false, lastLogin: '2026-03-05 10:00', mfa: false },
  { id: 4, name: 'Robert Williams', email: 'robert.w@email.com', role: 'patient', status: 'active', locked: false, lastLogin: '2026-03-04 16:20', mfa: false },
  { id: 5, name: 'Emily Davis', email: 'emily.d@email.com', role: 'patient', status: 'disabled', locked: false, lastLogin: '2026-02-28 09:00', mfa: false },
  { id: 6, name: 'Admin User', email: 'admin@health.com', role: 'admin', status: 'active', locked: false, lastLogin: '2026-03-05 15:00', mfa: true },
  { id: 7, name: 'Dr. James Park', email: 'dr.park@health.com', role: 'doctor', status: 'active', locked: true, lastLogin: '2026-03-03 11:30', mfa: true },
  { id: 8, name: 'Lisa Anderson', email: 'lisa.a@email.com', role: 'patient', status: 'active', locked: false, lastLogin: '2026-03-01 08:45', mfa: false },
];

const roleColors = { doctor: 'info', patient: 'success', admin: 'warning' };
const statusColors = { active: 'success', disabled: 'danger' };

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'patient', phone: '' });

  const filtered = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleDisable = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
    toast.success('User status updated');
  };

  const toggleLock = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, locked: !u.locked } : u));
    toast.success('Account lock status updated');
  };

  const resetPassword = (name) => {
    toast.success(`Password reset link sent to ${name}`);
  };

  const changeRole = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    toast.success('Role updated successfully');
  };

  const createUser = () => {
    if (!newUser.name || !newUser.email) { toast.error('Name and email are required'); return; }
    setUsers(prev => [...prev, { id: Date.now(), ...newUser, status: 'active', locked: false, lastLogin: 'Never', mfa: false }]);
    setNewUser({ name: '', email: '', role: 'patient', phone: '' });
    setCreateModal(false);
    toast.success('User created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-surface-500 mt-1">Create, disable, lock/unlock accounts and manage roles</p>
        </div>
        <Button icon={UserPlus} size="sm" onClick={() => setCreateModal(true)}>Create User</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-700">{users.length}</p>
          <p className="text-xs font-medium text-primary-600 mt-1">Total Users</p>
        </div>
        <div className="bg-success-50 border border-success-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-success-700">{users.filter(u => u.status === 'active').length}</p>
          <p className="text-xs font-medium text-success-600 mt-1">Active</p>
        </div>
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-danger-700">{users.filter(u => u.status === 'disabled').length}</p>
          <p className="text-xs font-medium text-danger-600 mt-1">Disabled</p>
        </div>
        <div className="bg-warning-50 border border-warning-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-warning-700">{users.filter(u => u.locked).length}</p>
          <p className="text-xs font-medium text-warning-600 mt-1">Locked</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
        <div className="flex gap-2">
          {['', 'patient', 'doctor', 'admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${roleFilter === r ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200'}`}
            >{r || 'All'}</button>
          ))}
        </div>
      </div>

      {/* User Cards */}
      <div className="space-y-3">
        {filtered.map((user, i) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card hover>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-surface-800 truncate">{user.name}</p>
                      <Badge variant={roleColors[user.role]} size="sm">{user.role}</Badge>
                      {user.locked && <Badge variant="danger" size="sm">🔒 Locked</Badge>}
                      {user.status === 'disabled' && <Badge variant="danger" size="sm">Disabled</Badge>}
                    </div>
                    <p className="text-xs text-surface-500 truncate">{user.email} · Last login: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <select value={user.role} onChange={e => changeRole(user.id, e.target.value)}
                    className="px-2 py-1 text-xs border border-surface-200 rounded-lg bg-surface-50 focus:ring-1 focus:ring-primary-500">
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button variant="ghost" size="sm" onClick={() => toggleLock(user.id)} title={user.locked ? 'Unlock' : 'Lock'}>
                    {user.locked ? <Unlock className="w-4 h-4 text-success-500" /> : <Lock className="w-4 h-4 text-surface-400" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => resetPassword(user.name)} title="Reset Password">
                    <KeyRound className="w-4 h-4 text-primary-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleDisable(user.id)} title={user.status === 'active' ? 'Disable' : 'Enable'}>
                    {user.status === 'active' ? <X className="w-4 h-4 text-danger-500" /> : <CheckCircle className="w-4 h-4 text-success-500" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create User Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New User" size="md">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
            <input value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className="input-base" placeholder="John Doe" /></div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
            <input value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="input-base" type="email" placeholder="user@health.com" /></div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
            <input value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} className="input-base" placeholder="+1-555-0000" /></div>
          <div><label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
            <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="input-base">
              <option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option>
            </select></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button onClick={createUser} icon={UserPlus}>Create User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
