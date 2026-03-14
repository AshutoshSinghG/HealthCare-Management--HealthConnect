import MFAForm from '../../components/auth/MFAForm';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MfaPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (code) => {
    setLoading(true);
    try {
      // In production: await verifyMfa({ code })
      toast.success('Verification successful!');
      navigate('/patient/dashboard');
    } catch {
      toast.error('Invalid code. Please try again.');
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
          <MFAForm onSubmit={handleVerify} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default MfaPage;
