/**
 * LEARNING PATH SECTION
 *
 * DYNAMIC PHASE GENERATION:
 * - Phases are CALCULATED, not loaded from JSON
 * - Uses learningPathCalculator.js to determine phases based on:
 *   - Skill coverage (% of skills selected)
 *   - DSA level (problemSolving quiz answer)
 *   - System Design level (systemDesign quiz answer)
 *   - Target role (backend, frontend, etc.)
 *
 * Phase Logic:
 * - Phase 1: Skills (varies by coverage + DSA level)
 * - Phase 2: System Design (if weak) OR Role-specific (if SD strong)
 * - Phase 3: Role-specific OR Interview Prep
 * - Phase 4: Projects & Portfolio (always)
 */

import React, { useState, useMemo } from 'react';
import { Target, Check, Rocket, Crown, Lightbulb, Books } from 'phosphor-react';
import { calculateLearningPath } from '../../../src/utils/learningPathCalculator';

const LearningPathSection = ({ config, quizResponses = {} }) => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);

  // Extract data needed for learning path calculation
  const skillPriorities = config?.skillMap?.skillPriorities || {};
  const role = config?.metadata?.role || config?.meta?.role || 'backend';

  // Extract all skills from skillPriorities
  const allSkills = useMemo(() => {
    const skills = [];
    ['high', 'medium', 'low'].forEach(priority => {
      (skillPriorities[priority] || []).forEach(skill => {
        const name = typeof skill === 'string' ? skill : skill?.name;
        if (name) skills.push(name);
      });
    });
    return skills;
  }, [skillPriorities]);

  // DYNAMIC: Calculate phases from persona based on quiz responses
  const phases = useMemo(() => {
    return calculateLearningPath(config, quizResponses, allSkills);
  }, [config, quizResponses, allSkills]);

  // DEBUG: Log the data structure
  if (typeof window !== 'undefined') {
    console.log('📚 LearningPathSection DEBUG:');
    console.log('  Quiz responses:', quizResponses);
    console.log('  All skills count:', allSkills.length);
    console.log('  Role:', role);
    console.log('  Generated phases:', phases.length);
    if (phases.length > 0) {
      console.log('  Phase titles:', phases.map(p => p.title));
    }
  }

  if (!phases || phases.length === 0) {
    return <section id="learning" className="scroll-mt-24"><p>No learning path data</p></section>;
  }

  const selectedPhase = phases[selectedPhaseIndex];

  // Check what's in selectedPhase
  const hasWhatYouLearn = selectedPhase?.whatYouLearn && Array.isArray(selectedPhase.whatYouLearn) && selectedPhase.whatYouLearn.length > 0;
  if (selectedPhase && !hasWhatYouLearn) {
    console.warn('⚠️ Selected phase has no whatYouLearn data:', {
      title: selectedPhase.title,
      whatYouLearnValue: selectedPhase.whatYouLearn,
      whatYouLearnIsArray: Array.isArray(selectedPhase.whatYouLearn),
      whatYouLearnLength: selectedPhase.whatYouLearn?.length
    });
  }

  return (
    <section id="learning" className="scroll-mt-24">
      <div className="mb-12">
        <div className="text-left mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">ROADMAP TO SUCCESS</p>
          <h2 className="text-2xl md:text-3xl lg:text-3.5xl font-bold text-slate-900 leading-snug">
            Your Personalised Learning Path
          </h2>
        </div>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          A structured plan to master the skills you need, with milestones and progress checkpoints.
        </p>
      </div>

      {/* TAB-BASED LAYOUT: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* LEFT: Phase Navigation Tabs - Hidden on Mobile */}
        <div className="hidden lg:flex flex-col gap-3">
          {phases.map((phase, idx) => {
            const icons = [Rocket, Crown, Lightbulb];
            const IconComponent = icons[idx] || Lightbulb;
            return (
              <button
                key={idx}
                onClick={() => setSelectedPhaseIndex(idx)}
                className={`flex items-center gap-3 p-4 rounded-none text-left transition-all ${
                  selectedPhaseIndex === idx
                    ? 'bg-[#073CA0] text-white shadow-lg'
                    : 'bg-white border border-slate-200 text-slate-900 hover:border-blue-300'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center font-bold ${
                  selectedPhaseIndex === idx
                    ? 'bg-white/20'
                    : 'bg-slate-100'
                }`}>
                  <IconComponent size={24} weight={selectedPhaseIndex === idx ? 'fill' : 'regular'} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${selectedPhaseIndex === idx ? 'text-blue-100' : 'text-slate-500'}`}>
                    Phase {idx + 1}
                  </p>
                  <h3 className="font-semibold">{phase.title}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Phase Content */}
        <div className="col-span-1 lg:col-span-3">
          {/* DESKTOP: Show selected phase */}
          <div className="hidden lg:block space-y-8">
            {selectedPhase && (
              <>
                {/* Phase Header */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                  <div className="bg-[#073CA0] text-white px-3 py-1 rounded-none text-xs lg:text-sm font-bold whitespace-nowrap w-fit">
                    Phase {selectedPhaseIndex + 1}
                  </div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">{selectedPhase.title}</h2>
                </div>

                {/* WHAT YOU'LL LEARN SECTION */}
                {hasWhatYouLearn ? (
                  <div className="bg-gradient-to-b from-white to-slate-50 p-4 md:p-6 lg:p-8 rounded-none border border-slate-200">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8">What You'll Learn</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Learning Points */}
                      <ul className="space-y-4">
                        {selectedPhase.whatYouLearn.map((item, idx) => {
                          const isObject = typeof item === 'object' && item !== null;
                          const title = isObject ? item.title : item;
                          const description = isObject ? item.description : null;

                          return (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">{idx + 1}.</span>
                              <div className="flex-1">
                                <h5 className="font-semibold text-slate-900 text-sm">{title}</h5>
                                {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Video */}
                      {selectedPhase.videoUrl && (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-none border-0"
                            src={selectedPhase.videoUrl}
                            title={`${selectedPhase.title} Video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-none">
                    <p className="text-yellow-900 font-semibold">📚 Learning content coming soon...</p>
                  </div>
                )}

                {/* TARGET & WHY IT MATTERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TARGET */}
                  {selectedPhase.target && (
                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-none border border-slate-200">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-none bg-green-100 flex items-center justify-center mt-0.5">
                          <Target size={20} weight="bold" className="text-green-600" />
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                          {typeof selectedPhase.target === 'object' ? selectedPhase.target.metric : selectedPhase.target}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WHY IT MATTERS */}
                  {selectedPhase.whyItMatters && selectedPhase.whyItMatters.length > 0 && (
                    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-none border border-slate-200">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                      <ul className="space-y-2.5">
                        {selectedPhase.whyItMatters.map((item, idx) => {
                          const isObject = typeof item === 'object' && item !== null;
                          const text = isObject ? item.metric : item;
                          return (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* MOBILE: Show all phases stacked one below the other */}
          <div className="lg:hidden space-y-12">
            {phases.map((phase, idx) => (
              <div key={idx} className="space-y-6">
                {/* Phase Header */}
                <div className="flex flex-col gap-2">
                  <div className="bg-[#073CA0] text-white px-3 py-1 rounded-none text-xs font-bold whitespace-nowrap w-fit">
                    Phase {idx + 1}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">{phase.title}</h2>
                </div>

                {/* WHAT YOU'LL LEARN SECTION */}
                {(phase.whatYouLearn && Array.isArray(phase.whatYouLearn) && phase.whatYouLearn.length > 0) ? (
                  <div className="bg-gradient-to-b from-white to-slate-50 p-4 md:p-6 rounded-none border border-slate-200">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6">What You'll Learn</h3>
                    <ul className="space-y-4">
                      {phase.whatYouLearn.map((item, itemIdx) => {
                        const isObject = typeof item === 'object' && item !== null;
                        const title = isObject ? item.title : item;
                        const description = isObject ? item.description : null;

                        return (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">{itemIdx + 1}.</span>
                            <div className="flex-1">
                              <h5 className="font-semibold text-slate-900 text-sm">{title}</h5>
                              {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Video */}
                    {phase.videoUrl && (
                      <div className="relative w-full mt-6" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-none border-0"
                          src={phase.videoUrl}
                          title={`${phase.title} Video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-none">
                    <p className="text-yellow-900 font-semibold">📚 Learning content coming soon...</p>
                  </div>
                )}

                {/* TARGET & WHY IT MATTERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TARGET */}
                  {phase.target && (
                    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-none border border-slate-200">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-none bg-green-100 flex items-center justify-center mt-0.5">
                          <Target size={20} weight="bold" className="text-green-600" />
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                          {typeof phase.target === 'object' ? phase.target.metric : phase.target}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WHY IT MATTERS */}
                  {phase.whyItMatters && phase.whyItMatters.length > 0 && (
                    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-none border border-slate-200">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                      <ul className="space-y-2.5">
                        {phase.whyItMatters.map((item, itemIdx) => {
                          const isObject = typeof item === 'object' && item !== null;
                          const text = isObject ? item.metric : item;
                          return (
                            <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;
