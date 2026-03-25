import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Clock, MapPin, Star, ShieldCheck, ChevronRight,
  Stethoscope, CreditCard, CheckCircle, X, Info, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { useAvailableDoctors, useDoctorSlots, useBookAppointment } from '../../hooks/usePatients';

const PatientBookAppointment = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filters = useMemo(() => {
    const f = {};
    if (searchTerm) f.search = searchTerm;
    if (selectedSpecialty !== 'All') f.specialisation = selectedSpecialty;
    return f;
  }, [searchTerm, selectedSpecialty]);

  const { data: doctors = [], isLoading: loadingDoctors } = useAvailableDoctors(filters);
  const { data: slots = [], isLoading: loadingSlots } = useDoctorSlots(selectedDoctor?._id, selectedDate);
  const bookMutation = useBookAppointment();

  // Get unique specialties from loaded doctors for filter
  const specialties = useMemo(() => {
    const specs = new Set(doctors.map(d => d.specialisation).filter(Boolean));
    return ['All', ...Array.from(specs)];
  }, [doctors]);

  const handleSlotSelect = (slot) => {
    if (slot.status === 'booked') return;
    setSelectedSlot(slot);
    setPaymentModalOpen(true);
    setPaymentSuccess(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await bookMutation.mutateAsync({
        doctorId: selectedDoctor._id,
        date: selectedDate,
        time: selectedSlot.time,
        type: 'In-person',
        fee: 0,
      });
      setPaymentSuccess(true);

      setTimeout(() => {
        setPaymentModalOpen(false);
        setSelectedDoctor(null);
        setSelectedSlot(null);
        toast.success('Appointment booked successfully!');
        navigate('/patient/appointments');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const getDoctorName = (doc) => `Dr. ${doc.firstName} ${doc.lastName}`;
  const getInitials = (doc) => `${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="page-title">Book an Appointment</h1>
        <p className="text-sm text-surface-500">Find the right doctor and book your consultation instantly.</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedDoctor ? (
          <motion.div key="search" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

            {/* Search Filters */}
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-base pl-10 w-full"
                  />
                </div>
                <div className="w-full md:w-64">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="input-base w-full"
                  >
                    {specialties.map(s => (
                      <option key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Doctor List */}
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-surface-500 bg-surface-50 rounded-2xl border border-surface-200">
                    <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No doctors found matching your criteria.</p>
                  </div>
                ) : (
                  doctors.map((doc, idx) => (
                    <motion.div key={doc._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card hover className="h-full flex flex-col">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">
                            {getInitials(doc)}
                          </div>
                          <div>
                            <h3 className="font-bold text-surface-800">{getDoctorName(doc)}</h3>
                            <p className="text-xs text-primary-600 font-medium">{doc.specialisation}</p>
                            {doc.department && (
                              <p className="text-xs text-surface-500 mt-0.5">{doc.department}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4 flex-1">
                          {doc.registrationNumber && (
                            <div className="flex items-center gap-2 text-xs text-surface-600">
                              <ShieldCheck className="w-4 h-4 text-surface-400" />
                              <span>Reg: {doc.registrationNumber}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-3 border-t border-surface-100">
                          <Button className="w-full" onClick={() => setSelectedDoctor(doc)}>View Profile & Book</Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <button onClick={() => setSelectedDoctor(null)} className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 mb-4">
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Search
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Doctor Profile Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <div className="text-center pb-4 border-b border-surface-100">
                    <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 font-bold text-2xl flex items-center justify-center mx-auto mb-3">
                      {getInitials(selectedDoctor)}
                    </div>
                    <h2 className="text-xl font-bold text-surface-800">{getDoctorName(selectedDoctor)}</h2>
                    <p className="text-primary-600 font-medium">{selectedDoctor.specialisation}</p>
                    {selectedDoctor.department && (
                      <p className="text-sm text-surface-500 mt-1">{selectedDoctor.department}</p>
                    )}
                  </div>

                  <div className="py-4 space-y-3">
                    {selectedDoctor.registrationNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-500">Registration</span>
                        <span className="font-medium text-surface-800">{selectedDoctor.registrationNumber}</span>
                      </div>
                    )}
                    {selectedDoctor.contactEmail && (
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-500">Email</span>
                        <span className="font-medium text-surface-800 text-xs">{selectedDoctor.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Slot Booking Area */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    Select Appointment Slot
                  </h3>

                  <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <div className="space-y-1 w-full sm:w-auto">
                      <label className="text-xs font-bold text-primary-700 uppercase tracking-wider">Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-base border-primary-200 focus:border-primary-500 focus:ring-primary-500/20 bg-white"
                      />
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success-100 border border-success-200"></div> Vacant</span>
                      <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-surface-100 border border-surface-200 opacity-60"></div> Booked</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-medium text-surface-700 mb-3">Available Timings</h4>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {slots.map((slot, idx) => {
                        const isBooked = slot.status === 'booked';
                        return (
                          <button
                            key={idx}
                            disabled={isBooked}
                            onClick={() => handleSlotSelect(slot)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isBooked
                                ? 'bg-surface-50 border-surface-200 text-surface-400 cursor-not-allowed opacity-60'
                                : 'bg-white border-success-200 text-success-700 hover:bg-success-50 hover:border-success-300 shadow-sm'
                            }`}
                          >
                            <Clock className={`w-4 h-4 mx-auto mb-1 ${isBooked ? 'text-surface-400' : 'text-success-600'}`} />
                            <p className="text-sm font-bold">{slot.time}</p>
                            <p className="text-[10px] uppercase font-bold mt-0.5 tracking-wider">{slot.status}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <Modal isOpen={paymentModalOpen} onClose={() => !bookMutation.isPending && !paymentSuccess && setPaymentModalOpen(false)} title="Confirm Appointment" size="md">
        {paymentSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-100 text-success-500 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Booking Successful!</h3>
            <p className="text-surface-600">Your appointment with {selectedDoctor ? getDoctorName(selectedDoctor) : ''} is confirmed.</p>
            <p className="text-sm font-medium text-surface-800 mt-4 bg-surface-50 p-3 rounded-lg inline-block">
              {new Date(selectedDate).toLocaleDateString()} at {selectedSlot?.time}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase">Appointment</p>
                <p className="text-lg font-bold text-primary-800">{selectedDoctor ? getDoctorName(selectedDoctor) : ''}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-surface-800">{selectedDoctor?.specialisation}</p>
                <p className="text-xs text-surface-500">{new Date(selectedDate).toLocaleDateString()} · {selectedSlot?.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-surface-500 bg-surface-50 p-3 rounded-lg mt-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p>By confirming, you agree to book this appointment slot. The doctor will be notified of your booking.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setPaymentModalOpen(false)} disabled={bookMutation.isPending}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={bookMutation.isPending}>
                {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PatientBookAppointment;
