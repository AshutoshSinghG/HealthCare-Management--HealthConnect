import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Heart, Shield, Users, Stethoscope, UserPlus, CheckCircle } from 'lucide-react';
import SignupForm from '../../components/auth/SignupForm';
import toast from 'react-hot-toast';

const benefits = [
  { icon: CheckCircle, text: 'Secure medical records management' },
  { icon: CheckCircle, text: 'Real-time treatment tracking' },
  { icon: CheckCircle, text: 'HIPAA-compliant data protection' },
  { icon: CheckCircle, text: 'Multi-role access control' },
  { icon: CheckCircle, text: 'Comprehensive health analytics' },
];

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      // In production: await authApi.register(data)
      await new Promise(r => setTimeout(r, 1200));
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-white/10 rounded-full" />

          {/* Heartbeat line SVG */}
          <svg className="absolute bottom-40 left-0 w-full h-20 opacity-10" viewBox="0 0 800 80" fill="none">
            <path d="M0 40 L150 40 L180 10 L210 70 L240 20 L270 60 L300 40 L800 40" stroke="white" strokeWidth="2" />
          </svg>

          {/* Floating medical icons */}
          <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-32 right-24">
            <Heart className="w-8 h-8 text-white/20" />
          </motion.div>
          <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-48 left-20">
            <Stethoscope className="w-10 h-10 text-white/15" />
          </motion.div>
          <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-1/3 right-1/3">
            <Shield className="w-6 h-6 text-white/20" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">HealthConnect</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Join the Future of<br />
              <span className="text-primary-200">Healthcare Management</span>
            </h1>
            <p className="text-lg text-primary-100/80 mb-10 max-w-md leading-relaxed">
              Create your account and get instant access to our comprehensive healthcare platform.
            </p>

            <div className="space-y-3">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-primary-200" />
                  </div>
                  <span className="text-sm text-primary-100/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">Health<span className="text-primary-600">Connect</span></span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-surface-900">Create Account</h2>
            </div>
            <p className="text-surface-500 mb-6">Get started with your healthcare portal</p>
          </motion.div>

          <SignupForm onSubmit={handleSignup} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
