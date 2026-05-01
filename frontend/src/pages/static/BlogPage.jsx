import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rss, Calendar, User, Clock, ArrowRight, Tag, Search, BookOpen } from 'lucide-react';
import StaticPageLayout from '../../components/landing/StaticPageLayout';

const posts = [
  {
    title: 'How HealthConnect Handles Cross-Midnight Appointment Scheduling',
    excerpt: 'A deep dive into how we solved one of the trickiest scheduling problems — accurately generating time slots for shifts that span past midnight.',
    category: 'Engineering',
    author: 'Dev Team',
    date: 'April 28, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    title: 'Why We Built Real-Time Chat for Doctor-Patient Communication',
    excerpt: 'Secure, time-bounded messaging between doctors and patients — here\'s why we chose Socket.IO and how we ensure conversations stay private and accessible only during appointments.',
    category: 'Product',
    author: 'Product Team',
    date: 'April 15, 2026',
    readTime: '6 min read',
    featured: true,
  },
  {
    title: '5 Ways HealthConnect Keeps Your Medical Data Secure',
    excerpt: 'From bcrypt hashing to JWT authentication and comprehensive audit logs — an inside look at our multi-layered security architecture.',
    category: 'Security',
    author: 'Security Team',
    date: 'March 20, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'Understanding Role-Based Access Control in Healthcare',
    excerpt: 'How we implement RBAC to ensure patients, doctors, and administrators only see what they\'re authorized to see — and why it matters for HIPAA compliance.',
    category: 'Security',
    author: 'Dev Team',
    date: 'March 5, 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'The Complete Guide to Patient Medical Record Export',
    excerpt: 'Empowering patients with data portability — how our export feature lets you download your complete health history for insurance, referrals, or personal records.',
    category: 'Feature Guide',
    author: 'Product Team',
    date: 'February 18, 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    title: 'Building a Scalable Admin Dashboard with React and Node.js',
    excerpt: 'Lessons learned from building our admin portal — audit logs, user management, analytics, and real-time security monitoring at scale.',
    category: 'Engineering',
    author: 'Dev Team',
    date: 'February 1, 2026',
    readTime: '10 min read',
    featured: false,
  },
  {
    title: 'Multi-Factor Authentication: Why Every Healthcare App Needs It',
    excerpt: 'A guide to our email OTP-based MFA implementation and why two-factor authentication is non-negotiable in healthcare software.',
    category: 'Security',
    author: 'Security Team',
    date: 'January 12, 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    title: 'How We Achieved 99.9% Uptime for HealthConnect',
    excerpt: 'Our infrastructure story — cloud hosting, automated backups, geographic redundancy, and the monitoring stack that keeps HealthConnect reliable.',
    category: 'Engineering',
    author: 'Dev Ops Team',
    date: 'December 20, 2025',
    readTime: '9 min read',
    featured: false,
  },
];

const categoryColors = {
  Engineering: 'bg-blue-50 text-blue-700',
  Product: 'bg-green-50 text-green-700',
  Security: 'bg-red-50 text-red-700',
  'Feature Guide': 'bg-purple-50 text-purple-700',
};

const BlogPage = () => {
  const featured = posts.filter(p => p.featured);
  const regular = posts.filter(p => !p.featured);

  return (
    <StaticPageLayout title="Blog" subtitle="Insights, engineering stories, and updates from the HealthConnect team.">
      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-surface-900 mb-6">Featured Articles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Gradient banner */}
              <div className="h-40 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="absolute bottom-4 left-6">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${categoryColors[post.category]} bg-opacity-90`}>{post.category}</span>
                </div>
                <Rss className="absolute top-4 right-4 w-6 h-6 text-white/20" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-surface-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight">{post.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  </div>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* All Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-surface-900 mb-6">All Articles</h2>
        <div className="space-y-4">
          {regular.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-6 border border-surface-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[post.category]}`}>{post.category}</span>
                    <span className="text-xs text-surface-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-surface-900 mb-1 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-surface-400 flex-shrink-0">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  <ArrowRight className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10">
        <BookOpen className="w-10 h-10 text-white/80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-3">Stay Updated</h2>
        <p className="text-primary-100/80 mb-6 max-w-lg mx-auto">Get the latest articles, product updates, and healthcare insights delivered to your inbox.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 rounded-xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm" />
          <button className="px-6 py-3.5 rounded-xl bg-white text-primary-700 font-bold shadow-xl hover:scale-[1.02] transition-transform text-sm">
            Subscribe
          </button>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default BlogPage;
