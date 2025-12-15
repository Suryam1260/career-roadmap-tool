/**
 * CLEAN NAVBAR for roadmap-new page
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ScalerLogo from '../../assets/scaler-logo.svg';

const Navbar = () => {
  const [showCSATBanner, setShowCSATBanner] = useState(true);
  const lastScrollYRef = useRef(0);
  const lastVisibilityRef = useRef(true);

  // Initialize Tally after component mounts (in case script loaded before DOM)
  useEffect(() => {
    // Give Tally script time to load, then re-scan for embeds
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.Tally) {
        window.Tally.loadEmbeds();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll direction detection for CSAT banner
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let newVisibility;

      if (currentScrollY < 10) {
        newVisibility = true;
      } else if (currentScrollY < lastScrollYRef.current) {
        // Scrolling up - show banner
        newVisibility = true;
      } else if (currentScrollY > lastScrollYRef.current) {
        // Scrolling down - hide banner
        newVisibility = false;
      } else {
        newVisibility = lastVisibilityRef.current;
      }

      if (newVisibility !== lastVisibilityRef.current) {
        setShowCSATBanner(newVisibility);
        lastVisibilityRef.current = newVisibility;
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .csat-navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          overflow: hidden;
        }
        .csat-banner {
          transition: opacity 0.2s ease, visibility 0.2s ease;
        }
        .csat-banner:hover {
          background: #5a2e8a !important;
        }
        .main-navbar {
          transition: transform 0.3s ease;
        }
        .main-navbar.slide-up {
          transform: translateY(-48px);
        }
        @media (max-width: 768px) {
          .main-navbar.slide-up {
            transform: translateY(-76px);
          }
        }
      `}</style>
      <div className="csat-navbar-wrapper">
        {/* CSAT Banner */}
        <button
          className="csat-banner w-full flex items-center justify-center gap-3 px-4 py-3 cursor-pointer border-none md:flex-row flex-col md:gap-3 gap-1"
          style={{
            background: '#472472',
            opacity: showCSATBanner ? 1 : 0,
            visibility: showCSATBanner ? 'visible' : 'hidden',
            pointerEvents: showCSATBanner ? 'auto' : 'none',
          }}
          data-tally-open="VLGq9M"
          data-tally-layout="modal"
          data-tally-width="500"
          data-tally-hide-title="1"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
          data-tally-auto-close="0"
          data-tally-form-events-forwarding="1"
        >
          <span className="text-white text-sm font-medium">Was this roadmap helpful?</span>
          <span className="text-white text-sm font-semibold underline">Please share your feedback</span>
        </button>

        {/* Main Navbar */}
        <nav className={`main-navbar w-full bg-white border-b border-slate-200 ${!showCSATBanner ? 'slide-up' : ''}`}>
        <div className="max-w-[1440px] mx-auto px-5 lg:px-[120px]">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ScalerLogo className="h-7 w-auto" />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/quiz" className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 md:px-0 uppercase" style={{ letterSpacing: '1px' }}>
              Re-evaluate
            </Link>
            <button
              onClick={() => window.open('/callback', '_blank')}
              className="hidden lg:block px-6 py-3 bg-primary text-white font-bold text-sm rounded-none hover:bg-primary/90 transition-colors uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Book a Free Career Call
            </button>
          </div>
          </div>
        </div>
      </nav>
      </div>
    </>
  );
};

export default Navbar;
