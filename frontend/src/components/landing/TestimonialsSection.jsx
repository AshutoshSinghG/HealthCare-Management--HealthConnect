import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Cardiologist', avatar: 'PS', color: 'bg-blue-500', rating: 5, text: 'HealthConnect has transformed how I manage my practice. The slot management system is incredibly intuitive, and the real-time chat feature lets me follow up with patients seamlessly.' },
  { name: 'Rahul Verma', role: 'Patient', avatar: 'RV', color: 'bg-green-500', rating: 5, text: 'I can book appointments, track my treatments, and even chat with my doctor — all from my phone. The medication tracker reminds me of my prescriptions. Truly a lifesaver!' },
  { name: 'Dr. Anil Kapoor', role: 'Orthopedic Surgeon', avatar: 'AK', color: 'bg-purple-500', rating: 5, text: 'The treatment creation workflow is comprehensive. I can add diagnoses, prescriptions, and follow-up notes in minutes. Plus, the patient history is always at my fingertips.' },
  { name: 'Sneha Patel', role: 'Patient', avatar: 'SP', color: 'bg-pink-500', rating: 5, text: 'What impressed me most is the export feature. I could download my entire medical history when switching to a new doctor. The security measures also give me complete peace of mind.' },
  { name: 'Admin Team, City Hospital', role: 'Hospital Administrator', avatar: 'CH', color: 'bg-orange-500', rating: 5, text: 'The admin dashboard gives us complete visibility into our operations. Audit logs, user management, and security monitoring — everything we need to run our hospital efficiently.' },
  { name: 'Dr. Meera Joshi', role: 'Pediatrician', avatar: 'MJ', color: 'bg-teal-500', rating: 5, text: 'The rating system helps me understand my patients\' experience. Cross-midnight shift support was a game-changer for our night clinic. Highly recommend HealthConnect!' },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="relative z-10 py-24 lg:py-32 bg-surface-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
            What Our Users{' '}
            <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">Say About Us</span>
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <div className="relative bg-white rounded-3xl border border-surface-100 shadow-lg p-8 lg:p-12 mb-8 overflow-hidden">
          <Quote className="absolute top-6 right-6 w-16 h-16 text-primary-50" />
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg lg:text-xl text-surface-700 leading-relaxed mb-8 relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${t.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-surface-900">{t.name}</p>
                  <p className="text-sm text-surface-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Testimonial dots / selector */}
        <div className="flex justify-center gap-3">
          {testimonials.map((tm, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i === current
                  ? `${tm.color} text-white shadow-lg scale-110`
                  : 'bg-white text-surface-400 border border-surface-200 hover:border-surface-300'
              }`}
            >
              {tm.avatar}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
