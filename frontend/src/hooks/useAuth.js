import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest, generateJWT } from '../utils/api';
import { addMeta } from '../utils/dom';

/**
 * Custom hook for authentication state management
 * Fetches user data and manages logged-in state
 * 
 * @returns {Object} Auth state and methods
 * - loading: boolean - Whether auth data is being fetched
 * - error: Error|null - Any error that occurred during fetch
 * - isLoggedIn: boolean - Whether user is authenticated
 * - isPhoneVerified: boolean - Whether user's phone is verified
 * - userData: Object|null - User attributes from API
 * - refetch: Function - Manually trigger a refetch
 */
export function useAuth() {
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

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    fetchAuthData();
  }, [fetchAuthData]);

  return {
    ...state,
    refetch
  };
}

export default useAuth;

