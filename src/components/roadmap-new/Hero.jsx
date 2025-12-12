/**
 * HERO SECTION - Clean build with stats cards
 */

import React from 'react';
import { Target, ChartBar } from 'phosphor-react';
import { getVideoId } from '../../utils/videoConfig';
import { Card, CardContent } from '../ui/card';

const Hero = ({ roadmapData }) => {
  // Use config title if available, otherwise build from roadmapData
  const heroTitle = roadmapData._fullConfig?.hero?.title ||
                    `Your roadmap to become a ${roadmapData.targetRole} is ready!`;

  // ALWAYS calculate skills count dynamically from missingSkills
  // This ensures the count matches what's actually shown in the skills table
  const skillsCount = (roadmapData.missingSkills?.highPriority?.length || 0) +
    (roadmapData.missingSkills?.mediumPriority?.length || 0) +
    (roadmapData.missingSkills?.lowPriority?.length || 0);

  // Debug: Log what we're receiving
  if (typeof window !== 'undefined') {
    console.log('🎯 Hero Component:');
    console.log(`   Title: "${heroTitle}"`);
    console.log(`   Target Role: "${roadmapData.targetRole}"`);
    console.log(`   Skills to Learn (calculated): ${skillsCount}`);
    console.log(`   Missing Skills breakdown:`, {
      high: roadmapData.missingSkills?.highPriority?.length || 0,
      medium: roadmapData.missingSkills?.mediumPriority?.length || 0,
      low: roadmapData.missingSkills?.lowPriority?.length || 0
    });
  }

  const stats = [
    {
      icon: Target,
      label: 'Skills to Learn',
      value: `${skillsCount} skills`
    },
    {
      icon: ChartBar,
      label: 'Est. effort',
      value: `${roadmapData.effortPerWeek || '10'} hrs/week`
    }
  ];

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200">
      <div className="mx-auto px-5 py-12 lg:px-[120px] lg:py-16 max-w-[1440px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-start">

            {/* LEFT: Greeting + Stats */}
            <div className="flex flex-col gap-8 lg:w-[500px]">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 leading-tight lg:text-3xl">
                  <span className="text-xl font-semibold block mb-2 text-slate-700">Hey There! 👋</span>
                  {heroTitle}
                </h1>
              </div>

              {/* Stats Cards - Icon LEFT, Text RIGHT */}
              <div className="flex flex-row gap-0 lg:w-[420px]">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className={`flex-1 rounded-none border-slate-200 ${index > 0 ? 'border-l-0' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon size={28} weight="duotone" color="#3B82F6" className="flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-normal mb-1 whitespace-nowrap">
                              {stat.label}
                            </div>
                            <div className="text-base font-semibold text-slate-900">
                              {stat.value}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Video */}
            <div className="flex flex-col gap-4 w-full lg:w-[520px]">
              <div className="w-full aspect-video relative bg-slate-200 rounded-none overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={roadmapData.videoUrl || `https://www.youtube.com/embed/${getVideoId('hero.founderMessage')}`}
                  title="Scaler Career Roadmap"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-sm text-slate-600">
                Watch how Scaler can help you achieve your career goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
