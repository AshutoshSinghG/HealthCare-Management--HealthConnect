import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, CalendarCheck, Clock, TrendingUp, Shield } from 'lucide-react';

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Registered Patients', color: 'from-blue-500 to-blue-600' },
  { icon: UserCheck, value: 200, suffix: '+', label: 'Verified Doctors', color: 'from-green-500 to-emerald-600' },
  { icon: CalendarCheck, value: 15000, suffix: '+', label: 'Appointments Booked', color: 'from-purple-500 to-purple-600' },
  { icon: Clock, value: 99.9, suffix: '%', label: 'System Uptime', color: 'from-orange-500 to-orange-600' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Satisfaction Rate', color: 'from-pink-500 to-pink-600' },
  { icon: Shield, value: 100, suffix: '%', label: 'HIPAA Compliant', color: 'from-teal-500 to-teal-600' },
];

const AnimatedCounter = ({ target, suffix, inView }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatsBar = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="relative z-10 -mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-surface-900/5 border border-surface-100 p-6 lg:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl lg:text-3xl font-extrabold text-surface-900">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
                </p>
                <p className="text-xs sm:text-sm text-surface-500 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
