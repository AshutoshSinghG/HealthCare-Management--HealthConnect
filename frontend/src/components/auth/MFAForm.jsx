import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ShieldCheck } from 'lucide-react';

const MFAForm = ({ onSubmit, loading }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c) && index === 5) {
      onSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-surface-900">Two-Factor Authentication</h2>
        <p className="text-sm text-surface-500 mt-2">Enter the 6-digit code from your authenticator app</p>
      </div>

      <div className="flex justify-center gap-3">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-surface-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />
        ))}
      </div>

      <Button
        loading={loading}
        className="w-full"
        size="lg"
        onClick={() => onSubmit(code.join(''))}
        disabled={!code.every(c => c)}
      >
        Verify Code
      </Button>

      <p className="text-sm text-surface-500">
        Didn't receive a code?{' '}
        <button className="font-medium text-primary-600 hover:text-primary-700">Resend</button>
      </p>
    </motion.div>
  );
};

export default MFAForm;
