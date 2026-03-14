import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-4.5 h-4.5 text-surface-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-base ${Icon ? 'pl-10' : ''} ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
