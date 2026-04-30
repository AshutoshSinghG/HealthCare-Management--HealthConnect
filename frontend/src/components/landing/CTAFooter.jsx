import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Mail, Phone, MapPin, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Dashboards', 'Security', 'Pricing', 'Changelog'],
  Resources: ['Documentation', 'API Reference', 'Help Center', 'Blog', 'Status'],
  Company: ['About Us', 'Careers', 'Contact', 'Partners', 'Press'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Notice'],
};

const CTAFooter = () => (
  <>
    {/* CTA Banner */}
    <section className="relative z-10 py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 animated-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),transparent_60%)]" />
          
          {/* ECG decoration */}
          <svg className="absolute bottom-6 left-0 w-full h-12 opacity-10" viewBox="0 0 800 40" fill="none">
            <path d="M0 20 L150 20 L180 5 L200 35 L220 8 L240 32 L260 20 L800 20" stroke="white" strokeWidth="1.5" />
          </svg>

          <div className="relative z-10 text-center py-16 lg:py-20 px-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Ready to Transform Your Healthcare?
            </h2>
            <p className="text-lg text-primary-100/80 max-w-xl mx-auto mb-8">
              Join thousands of healthcare professionals and patients who trust HealthConnect for better health management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-base shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold text-base hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="relative z-10 bg-surface-900 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column - spans 2 */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Health<span className="text-primary-400">Connect</span></span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed mb-6 max-w-xs">
              A comprehensive healthcare management platform connecting patients, doctors, and administrators for better health outcomes.
            </p>
            <div className="space-y-2">
              <a href="mailto:support@healthconnect.app" className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4" /> support@healthconnect.app
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4" /> +91 123 456 7890
              </a>
              <p className="flex items-center gap-2 text-sm text-surface-400">
                <MapPin className="w-4 h-4" /> India
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} HealthConnect. All rights reserved. Built with ❤️ for better healthcare.
          </p>
          <div className="flex items-center gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-surface-800 flex items-center justify-center text-surface-400 hover:text-primary-400 hover:bg-surface-700 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default CTAFooter;
