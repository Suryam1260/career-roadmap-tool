/**
 * ALGORITHM HELPERS - Shared Utility Functions
 *
 * Core algorithm functions for skill analysis and roadmap generation.
 * Can be used by both frontend components and Next.js API routes.
 *
 * Based on Scaler CRT weighted algorithm:
 * - HIGH priority skills = weight 3
 * - MEDIUM priority skills = weight 2
 * - LOW priority skills = weight 1
 *
 * Match Score = (weighted_score / total_weight) × 100
 */

import { getSkillsWithPriorities, getPriorityWeight } from './skillPriorities';

/**
 * Calculate weighted match score for a user's skills against a target role
 * @param {Array<string>} userSkills - Skills the user has
 * @param {string} skillCategory - Target role category (e.g., 'Backend Engineering')
 * @returns {Object} { matchScore, weightedScore, totalWeight, skillCoverage }
 */
export const calculateMatchScore = (userSkills, skillCategory) => {
  const skillsWithPriorities = getSkillsWithPriorities(skillCategory);
  const allSkills = Object.keys(skillsWithPriorities);

  if (allSkills.length === 0) {
    return {
      matchScore: 0,
      weightedScore: 0,
      totalWeight: 0,
      skillCoverage: 0,
    };
  }

  let weightedScore = 0;
  let totalWeight = 0;

  // Calculate weighted score
  allSkills.forEach((skill) => {
    const priority = skillsWithPriorities[skill];
    const weight = getPriorityWeight(priority);

    totalWeight += weight;

    // If user has this skill, add its weight to their score
    if (userSkills.includes(skill)) {
      weightedScore += weight;
    }
  });

  // Calculate percentage
  const matchScore =
    totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;

  return {
    matchScore,
    weightedScore,
    totalWeight,
    skillCoverage: matchScore, // Alias for compatibility
  };
};

/**
 * Analyze user's skill gaps against target role requirements
 * @param {Array<string>} userSkills - Skills the user has
 * @param {string} skillCategory - Target role category
 * @returns {Object} { existingSkills, missingSkills, totalSkillsNeeded, skillsAcquired }
 */
export const analyzeSkillGaps = (userSkills, skillCategory) => {
  const skillsWithPriorities = getSkillsWithPriorities(skillCategory);
  const allRoleSkills = Object.keys(skillsWithPriorities);

  // Filter existing skills (only count those relevant to the role)
  const existingSkills = userSkills.filter((skill) =>
    allRoleSkills.includes(skill)
  );

  // Find missing skills
  const missingSkills = allRoleSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  // Categorize missing skills by priority
  const highPriority = [];
  const mediumPriority = [];
  const lowPriority = [];

  missingSkills.forEach((skill) => {
    const priority = skillsWithPriorities[skill];

    if (priority === 'HIGH') {
      highPriority.push(skill);
    } else if (priority === 'MEDIUM') {
      mediumPriority.push(skill);
    } else {
      lowPriority.push(skill);
    }
  });

  return {
    existingSkills,
    missingSkills: {
      highPriority,
      mediumPriority,
      lowPriority,
    },
    totalSkillsNeeded: allRoleSkills.length,
    skillsAcquired: existingSkills.length,
  };
};

/**
 * Prioritize a list of skills by their importance for the role
 * @param {Array<string>} skills - Skills to prioritize
 * @param {string} skillCategory - Target role category
 * @returns {Array<Object>} Sorted array of { skill, priority, priorityScore, reason }
 */
export const prioritizeSkills = (skills, skillCategory) => {
  const skillsWithPriorities = getSkillsWithPriorities(skillCategory);

  const priorityReasons = {
    HIGH: 'Essential skill for this role',
    MEDIUM: 'Important supporting skill',
    LOW: 'Nice-to-have skill',
  };

  const prioritized = skills.map((skill) => {
    const priority = skillsWithPriorities[skill] || 'LOW';
    const priorityScore = getPriorityWeight(priority);
    const reason = priorityReasons[priority] || 'Additional skill';

    return {
      skill,
      priority,
      priorityScore,
      reason,
    };
  });

  // Sort by priority score (descending: HIGH first, then MEDIUM, then LOW)
  prioritized.sort((a, b) => b.priorityScore - a.priorityScore);

  return prioritized;
};

/**
 * Get top N skills to learn, prioritized by importance
 * @param {Object} missingSkills - Object with highPriority, mediumPriority, lowPriority arrays
 * @param {number} count - Number of skills to return (default: 3)
 * @returns {Array<string>} Top skill names to learn
 */
