import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Play, ChevronDown } from 'lucide-react';

// Medical/healthcare background video clips (Mixkit free license)
const VIDEO_CLIPS = [
  '/videos/med_26552.mp4',
  '/videos/med_26549.mp4',
  '/videos/med_26551.mp4',
  '/videos/med_4800.mp4',
  '/videos/med_4791.mp4',
  '/videos/med_4787.mp4',
];

const HeroVideoBackground = () => {
  const videoRef = useRef(null);
  const [clipIndex, setClipIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Cycle to next clip when current one ends
  const handleEnded = () => {
    setClipIndex(prev => (prev + 1) % VIDEO_CLIPS.length);
  };

  // When clip index changes, load & play the new clip
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.src = VIDEO_CLIPS[clipIndex];
    vid.load();
    vid.play().catch(() => {}); // graceful fail if autoplay blocked
  }, [clipIndex]);

  return (
    <>
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        src={VIDEO_CLIPS[0]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        onCanPlay={() => setLoaded(true)}
        style={{ zIndex: 0 }}
      />

      {/* Multi-layer dark overlay so text always stays readable */}
      {/* Layer 1: Base dark tint */}
      <div className="absolute inset-0 bg-surface-900/60" style={{ zIndex: 1 }} />
      {/* Layer 2: Brand gradient on top to keep the primary color identity */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-900/70 via-primary-900/50 to-primary-800/40" style={{ zIndex: 2 }} />
      {/* Layer 3: Left-side strong fade so the left content text is crystal clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-900/80 via-surface-900/40 to-transparent" style={{ zIndex: 3 }} />
      {/* Layer 4: Bottom fade for ECG line area */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-900/80 to-transparent" style={{ zIndex: 4 }} />
      {/* Layer 5: Top fade for navbar readability */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-surface-900/60 to-transparent" style={{ zIndex: 4 }} />

      {/* Radial accent overlays (kept from original design) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.12),transparent_50%)]" style={{ zIndex: 5 }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.08),transparent_50%)]" style={{ zIndex: 5 }} />
    </>
  );
};

const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-surface-900">

    {/* === VIDEO BACKGROUND === */}
    <HeroVideoBackground />

    {/* Decorative circles (above video, below content) */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full" style={{ zIndex: 6 }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.04] rounded-full" style={{ zIndex: 6 }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.05] rounded-full" style={{ zIndex: 6 }} />

    {/* ECG line */}
    <svg className="absolute bottom-32 left-0 w-full h-16 opacity-[0.10]" viewBox="0 0 1600 60" fill="none" style={{ zIndex: 6 }}>
      <path className="ecg-line" d="M0 30 L300 30 L340 30 L360 8 L380 52 L400 5 L420 55 L440 25 L460 35 L500 30 L800 30 L840 30 L860 8 L880 52 L900 5 L920 55 L940 25 L960 35 L1000 30 L1300 30 L1340 30 L1360 8 L1380 52 L1400 5 L1420 55 L1440 25 L1460 35 L1500 30 L1600 30" stroke="white" strokeWidth="2" />
    </svg>

    {/* === MAIN CONTENT (z-10 ensures above all overlays) === */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-primary-200 font-medium">Trusted by 5,000+ Healthcare Professionals</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            Revolutionize{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
                Healthcare
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8 Q75 2 150 8 Q225 14 298 6" stroke="url(#hero-underline)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="hero-underline" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#6EE7B7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            Management
          </h1>

          <p className="text-lg sm:text-xl text-primary-100/80 mb-8 max-w-xl leading-relaxed">
            HealthConnect is an all-in-one platform that seamlessly connects patients, doctors,
            and administrators with smart scheduling, real-time chat, treatment tracking,
            and HIPAA-compliant security.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-primary-700 font-bold text-base shadow-2xl shadow-black/20 hover:shadow-primary-500/30 hover:scale-[1.02] transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/20 text-white font-semibold text-base hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400'].map((bg, i) => (
                <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold`}>
                  {['Dr', 'Pt', 'Dr', 'Ad', 'Pt'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-primary-200/70">4.9/5 from 2,000+ reviews</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/20 to-green-500/20 rounded-3xl blur-2xl" />
            <img
              src="/images/landing/hero-doctor.png"
              alt="Doctor using HealthConnect"
              className="relative w-full rounded-3xl shadow-2xl shadow-black/30 border border-white/10"
            />
            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-1/4 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-surface-500">Appointments Today</p>
                  <p className="text-lg font-bold text-surface-900">248</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-6 bottom-1/4 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 text-lg heartbeat">👨</span>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Patient Satisfaction</p>
                  <p className="text-lg font-bold text-surface-900">98.5%</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
    >
      <a href="#stats" className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-colors">
        <span className="text-xs font-medium">Scroll to explore</span>
        <ChevronDown className="w-5 h-5" />
      </a>
    </motion.div>
  </section>
);

export default HeroSection;
