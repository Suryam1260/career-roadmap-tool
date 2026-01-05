import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import LoadingScreen from './LoadingScreen';
import LoggedOutScreen from './LoggedOutScreen';

/**
 * AuthGate - Wraps children and handles authentication state
 * 
 * - Shows LoadingScreen while auth is being checked
 * - Shows LoggedOutScreen with auto-redirect if user is not logged in
 * - Renders children only when user is authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render when authenticated
 * @param {string} props.loadingMessage - Custom loading message
 * @param {string} props.loadingSubtitle - Custom loading subtitle
 * @param {number} props.redirectDelay - Seconds before auto-redirect (default: 3)
 */
export function AuthGate({ 
  children, 
  loadingMessage = 'Loading...',
  loadingSubtitle = 'Please wait while we verify your session',
  redirectDelay = 3
}) {
  const { 
    loading, 
    error, 
    isLoggedIn, 
    redirectToSignIn 
  } = useAuthContext();

  // Auto-redirect on error after delay
  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(() => {
      redirectToSignIn();
    }, redirectDelay * 1000);

    return () => clearTimeout(timeoutId);
  }, [error, redirectDelay, redirectToSignIn]);

  // Show loading screen while fetching auth data
  if (loading) {
    return (
      <LoadingScreen 
        message={loadingMessage}
        subtitle={loadingSubtitle}
      />
    );
  }

  // Show logged out screen on error or when not logged in
  if (error || !isLoggedIn) {
    return (
      <LoggedOutScreen 
        onRetry={redirectToSignIn}
        autoRedirect={true}
        redirectDelay={redirectDelay}
      />
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default AuthGate;

