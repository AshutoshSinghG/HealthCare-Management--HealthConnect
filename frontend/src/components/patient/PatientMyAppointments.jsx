import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, MapPin, XCircle, CheckCircle,
  Video, FileText, ChevronRight, AlertTriangle, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

// ── Mock Data ──
const initialAppointments = [
  { id: 'A-101', doctor: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2024-11-15', time: '10:00 AM', status: 'upcoming', type: 'In-person', hospital: 'City Central Hospital', fee: 150 },
  { id: 'A-102', doctor: 'Dr. Sarah Williams', specialty: 'Dermatology', date: '2024-11-20', time: '02:30 PM', status: 'upcoming', type: 'Video Consult', hospital: 'SkinCare Clinic', fee: 120 },
  { id: 'A-103', doctor: 'Dr. James Anderson', specialty: 'Neurology', date: '2024-09-10', time: '11:00 AM', status: 'completed', type: 'In-person', hospital: 'Neuro Center', fee: 200 },
  { id: 'A-104', doctor: 'Dr. Emily Davis', specialty: 'Pediatrics', date: '2024-08-05', time: '09:30 AM', status: 'completed', type: 'In-person', hospital: 'Childrens Hospital', fee: 100 },
  { id: 'A-105', doctor: 'Dr. Robert Wilson', specialty: 'General Medicine', date: '2024-10-12', time: '04:00 PM', status: 'cancelled', type: 'Video Consult', hospital: 'City Central Hospital', fee: 80 },
];

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const PatientMyAppointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Derived
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => a.status === activeTab);
  }, [appointments, activeTab]);

  // Actions
  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    setAppointments(prev => prev.map(a => 
      a.id === selectedAppointment.id ? { ...a, status: 'cancelled' } : a
    ));
    
    setIsProcessing(false);
    setCancelModalOpen(false);
    toast.success('Appointment cancelled successfully');
    
    // Auto switch to cancelled tab so they see it moved
    setActiveTab('cancelled');
  };

  const EmptyState = () => (
    <div className="text-center py-16 bg-surface-50 rounded-2xl border border-surface-200">
      <CalendarDays className="w-16 h-16 mx-auto mb-4 text-surface-300" />
      <h3 className="text-lg font-bold text-surface-800 mb-2">No {activeTab} appointments</h3>
      <p className="text-surface-500 max-w-sm mx-auto mb-6">
        {activeTab === 'upcoming' 
          ? "You don't have any upcoming consultations scheduled." 
          : `You have no ${activeTab} appointments in your history.`}
      </p>
      {activeTab === 'upcoming' && (
        <Link to="/patient/book-appointment">
          <Button icon={CalendarDays}>Book New Appointment</Button>
        </Link>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="text-sm text-surface-500">Manage your bookings and view consultation history.</p>
        </div>
        <Link to="/patient/book-appointment">
          <Button icon={CalendarDays} size="sm">Book New Appointment</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex gap-4">
          {tabs.map(tab => {
            const count = appointments.filter(a => a.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-surface-500 hover:text-surface-700'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Appointment List */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {filteredAppointments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map(appt => (
                <Card key={appt.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    
                    {/* Left: Doctor Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-surface-800 text-lg">{appt.doctor}</h3>
                        <p className="text-sm text-primary-600 font-medium mb-2">{appt.specialty}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-surface-400" />
                            <span>{appt.hospital}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {appt.type === 'Video Consult' ? (
                              <Video className="w-4 h-4 text-surface-400" />
                            ) : (
                              <User className="w-4 h-4 text-surface-400" />
                            )}
                            <span>{appt.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-medium text-surface-700">
                            Fee: ${appt.fee}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Time Info */}
                    <div className="bg-surface-50 p-4 rounded-xl border border-surface-100 md:w-64 flex-shrink-0">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-surface-800">
                            {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-surface-800">{appt.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions / Status */}
                    <div className="flex flex-col items-end justify-center min-w-[140px] gap-3">
                      {appt.status === 'upcoming' && (
                        <>
                          <Badge variant="warning" size="md">Upcoming</Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-danger-600 border-danger-200 hover:bg-danger-50"
                            onClick={() => handleCancelClick(appt)}
                          >
                            Cancel Session
                          </Button>
                        </>
                      )}
                      
                      {appt.status === 'completed' && (
                        <>
                          <Badge variant="success" size="md" icon={CheckCircle}>Completed</Badge>
                          <Link to="/patient/treatments" className="w-full">
                            <Button variant="outline" size="sm" className="w-full" icon={FileText}>
                              View Record
                            </Button>
                          </Link>
                        </>
                      )}

                      {appt.status === 'cancelled' && (
                        <Badge variant="danger" size="md" icon={XCircle}>Cancelled</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => !isProcessing && setCancelModalOpen(false)} title="Cancel Appointment" size="sm">
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-danger-100 text-danger-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-surface-800">Are you sure?</h3>
          <p className="text-surface-600 text-sm">
            You are about to cancel your appointment with <strong>{selectedAppointment?.doctor}</strong> on <strong>{new Date(selectedAppointment?.date).toLocaleDateString()} at {selectedAppointment?.time}</strong>.
            This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setCancelModalOpen(false)} disabled={isProcessing}>Keep it</Button>
            <Button className="flex-1 bg-danger-500 hover:bg-danger-600 text-white border-0" onClick={confirmCancel} loading={isProcessing}>Yes, Cancel</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default PatientMyAppointments;
