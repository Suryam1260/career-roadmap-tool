/**
 * COMPANIES SECTION
 *
 * DYNAMIC FIT ANALYSIS:
 * - fitAnalysis is CALCULATED, not loaded from JSON
 * - Uses fitCalculator.js to determine fit based on:
 *   - currentCompanyType (from quiz)
 *   - targetCompanyType (selected tab)
 *   - userAxisScores (from axisCalculator)
 *
 * From Persona JSON (static data):
 * - companySize, expectedSalary
 * - companies list
 * - rounds (interview process)
 *
 * Dynamically Generated:
 * - fitAnalysis.level, color, message
 * - whyFeasible (based on fit level)
 * - whatYouNeed (based on user's weak axes)
 */

import React, { useState, useMemo } from 'react';
import { Target, CheckCircle, TrendUp, Users, CurrencyDollar, Clock, ChartBar } from 'phosphor-react';
import CompanyTicker from '../../../src/components/roadmap-new/CompanyTicker';
import { calculateFitAnalysis } from '../../../src/utils/fitCalculator';
import { calculateAxisScores, getBaselineScores } from '../../../src/utils/axisCalculator';

// ONLY HARDCODED: The 4 company type labels & descriptions (frontend structure)
const COMPANY_TYPE_LABELS = {
  'high-growth': 'High Growth Startups',
  'unicorns': 'Product Unicorns',
  'service': 'Service Companies',
  'big-tech': 'FAANG / Big-Tech'
};

const COMPANY_TYPE_DESCRIPTIONS = {
  'high-growth': 'Fast-scaling companies with product-market fit. Offers high learning, equity upside, and cutting-edge tech with lean teams.',
  'unicorns': 'Billion-dollar companies serving millions. Combines startup innovation with big-company stability, excellent pay and work culture.',
  'service': 'IT consulting firms with diverse projects. Offer stability and domain exposure, but typically lower pay and slower growth than product companies.',
  'big-tech': 'Global tech giants (Google, Amazon, Meta, Microsoft, Apple). World-class pay, cutting-edge tech, excellent work-life balance, and top-tier learning.'
};

