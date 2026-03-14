import { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isTokenExpired } from '../utils/jwtHelpers';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

// Demo users for frontend-only mode (no backend required)
const DEMO_USERS = {
  'patient@health.com': { id: '1', name: 'Sarah Johnson', email: 'patient@health.com', role: ROLES.PATIENT, avatar: null },
  'doctor@health.com': { id: '2', name: 'Dr. Michael Chen', email: 'doctor@health.com', role: ROLES.DOCTOR, avatar: null },
  'admin@health.com': { id: '3', name: 'Admin User', email: 'admin@health.com', role: ROLES.ADMIN, avatar: null },
};

const DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.demo';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      const stored = getStoredUser();
      if (stored) setUser(stored);
    } else {
      removeToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, _password) => {
    // In production, this would call authApi.login
    // For demo, we simulate authentication
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser) {
      setToken(DEMO_TOKEN);
      setStoredUser(demoUser);
      setUser(demoUser);
      return { user: demoUser, requiresMfa: false };
    }
    throw new Error('Invalid credentials. Try: patient@health.com, doctor@health.com, or admin@health.com');
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const isAuthenticated = !!user && !!getToken();
  const isAdmin = user?.role === ROLES.ADMIN;
  const isDoctor = user?.role === ROLES.DOCTOR;
  const isPatient = user?.role === ROLES.PATIENT;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isDoctor,
      isPatient,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
