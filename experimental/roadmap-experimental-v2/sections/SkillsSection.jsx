/**
 * SKILLS SECTION
 * Two-column layout: Skill Map (radar) + Skills Table
 *
 * SKILL TABLE LOGIC:
 * Simply shows (all persona skills) - (user selected skills)
 * Organized by priority: high, medium, low
 */

import React from 'react';
import { GraduationCap } from 'phosphor-react';
import SkillMapNew from '../../../src/components/roadmap/SkillMapNew.jsx';
import { getSkillDescription } from '../../../src/utils/skillDescriptions.js';

const SkillsSection = ({ config, quizResponses = {} }) => {
  // Section header
  const sectionTitle = config?.skillsGap?.title || 'Understand Where You Stand Right Now';
  const sectionDescription = config?.skillsGap?.description || 'Identify your skill gaps and focus on what matters most.';

  // Get data from config
  const skillPriorities = config?.skillMap?.skillPriorities || {};
  const currentSkills = config?.currentSkills || [];

  // Helper to get skill name
  const getSkillName = (skill) => typeof skill === 'string' ? skill : skill?.name;

  // SIMPLE LOGIC: Skills to learn = All persona skills - User selected skills
  const filterUnselectedSkills = (skillsArray) => {
    return (skillsArray || [])
      .filter(skill => !currentSkills.includes(getSkillName(skill)))
      .map(skill => ({
        name: getSkillName(skill),
        description: getSkillDescription(getSkillName(skill)),
        priority: 'high'
      }));
  };

  const highPrioritySkills = filterUnselectedSkills(skillPriorities.high);
  const mediumPrioritySkills = filterUnselectedSkills(skillPriorities.medium);
  const lowPrioritySkills = filterUnselectedSkills(skillPriorities.low);

  // Total skills to learn (for Hero section to use)
  const totalSkillsToLearn = highPrioritySkills.length + mediumPrioritySkills.length + lowPrioritySkills.length;

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('📋 Skills Section:');
    console.log('   User selected:', currentSkills);
    console.log('   Skills to learn:', totalSkillsToLearn);
    console.log('   High priority:', highPrioritySkills.map(s => s.name));
    console.log('   Medium priority:', mediumPrioritySkills.map(s => s.name));
    console.log('   Low priority:', lowPrioritySkills.map(s => s.name));
  }

  return (
    <section id="skills" className="scroll-mt-24">
      {/* PROMINENT SECTION HEADER */}
      <div className="mb-12">
        {/* Title Section */}
        <div className="text-left mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Skill Analysis</p>
          <h2 className="text-2xl md:text-3xl lg:text-3.5xl font-bold text-slate-900 leading-snug">
            {sectionTitle}
          </h2>
        </div>
        {/* Description Below */}
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          {sectionDescription}
        </p>
      </div>

      {/* Two Column Layout: Skill Map (Left 50%) + Skills Table (Right 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-start mb-8 md:mb-16 lg:mb-20">
        {/* LEFT: Skill Map - 50% width */}
        <div className="flex flex-col h-full relative z-20">
          <div className="mb-2 md:mb-4 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-30">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 pt-0.5">Your Skill Map</h3>
            </div>
            <div className="w-full border-b border-slate-300 mt-2"></div>
          </div>
          <div className="w-full">
            {config?.skillMap ? (
              <SkillMapNew
                radarAxes={config?.skillMap?.radarAxes || []}
                skillMapThresholds={config?.skillMap?.thresholds || {}}
                background={config?.metadata?.userType === 'tech' ? 'tech' : 'nonTech'}
                quizResponses={quizResponses}
                currentSkills={config?.currentSkills || []}
                skillPriorities={config?.skillMap?.skillPriorities || {}}
                targetRole={config?.metadata?.roleLabel || 'Engineer'}
              />
            ) : (
              <p className="text-slate-500">Loading skill map...</p>
            )}
          </div>
        </div>

        {/* RIGHT: Skills Table - 50% width */}
        <div className="flex flex-col h-full relative overflow-visible">
          <div className="mb-6 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 pt-0.5">Skills You Need to Master</h3>
            </div>
            <div className="w-full border-b border-slate-300 mt-2"></div>
          </div>

          {/* Skills Table */}
          <div className="w-full border-t border-b border-slate-200">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 py-3 px-4 bg-slate-50 border-b border-slate-200">
              <div><h5 className="text-base font-bold text-slate-900">High Priority</h5></div>
              <div><h5 className="text-base font-bold text-slate-900">Medium Priority</h5></div>
              <div><h5 className="text-base font-bold text-slate-900">Low Priority</h5></div>
            </div>

            {/* Table Content */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 py-4 px-2 md:px-4 bg-white overflow-visible">
              {/* High Priority */}
              <div className="flex flex-col gap-2">
                {highPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group flex items-start gap-1 px-2 py-1.5 bg-red-50 border border-red-200 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-red-800 text-xs font-medium break-words hyphens-auto leading-tight">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                      <div className="bg-slate-900 text-white text-xs rounded px-3 py-2 shadow-lg w-[150px] whitespace-normal text-center">
                        {skill.description}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Medium Priority */}
              <div className="flex flex-col gap-2">
                {mediumPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group flex items-start gap-1 px-2 py-1.5 bg-orange-50 border border-orange-200 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-orange-800 text-xs font-medium break-words hyphens-auto leading-tight">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                      <div className="bg-slate-900 text-white text-xs rounded px-3 py-2 shadow-lg w-[150px] whitespace-normal text-center">
                        {skill.description}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Low Priority */}
              <div className="flex flex-col gap-2">
                {lowPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group flex items-start gap-1 px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-slate-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-xs font-medium break-words hyphens-auto leading-tight">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                      <div className="bg-slate-900 text-white text-xs rounded px-3 py-2 shadow-lg w-[150px] whitespace-normal text-center">
                        {skill.description}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
