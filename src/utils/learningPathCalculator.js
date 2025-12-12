/**
 * LEARNING PATH CALCULATOR - Dynamic phase generation based on user's quiz responses
 *
 * Logic:
 * - Phase 1: Skills (title varies by skill coverage %, DSA emphasis if weak)
 * - Phase 2: System Design (if weak) OR Role-specific (DevOps/Performance)
 * - Phase 3: Role-specific (if SD was Phase 2) OR Interview Prep (if SD skipped)
 * - Phase 4: Projects & Portfolio (always)
 *
 * Inputs:
 * - quizResponses.currentSkills (array) → skill coverage %
 * - quizResponses.problemSolving → DSA level (0-10, 11-50, 51-100, 100+)
 * - quizResponses.systemDesign → SD level (not-yet, learning, once, multiple)
 * - role → backend, frontend, fullstack, devops, data
 */

// ============================================
// PHASE TEMPLATES - All possible phases
// ============================================

// ============================================
// VIDEO URLs - Add your YouTube embed URLs here
// Format: https://www.youtube.com/embed/VIDEO_ID
// ============================================
const PHASE_VIDEOS = {
  // Skills phases
  'skills-beginner': '',           // TODO: Add video for beginners
  'skills-intermediate-dsa-weak': '', // TODO: Add video for DSA focus
  'skills-intermediate': '',       // TODO: Add video for core skills
  'skills-advanced-dsa-weak': '',  // TODO: Add video for advanced DSA
  'skills-advanced': '',           // TODO: Add video for advanced skills
  // System Design phases
  'systemDesign-fundamentals': '', // TODO: Add system design intro video
  'systemDesign-intermediate': '', // TODO: Add system design deep dive video
  // Role-specific phases
  'backend-devops': '',            // TODO: Add DevOps video
  'frontend-performance': '',      // TODO: Add performance video
  'fullstack-ops': '',             // TODO: Add fullstack ops video
  'devops-advanced': '',           // TODO: Add advanced infra video
  'data-mlops': '',                // TODO: Add MLOps video
  // Other phases
  'interview-prep': '',            // TODO: Add interview prep video
  'projects': ''                   // TODO: Add portfolio building video
};

const SKILLS_PHASES = {
  // Very low skills (0-20%)
  'skills-beginner': {
    title: 'Foundation: Start from the Basics',
    duration: '8-10 weeks',
    videoUrl: PHASE_VIDEOS['skills-beginner'],
    whatYouLearn: [
      { title: 'Programming Fundamentals', description: 'Master core language concepts and syntax' },
      { title: 'Data Structures Basics', description: 'Arrays, strings, linked lists, stacks, queues' },
      { title: 'Problem Solving Mindset', description: 'Learn to break down problems systematically' }
    ],
    target: 'Build a solid programming foundation',
    whyItMatters: [
      'Strong fundamentals accelerate all future learning',
      'Most interview rejections happen due to weak basics',
      'Confidence in basics lets you tackle complex problems'
    ]
  },

  // Low-medium skills (20-50%) with weak DSA
  'skills-intermediate-dsa-weak': {
    title: 'Building Core Skills & Problem Solving',
    duration: '6-8 weeks',
    videoUrl: PHASE_VIDEOS['skills-intermediate-dsa-weak'],
    whatYouLearn: [
      { title: 'DSA Fundamentals', description: 'Trees, graphs, sorting, searching algorithms' },
      { title: 'Core Technical Skills', description: 'Fill gaps in your current skill set' },
      { title: 'Coding Practice', description: 'Solve 50+ LeetCode problems across patterns' }
    ],
    target: 'Reach interview-ready DSA proficiency',
    whyItMatters: [
      'DSA is the primary filter in tech interviews',
      'Pattern recognition comes from consistent practice',
      'Strong DSA opens doors to top companies'
    ]
  },

  // Low-medium skills (20-50%) with decent DSA
  'skills-intermediate': {
    title: 'Building Core Competencies',
    duration: '6-8 weeks',
    videoUrl: PHASE_VIDEOS['skills-intermediate'],
    whatYouLearn: [
      { title: 'Core Backend/Frontend Skills', description: 'Master the essential technologies' },
      { title: 'Best Practices', description: 'Learn industry-standard patterns and approaches' },
      { title: 'Tool Proficiency', description: 'Git, debugging, testing fundamentals' }
    ],
    target: 'Become proficient in role-specific technologies',
    whyItMatters: [
      'Core skills are non-negotiable for any role',
      'Depth in fundamentals beats breadth in trends',
      'Companies value engineers who know their tools well'
    ]
  },

  // High skills (50%+) with weak DSA
  'skills-advanced-dsa-weak': {
    title: 'Level Up: Advanced Skills & DSA',
    duration: '6-8 weeks',
    videoUrl: PHASE_VIDEOS['skills-advanced-dsa-weak'],
    whatYouLearn: [
      { title: 'Advanced DSA', description: 'Dynamic programming, graphs, advanced trees' },
      { title: 'Optimization Techniques', description: 'Time/space complexity optimization' },
      { title: 'Interview Patterns', description: 'Master the top 15 DSA patterns' }
    ],
    target: 'Crack DSA rounds at top companies',
    whyItMatters: [
      'Your skills are strong - DSA is the missing piece',
      'Top companies heavily weight algorithmic ability',
      'Consistent practice builds pattern recognition'
    ]
  },

  // High skills (50%+) with decent DSA
  'skills-advanced': {
    title: 'Advancing Your Technical Expertise',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['skills-advanced'],
    whatYouLearn: [
      { title: 'Advanced Concepts', description: 'Deep dive into complex topics in your stack' },
      { title: 'Performance & Optimization', description: 'Write efficient, production-grade code' },
      { title: 'Architecture Patterns', description: 'Understand when to use which patterns' }
    ],
    target: 'Move from good to great in your core skills',
    whyItMatters: [
      'Depth differentiates senior from mid-level',
      'Advanced knowledge shows in system design rounds',
      'You can mentor others only when you have depth'
    ]
  }
};

