import { useState } from 'react';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // In production: await resetPassword({ ...data, token: searchParams.get('token') })
      await new Promise(r => setTimeout(r, 1000));
      setSuccess(true);
      toast.success('Password updated!');
    } catch {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 medical-bg p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900">Health<span className="text-primary-600">Connect</span></span>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-surface-200/60 p-8">
          <ResetPasswordForm onSubmit={handleSubmit} loading={loading} success={success} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
