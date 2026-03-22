import { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser, isTokenExpired, decodeToken } from '../utils/jwtHelpers';
import * as authApi from '../api/authApi';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

const REFRESH_TOKEN_KEY = 'healthconnect_refresh_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // Restore session from stored tokens
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      const refreshTokenStr = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (token && !isTokenExpired(token)) {
        const stored = getStoredUser();
        if (stored) {
          setUser(stored);
        }
      } else if (refreshTokenStr) {
        // Try to refresh the token
        try {
          const result = await authApi.refreshToken(refreshTokenStr);
          setToken(result.accessToken);
          const decoded = decodeToken(result.accessToken);
          if (decoded) {
            const stored = getStoredUser();
            if (stored) setUser(stored);
          }
        } catch {
          // Refresh failed, clear everything
          removeToken();
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          setUser(null);
        }
      } else {
        removeToken();
        setUser(null);
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });

    if (result.mfaRequired) {
      return { requiresMfa: true, tempToken: result.tempToken };
    }

    // Store tokens
    setToken(result.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);

    const userData = {
      id: result.user._id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.email, // Will be updated once profile is loaded
    };
    setStoredUser(userData);
    setUser(userData);

    return { user: userData, requiresMfa: false };
  }, []);

  const verifyMfa = useCallback(async (tempToken, otpCode) => {
    const result = await authApi.verifyMfa({ tempToken, token: otpCode });

    setToken(result.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);

    const userData = {
      id: result.user._id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.email,
    };
    setStoredUser(userData);
    setUser(userData);

    return { user: userData };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    removeToken();
    localStorage.removeItem(REFRESH_TOKEN_KEY);
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
      verifyMfa,
      isAuthenticated,
      isAdmin,
      isDoctor,
      isPatient,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