const SYSTEM_DESIGN_PHASES = {
  // For those who don't know SD
  'systemDesign-fundamentals': {
    title: 'System Design Fundamentals',
    duration: '6-8 weeks',
    videoUrl: PHASE_VIDEOS['systemDesign-fundamentals'],
    whatYouLearn: [
      { title: 'Design Principles', description: 'Scalability, availability, consistency trade-offs' },
      { title: 'Building Blocks', description: 'Load balancers, caches, databases, queues' },
      { title: 'Common Patterns', description: 'URL shortener, rate limiter, notification system' }
    ],
    target: 'Design systems handling millions of users',
    whyItMatters: [
      'System design is tested at every level now',
      'Shows you can think beyond just coding',
      'Critical for senior roles and promotions'
    ]
  },

  // For those learning SD
  'systemDesign-intermediate': {
    title: 'System Design Deep Dive',
    duration: '6-8 weeks',
    videoUrl: PHASE_VIDEOS['systemDesign-intermediate'],
    whatYouLearn: [
      { title: 'Distributed Systems', description: 'CAP theorem, consensus, replication' },
      { title: 'Real-world Systems', description: 'Design Twitter, YouTube, Uber architecture' },
      { title: 'Trade-off Analysis', description: 'Make and justify architectural decisions' }
    ],
    target: 'Confidently tackle any system design interview',
    whyItMatters: [
      'Mid-level roles expect solid SD fundamentals',
      'Understanding systems makes you a better engineer',
      'Architecture skills compound over your career'
    ]
  }
};

// Role-specific phases (when SD is already strong)
const ROLE_SPECIFIC_PHASES = {
  backend: {
    title: 'DevOps & Cloud Infrastructure',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['backend-devops'],
    whatYouLearn: [
      { title: 'Containerization', description: 'Docker, Kubernetes fundamentals' },
      { title: 'CI/CD Pipelines', description: 'Automate testing and deployment' },
      { title: 'Cloud Services', description: 'AWS/GCP core services for backend' }
    ],
    target: 'Deploy and operate production systems',
    whyItMatters: [
      'Modern backend roles expect DevOps knowledge',
      'Understanding deployment makes debugging easier',
      'Cloud skills are increasingly required'
    ]
  },

  frontend: {
    title: 'Performance & Accessibility',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['frontend-performance'],
    whatYouLearn: [
      { title: 'Web Performance', description: 'Core Web Vitals, lazy loading, optimization' },
      { title: 'Accessibility (a11y)', description: 'WCAG guidelines, screen reader support' },
      { title: 'Testing Strategies', description: 'Unit, integration, E2E testing' }
    ],
    target: 'Build fast, accessible web applications',
    whyItMatters: [
      'Performance directly impacts user experience',
      'Accessibility is increasingly a legal requirement',
      'Top companies prioritize these skills'
    ]
  },

  fullstack: {
    title: 'DevOps & Full Stack Operations',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['fullstack-ops'],
    whatYouLearn: [
      { title: 'Docker & Deployment', description: 'Containerize and deploy full stack apps' },
      { title: 'Database Operations', description: 'Scaling, backups, query optimization' },
      { title: 'Monitoring & Logging', description: 'Observability for full stack systems' }
    ],
    target: 'Own the complete application lifecycle',
    whyItMatters: [
      'Full stack means full ownership',
      'Understanding ops makes you more valuable',
      'Startups especially value this breadth'
    ]
  },

  devops: {
    title: 'Advanced Infrastructure & SRE',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['devops-advanced'],
    whatYouLearn: [
      { title: 'Infrastructure as Code', description: 'Terraform, CloudFormation, Pulumi' },
      { title: 'SRE Principles', description: 'SLOs, error budgets, incident management' },
      { title: 'Security & Compliance', description: 'DevSecOps practices and tools' }
    ],
    target: 'Design and operate reliable infrastructure',
    whyItMatters: [
      'IaC is the standard for modern infrastructure',
      'SRE skills are highly sought after',
      'Security knowledge is increasingly critical'
    ]
  },

  data: {
    title: 'ML Ops & Data Pipelines',
    duration: '4-6 weeks',
    videoUrl: PHASE_VIDEOS['data-mlops'],
    whatYouLearn: [
      { title: 'Data Pipelines', description: 'Airflow, Spark, streaming architectures' },
      { title: 'ML Ops Basics', description: 'Model deployment, monitoring, versioning' },
      { title: 'Data Quality', description: 'Testing, validation, observability' }
    ],
    target: 'Build production-ready data systems',
    whyItMatters: [
      'Data engineering is evolving rapidly',
      'ML Ops bridges data science and engineering',
      'Production data skills are highly valued'
    ]
  }
};

