import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User, Phone, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['PATIENT', 'DOCTOR'], { required_error: 'Please select a role' }),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms' }) }),
  // Patient-specific
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  // Doctor-specific
  specialisation: z.string().optional(),
  registrationNumber: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine(data => {
  if (data.role === 'PATIENT') return !!data.dateOfBirth;
  return true;
}, {
  message: 'Date of birth is required',
  path: ['dateOfBirth'],
}).refine(data => {
  if (data.role === 'PATIENT') return !!data.gender;
  return true;
}, {
  message: 'Gender is required',
  path: ['gender'],
}).refine(data => {
  if (data.role === 'DOCTOR') return !!data.specialisation;
  return true;
}, {
  message: 'Specialisation is required',
  path: ['specialisation'],
}).refine(data => {
  if (data.role === 'DOCTOR') return !!data.registrationNumber;
  return true;
}, {
  message: 'Registration number is required',
  path: ['registrationNumber'],
});

const SignupForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '', email: '', phone: '', password: '', confirmPassword: '',
      role: 'PATIENT', agreeTerms: false,
      dateOfBirth: '', gender: '', specialisation: '', registrationNumber: '',
    },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Input
        label="Full Name"
        type="text"
        icon={User}
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email Address"
        type="email"
        icon={Mail}
        placeholder="you@hospital.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone Number"
        type="tel"
        icon={Phone}
        placeholder="+1 (555) 000-0000"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-surface-700">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative">
            <input type="radio" value="PATIENT" {...register('role')} className="peer sr-only" />
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-surface-200 rounded-xl text-sm font-medium text-surface-600 cursor-pointer transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 hover:border-surface-300">
              <User className="w-4 h-4" />
              Patient
            </div>
          </label>
          <label className="relative">
            <input type="radio" value="DOCTOR" {...register('role')} className="peer sr-only" />
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-surface-200 rounded-xl text-sm font-medium text-surface-600 cursor-pointer transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 hover:border-surface-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
              Doctor
            </div>
          </label>
        </div>
        {errors.role && <p className="text-xs text-danger-500">{errors.role.message}</p>}
      </div>

      {/* Patient-specific fields */}
      {selectedRole === 'PATIENT' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Input
            label="Date of Birth"
            type="date"
            icon={Calendar}
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="relative">
                  <input type="radio" value={g} {...register('gender')} className="peer sr-only" />
                  <div className="flex items-center justify-center px-3 py-2 border-2 border-surface-200 rounded-xl text-sm font-medium text-surface-600 cursor-pointer transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 hover:border-surface-300">
                    {g}
                  </div>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-danger-500">{errors.gender.message}</p>}
          </div>
        </motion.div>
      )}

      {/* Doctor-specific fields */}
      {selectedRole === 'DOCTOR' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Input
            label="Specialisation"
            type="text"
            placeholder="e.g. General Medicine, Cardiology"
            error={errors.specialisation?.message}
            {...register('specialisation')}
          />
          <Input
            label="Registration Number"
            type="text"
            placeholder="Medical license/registration number"
            error={errors.registrationNumber?.message}
            {...register('registrationNumber')}
          />
        </motion.div>
      )}

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="At least 8 characters"
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

      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          icon={Lock}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
        >
          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" {...register('agreeTerms')} className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
        <span className="text-sm text-surface-600">
          I agree to the{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-700">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="font-medium text-primary-600 hover:text-primary-700">Privacy Policy</a>
        </span>
      </label>
      {errors.agreeTerms && <p className="text-xs text-danger-500">{errors.agreeTerms.message}</p>}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Account
      </Button>

      <p className="text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Sign In
        </Link>
      </p>
    </motion.form>
  );
};

export default SignupForm;
