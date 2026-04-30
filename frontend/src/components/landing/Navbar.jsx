import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Dashboards', href: '#dashboards' },
  { label: 'Security', href: '#security' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Testimonials', href: '#testimonials' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'navbar-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#hero" onClick={() => handleClick('#hero')} className="flex items-center gap-2.5 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              scrolled ? 'bg-gradient-to-br from-primary-600 to-primary-500' : 'bg-white/10 backdrop-blur-sm'
            }`}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-surface-900' : 'text-white'
            }`}>
              Health<span className={scrolled ? 'text-primary-600' : 'text-primary-200'}>Connect</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? scrolled ? 'text-primary-600 bg-primary-50' : 'text-white bg-white/15'
                    : scrolled ? 'text-surface-600 hover:text-primary-600 hover:bg-primary-50/50' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'text-primary-600 hover:bg-primary-50 border border-primary-200'
                  : 'text-white hover:bg-white/10 border border-white/20'
              }`}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
                  : 'bg-white text-primary-700 hover:bg-white/90 shadow-lg shadow-black/10'
              }`}
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-xl ${scrolled ? 'text-surface-700' : 'text-white'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-t border-surface-100 shadow-xl"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className="block w-full text-left px-4 py-3 rounded-xl text-surface-700 hover:bg-primary-50 hover:text-primary-600 text-sm font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-surface-100 space-y-2">
              <Link to="/login" className="block w-full text-center px-4 py-3 rounded-xl border border-primary-200 text-primary-600 font-semibold text-sm">
                Log In
              </Link>
              <Link to="/signup" className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm shadow-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
