/**
 * SKILL PRIORITIES - Weighted Taxonomy
 *
 * Based on Scaler CRT algorithm for skill prioritization.
 * Each role has skills categorized by importance:
 *
 * - HIGH priority (weight: 3) - Must-have skills, critical for the role
 * - MEDIUM priority (weight: 2) - Important skills, enhances effectiveness
 * - LOW priority (weight: 1) - Nice-to-have skills, bonus/specialized
 *
 * Match score formula:
 * weighted_score = sum of (user's skills × their weights)
 * total_weight = sum of (all role skills × their weights)
 * match_score = (weighted_score / total_weight) × 100
 */

export const SKILL_PRIORITIES = {
  /**
   * BACKEND ENGINEERING
   * Focus: Server-side development, APIs, databases, scalability
   */
  'Backend Engineering': {
    HIGH: [
      'Python',
      'Java',
      'Node.js',
      'Data Structures & Algorithms',
      'System Design',
      'SQL & Databases',
      'REST APIs',
      'Git',
    ],
    MEDIUM: [
      'NoSQL (MongoDB/Redis)',
      'GraphQL',
      'Microservices Architecture',
      'Docker',
      'Kubernetes',
      'Message Queues (Kafka/RabbitMQ)',
      'Caching Strategies',
      'API Design & Documentation',
    ],
    LOW: [
      'AWS/Cloud Platforms',
      'CI/CD Pipelines',
      'Authentication & Security',
      'Performance Optimization',
      'Monitoring & Logging',
      'Serverless',
    ],
  },

  /**
   * FRONTEND ENGINEERING
   * Focus: User interfaces, web applications, responsive design
   */
  'Frontend Engineering': {
    HIGH: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML',
      'CSS',
      'State Management (Redux/Context)',
      'Responsive Design',
      'Git',
    ],
    MEDIUM: [
      'Next.js',
      'Vue.js',
      'Angular',
      'Webpack/Vite',
      'Testing (Jest/React Testing Library)',
      'REST APIs',
      'GraphQL',
      'CSS Frameworks (Tailwind/Bootstrap)',
    ],
    LOW: [
      'Progressive Web Apps',
      'Accessibility (WCAG)',
      'Performance Optimization',
      'Browser DevTools',
      'npm/yarn',
      'Svelte',
    ],
  },

  /**
   * SOFTWARE ENGINEERING (Full Stack focus)
   * Focus: End-to-end development, both frontend and backend
   */
  'Software Engineering': {
    HIGH: [
      'JavaScript',
      'Python',
      'Data Structures & Algorithms',
      'System Design',
      'Git',
      'SQL & Databases',
      'REST APIs',
      'Problem Solving',
    ],
    MEDIUM: [
      'React',
      'Node.js',
      'TypeScript',
      'NoSQL (MongoDB/Redis)',
      'Docker',
      'Testing (Unit/Integration)',
      'API Design',
      'Microservices',
    ],
    LOW: [
      'Kubernetes',
      'AWS/Cloud',
      'GraphQL',
      'CI/CD',
      'Message Queues',
      'Monitoring',
      'Performance Optimization',
    ],
  },

  /**
   * MACHINE LEARNING
   * Focus: AI/ML systems, data processing, model development
   */
  'Machine Learning': {
    HIGH: [
      'Python',
      'Mathematics (Linear Algebra/Calculus)',
      'Statistics & Probability',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'Machine Learning Algorithms',
      'Data Preprocessing',
    ],
    MEDIUM: [
      'Deep Learning',
      'TensorFlow',
      'PyTorch',
      'Neural Networks',
      'Feature Engineering',
      'Model Evaluation',
      'Data Visualization',
      'SQL',
      'Git',
    ],
    LOW: [
      'MLOps',
      'Model Deployment',
      'Computer Vision',
      'NLP',
      'Hyperparameter Tuning',
      'Cloud Platforms',
      'Docker',
    ],
  },

  /**
   * DATA SCIENCE
   * Focus: Data analysis, insights extraction, statistical modeling
   */
  'Data Science': {
    HIGH: [
      'Python',
      'SQL',
      'Statistics',
      'Probability',
      'Pandas',
      'NumPy',
      'Data Visualization',
      'Jupyter Notebooks',
    ],
    MEDIUM: [
      'Machine Learning',
      'Scikit-learn',
      'Matplotlib',
      'Seaborn',
      'Feature Engineering',
      'Model Evaluation',
      'A/B Testing',
      'R',
    ],
    LOW: [
      'Deep Learning',
      'TensorFlow',
      'PyTorch',
      'NLP',
      'Computer Vision',
      'Big Data (Spark/Hadoop)',
      'ETL',
    ],
  },

  /**
   * DATA ANALYTICS
   * Focus: Business intelligence, dashboards, data reporting
   */
  'Data Analytics': {
    HIGH: [
      'SQL',
      'Excel',
      'Data Visualization',
      'Business Intelligence',
      'Statistics',
      'Dashboard Creation',
      'Data Modeling',
    ],
    MEDIUM: [
      'Power BI',
      'Tableau',
      'Looker',
      'Python',
      'Pandas',
      'Google Analytics',
      'A/B Testing',
      'ETL Processes',
    ],
    LOW: [
      'R',
      'NumPy',
      'Data Warehousing',
      'Big Data Tools',
      'Machine Learning Basics',
      'Advanced Statistics',
    ],
  },

  /**
   * DEVOPS & CLOUD COMPUTING
   * Focus: Infrastructure, deployment, automation, reliability
   */
  'DevOps & Cloud Computing': {
    HIGH: [
      'Linux/Unix',
      'Bash Scripting',
      'Git',
      'Docker',
      'CI/CD',
      'AWS/Azure/GCP',
      'Networking Basics',
      'Monitoring & Logging',
    ],
    MEDIUM: [
      'Kubernetes',
      'Terraform',
      'Ansible',
      'Python',
      'Jenkins/GitLab CI',
      'Infrastructure as Code',
      'Load Balancing',
      'Security Fundamentals',
    ],
    LOW: [
      'Service Mesh',
      'Serverless',
      'Cloud Architecture',
      'Container Orchestration',
      'Advanced Networking',
      'Cost Optimization',
    ],
  },
};

