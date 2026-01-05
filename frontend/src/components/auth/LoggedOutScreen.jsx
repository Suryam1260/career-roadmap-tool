import React, { useEffect, useState } from 'react';
import { WarningCircle } from 'phosphor-react';

const REDIRECT_DELAY_SECONDS = 3;

/**
 * Screen shown when user is logged out
 * Matches the project's design system (Plus Jakarta Sans, #B30158 primary, sharp corners)
 * Includes auto-redirect countdown and manual retry button
 */
export function LoggedOutScreen({ 
  onRetry, 
  autoRedirect = true,
  redirectDelay = REDIRECT_DELAY_SECONDS,
  title = 'Session Expired',
  message = 'Your session has expired or you are not logged in. Please sign in to continue.'
}) {
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    if (!autoRedirect || !onRetry) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, onRetry]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto px-8">
        {/* Card */}
        <div className="w-full bg-white border border-slate-200 rounded-none p-8 text-center shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-none flex items-center justify-center mx-auto mb-6">
            <WarningCircle size={32} weight="bold" className="text-red-500" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            {title}
          </h1>
          
          {/* Message */}
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Countdown */}
          {autoRedirect && countdown > 0 && (
            <p className="text-sm text-slate-500 mb-6">
              Redirecting to sign in in{' '}
              <span className="font-semibold text-[#B30158]">{countdown}</span>
              {' '}seconds...
            </p>
          )}
          
          {/* Button */}
          <button
            onClick={onRetry}
            className="w-full bg-[#B30158] text-white rounded-none py-3.5 px-6 text-base font-medium cursor-pointer transition-all duration-200 hover:bg-[#8B0044] hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoggedOutScreen;
