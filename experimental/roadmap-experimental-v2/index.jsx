/**
 * EXPERIMENTAL ROADMAP V2 - Persona-Driven Architecture (TESTING MODE)
 *
 * DECOUPLED FROM QUIZ FOR TESTING:
 * This component loads test_persona.json directly to verify data flow.
 * Uses obvious TEST: prefixes so we can visually see what's from persona vs hardcoded.
 *
 * ONCE VERIFIED, wire back to quiz responses using getPersonaIdFromQuiz().
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../../src/components/roadmap-new/Navbar';
import Hero from '../../src/components/roadmap-new/Hero';
import HorizontalNavigation from './sections/HorizontalNavigation';
import SkillsSection from './sections/SkillsSection';
import CompaniesSection from './sections/CompaniesSection';
import LearningPathSection from './sections/LearningPathSection';
import ProjectsSection from './sections/ProjectsSection';
import FloatingCTA from './sections/FloatingCTA';
import { loadPersonaFromQuiz, transformPersonaForExperimental } from '../../src/utils/personaLoader';
import { useUnified } from '../../src/context/UnifiedContext';
import { MagnifyingGlass, Target, BriefcaseMetal, ChartLine, Sparkle } from 'phosphor-react';
import { sendLSQActivity } from '../../src/utils/leadSquared';

const RoadmapNewExperimental = () => {
  const [activeSection, setActiveSection] = useState('skills');
  const [personaConfig, setPersonaConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  // Loader states (similar to roadmap-new.js)
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: <MagnifyingGlass size={28} weight="bold" />, text: 'Analyzing your skills...', subtext: 'Evaluating your current skill level' },
    { icon: <Target size={28} weight="bold" />, text: 'Building your roadmap...', subtext: 'Creating a personalized learning path' },
    { icon: <BriefcaseMetal size={28} weight="bold" />, text: 'Finding relevant companies...', subtext: 'Matching you with top opportunities' },
    { icon: <ChartLine size={28} weight="bold" />, text: 'Curating project ideas...', subtext: 'Selecting projects to build your portfolio' },
    { icon: <Sparkle size={28} weight="bold" />, text: 'Finalizing your roadmap...', subtext: 'Almost there!' }
  ];

  // Get quiz responses from unified context
  // NOTE: currentSkills is stored INSIDE quizResponses (quiz question id is 'currentSkills')
  const { quizResponses } = useUnified();

  // Extract currentSkills from quizResponses (this is where the quiz stores selected skills)
  const userSelectedSkills = quizResponses?.currentSkills || [];

  /**
   * Load persona based on quiz responses or use default for testing
   * Simple, no-merge approach: load the complete monolithic persona file
   */
  useEffect(() => {
    const generatePersonaFromQuiz = async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);

        // SSR check
        if (typeof window === 'undefined') {
          setConfigLoading(false);
          return;
        }

        // REQUIRE quiz responses - no fallback to test persona
        if (!quizResponses || Object.keys(quizResponses).length === 0) {
          throw new Error('No quiz responses found. Complete the quiz to generate your roadmap.');
        }

        const persona = await loadPersonaFromQuiz(quizResponses);

        const config = transformPersonaForExperimental(persona, userSelectedSkills);

        if (config) {
          // no-op debug removed

          setPersonaConfig(config);
        } else {
          throw new Error('Failed to transform persona configuration');
        }
      } catch (error) {
        setConfigError(error.message);
        setPersonaConfig(null);
      } finally {
        setConfigLoading(false);
      }
    };

    generatePersonaFromQuiz();
  }, [userSelectedSkills]);

  // Loader animation - 6 second fake loader (similar to roadmap-new.js)
  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);

        // Send LSQ activity with admin URL when roadmap is generated
        if (quizResponses && Object.keys(quizResponses).length > 0) {
          // Encode quiz responses for admin URL
          const encodedResponses = btoa(JSON.stringify(quizResponses));
          const adminUrl = `${window.location.origin}/admin/roadmap?data=${encodedResponses}`;

          sendLSQActivity({
            activityName: 'roadmap_output_generated',
            fields: [adminUrl]
          });
        }
      }, 300); // Small delay for smooth transition
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(loaderTimeout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['skills', 'companies', 'learning', 'projects'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Build roadmap data from persona config
   * NO MOCK DATA - Only uses real data from persona JSON
   * Returns data or null if config not loaded
   */
  const buildRoadmapData = () => {
    if (personaConfig) {

      // Use persona config data directly (testing mode - no quiz responses)
      const roadmapData = {
        targetRole: personaConfig.metadata?.roleLabel,
        targetCompany: 'Big-Tech Companies',
        timeline: '6-9 months',
        effortPerWeek: personaConfig.hero?.estimatedEffort?.value || '10',
        skillsToLearn: personaConfig.hero?.skillsToLearn,
        videoUrl: personaConfig.hero?.videoUrl,
        currentSkills: personaConfig.currentSkills || [],
        missingSkills: personaConfig.missingSkills || {
          highPriority: [],
          mediumPriority: [],
          lowPriority: []
        },
        // Include full config for sections to reference
        _fullConfig: personaConfig,
        // Data source tracking
        _dataSources: {
          metadata: !!personaConfig.metadata,
          hero: !!personaConfig.hero,
          skillMap: !!personaConfig.skillMap,
          skillsGap: !!personaConfig.skillsGap,
          missingSkills: !!personaConfig.missingSkills,
          companyInsights: !!personaConfig.companyInsights,
          learningPath: !!personaConfig.learningPath,
          projects: !!personaConfig.projects
        }
      };

      return roadmapData;
    }

    return null;
  };

  const roadmapDisplay = buildRoadmapData();

  // Show loader for 6 seconds
  if (isLoading) {
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
  }

  // Show error if no data available
  if (!roadmapDisplay || configLoading) {
    return (
      <>
        <Navbar />
        {configError && (
          <div style={{
            margin: '40px auto',
            maxWidth: '800px',
            padding: '24px',
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '0',
            color: '#7F1D1D'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              ⚠️ Unable to Load Roadmap
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {configError}
            </p>
            <p style={{ fontSize: '13px', marginTop: '12px', opacity: 0.8 }}>
              Please go back and complete the quiz to generate your personalized roadmap.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar />
      {roadmapDisplay && <Hero roadmapData={roadmapDisplay} />}
      <HorizontalNavigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="w-full bg-white">
        <div className="mx-auto px-5 py-12 lg:px-[120px] lg:pt-16 lg:pb-40 max-w-[1440px]">
          <div className="w-full space-y-32">
            {personaConfig ? (
              <>
                <SkillsSection config={personaConfig} quizResponses={quizResponses} />
                <CompaniesSection config={personaConfig} quizResponses={quizResponses} />
                <LearningPathSection config={personaConfig} quizResponses={quizResponses} />
                <ProjectsSection config={personaConfig} />
              </>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-900 font-semibold">⏳ Loading persona data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapNewExperimental;
