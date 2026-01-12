import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import LoadingScreen from './LoadingScreen';
import LoggedOutScreen from './LoggedOutScreen';

/**
 * AuthGate - Wraps children and handles authentication state
 * 
 * - Shows LoadingScreen while auth is being checked
 * - Shows LoggedOutScreen with inline auth forms if user is not logged in
 * - Renders children only when user is authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render when authenticated
 * @param {string} props.loadingMessage - Custom loading message
 * @param {string} props.loadingSubtitle - Custom loading subtitle
 * @param {string} props.initialAuthMode - Initial auth mode ('login' or 'signup')
 */
export function AuthGate({ 
  children, 
  loadingMessage = 'Loading...',
  loadingSubtitle = 'Please wait while we verify your session',
  initialAuthMode = 'login'
}) {
  const { 
    loading, 
    error, 
    isLoggedIn
  } = useAuthContext();

  // Show loading screen while fetching auth data
  if (loading) {
    return (
      <LoadingScreen 
        message={loadingMessage}
        subtitle={loadingSubtitle}
      />
    );
  }

  // Show logged out screen with auth forms on error or when not logged in
  if (error || !isLoggedIn) {
    return (
      <LoggedOutScreen 
        initialMode={initialAuthMode}
      />
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default AuthGate;
