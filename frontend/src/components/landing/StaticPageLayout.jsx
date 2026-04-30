import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const StaticPageLayout = ({ children, title, subtitle }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-surface-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900">
                Health<span className="text-primary-600">Connect</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-surface-500 hover:text-primary-600 transition-colors font-medium">Home</Link>
              <Link to="/about" className="text-sm text-surface-500 hover:text-primary-600 transition-colors font-medium">About</Link>
              <Link to="/contact" className="text-sm text-surface-500 hover:text-primary-600 transition-colors font-medium">Contact</Link>
              <Link to="/careers" className="text-sm text-surface-500 hover:text-primary-600 transition-colors font-medium">Careers</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <Link to="/login" className="hidden sm:inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-surface-900 via-primary-900 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),transparent_50%)]" />
        <svg className="absolute bottom-0 left-0 w-full h-12 opacity-[0.06]" viewBox="0 0 1600 50" fill="none">
          <path d="M0 25 L300 25 L340 8 L360 42 L380 5 L400 45 L420 20 L440 30 L480 25 L800 25 L840 8 L860 42 L880 5 L900 45 L920 20 L940 30 L980 25 L1600 25" stroke="white" strokeWidth="1.5" />
        </svg>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-primary-100/70 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-900 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Health<span className="text-primary-400">Connect</span></span>
              </Link>
              <p className="text-surface-400 text-sm leading-relaxed mb-4 max-w-xs">
                Comprehensive healthcare management for patients, doctors, and administrators.
              </p>
              <div className="space-y-1.5 text-sm text-surface-400">
                <a href="mailto:support@healthconnect.app" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><Mail className="w-3.5 h-3.5" /> support@healthconnect.app</a>
                <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><Phone className="w-3.5 h-3.5" /> +91 123 456 7890</a>
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> India</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                {[['About Us', '/about'], ['Careers', '/careers'], ['Contact', '/contact'], ['Partners', '/partners'], ['Press', '/press']].map(([label, to]) => (
                  <li key={to}><Link to={to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                {[['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service'], ['Cookie Policy', '/cookie-policy'], ['HIPAA Notice', '/hipaa-notice']].map(([label, to]) => (
                  <li key={to}><Link to={to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Dashboards', 'Security'].map(label => (
                  <li key={label}><Link to="/" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-surface-500">© {new Date().getFullYear()} HealthConnect. All rights reserved.</p>
            <div className="flex items-center gap-2.5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:bg-surface-700 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaticPageLayout;
