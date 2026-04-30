import { motion } from 'framer-motion';
import { Heart, Stethoscope, Pill, Shield, Thermometer, Syringe } from 'lucide-react';

const floatingIcons = [
  { Icon: Heart, className: 'top-[10%] left-[5%]', delay: 0, duration: 7 },
  { Icon: Stethoscope, className: 'top-[20%] right-[8%]', delay: 1, duration: 6 },
  { Icon: Pill, className: 'top-[60%] left-[10%]', delay: 2, duration: 8 },
  { Icon: Shield, className: 'top-[40%] right-[5%]', delay: 0.5, duration: 7.5 },
  { Icon: Thermometer, className: 'top-[75%] right-[15%]', delay: 1.5, duration: 6.5 },
  { Icon: Syringe, className: 'top-[85%] left-[20%]', delay: 3, duration: 9 },
  { Icon: Heart, className: 'top-[50%] left-[85%]', delay: 2.5, duration: 7 },
  { Icon: Pill, className: 'top-[30%] left-[45%]', delay: 1.2, duration: 8.5 },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 6,
}));

const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {/* ECG Heartbeat Line */}
    <svg className="absolute top-[15%] left-0 w-full h-20 opacity-[0.04]" viewBox="0 0 1600 80" fill="none">
      <path className="ecg-line" d="M0 40 L200 40 L240 40 L260 15 L280 65 L300 10 L320 70 L340 35 L360 45 L400 40 L600 40 L640 40 L660 15 L680 65 L700 10 L720 70 L740 35 L760 45 L800 40 L1000 40 L1040 40 L1060 15 L1080 65 L1100 10 L1120 70 L1140 35 L1160 45 L1200 40 L1600 40" stroke="#2563EB" strokeWidth="2" />
    </svg>
    <svg className="absolute top-[55%] left-0 w-full h-20 opacity-[0.03]" viewBox="0 0 1600 80" fill="none">
      <path className="ecg-line" style={{ animationDelay: '1.5s' }} d="M0 40 L200 40 L240 40 L260 15 L280 65 L300 10 L320 70 L340 35 L360 45 L400 40 L600 40 L640 40 L660 15 L680 65 L700 10 L720 70 L740 35 L760 45 L800 40 L1000 40 L1040 40 L1060 15 L1080 65 L1100 10 L1120 70 L1140 35 L1160 45 L1200 40 L1600 40" stroke="#10B981" strokeWidth="2" />
    </svg>
    <svg className="absolute top-[85%] left-0 w-full h-20 opacity-[0.03]" viewBox="0 0 1600 80" fill="none">
      <path className="ecg-line" style={{ animationDelay: '3s' }} d="M0 40 L200 40 L240 40 L260 15 L280 65 L300 10 L320 70 L340 35 L360 45 L400 40 L600 40 L640 40 L660 15 L680 65 L700 10 L720 70 L740 35 L760 45 L800 40 L1000 40 L1040 40 L1060 15 L1080 65 L1100 10 L1120 70 L1140 35 L1160 45 L1200 40 L1600 40" stroke="#2563EB" strokeWidth="1.5" />
    </svg>

    {/* Pulse Rings */}
    <div className="absolute top-[25%] left-[15%]">
      <div className="w-8 h-8 rounded-full border border-primary-400/10 pulse-ring" />
      <div className="w-8 h-8 rounded-full border border-primary-400/10 pulse-ring-delay-1 absolute inset-0" />
      <div className="w-8 h-8 rounded-full border border-primary-400/10 pulse-ring-delay-2 absolute inset-0" />
    </div>
    <div className="absolute top-[65%] right-[20%]">
      <div className="w-6 h-6 rounded-full border border-green-400/10 pulse-ring" style={{ animationDelay: '0.5s' }} />
      <div className="w-6 h-6 rounded-full border border-green-400/10 pulse-ring-delay-1 absolute inset-0" />
    </div>

    {/* Floating Medical Icons */}
    {floatingIcons.map(({ Icon, className, delay, duration }, i) => (
      <motion.div
        key={i}
        className={`absolute ${className}`}
        animate={{ y: [-12, 12, -12], rotate: [-5, 5, -5] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="w-6 h-6 text-primary-300/[0.07]" />
      </motion.div>
    ))}

    {/* Floating Particles */}
    {particles.map(p => (
      <motion.div
        key={p.id}
        className="absolute rounded-full bg-primary-400/[0.06]"
        style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
        animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}

    {/* Large Gradient Orbs */}
    <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-primary-400/[0.03] rounded-full blur-3xl" />
    <div className="absolute top-[50%] right-[-10%] w-[600px] h-[600px] bg-green-400/[0.03] rounded-full blur-3xl" />
    <div className="absolute bottom-[5%] left-[30%] w-[400px] h-[400px] bg-blue-400/[0.02] rounded-full blur-3xl" />

    {/* DNA Helix Decorative */}
    <div className="absolute top-[35%] right-[3%] opacity-[0.04]">
      <svg className="dna-helix" width="40" height="200" viewBox="0 0 40 200">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <g key={i}>
            <circle cx={20 + 15 * Math.sin(i * 0.8)} cy={i * 25 + 10} r="3" fill="#2563EB" />
            <circle cx={20 - 15 * Math.sin(i * 0.8)} cy={i * 25 + 10} r="3" fill="#10B981" />
            <line x1={20 + 15 * Math.sin(i * 0.8)} y1={i * 25 + 10} x2={20 - 15 * Math.sin(i * 0.8)} y2={i * 25 + 10} stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="2,2" />
          </g>
        ))}
      </svg>
    </div>
  </div>
);

export default AnimatedBackground;
