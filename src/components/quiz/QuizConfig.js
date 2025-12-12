/**
 * COMPLETE QUIZ CONFIGURATION - Free Profile Evaluator Flow
 *
 * Architecture:
 * 1. Background Selection (Tech / Non-Tech) - determines which flow
 * 2. Conditional flows based on background
 * 3. Dynamic skills selection based on target role
 * 4. Generate Roadmap CTA
 */

import React from 'react';
import {
  Code,
  Database,
  Cube,
  CloudArrowUp,
  ChartBar,
  ShieldCheck,
  Gauge,
  FileCode,
  GitBranch,
  Clock,
  Lightning,
  FireSimple,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Gear,
  Graph
} from 'phosphor-react';
import { getSkillsFromCache } from '../../utils/quizSkillLoader';

// ============================================================
// SHARED OPTIONS
// ============================================================

const TARGET_ROLES = [
  { value: 'Backend Engineer', label: 'Backend Engineer', icon: <Database size={24} weight="duotone" />, category: 'Backend Engineering' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer', icon: <Code size={24} weight="duotone" />, category: 'Frontend Engineering' },
  { value: 'Full Stack Engineer', label: 'Full-Stack Engineer', icon: <Cube size={24} weight="duotone" />, category: 'Software Engineering' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: <Gear size={24} weight="duotone" />, category: 'DevOps & Cloud Computing' },
  { value: 'Data Science Engineer', label: 'Data Science Engineer', icon: <Graph size={24} weight="duotone" />, category: 'Data Science' },
];

// ============================================================
// TECH PROFESSIONAL OPTIONS
// ============================================================

const TECH_CURRENT_ROLES = [
  { value: 'swe-product', label: 'Software Engineer - Product Company', icon: <Cube size={24} weight="duotone" /> },
  { value: 'swe-service', label: 'Software Engineer - Service Company', icon: <Briefcase size={24} weight="duotone" /> },
  { value: 'devops', label: 'DevOps / Cloud / Infrastructure Engineer', icon: <CloudArrowUp size={24} weight="duotone" /> },
  { value: 'qa', label: 'QA / Support / Other Technical Role', icon: <ShieldCheck size={24} weight="duotone" /> },
];

const TECH_EXPERIENCE = [
  { value: '0-2', label: '0-2 years', icon: <Clock size={24} weight="duotone" /> },
  { value: '2-5', label: '2-5 years', icon: <Briefcase size={24} weight="duotone" /> },
  { value: '5-8', label: '5-8 years', icon: <FireSimple size={24} weight="duotone" /> },
  { value: '8+', label: '8+ years', icon: <CheckCircle size={24} weight="duotone" /> },
];

const TECH_PROBLEM_SOLVING = [
  { value: '100+', label: 'Very Active (100+ problems)', icon: <Lightning size={24} weight="duotone" /> },
  { value: '51-100', label: 'Moderately Active (50-100 problems)', icon: <FireSimple size={24} weight="duotone" /> },
  { value: '11-50', label: 'Somewhat Active (10-50 problems)', icon: <Gauge size={24} weight="duotone" /> },
  { value: '0-10', label: 'Not Active (0-10 problems)', icon: <Clock size={24} weight="duotone" /> },
];

const TECH_SYSTEM_DESIGN = [
  { value: 'multiple', label: 'Led design discussions', icon: <Cube size={24} weight="duotone" /> },
  { value: 'once', label: 'Participated in discussions', icon: <ChartBar size={24} weight="duotone" /> },
  { value: 'learning', label: 'Self-learning only', icon: <FileCode size={24} weight="duotone" /> },
  { value: 'not-yet', label: 'Not yet, will learn', icon: <Clock size={24} weight="duotone" /> },
];

const TECH_PORTFOLIO = [
  { value: 'active-5+', label: 'Active (5+ public repos)', icon: <GitBranch size={24} weight="duotone" /> },
  { value: 'limited-1-5', label: 'Limited (1-5 repos)', icon: <GitBranch size={24} weight="duotone" /> },
  { value: 'inactive', label: 'Inactive (old activity)', icon: <Clock size={24} weight="duotone" /> },
  { value: 'none', label: 'No portfolio yet', icon: <GraduationCap size={24} weight="duotone" /> },
];

// ============================================================
// NON-TECH / CAREER SWITCHER OPTIONS
// ============================================================

const NONTECH_BACKGROUND = [
  { value: 'sales-marketing', label: 'Sales / Marketing / Business', icon: <ChartBar size={24} weight="duotone" /> },
  { value: 'operations', label: 'Operations / Consulting / PM', icon: <Gear size={24} weight="duotone" /> },
  { value: 'design', label: 'Design (UI/UX / Graphic / Product)', icon: <Cube size={24} weight="duotone" /> },
  { value: 'finance', label: 'Finance / Accounting / Banking', icon: <Briefcase size={24} weight="duotone" /> },
  { value: 'other', label: 'Other Non-Tech / Fresh Grad', icon: <GraduationCap size={24} weight="duotone" /> },
];

const NONTECH_EXPERIENCE = [
  { value: '0', label: '0 years (Fresh grad)', icon: <GraduationCap size={24} weight="duotone" /> },
  { value: '0-2', label: '0-2 years', icon: <Clock size={24} weight="duotone" /> },
  { value: '2-3', label: '2-3 years', icon: <Clock size={24} weight="duotone" /> },
  { value: '3-5', label: '3-5 years', icon: <Briefcase size={24} weight="duotone" /> },
  { value: '5+', label: '5+ years', icon: <CheckCircle size={24} weight="duotone" /> },
];

const NONTECH_STEPS_TAKEN = [
  { value: 'bootcamp', label: 'Attended bootcamp/workshop', icon: <GraduationCap size={24} weight="duotone" /> },
  { value: 'completed-course', label: 'Completed online courses', icon: <CheckCircle size={24} weight="duotone" /> },
  { value: 'built-projects', label: 'Built 1-2 small projects', icon: <Code size={24} weight="duotone" /> },
  { value: 'self-learning', label: 'Self-learning (YouTube/blogs)', icon: <FileCode size={24} weight="duotone" /> },
  { value: 'just-exploring', label: 'Just exploring, haven\'t started', icon: <Clock size={24} weight="duotone" /> },
];

const NONTECH_TARGET_ROLES = [
  { value: 'Backend Engineer', label: 'Backend Engineer', icon: <Database size={24} weight="duotone" />, category: 'Backend Engineering' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer', icon: <Code size={24} weight="duotone" />, category: 'Frontend Engineering' },
  { value: 'Full Stack Engineer', label: 'Full-Stack Engineer', icon: <Cube size={24} weight="duotone" />, category: 'Software Engineering' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: <Gear size={24} weight="duotone" />, category: 'DevOps & Cloud Computing' },
  { value: 'Data Science Engineer', label: 'Data Science Engineer', icon: <Graph size={24} weight="duotone" />, category: 'Data Science' },
];

const NONTECH_CODE_COMFORT = [
  { value: 'confident', label: 'Confident (solve simple problems independently)', icon: <CheckCircle size={24} weight="duotone" /> },
  { value: 'learning', label: 'Learning (follow tutorials, struggle alone)', icon: <FileCode size={24} weight="duotone" /> },
  { value: 'beginner', label: 'Beginner (understand concepts, can\'t code yet)', icon: <Gauge size={24} weight="duotone" /> },
  { value: 'complete-beginner', label: 'Complete Beginner (haven\'t tried yet)', icon: <Clock size={24} weight="duotone" /> },
];

// ============================================================
// QUIZ SCREENS - COMPLETE FLOW
// ============================================================

/**
 * Get quiz screens based on user background
 * Creates dynamic flow for tech vs non-tech users
 * Consolidated: max 3 questions per screen to minimize clicks
 */
export const getQuizScreens = (background) => {
  const baseScreens = [
    // Screen 1: Background Selection - Simple, clean first screen
    {
      id: 'background',
      initialChatText: "Let's get started with your profile",
      singleColumn: true,
      questions: [
        {
          id: 'background',
          question: 'What\'s your current background?',
          type: 'button-grid',
          options: [
            {
              value: 'non-tech',
              label: 'Non-Tech / Career Switcher',
              description: 'Coming from sales, design, consulting, or other non-technical background',
              icon: <GraduationCap size={24} weight="duotone" />
            },
            {
              value: 'tech',
              label: 'Tech Professional',
              description: 'Already working as a software engineer or in a technical role',
              icon: <Code size={24} weight="duotone" />
            },
          ]
        }
      ]
    }
  ];

  if (background === 'tech') {
    return [
      ...baseScreens,
      // TECH PROFESSIONAL FLOW - CONSOLIDATED
      // Screen 2: WHO YOU ARE (Current Role + Experience)
      {
        id: 'tech-who-are-you',
        initialChatText: "Great! Let's understand your current tech experience.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentRole',
            question: 'What\'s your current role in the tech world?',
            type: 'button-grid',
            options: TECH_CURRENT_ROLES
          },
          {
            id: 'yearsOfExperience',
            question: 'How many years have you been in the tech industry?',
            type: 'radio-buttons',
            options: TECH_EXPERIENCE
          }
        ],
        chatResponseMap: {
          currentRole: {
            'swe-product': 'Awesome! Product companies offer great learning opportunities and cutting-edge tech stacks.',
            'swe-service': 'Got it! Many engineers successfully level up from service to product companies.',
            'devops': 'Great! DevOps and infrastructure engineers are in high demand right now.',
            'qa': 'Perfect! Many successful engineers started in QA/support roles.'
          },
          yearsOfExperience: {
            '0-2': 'Early in your career - perfect time to build strong foundations!',
            '2-5': 'Great timing! You\'re building solid experience. Strategic skill development pays off now.',
            '5-8': 'Solid experience! Time to level up to senior roles or high-growth opportunities.',
            '8+': 'Impressive! With 8+ years, you can target staff/principal or leadership roles.'
          }
        }
      },

      // Screen 3: TARGET ROLE + DSA PRACTICE
      {
        id: 'tech-goals',
        initialChatText: "Now, let's understand what you're preparing for.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'targetRole',
            question: 'Which role are you preparing for?',
            type: 'button-grid',
            options: TARGET_ROLES
          },
          {
            id: 'problemSolving',
            question: 'How active are you with DSA practice?',
            type: 'radio-buttons',
            options: TECH_PROBLEM_SOLVING
          }
        ],
        chatResponseMap: {
          targetRole: {
            'Backend Engineer': 'Excellent choice! Backend roles are foundational to every tech company.',
            'Frontend Engineer': 'Great! Frontend engineers create the experiences users love.',
            'Full Stack Engineer': 'Perfect! Full-stack engineers are versatile and highly valued.',
            'DevOps Engineer': 'Awesome! DevOps is critical for modern software delivery.',
            'Data Science Engineer': 'Fantastic! Data roles are shaping the future of tech.'
          },
          problemSolving: {
            '100+': 'Impressive! You\'re very active with problem-solving. That discipline shows.',
            '51-100': 'Great work! You\'re consistently practicing. Keep that momentum going.',
            '11-50': 'Good start! Regular practice will compound quickly.',
            '0-10': 'Perfect timing to ramp up! Even 15 mins daily makes a huge difference.'
          }
        }
      },

      // Screen 4: READINESS ASSESSMENT (System Design + Portfolio)
      {
        id: 'tech-readiness',
        initialChatText: "Let's assess your current readiness level.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'systemDesign',
            question: 'How comfortable are you with system design?',
            type: 'radio-buttons',
            options: TECH_SYSTEM_DESIGN
          },
          {
            id: 'portfolio',
            question: 'How active is your GitHub / GitLab profile?',
            type: 'radio-buttons',
            options: TECH_PORTFOLIO
          }
        ],
        chatResponseMap: {
          systemDesign: {
            'multiple': 'Excellent! Leading design discussions shows senior-level thinking.',
            'once': 'Great! Participating in discussions builds your design intuition.',
            'learning': 'Perfect timing to deepen your system design knowledge!',
            'not-yet': 'No worries! System design is learnable with the right guidance.'
          },
          portfolio: {
            'active-5+': 'Fantastic! An active GitHub shows your commitment and passion.',
            'limited-1-5': 'Good! Let\'s make your portfolio even stronger.',
            'inactive': 'Let\'s revive your portfolio with some fresh projects!',
            'none': 'No problem! We\'ll help you build impressive projects to showcase.'
          }
        }
      },

      // Screen 5: SKILLS SELECTION
      {
        id: 'skills',
        initialChatText: "Excellent! Now let's understand your current technical skills.\n\nSelect all the skills you're comfortable using independently.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentSkills',
            getDynamicQuestion: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              return `Which of these ${category.toLowerCase()} skills do you already have?`;
            },
            type: 'multi-select-pills',
            getDynamicOptions: (responses) => {
              // Load skills from persona cache (skills are preloaded in QuizOrchestrator)
              const skillObjects = getSkillsFromCache(responses);
              const skills = skillObjects.map(s => s.name);

              console.log('🎯 getDynamicOptions (TECH) called:', {
                cacheSize: skillObjects.length,
                firstFewSkills: skills.slice(0, 3),
                targetRole: responses?.targetRole
              });

              if (skills.length === 0) {
                console.warn('⚠️ WARNING: Skills cache is empty! Skills may not have loaded yet.');
              }

              return skills.map(skill => ({
                value: skill,
                label: skill,
                icon: getSkillIcon(skill)
              }));
            }
          }
        ]
      }
    ];
  } else {
    // NON-TECH / CAREER SWITCHER FLOW - CONSOLIDATED
    return [
      ...baseScreens,
      // Screen 2: WHO YOU ARE (Background + Experience + Steps Taken)
      {
        id: 'nontech-who-are-you',
        initialChatText: "Great! Let's understand your professional background.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentBackground',
            question: 'What\'s your current professional background?',
            type: 'button-grid',
            options: NONTECH_BACKGROUND
          },
          {
            id: 'yearsOfExperience',
            question: 'How many years of work experience do you have?',
            type: 'radio-buttons',
            options: NONTECH_EXPERIENCE
          },
          {
            id: 'stepsTaken',
            question: 'What steps have you taken toward a tech career so far?',
            type: 'button-grid',
            options: NONTECH_STEPS_TAKEN
          }
        ],
        chatResponseMap: {
          currentBackground: {
            'sales-marketing': 'Excellent! Sales & marketing pros bring valuable customer insights to tech.',
            'operations': 'Great! Ops and consulting experience is valuable for problem-solving in tech.',
            'design': 'Perfect! Designers transitioning to tech have a unique advantage in UX.',
            'finance': 'Wonderful! Analytical skills from finance translate well to data and backend roles.',
            'other': 'Fantastic! Diverse backgrounds bring fresh perspectives to tech teams.'
          },
          yearsOfExperience: {
            '0': 'Fresh start! Career switchers at this stage adapt quickly and learn fast.',
            '0-2': 'You bring fresh energy! Career switchers at this stage adapt quickly.',
            '2-3': 'Great timing! You have professional maturity while still being flexible.',
            '3-5': 'Perfect! Your experience adds value while you\'re building tech skills.',
            '5+': 'Excellent! Senior professionals bring leadership and domain expertise to tech.'
          },
          stepsTaken: {
            'bootcamp': 'Great! Bootcamps provide structured learning and hands-on experience.',
            'completed-course': 'Awesome! Completing courses shows commitment and follow-through.',
            'built-projects': 'Perfect! Building projects is the best way to learn. Keep going!',
            'self-learning': 'Excellent start! Self-learning shows initiative and resourcefulness.',
            'just-exploring': 'Welcome! Everyone starts somewhere. Let\'s build your roadmap together.'
          }
        }
      },

      // Screen 3: WHERE YOU WANT TO GO (Target Role + Company + Code Comfort)
      {
        id: 'nontech-goals-readiness',
        initialChatText: "Now, let's talk about your tech career goals and readiness.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'targetRole',
            question: 'Which tech role excites you the most?',
            type: 'button-grid',
            options: NONTECH_TARGET_ROLES
          },
          {
            id: 'codeComfort',
            question: 'How comfortable are you with coding right now?',
            type: 'radio-buttons',
            options: NONTECH_CODE_COMFORT
          }
        ],
        chatResponseMap: {
          targetRole: {
            'Backend Engineer': 'Excellent choice! Backend is a solid foundation for any tech career.',
            'Frontend Engineer': 'Great! Frontend lets you see your work come to life visually.',
            'Full Stack Engineer': 'Perfect! Full-stack gives you the complete picture.',
            'DevOps Engineer': 'Awesome! DevOps is crucial and has great career prospects.',
            'Data Science Engineer': 'Fantastic! Data is transforming every industry right now.'
          },
          codeComfort: {
            'confident': 'Excellent! You\'re ready to build real projects and level up quickly.',
            'learning': 'Great! You\'re in the learning phase. Consistency is key now.',
            'beginner': 'Perfect! Understanding concepts first is the right approach.',
            'complete-beginner': 'Welcome! We\'ll start from the basics and build up systematically.'
          }
        }
      },

      // Screen 4: SKILLS SELECTION
      {
        id: 'skills',
        initialChatText: "Perfect! Now let's understand your current skills.\n\nSelect all the skills you already have or are familiar with.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentSkills',
            getDynamicQuestion: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = NONTECH_TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              return `Which of these ${category.toLowerCase()} skills do you already have?`;
            },
            type: 'multi-select-pills',
            getDynamicOptions: (responses) => {
              // Load skills from persona cache (skills are preloaded in QuizOrchestrator)
              const skillObjects = getSkillsFromCache(responses);
              const skills = skillObjects.map(s => s.name);

              console.log('🎯 getDynamicOptions (NON-TECH) called:', {
                cacheSize: skillObjects.length,
                firstFewSkills: skills.slice(0, 3),
                targetRole: responses?.targetRole
              });

              if (skills.length === 0) {
                console.warn('⚠️ WARNING: Skills cache is empty! Skills may not have loaded yet.');
              }

              return skills.map(skill => ({
                value: skill,
                label: skill,
                icon: getSkillIcon(skill)
              }));
            }
          }
        ]
      }
    ];
  }
};

