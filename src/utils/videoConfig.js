/**
 * VIDEO CONFIGURATION
 *
 * Centralized repository for all YouTube video IDs used throughout the roadmap.
 * Update these IDs with actual Scaler videos.
 *
 * Video ID format: The part after 'v=' in YouTube URL
 * Example: https://www.youtube.com/watch?v=3Pq9blTtKfE → '3Pq9blTtKfE'
 */

export const VIDEO_IDS = {
  // HERO SECTION - Role-specific founder messages
  hero: {
    founderMessage: '3Pq9blTtKfE', // Default welcome message / Founder intro
    // Role-specific hero videos
    backend: 'dQw4w9WgXcQ',        // Backend Engineering roadmap
    frontend: 'jNQXAC9IVRw',       // Frontend Engineering roadmap
    fullstack: 'aqz-KE-bpKQ',      // Full-stack Engineering roadmap
    devops: 'DLzxrzFCyEo',         // DevOps & Infrastructure roadmap
    data: 'qfgfeyuipOo',           // Data Engineering roadmap
  },

  // COMPANY INSIGHTS SECTION
  companies: {
    'High Growth Startups': '3Pq9blTtKfE',
    'Scaled Startups': '3Pq9blTtKfE',
    'Big Tech': '3Pq9blTtKfE',
    'Product MNCs': '3Pq9blTtKfE',
    'Dream Companies': '3Pq9blTtKfE',
  },

  // INTERVIEW PREP - TECH PROFESSIONALS
  interviewRounds: {
    tech: {
      onlineAssessment: 'sg5pwazWomM',      // Screening Round
      technicalScreening: 'sg5pwazWomM',     // Machine Coding
      systemDesign: 'sg5pwazWomM',           // DSA Round
      hiringManager: 'sg5pwazWomM',          // HR Round
    },
    nonTech: {
      basicCoding: 'sg5pwazWomM',            // Screening Round
      projectDiscussion: 'sg5pwazWomM',      // Machine Coding
      behavioral: 'sg5pwazWomM',             // HR Round
    },
  },

  // INTERVIEW PREP - RESOURCES TAB
  prepResources: {
    dsaCrashCourse: '3Pq9blTtKfE',           // DSA fundamentals
    systemDesignBasics: '3Pq9blTtKfE',       // System design intro
    behavioralTips: '3Pq9blTtKfE',           // HR round preparation

    // Additional resource videos
    leetCodeStrategy: '3Pq9blTtKfE',         // How to practice LeetCode
    mockInterviewTips: '3Pq9blTtKfE',        // Mock interview guidance
    resumeBuilding: '3Pq9blTtKfE',           // Resume optimization
    salaryNegotiation: '3Pq9blTtKfE',        // Negotiation strategies
  },

  // LEARNING PATH SECTION (optional future use)
  learningPath: {
    gettingStarted: '3Pq9blTtKfE',
    dsaFundamentals: '_dl8KiU1HYY',        // DSA
    systemDesignIntro: 'o39hGS4ef6E',       // System Design
    backendDevelopment: '6yJ8eTtId8A',      // Real-World Projects
    databaseDesign: '3Pq9blTtKfE',
  },

  // PROJECTS SECTION (optional)
  projectGuides: {
    portfolioWebsite: '3Pq9blTtKfE',
    restApi: '3Pq9blTtKfE',
    microservices: '3Pq9blTtKfE',
    systemDesignProject: '3Pq9blTtKfE',
  },
};

/**
 * Helper function to get video ID with fallback
 */
export const getVideoId = (path, fallback = '3Pq9blTtKfE') => {
  try {
    const keys = path.split('.');
    let value = VIDEO_IDS;

    for (const key of keys) {
      value = value[key];
      if (!value) return fallback;
    }

    return value || fallback;
  } catch (error) {
    console.warn(`Video ID not found for path: ${path}`);
    return fallback;
  }
};

/**
 * Helper function to get full YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Get role-specific hero video ID
 */
export const getHeroVideoForRole = (roleKey) => {
  const videoId = VIDEO_IDS.hero[roleKey] || VIDEO_IDS.hero.founderMessage;
  return videoId;
};

/**
 * Get video ID based on background and context
 */
export const getContextualVideoId = (section, background = 'tech', context = {}) => {
  switch (section) {
    case 'hero':
      // If roleKey is provided in context, use role-specific video
      if (context.roleKey) {
        return getHeroVideoForRole(context.roleKey);
      }
      return VIDEO_IDS.hero.founderMessage;

    case 'companyInsights':
      return VIDEO_IDS.companies[context.companyType] || VIDEO_IDS.companies['Big Tech'];

    case 'interviewRound':
      const roundType = background === 'tech' ? 'tech' : 'nonTech';
      return VIDEO_IDS.interviewRounds[roundType][context.roundKey] || '3Pq9blTtKfE';

    case 'prepResource':
      return VIDEO_IDS.prepResources[context.resourceKey] || '3Pq9blTtKfE';

    default:
      return '3Pq9blTtKfE';
  }
};

export default VIDEO_IDS;
