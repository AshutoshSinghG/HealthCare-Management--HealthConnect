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
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="you@hospital.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div>
        <div className="relative">
          <Input
            label="Password"
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

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-surface-500">Demo Credentials</span>
        </div>
      </div>

      <div className="bg-surface-50 rounded-xl p-3 space-y-1.5">
        <p className="text-xs font-medium text-surface-600">Try these accounts:</p>
        <div className="space-y-1 text-xs text-surface-500">
          <p><span className="font-mono bg-surface-100 px-1.5 py-0.5 rounded">patient@health.com</span> — Patient Portal</p>
          <p><span className="font-mono bg-surface-100 px-1.5 py-0.5 rounded">doctor@health.com</span> — Doctor Portal</p>
          <p><span className="font-mono bg-surface-100 px-1.5 py-0.5 rounded">admin@health.com</span> — Admin Portal</p>
          <p className="text-surface-400 mt-1">Any password works</p>
        </div>
      </div>

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
