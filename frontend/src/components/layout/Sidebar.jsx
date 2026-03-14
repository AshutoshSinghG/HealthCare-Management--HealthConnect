import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, ClipboardList, ShieldCheck,
  ChevronLeft, ChevronRight, LogOut, Heart, Stethoscope,
  AlertTriangle, PlusCircle, ScrollText, Activity, Pill, Download, Lock, CalendarDays,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const patientLinks = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/profile', label: 'Edit Profile', icon: Users },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
  { to: '/patient/book-appointment', label: 'Book Appointment', icon: PlusCircle },
  { to: '/patient/treatments', label: 'My Treatments', icon: FileText },
  { to: '/patient/medications', label: 'My Medications', icon: Pill },
  { to: '/patient/unsuitable-medicines', label: 'Medicine Alerts', icon: AlertTriangle },
  { to: '/patient/export', label: 'Export Records', icon: Download },
];

const doctorLinks = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/profile', label: 'Edit Profile', icon: Users },
  { to: '/doctor/slots', label: 'Appointment Slots', icon: CalendarDays },
  { to: '/doctor/patients', label: 'My Patients', icon: Users },
  { to: '/doctor/treatments/create', label: 'New Treatment', icon: PlusCircle },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/doctors', label: 'Doctor Management', icon: Stethoscope },
  { to: '/admin/patients', label: 'Patient Records', icon: Heart },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/security', label: 'Security Monitor', icon: Lock },
  { to: '/admin/medicines', label: 'Medicine Safety', icon: AlertTriangle },
  { to: '/admin/export', label: 'Export Records', icon: Download },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === ROLES.ADMIN ? adminLinks :
                user?.role === ROLES.DOCTOR ? doctorLinks : patientLinks;

  const roleIcon = user?.role === ROLES.DOCTOR ? Stethoscope :
                   user?.role === ROLES.ADMIN ? ShieldCheck : Heart;
  const RoleIcon = roleIcon;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-surface-200/60 z-40 flex flex-col shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-lg font-bold text-surface-900">Health</span>
              <span className="text-lg font-bold text-primary-600">Connect</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-surface-100 p-3 space-y-2">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <RoleIcon className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-medium text-surface-800 truncate">{user?.name}</p>
                <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-danger-500 hover:bg-danger-50 hover:text-danger-600"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-link w-full justify-center"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
