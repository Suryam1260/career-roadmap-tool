/**
 * SKILL FILTER BY AXES - Filter which skills to recommend based on weak axes
 *
 * Only recommend skills that:
 * 1. User hasn't selected yet
 * 2. Are tagged to axes where user is weak (scored below baseline)
 */

/**
 * Filter skills by weak axes
 * Returns only skills tagged to axes where user is weak
 *
 * @param {Array} allSkills - All skills from persona (with axis tags)
 * @param {Array} userSelectedSkills - Skills user already selected
 * @param {Array} weakAxes - Axes where user scored below baseline
 * @returns {Object} Skills filtered by priority, organized by axis
 */
export function filterSkillsByWeakAxes(allSkills = [], userSelectedSkills = [], weakAxes = []) {
  const filtered = {
    high: [],
    medium: [],
    low: []
  };

  // If no weak axes, return empty (user is strong everywhere)
  if (!weakAxes || weakAxes.length === 0) {
    return filtered;
  }

  // Process each priority level
  Object.keys(filtered).forEach(priority => {
    const skillsAtPriority = allSkills[priority] || [];

    skillsAtPriority.forEach(skill => {
      // Skip if user already selected this skill
      if (userSelectedSkills.includes(skill.name || skill)) {
        return;
      }

      // Check if skill is tagged to any weak axis
      const skillAxes = skill.axes || [];
      // Include skill if: (1) it's tagged to a weak axis, or (2) it has no axis tags (fallback for incomplete mappings)
      const isRelevantToWeakAxis = skillAxes.length === 0 || skillAxes.some(axis => weakAxes.includes(axis));

      // Add if relevant to weak axis
      if (isRelevantToWeakAxis) {
        filtered[priority].push(skill.name || skill);
      }
    });
  });

  return filtered;
}

/**
 * Extract skill names from priority structure (for backward compatibility)
 *
 * @param {Object} skillPriorities - Skills organized by priority with axis tags
 * @returns {Object} Same structure but with skill names extracted
 */
export function extractSkillNames(skillPriorities = {}) {
  const extracted = {
    high: [],
    medium: [],
    low: []
  };

  Object.keys(extracted).forEach(priority => {
    const skills = skillPriorities[priority] || [];
    extracted[priority] = skills.map(skill => {
      // Handle both string and object formats
      return typeof skill === 'string' ? skill : skill.name;
    });
  });

  return extracted;
}

/**
 * Get skills to learn based on weak axes
 * Combines unselected skills with axis filtering
 *
 * @param {Object} persona - Full persona object
 * @param {Array} userSelectedSkills - Skills user selected
 * @param {Array} weakAxes - Axes where user is weak
 * @returns {Object} Recommended skills organized by priority
 */
export function getSkillsToLearn(persona = {}, userSelectedSkills = [], weakAxes = []) {
  const skillPriorities = persona?.skillMap?.skillPriorities || {};

  // If skills axis is weak, show all unselected skills (user needs breadth)
  if (weakAxes.includes('skills')) {
    return filterUnselectedSkills(skillPriorities, userSelectedSkills);
  }

  // Otherwise, filter by weak axes
  return filterSkillsByWeakAxes(skillPriorities, userSelectedSkills, weakAxes);
}

/**
 * Filter to only show skills user hasn't selected (for skills axis weakness)
 *
 * @param {Object} skillPriorities - Skills by priority with axis tags
 * @param {Array} userSelectedSkills - Selected skills
 * @returns {Object} Unselected skills by priority
 */
export function filterUnselectedSkills(skillPriorities = {}, userSelectedSkills = []) {
  const filtered = {
    high: [],
    medium: [],
    low: []
  };

  Object.keys(filtered).forEach(priority => {
    const skills = skillPriorities[priority] || [];
    filtered[priority] = skills.filter(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      return !userSelectedSkills.includes(skillName);
    }).map(skill => typeof skill === 'string' ? skill : skill.name);
  });

  return filtered;
}

export default {
  filterSkillsByWeakAxes,
  extractSkillNames,
  getSkillsToLearn,
  filterUnselectedSkills
};
