/**
 * FLOATING CTA BUTTON
 * Fixed button at bottom for career consultation booking
 */

import React from 'react';
import { Phone } from 'phosphor-react';
import { useRequestCallback } from '@/context/RequestCallbackContext';
import tracker from '@/utils/tracker';

const FloatingCTA = () => {
  const { open } = useRequestCallback();
  
  const handleClick = () => {
    tracker.click({
      click_type: 'book_career_call_click',
      custom: {
        source: 'floating-cta',
        button_title: 'Book a Free Career Call'
      }
    });
    open({ source: 'floating-cta' });
  };
  
  return (
    <button
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#B30158] hover:bg-[#8A0145] text-white font-bold transition-all duration-200 z-50 uppercase tracking-wide flex items-center justify-center gap-2.5 md:px-6 md:py-3 md:text-sm px-0"
      style={{
        boxShadow: '0 4px 14px 0 rgba(179, 1, 88, 0.39)',
        borderRadius: '0px',
        width: 'auto'
      }}
      onClick={handleClick}
    >
      {/* Mobile: Square icon-only button */}
      <div className="md:hidden flex items-center justify-center" style={{ width: '56px', height: '56px' }}>
        <Phone size={24} weight="fill" className="flex-shrink-0" />
      </div>

      {/* Desktop: Full text button */}
      <span className="whitespace-nowrap hidden md:flex md:items-center md:gap-2.5" style={{ letterSpacing: '0.8px' }}>
        <Phone size={20} weight="fill" className="flex-shrink-0" />
        Book a Free Career Call
      </span>
    </button>
  );
};

export default FloatingCTA;
