import React from 'react';

/**
 * Loading screen shown while authentication is being checked
 * Matches the project's design system (Plus Jakarta Sans, #B30158 primary, sharp corners)
 */
export function LoadingScreen({ 
  message = 'Verifying your session...', 
  subtitle = 'Please wait a moment' 
}) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center w-full max-w-[700px] mx-auto px-8">
        {/* Loading Icon and Text */}
        <div className="flex flex-col items-center gap-4 mb-10 animate-pulse">
          <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center text-[#B30158]">
            <svg 
              className="w-7 h-7 animate-spin"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeOpacity="0.25"
              />
              <path 
                d="M12 2a10 10 0 0 1 10 10" 
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-900 mb-1.5">
              {message}
            </div>
            <div className="text-sm text-slate-600">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[500px] h-2 bg-slate-200 rounded-none overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B30158] to-[#E91E63] animate-loading-bar"
            style={{ 
              animation: 'loading-bar 1.5s ease-in-out infinite',
              width: '40%'
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
