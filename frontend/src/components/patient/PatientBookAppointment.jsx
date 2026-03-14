import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, Clock, MapPin, Star, ShieldCheck, ChevronRight,
  Stethoscope, CreditCard, CheckCircle, X, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

// ── Mock Data ──
const mockDoctors = [
  { id: 'D-101', name: 'Dr. Michael Chen', specialty: 'Cardiology', illness: ['Heart Attack', 'Hypertension', 'Chest Pain'], fee: 150, rating: 4.9, reviews: 124, exp: 12, hospital: 'City Central Hospital', img: 'MC' },
  { id: 'D-102', name: 'Dr. Sarah Williams', specialty: 'Dermatology', illness: ['Acne', 'Skin Rash', 'Psoriasis'], fee: 120, rating: 4.7, reviews: 89, exp: 8, hospital: 'SkinCare Clinic', img: 'SW' },
  { id: 'D-103', name: 'Dr. James Anderson', specialty: 'Neurology', illness: ['Migraine', 'Stroke', 'Epilepsy'], fee: 200, rating: 4.8, reviews: 156, exp: 15, hospital: 'Neuro Center', img: 'JA' },
  { id: 'D-104', name: 'Dr. Emily Davis', specialty: 'Pediatrics', illness: ['Fever', 'Cough', 'Chickenpox'], fee: 100, rating: 4.9, reviews: 210, exp: 10, hospital: 'Childrens Hospital', img: 'ED' },
  { id: 'D-105', name: 'Dr. Robert Wilson', specialty: 'General Medicine', illness: ['Fever', 'Cold', 'Flu', 'Headache'], fee: 80, rating: 4.6, reviews: 342, exp: 20, hospital: 'City Central Hospital', img: 'RW' },
];

const generateSlots = (dateStr) => [
  { id: 's1', time: '09:00 AM', status: 'vacant' },
  { id: 's2', time: '09:30 AM', status: 'booked' },
  { id: 's3', time: '10:00 AM', status: 'vacant' },
  { id: 's4', time: '10:30 AM', status: 'vacant' },
  { id: 's5', time: '11:00 AM', status: 'booked' },
  { id: 's6', time: '14:00 PM', status: 'vacant' },
  { id: 's7', time: '14:30 PM', status: 'vacant' },
  { id: 's8', time: '15:00 PM', status: 'vacant' },
];

const specialties = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'General Medicine'];

