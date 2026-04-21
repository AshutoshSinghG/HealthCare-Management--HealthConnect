import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        label={
          <>
            Email Address <span className="text-danger-500">*</span>
          </>
        }
        type="email"
        icon={Mail}
        placeholder="you@hospital.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <div className="relative">
          <Input
            label={
              <>
                Password <span className="text-danger-500">*</span>
              </>
            }
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
          <span className="text-sm text-surface-600">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Forgot password?
        </a>
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Sign In
      </Button>


      <p className="text-center text-sm text-surface-500 mt-4">
        Don't have an account?{' '}
        <a href="/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Sign Up
        </a>
      </p>

    </motion.form>
  );
};

export default LoginForm;
