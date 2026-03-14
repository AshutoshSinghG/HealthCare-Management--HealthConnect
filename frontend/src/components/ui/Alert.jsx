import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-success-50 border-success-200 text-success-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  error: 'bg-danger-50 border-danger-200 text-danger-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
};

const iconStyles = {
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-danger-500',
  info: 'text-primary-500',
};

const Alert = ({ type = 'info', title, message, dismissible = false, className = '' }) => {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className={`flex items-start gap-3 p-4 rounded-xl border ${styles[type]} ${className}`}
        >
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconStyles[type]}`} />
          <div className="flex-1 min-w-0">
            {title && <p className="font-semibold text-sm">{title}</p>}
            {message && <p className="text-sm opacity-90 mt-0.5">{message}</p>}
          </div>
          {dismissible && (
            <button onClick={() => setVisible(false)} className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