export const getTopSkillsToLearn = (missingSkills, count = 3) => {
  const topSkills = [];

  // Add HIGH priority first
  topSkills.push(...(missingSkills.highPriority || []));

  // Add MEDIUM priority if we need more
  if (topSkills.length < count) {
    topSkills.push(...(missingSkills.mediumPriority || []));
  }

  // Add LOW priority if we still need more
  if (topSkills.length < count) {
    topSkills.push(...(missingSkills.lowPriority || []));
  }

  // Return only the requested count
  return topSkills.slice(0, count);
};

/**
 * Generate complete skill analysis for a user
 * Combines all analysis functions into one comprehensive output
 * @param {Array<string>} userSkills - Skills the user has
 * @param {string} skillCategory - Target role category
 * @returns {Object} Complete analysis including match score, gaps, prioritized skills, recommendations
 */
export const generateSkillAnalysis = (userSkills, skillCategory) => {
  // Calculate match score
  const matchData = calculateMatchScore(userSkills, skillCategory);

  // Analyze skill gaps
  const gapData = analyzeSkillGaps(userSkills, skillCategory);

  // Prioritize existing skills
  const prioritizedExisting = prioritizeSkills(
    gapData.existingSkills,
    skillCategory
  );

  // Prioritize missing skills
  const allMissing = [
    ...gapData.missingSkills.highPriority,
    ...gapData.missingSkills.mediumPriority,
    ...gapData.missingSkills.lowPriority,
  ];
  const prioritizedMissing = prioritizeSkills(allMissing, skillCategory);

  // Get top 3 skills to focus on
  const topSkillsToLearn = getTopSkillsToLearn(gapData.missingSkills, 3);

  return {
    // Match score data
    matchScore: matchData.matchScore,
    weightedScore: matchData.weightedScore,
    totalWeight: matchData.totalWeight,
    skillCoverage: matchData.skillCoverage,

    // Skill lists
    existingSkills: gapData.existingSkills,
    missingSkills: gapData.missingSkills,
    totalSkillsNeeded: gapData.totalSkillsNeeded,
    skillsAcquired: gapData.skillsAcquired,

    // Prioritized lists
    prioritizedExisting,
    prioritizedMissing,

    // Recommendations
    topSkillsToLearn,
  };
};

/**
 * Calculate estimated timeline based on skills and user profile
 * @param {Object} params - { userSkills, skillCategory, userTimeline, yearsExperience }
 * @returns {Object} { estimatedMonths, effortPerWeek, phases }
 */
export const calculateTimeline = ({
  userSkills,
  skillCategory,
  userTimeline,
  yearsExperience = 0,
}) => {
  const gapData = analyzeSkillGaps(userSkills, skillCategory);
  const totalMissing = Object.values(gapData.missingSkills).flat().length;

  // Base time per skill (in weeks)
  const baseWeeksPerSkill = {
    HIGH: 4, // 4 weeks per high priority skill
    MEDIUM: 2, // 2 weeks per medium priority skill
    LOW: 1, // 1 week per low priority skill
  };

  // Calculate base time
  let totalWeeks = 0;
  totalWeeks += gapData.missingSkills.highPriority.length * baseWeeksPerSkill.HIGH;
  totalWeeks += gapData.missingSkills.mediumPriority.length * baseWeeksPerSkill.MEDIUM;
  totalWeeks += gapData.missingSkills.lowPriority.length * baseWeeksPerSkill.LOW;

  // Apply experience multiplier
  let experienceMultiplier = 1.0;
  if (yearsExperience > 5) {
    experienceMultiplier = 0.7; // 30% faster
  } else if (yearsExperience > 2) {
    experienceMultiplier = 0.9; // 10% faster
  }

  totalWeeks *= experienceMultiplier;

  // Convert to months
  const estimatedMonths = Math.ceil(totalWeeks / 4);

  // Calculate effort per week based on user's chosen timeline
  const timelineMap = {
    '3-6 months': 5,
    '6-9 months': 7.5,
    '9-12 months': 10,
    '12-18 months': 15,
    '18+ months': 20,
    'just_exploring': 0,
  };

  const targetMonths = timelineMap[userTimeline] || estimatedMonths;
  const effortPerWeek = Math.ceil((totalWeeks * 10) / (targetMonths * 4)); // hours per week

  return {
    estimatedMonths,
    effortPerWeek: Math.min(effortPerWeek, 20), // Cap at 20 hours/week
    totalSkillsToLearn: totalMissing,
    breakdown: {
      highPrioritySkills: gapData.missingSkills.highPriority.length,
      mediumPrioritySkills: gapData.missingSkills.mediumPriority.length,
      lowPrioritySkills: gapData.missingSkills.lowPriority.length,
    },
  };
};

export default {
  calculateMatchScore,
  analyzeSkillGaps,
  prioritizeSkills,
  getTopSkillsToLearn,
  generateSkillAnalysis,
  calculateTimeline,
};
