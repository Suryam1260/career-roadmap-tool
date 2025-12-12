/**
 * FLOATING NAVIGATION BAR - Simple Clean Design
 */

import React from 'react';
import { Phone } from 'phosphor-react';

const HorizontalNavigation = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'skills', label: 'Your Skills' },
    { id: 'companies', label: 'Where to Work' },
    { id: 'learning', label: 'Learn Step-by-Step' },
    { id: 'projects', label: 'Build & Ship' }
  ];

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onSectionChange(sectionId);
    }
  };

  const handleCTA = () => {
    window.open('/callback', '_blank');
  };

  return (
    <>
      <style>{`
        .nav-bar-wrapper {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          margin-left: auto;
          margin-right: auto;
          padding-left: 5px;
          padding-right: 5px;
          max-width: calc(100% - 10px);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 0px;
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px;
        }

        @media (min-width: 1024px) {
          .nav-bar-wrapper {
            padding-left: 120px;
            padding-right: 120px;
            max-width: 1440px;
            padding: 8px;
          }
        }

        .nav-bar-container {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 0;
        }

        .nav-buttons-group {
          display: flex;
          flex: 1;
          gap: 0;
        }

        .nav-bar-container button {
          flex: 1;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          border: none;
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #4b5563;
          background: transparent;
          white-space: nowrap;
          text-align: center;
          line-height: 1.2;
        }

        .nav-bar-container button:hover {
          background: #f1f5f9;
          color: #003367;
        }

        .nav-bar-container button.active {
          background-color: #003367;
          color: #fff;
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: #e2e8f0;
          margin: 0 12px;
        }

        .nav-cta {
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          border: none;
          border-radius: 0px;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #B30158 !important;
          color: #ffffff !important;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
          line-height: 1.2;
        }

        .nav-cta:hover {
          background-color: #8A0145 !important;
          transform: translateY(-1px);
        }

        .mobile-cta {
          display: none;
        }

        @media (max-width: 1023px) {
          .nav-bar-wrapper {
            display: none;
          }

          .mobile-cta {
            display: flex;
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 50;
          }
        }
      `}</style>

      {/* FLOATING NAVIGATION BAR - Desktop Only */}
      <div className="nav-bar-wrapper">
        <div className="nav-bar-container">
          {/* Navigation Buttons - Equal Width */}
          <div className="nav-buttons-group">
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => handleScroll(section.id)}
                  className={isActive ? 'active' : ''}
                >
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="nav-divider"></div>

          {/* CTA Button */}
          <button
            onClick={handleCTA}
            className="nav-cta"
          >
            <Phone size={16} weight="fill" />
            <span>Book a Free Career Call</span>
          </button>
        </div>
      </div>

      {/* FLOATING CTA BUTTON - Mobile Only */}
      <div className="mobile-cta">
        <button
          onClick={handleCTA}
          style={{
            backgroundColor: '#B30158',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '0px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(179, 1, 88, 0.39)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8A0145'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B30158'}
        >
          <Phone size={18} weight="fill" />
          <span>Book a Free Career Call</span>
        </button>
      </div>
    </>
  );
};

export default HorizontalNavigation;
