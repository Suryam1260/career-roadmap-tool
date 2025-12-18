import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Hero from '../../src/components/roadmap-new/Hero';
import SkillsSection from '../../experimental/roadmap-experimental-v2/sections/SkillsSection';
import CompaniesSection from '../../experimental/roadmap-experimental-v2/sections/CompaniesSection';
import LearningPathSection from '../../experimental/roadmap-experimental-v2/sections/LearningPathSection';
import ProjectsSection from '../../experimental/roadmap-experimental-v2/sections/ProjectsSection';
import { loadPersonaFromQuiz, transformPersonaForExperimental } from '../../src/utils/personaLoader';
import { MagnifyingGlass, Target, BriefcaseMetal, ChartLine, Sparkle } from 'phosphor-react';

// Hardcoded credentials (as requested - no API needed)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'scaler123'
};

const COOKIE_NAME = 'scaler_admin_auth';
const COOKIE_EXPIRY_DAYS = 1;

// Function to expand compact admin data back to full quizResponses format
const expandCompactAdminData = (compact) => {
  return {
    background: compact.b, // background
    currentBackground: compact.cb, // currentBackground
    stepsTaken: compact.st, // stepsTaken
    targetRole: compact.tr, // targetRole
    targetRoleLabel: compact.trl, // targetRoleLabel
    yearsOfExperience: compact.yoe, // yearsOfExperience
    codeComfort: compact.cc, // codeComfort
    currentSkills: compact.cs, // currentSkills
    timeline: compact.tl, // timeline
    currentRole: compact.cr, // currentRole
    currentRoleLabel: compact.crl, // currentRoleLabel
    targetCompany: compact.tc, // targetCompany
    targetCompanyLabel: compact.tcl // targetCompanyLabel
  };
};

const AdminRoadmap = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Roadmap data
  const [personaConfig, setPersonaConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [quizResponses, setQuizResponses] = useState(null);

  // Check for existing auth cookie on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${COOKIE_NAME}=`))
          ?.split('=')[1];

        if (cookieValue) {
          const authData = JSON.parse(atob(cookieValue));
          if (authData.authenticated && authData.timestamp) {
            const expiryTime = authData.timestamp + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            if (Date.now() < expiryTime) {
              setIsAuthenticated(true);
              setIsLoading(false); // Set loading to false when authenticated
              return;
            }
          }
        }
      } catch (error) {
        // Invalid cookie, remove it
        document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Load roadmap data when authenticated and data param exists
  useEffect(() => {
    if (isAuthenticated) {
      if (router.query.d) {
        loadRoadmapData();
      } else {
        // Authenticated but no data parameter - stop loading
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, router.query.d]);

  const loadRoadmapData = async () => {
    try {
      setConfigLoading(true);
      setConfigError(null);

      // Decode the compact quiz responses from URL parameter
      const compactData = router.query.d;
      if (!compactData) {
        throw new Error('No admin data provided');
      }

      // Decode URL-safe base64 and expand compact format
      const decodedCompact = atob(compactData.replace(/-/g, '+').replace(/_/g, '/'));
      const compactResponses = JSON.parse(decodedCompact);

      // Expand compact format back to full quizResponses format
      const decodedResponses = expandCompactAdminData(compactResponses);

      setQuizResponses(decodedResponses);

      // Load persona using the same logic as the main roadmap
      const persona = await loadPersonaFromQuiz(decodedResponses);
      const userSelectedSkills = decodedResponses?.currentSkills || [];
      const config = transformPersonaForExperimental(persona, userSelectedSkills);

      if (config) {
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

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Set authentication cookie
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      };
      const encodedAuth = btoa(JSON.stringify(authData));
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));

      document.cookie = `${COOKIE_NAME}=${encodedAuth}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;

      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    setIsAuthenticated(false);
    setIsLoading(false);
    setPersonaConfig(null);
    setQuizResponses(null);
    setConfigLoading(false);
    setConfigError(null);
    setUsername('');
    setPassword('');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B30158] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter your credentials to view the roadmap</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B30158] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B30158] focus:border-transparent"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#B30158] text-white py-2 px-4 rounded-md hover:bg-[#8A0145] transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show error if no data parameter
  if (!router.query.d) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h1>
          <p className="text-gray-600 mb-6">No roadmap data provided in the URL.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#B30158] text-white py-2 px-6 rounded-md hover:bg-[#8A0145] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show loading while generating roadmap
  if (configLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 -mt-20">
          <div className="flex flex-col items-center justify-center w-full max-w-[700px] mx-auto px-8">
            <div className="flex flex-col items-center gap-4 mb-10 opacity-100 animate-pulse">
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center text-[#B30158]">
                <MagnifyingGlass size={28} weight="bold" />
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-slate-900 mb-1.5">
                  Loading Roadmap Data...
                </div>
                <div className="text-sm text-slate-600">
                  Preparing admin view
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error if data loading failed
  if (!personaConfig || configError) {
    return (
      <>
        <div style={{
          margin: '40px auto',
          maxWidth: '800px',
          padding: '24px',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: '0',
          color: '#7F1D1D'
        }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              ⚠️ Unable to Load Roadmap
            </h2>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Logout
            </button>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {configError || 'Failed to load roadmap data.'}
          </p>
        </div>
      </>
    );
  }

  // Build roadmap data for display
  const buildRoadmapData = () => {
    if (personaConfig) {
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
        _fullConfig: personaConfig,
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

  return (
    <>
      {/* Admin header with logout */}
      <div className="bg-gray-100 border-b border-gray-200 py-2">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Admin View</span>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {roadmapDisplay && <Hero roadmapData={roadmapDisplay} />}

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

export default AdminRoadmap;