// Legacy export for backward compatibility
export const QUIZ_SCREENS = getQuizScreens('tech');

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get skill icon based on skill name
 */
function getSkillIcon(skill, size = 18) {
  const skillLower = skill.toLowerCase();

  if (skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('node') || skillLower.includes('go')) {
    return <Code size={size} weight="duotone" />;
  }
  if (skillLower.includes('data structures') || skillLower.includes('algorithms')) {
    return <ChartBar size={size} weight="duotone" />;
  }
  if (skillLower.includes('system design')) {
    return <Cube size={size} weight="duotone" />;
  }
  if (skillLower.includes('sql') || skillLower.includes('database') || skillLower.includes('nosql') || skillLower.includes('mongodb') || skillLower.includes('redis')) {
    return <Database size={size} weight="duotone" />;
  }
  if (skillLower.includes('api') || skillLower.includes('rest') || skillLower.includes('graphql')) {
    return <FileCode size={size} weight="duotone" />;
  }
  if (skillLower.includes('microservices') || skillLower.includes('architecture')) {
    return <Cube size={size} weight="duotone" />;
  }
  if (skillLower.includes('docker') || skillLower.includes('kubernetes')) {
    return <CloudArrowUp size={size} weight="duotone" />;
  }
  if (skillLower.includes('aws') || skillLower.includes('cloud')) {
    return <CloudArrowUp size={size} weight="duotone" />;
  }
  if (skillLower.includes('kafka') || skillLower.includes('queue') || skillLower.includes('message')) {
    return <ChartBar size={size} weight="duotone" />;
  }
  if (skillLower.includes('caching') || skillLower.includes('performance')) {
    return <Gauge size={size} weight="duotone" />;
  }
  if (skillLower.includes('security') || skillLower.includes('authentication')) {
    return <ShieldCheck size={size} weight="duotone" />;
  }
  if (skillLower.includes('ci/cd') || skillLower.includes('git')) {
    return <GitBranch size={size} weight="duotone" />;
  }

  return <Code size={size} weight="duotone" />;
}

/**
 * Screen completion validation
 */
export function isScreenComplete(screen, responses, profileData) {
  if (!screen || !screen.questions) return false;

  return screen.questions.every(question => {
    const value = responses[question.id];

    // Info with CTA: check if CTA was clicked
    if (question.type === 'info-with-cta') {
      return value !== undefined && value !== null;
    }

    // Multi-select pills: check if array has at least one item
    if (question.type === 'multi-select-pills') {
      return Array.isArray(value) && value.length > 0;
    }

    // Button grid: check if single value selected
    if (question.type === 'button-grid') {
      return value !== undefined && value !== null && value !== '';
    }

    // Radio buttons: check if single value selected
    if (question.type === 'radio-buttons') {
      return value !== undefined && value !== null && value !== '';
    }

    // Default: check if value exists
    return value !== undefined && value !== null && value !== '';
  });
}