const PatientBookAppointment = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Derived
  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter(d => {
      const matchSpec = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
      const term = searchTerm.toLowerCase();
      const matchSearch = d.name.toLowerCase().includes(term) || 
                          d.id.toLowerCase().includes(term) || 
                          d.illness.some(i => i.toLowerCase().includes(term));
      return matchSpec && matchSearch;
    });
  }, [searchTerm, selectedSpecialty]);

  const currentSlots = useMemo(() => generateSlots(selectedDate), [selectedDate]);

  // Actions
  const handleSlotSelect = (slot) => {
    if (slot.status === 'booked') return;
    setSelectedSlot(slot);
    setPaymentModalOpen(true);
    setPaymentSuccess(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network delay for payment
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setPaymentModalOpen(false);
      setSelectedDoctor(null);
      setSelectedSlot(null);
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments'); // Redirect to my appointments
    }, 2000);
  };

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
                    placeholder="Search by doctor name, ID, or illness (e.g., Fever, Heart)..." 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.length === 0 ? (
                <div className="col-span-full py-12 text-center text-surface-500 bg-surface-50 rounded-2xl border border-surface-200">
                  <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No doctors found matching your criteria.</p>
                </div>
              ) : (
                filteredDoctors.map((doc, idx) => (
                  <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card hover className="h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">
                          {doc.img}
                        </div>
                        <div>
                          <h3 className="font-bold text-surface-800">{doc.name}</h3>
                          <p className="text-xs text-primary-600 font-medium">{doc.specialty}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-surface-500">
                            <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                            <span className="font-medium text-surface-700">{doc.rating}</span>
                            <span>({doc.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-xs text-surface-600">
                          <MapPin className="w-4 h-4 text-surface-400" />
                          <span>{doc.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-surface-600">
                          <ShieldCheck className="w-4 h-4 text-surface-400" />
                          <span>{doc.exp} Years Experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-success-600 bg-success-50 px-2 py-1 rounded w-fit mt-2">
                          Consultation Fee: ${doc.fee}
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-surface-100">
                        <p className="text-[10px] text-surface-400 mb-2 uppercase tracking-wide font-semibold">Treats exactly:</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {doc.illness.slice(0, 3).map(i => (
                            <span key={i} className="px-2 py-0.5 border border-surface-200 bg-surface-50 text-[10px] rounded-full text-surface-600">{i}</span>
                          ))}
                          {doc.illness.length > 3 && <span className="px-2 py-0.5 text-[10px] text-surface-400">+{doc.illness.length - 3} more</span>}
                        </div>
                        <Button className="w-full" onClick={() => setSelectedDoctor(doc)}>View Profile & Book</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
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
                      {selectedDoctor.img}
                    </div>
                    <h2 className="text-xl font-bold text-surface-800">{selectedDoctor.name}</h2>
                    <p className="text-primary-600 font-medium">{selectedDoctor.specialty}</p>
                    <p className="text-sm text-surface-500 mt-1">{selectedDoctor.hospital}</p>
                  </div>
                  
                  <div className="py-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Experience</span>
                      <span className="font-medium text-surface-800">{selectedDoctor.exp} Years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Rating</span>
                      <span className="font-medium text-surface-800 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" /> {selectedDoctor.rating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-surface-100 pt-3">
                      <span className="text-surface-500">Consultation Fee</span>
                      <span className="font-bold text-success-600 text-lg">${selectedDoctor.fee}</span>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <h3 className="font-semibold text-surface-800 mb-3">Conditions Treated</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.illness.map(i => (
                      <span key={i} className="px-2.5 py-1 bg-surface-100 text-xs font-medium text-surface-700 rounded-lg">{i}</span>
                    ))}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentSlots.map((slot) => {
                      const isBooked = slot.status === 'booked';
                      return (
                        <button
                          key={slot.id}
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
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <Modal isOpen={paymentModalOpen} onClose={() => !isProcessing && !paymentSuccess && setPaymentModalOpen(false)} title="Confirm & Pay" size="md">
        {paymentSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success-100 text-success-500 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">Payment Successful!</h3>
            <p className="text-surface-600">Your appointment with {selectedDoctor?.name} is confirmed.</p>
            <p className="text-sm font-medium text-surface-800 mt-4 bg-surface-50 p-3 rounded-lg inline-block">
              {new Date(selectedDate).toLocaleDateString()} at {selectedSlot?.time}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase">Consultation Fee</p>
                <p className="text-2xl font-bold text-primary-800">${selectedDoctor?.fee}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-surface-800">{selectedDoctor?.name}</p>
                <p className="text-xs text-surface-500">{new Date(selectedDate).toLocaleDateString()} · {selectedSlot?.time}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-medium text-surface-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-surface-500" /> Payment Details
              </h4>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-surface-700">Cardholder Name</label>
                <input required type="text" className="input-base" defaultValue="Sarah Johnson" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-surface-700">Card Number</label>
                <input required type="text" className="input-base" defaultValue="•••• •••• •••• 4242" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-700">Expiry (MM/YY)</label>
                  <input required type="text" className="input-base" defaultValue="12/26" maxLength={5} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-700">CVV</label>
                  <input required type="password" className="input-base" defaultValue="123" maxLength={3} />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-surface-500 bg-surface-50 p-3 rounded-lg mt-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <p>This is a secure, encrypted payment simulation. No real funds will be deducted.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setPaymentModalOpen(false)} disabled={isProcessing}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={isProcessing}>
                {isProcessing ? 'Processing...' : `Pay $${selectedDoctor?.fee} & Book`}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PatientBookAppointment;
