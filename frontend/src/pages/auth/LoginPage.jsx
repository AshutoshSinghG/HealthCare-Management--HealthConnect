import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Heart, Shield, Users, Stethoscope, ClipboardList } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { ROLES } from '../../utils/constants';
import { extractErrorMessage } from '../../utils/errorUtils';

const features = [
  { icon: Heart, label: 'Patient Care', desc: 'Comprehensive patient management' },
  { icon: Shield, label: 'Data Security', desc: 'HIPAA-compliant data protection' },
  { icon: ClipboardList, label: 'Treatment Tracking', desc: 'Full treatment history & records' },
  { icon: Users, label: 'Multi-Role Access', desc: 'Patient, Doctor & Admin portals' },
];

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      toast.success(`Welcome back, ${result.user.name}!`);
      const dashboards = {
        [ROLES.PATIENT]: '/patient/dashboard',
        [ROLES.DOCTOR]: '/doctor/dashboard',
        [ROLES.ADMIN]: '/admin/dashboard',
      };
      navigate(dashboards[result.user.role] || '/patient/dashboard');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Login failed. Please try again.'));
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
              Modern Healthcare<br />
              <span className="text-primary-200">Management System</span>
            </h1>
            <p className="text-lg text-primary-100/80 mb-10 max-w-md leading-relaxed">
              Streamline your hospital operations with our comprehensive platform for patient care, treatment tracking, and administrative management.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <feat.icon className="w-5 h-5 text-primary-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{feat.label}</p>
                    <p className="text-xs text-primary-200/70">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
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
            <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome Back</h2>
            <p className="text-surface-500 mb-8">Sign in to your healthcare portal</p>
          </motion.div>

          <LoginForm onSubmit={handleLogin} loading={loading} />

            <p className="mt-6 text-sm text-surface-500 leading-relaxed">
              <strong> You can use a demo account to explore the application. </strong> </p>
              
              <p className="text-sm text-surface-500 leading-relaxed">🔑 patient@gmail.com for Patient </p> <p
              className="text-sm text-surface-500 leading-relaxed">🔑 doctor@gmail.com for Doctor </p><p
              className="text-sm text-surface-500 leading-relaxed">🔑 admin@gmail.com for Admin </p><p className="text-sm text-surface-500 leading-relaxed">Password is "Test@123" for all.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
