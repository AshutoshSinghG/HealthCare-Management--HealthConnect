import { useState } from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // In production: await forgotPassword(data.email)
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to send reset email. Please try again.'));
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
          <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} sent={sent} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
