/**
 * QUIZ SKILL LOADER
 *
 * Loads skills from persona JSON files for quiz display.
 * Skills shown in quiz are based on role + level + userType.
 *
 * This ensures quiz skills MATCH persona skills for proper axis calculation.
 */

import { determinePersonaFile } from './personaCalculator';

// Cache loaded persona skills to avoid repeated fetches
let skillsCache = {};

/**
 * Load skills from persona file for quiz display
 * Returns all skills with their axis mappings and priorities
 *
 * @param {Object} quizResponses - Current quiz responses
 * @returns {Promise<Array>} Array of skill objects with name, priority, axes
 */
export async function loadSkillsForQuiz(quizResponses) {
  try {
    // Determine which persona file to load
    const personaFilename = determinePersonaFile(quizResponses);

    // Check cache first
    if (skillsCache[personaFilename]) {
      console.log(`📦 Using cached skills for ${personaFilename}`);
      return skillsCache[personaFilename];
    }

    // Load persona file
    const path = `/personas/complete/${personaFilename}`;
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to load persona: ${path}`);
    }

    const persona = await response.json();

    // Extract all skills from skillPriorities
    const skills = extractSkillsFromPersona(persona);

    // Cache for future use
    skillsCache[personaFilename] = skills;

    console.log(`✅ Loaded ${skills.length} skills from ${personaFilename}`);
    return skills;

  } catch (error) {
    console.error('❌ Error loading skills for quiz:', error);
    // Return empty array - let UI handle gracefully
    return [];
  }
}

/**
 * Extract all skills from persona skillPriorities
 * Maintains priority and axis information
 *
 * @param {Object} persona - Loaded persona data
 * @returns {Array} Array of skill objects
 */
function extractSkillsFromPersona(persona) {
  const skillPriorities = persona?.skillMap?.skillPriorities || {};
  const allSkills = [];

  // Process each priority level
  ['high', 'medium', 'low'].forEach(priority => {
    const skillsAtPriority = skillPriorities[priority] || [];

    skillsAtPriority.forEach(skill => {
      // Handle both string and object formats
      if (typeof skill === 'string') {
        allSkills.push({
          name: skill,
          priority: priority,
          axes: []
        });
      } else if (skill && typeof skill === 'object') {
        allSkills.push({
          name: skill.name,
          priority: priority,
          axes: skill.axes || []
        });
      }
    });
  });

  return allSkills;
}

/**
 * Get just skill names for quiz display (simple array)
 *
 * @param {Object} quizResponses - Current quiz responses
 * @returns {Promise<Array<string>>} Array of skill names
 */
export async function getSkillNamesForQuiz(quizResponses) {
  const skills = await loadSkillsForQuiz(quizResponses);
  return skills.map(s => s.name);
}

/**
 * Synchronous version using pre-loaded cache
 * Call loadSkillsForQuiz first to populate cache
 *
 * @param {Object} quizResponses - Current quiz responses
 * @returns {Array} Array of skill objects (from cache or empty)
 */
export function getSkillsFromCache(quizResponses) {
  const personaFilename = determinePersonaFile(quizResponses);
  return skillsCache[personaFilename] || [];
}

/**
 * Clear skills cache (useful for testing)
 */
export function clearSkillsCache() {
  skillsCache = {};
}

export default {
  loadSkillsForQuiz,
  getSkillNamesForQuiz,
  getSkillsFromCache,
  clearSkillsCache
};
