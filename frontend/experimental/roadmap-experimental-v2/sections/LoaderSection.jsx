/**
 * LOADER SECTION
 * 6-second loading animation with progress bar
 */

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Target, BriefcaseMetal, ChartLine, Sparkle } from 'phosphor-react';
import Navbar from '../../../src/components/roadmap-new/Navbar';

const LoaderSection = ({ isLoading, onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: <MagnifyingGlass size={28} weight="bold" />, text: 'Analyzing your skills...', subtext: 'Evaluating your current skill level' },
    { icon: <Target size={28} weight="bold" />, text: 'Building your roadmap...', subtext: 'Creating a personalized learning path' },
    { icon: <BriefcaseMetal size={28} weight="bold" />, text: 'Finding relevant companies...', subtext: 'Matching you with top opportunities' },
    { icon: <ChartLine size={28} weight="bold" />, text: 'Curating project ideas...', subtext: 'Selecting projects to build your portfolio' },
    { icon: <Sparkle size={28} weight="bold" />, text: 'Finalizing your roadmap...', subtext: 'Almost there!' }
  ];

  // Loader animation - 6 second fake loader
  useEffect(() => {
    if (!isLoading) return;

    setLoadingProgress(0);
    setLoadingStep(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 1.6;
      });
    }, 100); // Update every 100ms

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200); // Change step every 1.2 seconds

    // Hide loader after 6 seconds
    const loaderTimeout = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 300);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(loaderTimeout);
    };
  }, [isLoading, loadingSteps.length, onLoadingComplete]);

  if (!isLoading) return null;

  const currentStep = loadingSteps[loadingStep];

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50 -mt-20">
        <div className="flex flex-col items-center justify-center w-full max-w-[700px] mx-auto px-8">
          {/* Loading Icon and Text */}
          <div className="flex flex-col items-center gap-4 mb-10 opacity-100 animate-pulse">
            <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center text-[#B30158]">
              {currentStep.icon}
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-slate-900 mb-1.5">
                {currentStep.text}
              </div>
              <div className="text-sm text-slate-600">
                {currentStep.subtext}
              </div>
            </div>
          </div>

          {/* Progress Bar - Wider */}
          <div className="w-full max-w-[500px] h-2 bg-slate-200 rounded-none overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B30158] to-[#E91E63] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoaderSection;
