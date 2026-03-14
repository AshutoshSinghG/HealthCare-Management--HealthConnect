import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordForm = ({ onSubmit, loading, sent }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-success-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900">Check Your Email</h3>
        <p className="text-sm text-surface-500">We've sent password reset instructions to your email address.</p>
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
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
        <h2 className="text-xl font-bold text-surface-900">Forgot Password?</h2>
        <p className="text-sm text-surface-500">Enter your email and we'll send you reset instructions</p>
      </div>
      <Input
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="you@hospital.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Send Reset Link
      </Button>
      <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </motion.form>
  );
};

export default ForgotPasswordForm;
