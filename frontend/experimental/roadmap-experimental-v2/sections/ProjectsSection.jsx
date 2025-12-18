/**
 * PROJECTS SECTION
 * Project cards and project drawer
 */

import React, { useState, useEffect } from 'react';
import { Code, SquaresFour, Tree, X, Clock, Gauge, Timer, ArrowUpRight } from 'phosphor-react';

const ProjectsSection = ({ config }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get projects from persona config
  const projectsData = config?.projects?.projects || [];

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  // Helper function to get difficulty display label
  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    };
    return labels[difficulty] || 'Medium';
  };

  // Helper function to get difficulty styling (matches selection process)
  const getDifficultyStyle = (difficulty) => {
    const styles = {
      easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      hard: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };
    return styles[difficulty] || styles.medium;
  };

  return (
    <>
      <section id="projects" className="scroll-mt-24 mb-40">
        <div className="mb-12">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">BUILD & SHOWCASE</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
              Project Ideas to Crack Your Role
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-3">
              Build these projects to demonstrate your skills and stand out in interviews
            </p>
          </div>
        </div>

        {/* Project Cards Grid - 3 COLUMNS */}
        {projectsData && projectsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project, index) => {
              // Cycle through different icon colors and icons
              const iconColors = [
                { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Code },
                { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', icon: SquaresFour },
                { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: Tree }
              ];
              const colorScheme = iconColors[index % iconColors.length];
              const IconComponent = colorScheme.icon;
              const difficultyLabel = getDifficultyLabel(project.difficulty);
              const difficultyStyle = getDifficultyStyle(project.difficulty);

              return (
                <div
                  key={index}
                  onClick={() => handleProjectClick(project)}
                  className="border border-slate-200 rounded-none p-6 cursor-pointer hover:border-slate-400 hover:shadow-lg transition-all bg-white flex flex-col"
                >
                  {/* Icon Container */}
                  <div className={`w-12 h-12 ${colorScheme.bg} border ${colorScheme.border} rounded-none flex items-center justify-center mb-4`}>
                    <IconComponent size={24} weight="bold" className={colorScheme.text} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{project.title}</h3>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-none ${difficultyStyle.bg} ${difficultyStyle.text} border ${difficultyStyle.border}`}>
                      <Gauge size={12} weight="bold" />
                      {difficultyLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-none bg-slate-50 text-slate-700 border border-slate-200">
                      <Timer size={12} weight="bold" />
                      {project.duration || project.estimatedTime || '2-3 weeks'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">{project.description}</p>

                  {/* CTA Button */}
                  <button className="w-full py-2.5 px-4 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all rounded-none flex items-center justify-center gap-2 uppercase tracking-wider">
                    VIEW DETAILS
                    <ArrowUpRight size={14} weight="bold" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No projects available for this persona yet.</p>
          </div>
        )}
      </section>

      {/* Project Drawer */}
      {isDrawerOpen && selectedProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999 }}>
          {/* Overlay */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999999,
              cursor: 'pointer'
            }}
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer */}
          <div style={{
            position: 'fixed',
            ...(isMobile
              ? {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  top: 'auto',
                  height: '90vh',
                  width: '100%',
                  borderRadius: '16px 16px 0 0'
                }
              : {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 'auto',
                  height: 'auto',
                  width: '100%',
                  maxWidth: '42rem',
                  borderRadius: '0'
                }
            ),
            backgroundColor: '#fff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000000
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#0f172a',
                  marginBottom: '8px'
                }}>{selectedProject.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: 0,
                    ...(selectedProject.difficulty === 'easy'
                      ? { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }
                      : selectedProject.difficulty === 'medium'
                      ? { backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }
                      : { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' })
                  }}>
                    <Gauge size={12} weight="bold" />
                    {getDifficultyLabel(selectedProject.difficulty)}
                  </span>
                  <span style={{ fontSize: '14px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} weight="bold" />
                    {selectedProject.duration || selectedProject.estimatedTime || '2-3 weeks'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  flexShrink: 0,
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} weight="bold" style={{ color: '#4b5563' }} />
              </button>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px'
            }}>
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-slate-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Skills */}
              {selectedProject.learnings && selectedProject.learnings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Skills You'll Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.learnings.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-none border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Implementation Steps */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Implementation Steps</h3>

                {selectedProject.implementationSteps && selectedProject.implementationSteps.length > 0 ? (
                  <div className="space-y-0 border border-slate-200">
                    {selectedProject.implementationSteps.map((step, idx) => {
                      // Handle both string and object formats
                      const isObject = typeof step === 'object' && step !== null;
                      const title = isObject ? step.title : `Step ${idx + 1}`;
                      const description = isObject ? step.description : step;

                      return (
                        <details key={idx} className="group border-b border-slate-200 last:border-b-0">
                          <summary className="flex items-center gap-4 p-4 cursor-pointer list-none bg-slate-50 transition-colors hover:bg-slate-100">
                            <svg className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="flex-1 flex items-center gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <h4 className="text-base font-semibold text-slate-900">{title}</h4>
                            </div>
                          </summary>
                          <div className="p-4 bg-white">
                            <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Implementation steps coming soon...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
