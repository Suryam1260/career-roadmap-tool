/**
 * ROLE MAPPING - Profile Evaluator to Career Roadmap Tool
 *
 * Maps target roles from Free Profile Evaluator to skill categories
 * used in the Career Roadmap Tool.
 *
 * Profile Evaluator captures targetRole with values like:
 * - 'senior-backend', 'senior-fullstack', 'backend-sde', etc.
 *
 * Career Roadmap Tool uses broader categories:
 * - 'Backend Engineering', 'Frontend Engineering', 'Software Engineering', etc.
 *
 * This mapping connects the two systems.
 */

export const TARGET_ROLE_MAPPING = {
  // Backend roles
  'senior-backend': 'Backend Engineering',
  'backend-sde': 'Backend Engineering',

  // Full Stack roles
  'senior-fullstack': 'Software Engineering',
  'fullstack-sde': 'Software Engineering',

  // Data/ML roles
  'data-ml': 'Machine Learning',

  // Leadership/Advanced roles
  'tech-lead': 'Software Engineering', // Senior level, full-stack focus

  // Fallback mappings for other possible values
  'frontend': 'Frontend Engineering',
  'devops': 'DevOps & Cloud Computing',
  'data-science': 'Data Science',
  'data-analytics': 'Data Analytics',
};

/**
 * Get the skill category for a given target role
 * @param {string} targetRole - Role from Profile Evaluator (e.g., 'senior-backend')
 * @returns {string} Skill category (e.g., 'Backend Engineering')
 */
export const getSkillCategoryForRole = (targetRole) => {
  if (!targetRole) {
    return 'Software Engineering'; // Default
  }

  const normalized = targetRole.toLowerCase().trim();
  return TARGET_ROLE_MAPPING[normalized] || 'Software Engineering';
};

/**
 * Get a user-friendly display name for the target role
 * @param {string} targetRole - Role from Profile Evaluator
 * @returns {string} Display name
 */
export const getRoleDisplayName = (targetRole) => {
  const displayNames = {
    'senior-backend': 'Senior Backend Engineer',
    'backend-sde': 'Backend Engineer',
    'senior-fullstack': 'Senior Full-Stack Engineer',
    'fullstack-sde': 'Full-Stack Engineer',
    'data-ml': 'Data/ML Engineer',
    'tech-lead': 'Tech Lead / Staff Engineer',
    'frontend': 'Frontend Engineer',
    'devops': 'DevOps Engineer',
    'data-science': 'Data Scientist',
    'data-analytics': 'Data Analyst',
  };

  const normalized = targetRole?.toLowerCase().trim();
  return displayNames[normalized] || targetRole || 'Software Engineer';
};

/**
 * Get role description for display
 * @param {string} targetRole - Role from Profile Evaluator
 * @returns {string} Description
 */
export const getRoleDescription = (targetRole) => {
  const descriptions = {
    'senior-backend': 'Build robust and scalable backend systems',
    'backend-sde': 'Develop server-side applications and APIs',
    'senior-fullstack': 'Master both frontend and backend development',
    'fullstack-sde': 'Build end-to-end web applications',
    'data-ml': 'Create intelligent data-driven systems',
    'tech-lead': 'Lead technical teams and architecture',
    'frontend': 'Create engaging user interfaces',
    'devops': 'Build reliable infrastructure and deployment systems',
    'data-science': 'Extract insights from data',
    'data-analytics': 'Transform data into business intelligence',
  };

  const normalized = targetRole?.toLowerCase().trim();
  return descriptions[normalized] || 'Build amazing software';
};

export default {
  TARGET_ROLE_MAPPING,
  getSkillCategoryForRole,
  getRoleDisplayName,
  getRoleDescription,
};
