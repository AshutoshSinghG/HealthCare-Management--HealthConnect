import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ResetPasswordForm = ({ onSubmit, loading, success }) => {
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-success-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900">Password Updated</h3>
        <p className="text-sm text-surface-500">Your password has been reset successfully.</p>
        <Link to="/login" className="inline-block">
          <Button size="lg">Continue to Login</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-surface-900">Reset Password</h2>
        <p className="text-sm text-surface-500">Create a new secure password</p>
      </div>

      <div className="relative">
        <Input
          label="New Password"
          type={showP ? 'text' : 'password'}
          icon={Lock}
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <button type="button" onClick={() => setShowP(!showP)} className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600">
          {showP ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showC ? 'text' : 'password'}
          icon={Lock}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button type="button" onClick={() => setShowC(!showC)} className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600">
          {showC ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Reset Password
      </Button>
    </motion.form>
  );
};

export default ResetPasswordForm;
