import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { src: '/images/landing/slider-team.png', title: 'Expert Medical Team', desc: 'Our platform connects you with verified, experienced healthcare professionals across every specialization.' },
  { src: '/images/landing/slider-consultation.png', title: 'Personalized Consultations', desc: 'One-on-one doctor-patient interactions with real-time chat and comprehensive treatment tracking.' },
  { src: '/images/landing/slider-equipment.png', title: 'Advanced Medical Technology', desc: 'State-of-the-art diagnostic tools and equipment powered by modern healthcare infrastructure.' },
  { src: '/images/landing/slider-telemedicine.png', title: 'Telemedicine & Remote Care', desc: 'Access quality healthcare from the comfort of your home through our secure digital platform.' },
  { src: '/images/landing/slider-analytics.png', title: 'Data-Driven Healthcare', desc: 'Powerful analytics dashboards that transform raw health data into actionable insights.' },
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (i) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative z-10 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">Gallery</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4">
            See <span className="bg-gradient-to-r from-primary-600 to-green-500 bg-clip-text text-transparent">HealthConnect</span> in Action
          </h2>
        </motion.div>

        <div className="relative rounded-3xl overflow-hidden bg-surface-900 shadow-2xl">
          <div className="relative aspect-[16/7] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img src={slides[current].src} alt={slides[current].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{slides[current].title}</h3>
                  <p className="text-white/70 max-w-xl text-sm lg:text-base">{slides[current].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots + Progress */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative w-8 h-1.5 rounded-full overflow-hidden bg-white/20 transition-all"
              >
                {i === current && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
                {i !== current && i < current && <div className="absolute inset-0 bg-white/50 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