const CompaniesSection = ({ config, quizResponses = {} }) => {
  const companyTypeKeys = ['high-growth', 'unicorns', 'service', 'big-tech'];
  const [selectedCompanyType, setSelectedCompanyType] = useState('high-growth');

  // Get company data directly from persona - NO fallback
  const currentCompany = config?.companyInsights?.[selectedCompanyType];

  // ============================================
  // DYNAMIC FIT CALCULATION
  // ============================================
  // Extract data needed for fit calculation
  // Tech users: currentRole (swe-product, swe-service, devops, qa)
  // Non-tech users: currentBackground (sales-marketing, operations, design, finance, other)
  const userBackground = quizResponses?.background;
  const currentCompanyType = userBackground === 'tech'
    ? (quizResponses?.currentRole || 'fresher')
    : (quizResponses?.currentBackground || 'fresher');
  const currentSkills = config?.currentSkills || [];
  const skillPriorities = config?.skillMap?.skillPriorities || {};
  const thresholds = config?.skillMap?.thresholds || {};

  // Extract all skills from skillPriorities for axis calculation
  const allSkillsForRole = useMemo(() => {
    const skills = [];
    ['high', 'medium', 'low'].forEach(priority => {
      (skillPriorities[priority] || []).forEach(skill => {
        skills.push(typeof skill === 'string' ? { name: skill, axes: [] } : skill);
      });
    });
    return skills;
  }, [skillPriorities]);

  // Calculate user's axis scores
  const userAxisScores = useMemo(() => {
    return calculateAxisScores(
      quizResponses,
      currentSkills,
      allSkillsForRole,
      thresholds,
      'tech'
    );
  }, [quizResponses, currentSkills, allSkillsForRole, thresholds]);

  // Get baseline scores for comparison
  const baselineScores = useMemo(() => {
    return getBaselineScores(thresholds);
  }, [thresholds]);

  // Calculate fit analysis for the selected company type
  const fitAnalysis = useMemo(() => {
    return calculateFitAnalysis(
      currentCompanyType,
      selectedCompanyType,
      userAxisScores,
      baselineScores,
      currentCompany  // Pass company data from persona
    );
  }, [currentCompanyType, selectedCompanyType, userAxisScores, baselineScores, currentCompany]);

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('🏢 CompaniesSection Fit Analysis:');
    console.log('   Current company type:', currentCompanyType);
    console.log('   Target company type:', selectedCompanyType);
    console.log('   User axis scores:', userAxisScores);
    console.log('   Baseline scores:', baselineScores);
    console.log('   Fit result:', fitAnalysis);
  }

  const getDifficultyStyle = (difficulty) => {
    const styles = {
      easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' },
      hard: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' }
    };
    return styles[difficulty] || styles.medium;
  };

  return (
    <section id="companies" className="scroll-mt-24">
      <div className="mb-12">
        {/* Title Section */}
        <div className="text-left mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">TARGET COMPANIES</p>
          <h2 className="text-2xl md:text-3xl lg:text-3.5xl font-bold text-slate-900 leading-snug">
            See Which Type of Companies You Fit Into
          </h2>
        </div>
        {/* Description Below */}
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Explore company types, their interview processes, and what they're looking for.
        </p>
      </div>

      {/* Segmented Control - Sticky */}
      <div className="sticky top-16 z-20 bg-white pt-4 pb-6 mb-6">
        <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-none w-full overflow-x-auto">
          {companyTypeKeys.map((typeKey) => (
            <button
              key={typeKey}
              onClick={() => setSelectedCompanyType(typeKey)}
              className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                selectedCompanyType === typeKey
                  ? 'text-white bg-slate-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {COMPANY_TYPE_LABELS[typeKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Company Overview Section */}
      {!currentCompany ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded text-red-800 mb-16">
          <p className="font-semibold">❌ No company data found in persona for: {selectedCompanyType}</p>
          <p className="text-sm mt-2">Ensure this company type exists in your persona JSON</p>
        </div>
      ) : (
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* LEFT: Description + Stats */}
            <div className="lg:w-1/2 space-y-6">
              {/* Company Type Description */}
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {COMPANY_TYPE_DESCRIPTIONS[selectedCompanyType]}
              </p>

              {/* Stats */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* Team Size */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                    <Users size={16} weight="regular" className="text-slate-600" />
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-500 mb-0.5">Company Size</h5>
                    <p className="text-base font-semibold text-slate-900">{currentCompany.companySize}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block md:h-10 md:w-px bg-slate-200"></div>

                {/* Expected Salary */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                    <CurrencyDollar size={16} weight="regular" className="text-slate-600" />
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-500 mb-0.5">Expected Salary</h5>
                    <p className="text-base font-semibold text-slate-900">{currentCompany.expectedSalary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Company Ticker */}
            <div className="lg:w-1/2">
              <CompanyTicker companies={currentCompany.companies || []} />
            </div>
          </div>
        </div>
      )}

      <div className="relative space-y-12">
        {/* Connecting line */}
        <div className="hidden md:block absolute left-[15px] top-8 bottom-8 w-0.5 bg-slate-300"></div>

        {/* Step 1: Fit Analysis */}
        <div className="relative">
          <div className="flex gap-3 md:gap-6 items-start mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 pt-0.5">Your Fit Analysis</h3>
          </div>
          <div className="md:ml-14 space-y-6">
            {/* Fit Banner - DYNAMIC from fitCalculator */}
            <div className={`flex items-center gap-3 p-4 rounded-none border ${
              fitAnalysis.color === 'green'
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-none flex items-center justify-center ${
                fitAnalysis.color === 'green'
                  ? 'bg-green-100'
                  : 'bg-orange-100'
              }`}>
                <Target
                  size={16}
                  weight="fill"
                  className={
                    fitAnalysis.color === 'green'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }
                />
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wide ${
                  fitAnalysis.color === 'green' ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {fitAnalysis.level}
                </span>
                <p className={`text-sm font-medium leading-relaxed ${
                  fitAnalysis.color === 'green' ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {fitAnalysis.message}
                </p>
              </div>
            </div>

            {/* Two boxes - DYNAMIC content from fitCalculator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Box - Why Feasible (from fitAnalysis) */}
              <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-none">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Why It's Feasible</h4>
                <ul className="space-y-3">
                  {(fitAnalysis.whyFeasible || []).map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle size={18} weight="fill" className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Box - What You Need (personalized from weak axes) */}
              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-none">
                <h4 className="text-lg font-bold text-slate-900 mb-4">What You Need</h4>
                <ul className="space-y-3">
                  {(fitAnalysis.whatYouNeed || []).map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <TrendUp size={18} weight="bold" className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Selection Process */}
        <div className="relative">
          <div className="flex gap-3 md:gap-6 items-start mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 pt-0.5">Selection Process</h3>
          </div>
          <div className="md:ml-14">
            {/* Accordion */}
            <div className="space-y-0 border border-slate-200">
              {(currentCompany?.rounds || []).map((round, idx) => {
                const diffStyle = getDifficultyStyle(round.difficulty);

                return (
                  <details key={idx} className="group border-b border-slate-200 last:border-b-0">
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none bg-slate-50 transition-colors">
                      <svg className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>

                      <div className="flex-1 flex items-center gap-3 flex-wrap">
                        <h4 className="text-base font-semibold text-slate-900">
                          Round {idx + 1}: {round.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-none ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                            <ChartBar size={12} weight="bold" className={diffStyle.icon} />
                            {round.difficulty.charAt(0).toUpperCase() + round.difficulty.slice(1)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-none">
                            <Clock size={12} weight="bold" className="text-slate-600" />
                            {round.duration}
                          </span>
                        </div>
                      </div>
                    </summary>

                    <div className="p-5 bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Points */}
                        <div>
                          <ul className="space-y-2.5">
                            {(round.points || []).map((point, pointIdx) => (
                              <li key={pointIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-slate-400 mt-2"></span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right: Video */}
                        <div>
                          {round.videoUrl ? (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-none border-0"
                                src={round.videoUrl}
                                title={round.videoTitle || `How to ace ${round.name}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <div className="relative w-full bg-slate-100 rounded-none flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-slate-400 text-sm">Video coming soon</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