/**
 * Get all skills for a role with their priorities
 * @param {string} skillCategory - Skill category (e.g., 'Backend Engineering')
 * @returns {Object} { skill: priority }
 */
export const getSkillsWithPriorities = (skillCategory) => {
  const categoryData = SKILL_PRIORITIES[skillCategory];

  if (!categoryData) {
    return {};
  }

  const skillsMap = {};

  // Add HIGH priority skills
  categoryData.HIGH.forEach((skill) => {
    skillsMap[skill] = 'HIGH';
  });

  // Add MEDIUM priority skills
  categoryData.MEDIUM.forEach((skill) => {
    skillsMap[skill] = 'MEDIUM';
  });

  // Add LOW priority skills
  categoryData.LOW.forEach((skill) => {
    skillsMap[skill] = 'LOW';
  });

  return skillsMap;
};

/**
 * Get all skills for a role (as array, sorted by priority)
 * @param {string} skillCategory - Skill category
 * @returns {Array<string>} Array of skill names
 */
export const getAllSkillsForRole = (skillCategory) => {
  const categoryData = SKILL_PRIORITIES[skillCategory];

  if (!categoryData) {
    return [];
  }

  // Return HIGH first, then MEDIUM, then LOW
  return [...categoryData.HIGH, ...categoryData.MEDIUM, ...categoryData.LOW];
};

/**
 * Get priority weight for calculation
 * @param {string} priority - 'HIGH', 'MEDIUM', or 'LOW'
 * @returns {number} Weight (3, 2, or 1)
 */
export const getPriorityWeight = (priority) => {
  const weights = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return weights[priority] || 1;
};

/**
 * Calculate match score (weighted)
 * @param {Array<string>} userSkills - Skills user has
 * @param {string} skillCategory - Target role category
 * @returns {Object} { matchScore, weightedScore, totalWeight }
 */
export const calculateMatchScore = (userSkills, skillCategory) => {
  const skillsWithPriorities = getSkillsWithPriorities(skillCategory);
  const allSkills = Object.keys(skillsWithPriorities);

  if (allSkills.length === 0) {
    return { matchScore: 0, weightedScore: 0, totalWeight: 0 };
  }

  let weightedScore = 0;
  let totalWeight = 0;

  // Calculate weighted score
  allSkills.forEach((skill) => {
    const priority = skillsWithPriorities[skill];
    const weight = getPriorityWeight(priority);

    totalWeight += weight;

    if (userSkills.includes(skill)) {
      weightedScore += weight;
    }
  });

  const matchScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;

  return {
    matchScore,
    weightedScore,
    totalWeight,
  };
};

/**
 * Prioritize skills by their importance
 * @param {Array<string>} skills - Skills to prioritize
 * @param {string} skillCategory - Role category
 * @returns {Array<Object>} Sorted array of {skill, priority, weight}
 */
export const prioritizeSkills = (skills, skillCategory) => {
  const skillsWithPriorities = getSkillsWithPriorities(skillCategory);

  return skills
    .map((skill) => ({
      skill,
      priority: skillsWithPriorities[skill] || 'LOW',
      weight: getPriorityWeight(skillsWithPriorities[skill] || 'LOW'),
    }))
    .sort((a, b) => b.weight - a.weight); // Sort by weight descending
};

export default {
  SKILL_PRIORITIES,
  getSkillsWithPriorities,
  getAllSkillsForRole,
  getPriorityWeight,
  calculateMatchScore,
  prioritizeSkills,
};
