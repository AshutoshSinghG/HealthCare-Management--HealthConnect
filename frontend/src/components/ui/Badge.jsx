const variants = {
  success: 'bg-success-50 text-success-600 border border-success-200',
  warning: 'bg-warning-50 text-warning-600 border border-warning-200',
  danger: 'bg-danger-50 text-danger-600 border border-danger-200',
  info: 'bg-primary-50 text-primary-600 border border-primary-200',
  default: 'bg-surface-100 text-surface-600 border border-surface-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const Badge = ({ children, variant = 'default', size = 'md', dot = false, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-success-500' :
          variant === 'warning' ? 'bg-warning-500' :
          variant === 'danger' ? 'bg-danger-500' :
          variant === 'info' ? 'bg-primary-500' :
          'bg-surface-400'
        }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
