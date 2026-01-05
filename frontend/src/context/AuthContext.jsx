import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest, generateJWT } from '../utils/api';
import { addMeta } from '../utils/dom';

/**
 * Auth Context - Manages authentication state globally
 * 
 * Provides:
 * - loading: boolean - Whether auth data is being fetched
 * - error: Error|null - Any error that occurred during fetch
 * - isLoggedIn: boolean - Whether user is authenticated
 * - isPhoneVerified: boolean - Whether user's phone is verified
 * - userData: Object|null - User attributes from API
 * - refetch: Function - Manually trigger a refetch
 */

const AuthContext = createContext(null);

const SIGN_IN_URL = '/users/sign_in/mobile';

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    isLoggedIn: false,
    isPhoneVerified: false,
    userData: null
  });
  
  const fetchedRef = useRef(false);

  const fetchAuthData = useCallback(async () => {
    // Prevent duplicate fetches
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Step 1: Get CSRF token
      const csrfResponse = await apiRequest('GET', '/csrf-token');
      const csrfToken = csrfResponse?.csrf_token;
      
      if (csrfToken) {
        addMeta('csrf-token', csrfToken);
      }
      
      // Step 2: Generate JWT token
      const token = await generateJWT();
      
      if (!token) {
        throw new Error('Failed to generate JWT token');
      }
      
      // Step 3: Fetch user data
      const response = await apiRequest(
        'GET',
        '/api/v3/users',
        null,
        {
          headers: {
            'X-User-Token': token
          }
        }
      );
      
      const attributes = response?.data?.attributes;
      
      setState({
        loading: false,
        error: null,
        isLoggedIn: true,
        isPhoneVerified: Boolean(attributes?.phone_verified),
        userData: attributes ?? null
      });
    } catch (error) {
      console.error('Error fetching auth data:', error);
      
      setState({
        loading: false,
        error,
        isLoggedIn: false,
        isPhoneVerified: false,
        userData: null
      });
    }
  }, []);

  const refetch = useCallback(() => {
    fetchedRef.current = false;
    fetchAuthData();
  }, [fetchAuthData]);

  const redirectToSignIn = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(`${window.location.origin}${SIGN_IN_URL}`);
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    fetchAuthData();
  }, [fetchAuthData]);

  const value = {
    ...state,
    refetch,
    redirectToSignIn,
    signInUrl: SIGN_IN_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * @returns {Object} Auth state and methods
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
