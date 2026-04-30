import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'support@healthconnect.app', href: 'mailto:support@healthconnect.app', desc: 'For general inquiries and support' },
  { icon: Phone, label: 'Call Us', value: '+91 123 456 7890', href: 'tel:+911234567890', desc: 'Mon–Fri, 9 AM – 6 PM IST' },
  { icon: MapPin, label: 'Visit Us', value: 'Bangalore, Karnataka, India', href: null, desc: 'Our headquarters' },
  { icon: Clock, label: 'Business Hours', value: 'Mon – Fri, 9:00 AM – 6:00 PM IST', href: null, desc: 'We respond within 24 hours' },
];

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <StaticPageLayout title="Contact Us" subtitle="Have questions? We'd love to hear from you. Reach out and we'll respond promptly.">
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-5">
          {contactInfo.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-surface-100 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <c.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-surface-900 text-sm">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-primary-600 font-medium text-sm hover:underline">{c.value}</a>
                  ) : (
                    <p className="text-surface-700 text-sm font-medium">{c.value}</p>
                  )}
                  <p className="text-xs text-surface-400 mt-0.5">{c.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <MessageCircle className="w-8 h-8 text-white/80 mb-3" />
            <h3 className="font-bold mb-2">Need Immediate Help?</h3>
            <p className="text-primary-100/80 text-sm leading-relaxed mb-3">
              For urgent support issues, contact our priority support line or use the in-app chat when you're logged in.
            </p>
            <a href="mailto:urgent@healthconnect.app" className="text-sm font-semibold text-white underline underline-offset-4">
              urgent@healthconnect.app
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-8 border border-surface-100 shadow-sm">
            <h2 className="text-xl font-bold text-surface-900 mb-1">Send Us a Message</h2>
            <p className="text-sm text-surface-500 mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-surface-900 mb-2">Message Sent!</h3>
                <p className="text-surface-500">Thank you for reaching out. We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Full Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5">Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">Subject *</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
                  <Send className="w-5 h-5" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default ContactPage;
