import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/ui/Loader';

const RoleRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboards = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboards[user?.role] || '/login'} replace />;
  }

  return children;
};

export default RoleRoute;