const INTERVIEW_PREP_PHASE = {
  title: 'Interview Preparation & Mock Practice',
  duration: '4-6 weeks',
  videoUrl: PHASE_VIDEOS['interview-prep'],
  whatYouLearn: [
    { title: 'Mock Interviews', description: 'Practice with peers or platforms like Pramp' },
    { title: 'Behavioral Prep', description: 'STAR format stories, leadership principles' },
    { title: 'Company Research', description: 'Understand target companies\' interview styles' }
  ],
  target: 'Enter interviews with confidence',
  whyItMatters: [
    'Practice under pressure reveals weak spots',
    'Behavioral rounds trip up many candidates',
    'Company-specific prep increases success rate'
  ]
};

const PROJECTS_PHASE = {
  title: 'Build Your Portfolio',
  duration: '8-12 weeks',
  videoUrl: PHASE_VIDEOS['projects'],
  whatYouLearn: [
    { title: 'Showcase Projects', description: 'Build 2-3 projects that demonstrate your skills' },
    { title: 'Production Quality', description: 'Write clean, documented, tested code' },
    { title: 'Deployment & Demo', description: 'Deploy live and create compelling demos' }
  ],
  target: 'Have projects that impress interviewers',
  whyItMatters: [
    'Projects show you can ship, not just code',
    'Great talking points for behavioral rounds',
    'Demonstrates initiative and passion'
  ]
};

// ============================================
// MAIN CALCULATOR FUNCTION
// ============================================

/**
 * Calculate personalized learning path phases from persona data
 *
 * SIMPLE LOGIC:
 * - Phase 1-2: Conditional (show based on skill coverage)
 * - Phase 3-4: Always show
 *
 * @param {Object} persona - Persona object with learningPath.phases
 * @param {Object} quizResponses - User's quiz answers
 * @param {Array} allSkills - All skills available for the role (for calculating coverage)
 * @returns {Array} Filtered array of phase objects
 */
export function calculateLearningPath(persona, quizResponses = {}, allSkills = []) {
  const phases = [];

  // Get persona's defined phases
  const personaPhases = persona?.learningPath?.phases || [];

  if (personaPhases.length === 0) {
    console.warn('⚠️ No learning path phases found in persona');
    return [];
  }

  // Extract quiz data
  const selectedSkills = quizResponses.currentSkills || [];

  // Calculate skill coverage percentage
  const totalSkills = allSkills.length || 1;
  const skillCoverage = selectedSkills.length / totalSkills;

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('📚 Learning Path Calculator (Persona-driven):');
    console.log('   Skill coverage:', Math.round(skillCoverage * 100) + '%');
    console.log('   Total persona phases available:', personaPhases.length);
  }

  // ============================================
  // SIMPLE IF-ELSE LOGIC
  // ============================================

  // Phase 1: Show if skill coverage < 40% (beginner)
  if (skillCoverage < 0.4 && personaPhases[0]) {
    phases.push({ ...personaPhases[0], phaseNumber: phases.length + 1 });
  }

  // Phase 2: Show if skill coverage < 85% (intermediate)
  if (skillCoverage < 0.85 && personaPhases[1]) {
    phases.push({ ...personaPhases[1], phaseNumber: phases.length + 1 });
  }

  // Phase 3-4: Always show (advanced + interview prep)
  if (personaPhases[2]) {
    phases.push({ ...personaPhases[2], phaseNumber: phases.length + 1 });
  }
  if (personaPhases[3]) {
    phases.push({ ...personaPhases[3], phaseNumber: phases.length + 1 });
  }

  // Debug output
  if (typeof window !== 'undefined') {
    console.log('   Showing phases:', phases.map(p => `${p.phaseNumber}. ${p.title}`));
  }

  return phases;
}

/**
 * Get a summary of what the learning path covers
 * Useful for hero section or overview
 */
export function getLearningPathSummary(phases = []) {
  const totalWeeks = phases.reduce((sum, phase) => {
    const match = phase.duration?.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return {
    totalPhases: phases.length,
    estimatedWeeks: totalWeeks,
    estimatedMonths: Math.ceil(totalWeeks / 4),
    phasesTitles: phases.map(p => p.title)
  };
}

export default {
  calculateLearningPath,
  getLearningPathSummary
};
