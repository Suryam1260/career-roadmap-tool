/**
 * COMPANY TICKER - 2-row infinite scrolling ticker for company logos with Brandfetch
 */

import React, { useEffect } from 'react';

const CompanyTicker = ({ companies }) => {
  if (!companies || companies.length === 0) {
    return null;
  }

  // Filter out companies with poor/missing favicons
  const excludedCompanies = ['PhonePe', 'Udaan', 'PolicyBazaar', 'Mindtree', 'Mphasis', 'Persistent', 'Zensar', 'Hexaware', 'Genpact'];
  const filteredCompanies = companies.filter(company => !excludedCompanies.includes(company));

  // Split companies into 2 rows
  const row1 = filteredCompanies.slice(0, Math.ceil(filteredCompanies.length / 2));
  const row2 = filteredCompanies.slice(Math.ceil(filteredCompanies.length / 2));

  // Duplicate multiple times for seamless infinite scroll
  const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2];

  // Get company domain for logo API
  const getCompanyDomain = (companyName) => {
    const domainMap = {
      'Razorpay': 'razorpay.com',
      'Zerodha': 'zerodha.com',
      'Cred': 'cred.club',
      'Groww': 'groww.in',
      'Meesho': 'meesho.com',
      'Urban Company': 'urbancompany.com',
      'ShareChat': 'sharechat.com',
      'Dream11': 'dream11.com',
      'PharmEasy': 'pharmeasy.in',
      'Lenskart': 'lenskart.com',
      'Nykaa': 'nykaa.com',
      'Slice': 'sliceit.com',
      'Swiggy': 'swiggy.com',
      'Zomato': 'zomato.com',
      'Paytm': 'paytm.com',
      'PhonePe': 'phonepe.com',
      'Ola': 'olacabs.com',
      'Flipkart': 'flipkart.com',
      'Myntra': 'myntra.com',
      'Udaan': 'udaan.com',
      'OYO': 'oyorooms.com',
      'BigBasket': 'bigbasket.com',
      'PolicyBazaar': 'policybazaar.com',
      'Delhivery': 'delhivery.com',
      'TCS': 'tcs.com',
      'Infosys': 'infosys.com',
      'Wipro': 'wipro.com',
      'Cognizant': 'cognizant.com',
      'HCL': 'hcltech.com',
      'Tech Mahindra': 'techmahindra.com',
      'Accenture': 'accenture.com',
      'Capgemini': 'capgemini.com',
      'LTI': 'ltimindtree.com',
      'LTIMindtree': 'ltimindtree.com',
      'Mindtree': 'ltimindtree.com',
      'Mphasis': 'mphasis.com',
      'Persistent': 'persistent.com',
      'Zensar': 'zensar.com',
      'KPMG': 'kpmg.com',
      'Deloitte': 'deloitte.com',
      'EY': 'ey.com',
      'PWC': 'pwc.com',
      'IBM': 'ibm.com',
      'Genpact': 'genpact.com',
      'Hexaware': 'hexaware.com',
      'Google': 'google.com',
      'Amazon': 'amazon.com',
      'Microsoft': 'microsoft.com',
      'Meta': 'facebook.com',
      'Apple': 'apple.com',
      'Netflix': 'netflix.com',
      'Adobe': 'adobe.com',
      'Salesforce': 'salesforce.com',
      'Oracle': 'oracle.com',
      'Intel': 'intel.com',
      'Nvidia': 'nvidia.com',
      'Twitter': 'x.com',
      'Stripe': 'stripe.com',
      'Figma': 'figma.com',
      'Canva': 'canva.com',
      'Notion': 'notion.so',
      'Slack': 'slack.com',
      'Discord': 'discord.com',
      'Loom': 'loom.com',
      'Retool': 'retool.com',
      'Scaler': 'scaler.com'
    };
    return domainMap[companyName] || companyName.toLowerCase().replace(/\s+/g, '') + '.com';
  };

  return (
    <div className="space-y-6">
      {/* Row 1 - Scroll Left */}
      <div className="relative overflow-hidden" style={{ minHeight: '56px' }}>
        {/* Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        {/* Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-8 ticker-scroll-left">
          {duplicatedRow1.map((company, idx) => {
            const domain = getCompanyDomain(company);
            const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-12 h-12 bg-white rounded-none flex items-center justify-center p-2 shadow-sm border border-slate-100"
              >
                <img
                  src={logoUrl}
                  alt={company}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Fallback to generic company icon placeholder
                    e.target.style.display = 'none';
                    if (e.target.parentElement) {
                      e.target.parentElement.innerHTML = `<div class="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-100">${company.substring(0, 2).toUpperCase()}</div>`;
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 - Scroll Right - Hidden on mobile */}
      <div className="relative overflow-hidden hidden md:block" style={{ minHeight: '56px' }}>
        {/* Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        {/* Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-8 ticker-scroll-right">
          {duplicatedRow2.map((company, idx) => {
            const domain = getCompanyDomain(company);
            const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-12 h-12 bg-white rounded-none flex items-center justify-center p-2 shadow-sm border border-slate-100"
              >
                <img
                  src={logoUrl}
                  alt={company}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Fallback to generic company icon placeholder
                    e.target.style.display = 'none';
                    if (e.target.parentElement) {
                      e.target.parentElement.innerHTML = `<div class="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-100">${company.substring(0, 2).toUpperCase()}</div>`;
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .ticker-scroll-left {
          animation: scroll-left 60s linear infinite;
          width: max-content;
        }

        .ticker-scroll-right {
          animation: scroll-right 60s linear infinite;
          width: max-content;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyTicker;
