import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CalendarDays, Plus, Trash2, Check, X, DollarSign, Users,
  ChevronLeft, ChevronRight, Edit, AlertTriangle, CheckCircle,
  XCircle, Timer, Eye, RefreshCw, Settings, CalendarRange,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useDoctorSlots, useCreateDoctorSlot, useDeleteDoctorSlot, useUpdateSlotStatus, useDoctorAvailability, useUpdateDoctorAvailability } from '../../hooks/useDoctors';

// ── helpers ──
const pad = n => String(n).padStart(2, '0');
const SLOT_DURATION = 30; // minutes

const generateSlots = (startTime, endTime) => {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let cur = sh * 60 + sm;
  let end = eh * 60 + em;

  if (end <= cur) {
    end += 24 * 60; // Handle spanning across midnight
  }

  while (cur + SLOT_DURATION <= end) {
    const fromH = Math.floor(cur / 60) % 24, fromM = cur % 60;
    const toH = Math.floor((cur + SLOT_DURATION) / 60) % 24, toM = (cur + SLOT_DURATION) % 60;
    slots.push({ from: `${pad(fromH)}:${pad(fromM)}`, to: `${pad(toH)}:${pad(toM)}` });
    cur += SLOT_DURATION;
  }
  return slots;
};

const formatTime12 = t => {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${pad(m)} ${suffix}`;
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const today = new Date();
const todayStr = fmtDate(today);


const viewModes = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const statusColors = { booked: 'success', pending: 'warning', rejected: 'danger', vacant: 'default' };
const statusIcons = { booked: CheckCircle, pending: Timer, rejected: XCircle };

// ────────────────────────────────── component ──────────────────────────────────
const SlotManagement = () => {
  const createSlotMutation = useCreateDoctorSlot();
  const deleteSlotMutation = useDeleteDoctorSlot();
  const updateStatusMutation = useUpdateSlotStatus();
  const updateAvailMutation = useUpdateDoctorAvailability();

  const { data: availData } = useDoctorAvailability();
  const availability = availData || { startTime: '09:00', endTime: '17:00', consultationFee: 150, workingDays: [1, 2, 3, 4, 5] };

  const [viewMode, setViewMode] = useState('Daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: todayStr, from: '09:00', to: '09:30', patient: '', patientId: '', reason: '' });
  const [tempAvail, setTempAvail] = useState(availability);

  // Load slots from API
  const { data: slotsData } = useDoctorSlots();
  const bookings = useMemo(() => {
    if (!slotsData) return [];
    return (Array.isArray(slotsData) ? slotsData : []).map(s => ({
      id: s._id,
      date: s.date,
      from: s.from,
      to: s.to,
      patient: s.patient || '',
      patientId: s.patientId || '',
      reason: s.reason || '',
      status: s.status || 'vacant',
    }));
  }, [slotsData]);

  // ── derived ──
  const allSlots = useMemo(() => generateSlots(availability.startTime, availability.endTime), [availability]);

  const dateKey = fmtDate(currentDate);

  const getDateRange = () => {
    const d = new Date(currentDate);
    if (viewMode === 'Daily') return [fmtDate(d)];
    if (viewMode === 'Weekly') {
      const start = new Date(d); start.setDate(d.getDate() - d.getDay());
      return Array.from({ length: 7 }, (_, i) => { const x = new Date(start); x.setDate(start.getDate() + i); return fmtDate(x); });
    }
    if (viewMode === 'Monthly') {
      const y = d.getFullYear(), m = d.getMonth();
      const days = new Date(y, m + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => fmtDate(new Date(y, m, i + 1)));
    }
    // Yearly
    const y = d.getFullYear();
    return Array.from({ length: 12 }, (_, m) => {
      const days = new Date(y, m + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => fmtDate(new Date(y, m, i + 1)));
    }).flat();
  };

  const dateRange = getDateRange();
  const rangeBookings = bookings.filter(b => dateRange.includes(b.date));

  const stats = useMemo(() => {
    const totalSlotDays = dateRange.length * allSlots.length;
    const booked = rangeBookings.filter(b => b.status === 'booked').length;
    const pending = rangeBookings.filter(b => b.status === 'pending').length;
    const rejected = rangeBookings.filter(b => b.status === 'rejected').length;
    return { total: totalSlotDays, booked, pending, rejected, vacant: totalSlotDays - booked - pending - rejected };
  }, [dateRange, rangeBookings, allSlots]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'overview') return rangeBookings;
    if (activeTab === 'pending') return rangeBookings.filter(b => b.status === 'pending');
    if (activeTab === 'booked') return rangeBookings.filter(b => b.status === 'booked');
    if (activeTab === 'rejected') return rangeBookings.filter(b => b.status === 'rejected');
    return rangeBookings;
  }, [activeTab, rangeBookings]);

  // ── actions ──
  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === 'Daily') d.setDate(d.getDate() + dir);
    else if (viewMode === 'Weekly') d.setDate(d.getDate() + dir * 7);
    else if (viewMode === 'Monthly') d.setMonth(d.getMonth() + dir);
    else d.setFullYear(d.getFullYear() + dir);
    setCurrentDate(d);
  };

  const accept = id => { updateStatusMutation.mutate({ id, status: 'booked' }, { onSuccess: () => toast.success('Appointment accepted'), onError: (err) => toast.error(extractErrorMessage(err, 'Failed to accept appointment.')) }); };
  const reject = id => { updateStatusMutation.mutate({ id, status: 'rejected' }, { onSuccess: () => toast.success('Appointment rejected'), onError: (err) => toast.error(extractErrorMessage(err, 'Failed to reject appointment.')) }); };
  const deleteSlot = id => { deleteSlotMutation.mutate(id, { onSuccess: () => toast.success('Slot deleted'), onError: (err) => toast.error(extractErrorMessage(err, 'Failed to delete slot.')) }); };

  const saveAvailability = () => {
    if (!tempAvail.startTime || !tempAvail.endTime) {
      toast.error('Start time and end time are required');
      return;
    }
    if (tempAvail.startTime === tempAvail.endTime) {
      toast.error('Start time and end time cannot be the same');
      return;
    }
    if (tempAvail.consultationFee === '' || Number(tempAvail.consultationFee) < 0) {
      toast.error('Consultation fee must be ₹0 or more');
      return;
    }
    if (!tempAvail.workingDays || tempAvail.workingDays.length === 0) {
      toast.error('Please select at least one working day');
      return;
    }
    updateAvailMutation.mutate(tempAvail, {
      onSuccess: () => { setSettingsOpen(false); toast.success('Availability updated'); },
      onError: (err) => toast.error(extractErrorMessage(err, 'Failed to update availability.')),
    });
  };

  const addNewSlot = () => {
    if (!newSlot.date) { toast.error('Date is required'); return; }
    if (!newSlot.from || !newSlot.to) { toast.error('Start and end time are required'); return; }
    if (newSlot.from >= newSlot.to) { toast.error('End time must be after start time'); return; }
    createSlotMutation.mutate(newSlot, {
      onSuccess: () => {
        setNewSlot({ date: todayStr, from: '09:00', to: '09:30', patient: '', patientId: '', reason: '' });
        setAddSlotOpen(false);
        toast.success('Slot created');
      },
      onError: (err) => toast.error(extractErrorMessage(err, 'Failed to create slot.')),
    });
  };

  const dateLabel = () => {
    if (viewMode === 'Daily') return currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (viewMode === 'Weekly') {
      const s = new Date(currentDate); s.setDate(s.getDate() - s.getDay());
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (viewMode === 'Monthly') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return `Year ${currentDate.getFullYear()}`;
  };

  const tabs = [
    { key: 'overview', label: 'All Slots', count: rangeBookings.length },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'booked', label: 'Booked', count: stats.booked },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  // ── daily slot grid ──
  const renderDailyGrid = () => {
    const dayBookings = bookings.filter(b => b.date === dateKey);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {allSlots.map(slot => {
          const booking = dayBookings.find(b => b.from === slot.from);
          const Icon = booking ? statusIcons[booking.status] : Clock;
          return (
            <motion.div key={slot.from} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl border transition-all ${booking ? (booking.status === 'booked' ? 'border-success-200 bg-success-50/40' : booking.status === 'pending' ? 'border-warning-200 bg-warning-50/40' : 'border-danger-200 bg-danger-50/30') : 'border-surface-100 bg-surface-50/50 hover:border-primary-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-surface-700">{formatTime12(slot.from)} — {formatTime12(slot.to)}</span>
                <Badge variant={booking ? statusColors[booking.status] : 'default'} size="sm">{booking ? booking.status : 'vacant'}</Badge>
              </div>
              {booking ? (
                <div>
                  <p className="text-sm font-medium text-surface-800">{booking.patient}</p>
                  <p className="text-xs text-surface-500">{booking.patientId} · {booking.reason}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => accept(booking.id)} className="text-success-600"><Check className="w-3.5 h-3.5 mr-1" />Accept</Button>
                        <Button variant="ghost" size="sm" onClick={() => reject(booking.id)} className="text-danger-500"><X className="w-3.5 h-3.5 mr-1" />Reject</Button>
                      </>
                    )}
                    {booking.status === 'rejected' && (
                      <Button variant="ghost" size="sm" onClick={() => accept(booking.id)} className="text-success-600"><RefreshCw className="w-3.5 h-3.5 mr-1" />Re-accept</Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteSlot(booking.id)} className="text-surface-400 hover:text-danger-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-surface-400 italic">No booking</p>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // ── list view (for non-daily + tabs) ──
  const renderListView = () => (
    <div className="space-y-2">
      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-surface-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No appointments found for this period</p>
        </div>
      )}
      {filteredBookings.map((b, i) => {
        const Icon = statusIcons[b.status] || Clock;
        return (
          <motion.div key={b.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card hover>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${b.status === 'booked' ? 'bg-success-50 border border-success-200' : b.status === 'pending' ? 'bg-warning-50 border border-warning-200' : 'bg-danger-50 border border-danger-200'}`}>
                  <Icon className={`w-5 h-5 ${b.status === 'booked' ? 'text-success-500' : b.status === 'pending' ? 'text-warning-500' : 'text-danger-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-surface-800">{b.patient}</p>
                    <Badge variant={statusColors[b.status]} size="sm" dot>{b.status}</Badge>
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">{b.patientId} · {b.reason}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{b.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime12(b.from)} — {formatTime12(b.to)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {b.status === 'pending' && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => accept(b.id)} className="text-success-600"><Check className="w-4 h-4 mr-1" />Accept</Button>
                      <Button variant="ghost" size="sm" onClick={() => reject(b.id)} className="text-danger-500"><X className="w-4 h-4 mr-1" />Reject</Button>
                    </>
                  )}
                  {b.status === 'rejected' && (
                    <Button variant="ghost" size="sm" onClick={() => accept(b.id)} className="text-success-600"><RefreshCw className="w-4 h-4 mr-1" />Re-accept</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteSlot(b.id)} className="text-surface-400 hover:text-danger-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  // ── weekly summary grid ──
  const renderWeeklyGrid = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d; });

    return (
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map(d => {
          const dk = fmtDate(d);
          const dayBookings = bookings.filter(b => b.date === dk);
          const booked = dayBookings.filter(b => b.status === 'booked').length;
          const pending = dayBookings.filter(b => b.status === 'pending').length;
          const isToday = dk === todayStr;
          return (
            <div key={dk} onClick={() => { setCurrentDate(d); setViewMode('Daily'); }}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:border-primary-300 ${isToday ? 'border-primary-300 bg-primary-50/50' : 'border-surface-100 bg-surface-50/30'}`}>
              <p className="text-xs font-semibold text-surface-400 uppercase">{dayNames[d.getDay()]}</p>
              <p className={`text-lg font-bold mt-1 ${isToday ? 'text-primary-600' : 'text-surface-800'}`}>{d.getDate()}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {booked > 0 && <Badge variant="success" size="sm">{booked}</Badge>}
                {pending > 0 && <Badge variant="warning" size="sm">{pending}</Badge>}
                {booked === 0 && pending === 0 && <span className="text-xs text-surface-300">—</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ── monthly calendar grid ──
  const renderMonthlyGrid = () => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = Array.from({ length: 42 }, (_, i) => {
      const dayNum = i - firstDay + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      return dayNum;
    });

    return (
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-1">{dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-surface-400 py-1">{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dk = `${y}-${pad(m + 1)}-${pad(day)}`;
            const dayB = bookings.filter(b => b.date === dk);
            const booked = dayB.filter(b => b.status === 'booked').length;
            const pending = dayB.filter(b => b.status === 'pending').length;
            const isToday = dk === todayStr;
            return (
              <div key={i} onClick={() => { setCurrentDate(new Date(y, m, day)); setViewMode('Daily'); }}
                className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all hover:border-primary-200 min-h-[48px] ${isToday ? 'border-primary-300 bg-primary-50' : 'border-surface-50 hover:bg-surface-50'}`}>
                <p className={`text-xs font-medium ${isToday ? 'text-primary-600' : 'text-surface-700'}`}>{day}</p>
                <div className="flex items-center justify-center gap-0.5 mt-0.5">
                  {booked > 0 && <span className="w-1.5 h-1.5 rounded-full bg-success-400"></span>}
                  {pending > 0 && <span className="w-1.5 h-1.5 rounded-full bg-warning-400"></span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── yearly summary ──
  const renderYearlySummary = () => {
    const y = currentDate.getFullYear();
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {monthNames.map((name, m) => {
          const monthBookings = bookings.filter(b => { const d = new Date(b.date); return d.getFullYear() === y && d.getMonth() === m; });
          const booked = monthBookings.filter(b => b.status === 'booked').length;
          const pending = monthBookings.filter(b => b.status === 'pending').length;
          return (
            <div key={m} onClick={() => { setCurrentDate(new Date(y, m, 1)); setViewMode('Monthly'); }}
              className="p-4 rounded-xl border border-surface-100 bg-surface-50/30 text-center cursor-pointer hover:border-primary-200 transition-all">
              <p className="text-sm font-semibold text-surface-700">{name}</p>
              <div className="flex justify-center gap-3 mt-2 text-xs">
                <span className="text-success-600">{booked} booked</span>
                <span className="text-warning-600">{pending} pending</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Appointment Slots</h1>
          <p className="text-sm text-surface-500">Manage your availability, bookings, and consultation schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Settings} onClick={() => { setTempAvail(availability); setSettingsOpen(true); }}>Availability</Button>
          <Button size="sm" icon={Plus} onClick={() => setAddSlotOpen(true)}>Add Slot</Button>
        </div>
      </div>

      {/* Stats + Fee */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-primary-700">{stats.total}</p>
          <p className="text-xs font-medium text-primary-600">Total Slots</p>
        </div>
        <div className="bg-success-50 border border-success-100 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-success-700">{stats.booked}</p>
          <p className="text-xs font-medium text-success-600">Booked</p>
        </div>
        <div className="bg-warning-50 border border-warning-100 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-warning-700">{stats.pending}</p>
          <p className="text-xs font-medium text-warning-600">Pending</p>
        </div>
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-danger-700">{stats.rejected}</p>
          <p className="text-xs font-medium text-danger-600">Rejected</p>
        </div>
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-surface-700">{stats.vacant}</p>
          <p className="text-xs font-medium text-surface-500">Vacant</p>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-violet-700">₹{availability.consultationFee}</p>
          <p className="text-xs font-medium text-violet-600">Consult Fee</p>
        </div>
      </div>

      {/* View Mode + Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 bg-surface-50 border border-surface-200 rounded-xl p-1">
          {viewModes.map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === v ? 'bg-primary-500 text-white shadow-sm' : 'text-surface-600 hover:bg-surface-100'}`}
            >{v}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"><ChevronLeft className="w-5 h-5" /></button>
          <p className="text-sm font-semibold text-surface-700 min-w-[160px] text-center">{dateLabel()}</p>
          <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"><ChevronRight className="w-5 h-5" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-2 py-1 rounded-lg bg-surface-100 text-xs font-medium text-surface-600 hover:bg-surface-200">Today</button>
        </div>
      </div>

      {/* Calendar Grid (per view mode) */}
      {viewMode === 'Weekly' && renderWeeklyGrid()}
      {viewMode === 'Monthly' && renderMonthlyGrid()}
      {viewMode === 'Yearly' && renderYearlySummary()}

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === t.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >
              {t.label}
              {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.key ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-500'}`}>{t.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Slot Content */}
      <AnimatePresence mode="wait">
        <motion.div key={`${activeTab}-${viewMode}-${dateKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {viewMode === 'Daily' && activeTab === 'overview'
            ? renderDailyGrid()
            : renderListView()}
        </motion.div>
      </AnimatePresence>

      {/* ── Availability Settings Modal ── */}
      <Modal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} title="Set Availability & Fee" size="md">
        <div className="space-y-4">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-xs text-primary-700">
            Slots are auto-generated in <strong>30-minute</strong> intervals between your start and end times.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Start Time</label>
              <input type="time" value={tempAvail.startTime} onChange={e => setTempAvail(p => ({ ...p, startTime: e.target.value }))} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">End Time</label>
              <input type="time" value={tempAvail.endTime} onChange={e => setTempAvail(p => ({ ...p, endTime: e.target.value }))} className="input-base" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Consultation Fee (₹)</label>
            <input type="number" min="0" value={tempAvail.consultationFee}
              onChange={e => { const v = Math.max(0, Number(e.target.value) || 0); setTempAvail(p => ({ ...p, consultationFee: v })); }}
              className="input-base" placeholder="e.g. 500" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Working Days</label>
            <div className="flex gap-2">
              {dayNames.map((d, i) => (
                <button key={d} onClick={() => setTempAvail(p => ({ ...p, workingDays: p.workingDays.includes(i) ? p.workingDays.filter(x => x !== i) : [...p.workingDays, i] }))}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${tempAvail.workingDays.includes(i) ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-500 border border-surface-200'}`}
                >{d}</button>
              ))}
            </div>
          </div>
          <div className="bg-surface-50 border border-surface-100 rounded-xl p-3 text-xs text-surface-600">
            Preview: <strong>{generateSlots(tempAvail.startTime, tempAvail.endTime).length}</strong> slots × 30 min each ({formatTime12(tempAvail.startTime)} — {formatTime12(tempAvail.endTime)})
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={saveAvailability} icon={Check}>Save Availability</Button>
          </div>
        </div>
      </Modal>

      {/* ── Add Slot Modal ── */}
      <Modal isOpen={addSlotOpen} onClose={() => setAddSlotOpen(false)} title="Create New Slot" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Date</label>
              <input type="date" value={newSlot.date} onChange={e => setNewSlot(p => ({ ...p, date: e.target.value }))} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">From</label>
              <input type="time" value={newSlot.from} onChange={e => setNewSlot(p => ({ ...p, from: e.target.value }))} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">To</label>
              <input type="time" value={newSlot.to} onChange={e => setNewSlot(p => ({ ...p, to: e.target.value }))} className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Patient Name <span className="text-surface-400">(optional)</span></label>
              <input value={newSlot.patient} onChange={e => setNewSlot(p => ({ ...p, patient: e.target.value }))} className="input-base" placeholder="Leave empty for vacant slot" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Patient ID</label>
              <input value={newSlot.patientId} onChange={e => setNewSlot(p => ({ ...p, patientId: e.target.value }))} className="input-base" placeholder="P-XXXX" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Reason</label>
            <input value={newSlot.reason} onChange={e => setNewSlot(p => ({ ...p, reason: e.target.value }))} className="input-base" placeholder="Reason for visit" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setAddSlotOpen(false)}>Cancel</Button>
            <Button onClick={addNewSlot} icon={Plus}>Create Slot</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SlotManagement;
