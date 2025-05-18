import { useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'scholario_auth';
const DEFAULT_CODE = 'emp001';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Simplified authentication hook that works without Electron API
 */
export function useAuth() {
  // Initialize auth state from localStorage
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    return {
      isAuthenticated: storedAuth === 'true',
      isLoading: false
    };
  });

  // Login function - simple code check
  const login = useCallback((code: string) => {
    if (code === DEFAULT_CODE) {
      setAuthState({ isAuthenticated: true, isLoading: false });
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      return true;
    } else {
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, isLoading: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    
    // For extra security, clear all storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      // Silently handle any errors
    }
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    error: null,
    isError: false,
  };
}

export default useAuth; 