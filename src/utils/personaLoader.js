/**
 * PERSONA LOADER - Simple utility to load monolithic persona JSON files
 *
 * No orchestration, no merging - just loads the complete persona JSON directly.
 * Uses personaCalculator to determine which file to load based on quiz responses.
 */

import { determinePersonaFile } from './personaCalculator';

/**
 * Load persona data from JSON file using fetch
 * @param {string} personaId - Persona ID or filename (e.g., 'mid_tech_backend.json')
 * @returns {Promise<Object>} Persona data
 */
export async function loadPersona(personaId) {
  try {
    // Handle both with and without .json extension
    const filename = personaId.endsWith('.json') ? personaId : `${personaId}.json`;

    // Load from /public/personas/complete/ directory
    const path = `/personas/complete/${filename}`;
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Persona file not found at ${path}`);
    }

    const personaData = await response.json();

    if (!personaData) {
      throw new Error(`No data found in persona file: ${filename}`);
    }

    console.log(`✅ Loaded persona: ${filename}`);
    return personaData;
  } catch (error) {
    console.error('❌ Error loading persona:', error);
    throw new Error(`Failed to load persona '${personaId}': ${error.message}`);
  }
}

/**
 * Load persona directly from quiz responses
 * Determines which persona file to load, then loads it
 * @param {Object} quizResponses - User's quiz responses
 * @returns {Promise<Object>} Complete persona data
 */
export async function loadPersonaFromQuiz(quizResponses) {
  try {
    // Use persona calculator to determine which file to load
    const personaFilename = determinePersonaFile(quizResponses);

    // Load the persona
    const persona = await loadPersona(personaFilename);

    return persona;
  } catch (error) {
    console.error('❌ Error loading persona from quiz:', error);

    // Fallback to mid_tech_backend as safe default
    console.warn('⚠️ Falling back to default persona: mid_tech_backend.json');
    try {
      return await loadPersona('mid_tech_backend.json');
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

/**
 * Transform persona data to match roadmap-new.js component expectations
 * @param {Object} persona - Persona JSON data
 * @param {Array<string>} userSelectedSkills - Skills user selected in quiz
 * @returns {Object} Transformed data for frontend components
 */
export function transformPersonaForFrontend(persona, userSelectedSkills = []) {
  // SAFE: Get skillPriorities with proper null checking
  const skillPrioritiesData = persona?.skillMap?.skillPriorities;

  if (!skillPrioritiesData) {
    console.warn('⚠️ WARNING: skillPriorities not found in persona. Using empty arrays.');
  }

  const highPrioritySkills = skillPrioritiesData?.high || [];
  const mediumPrioritySkills = skillPrioritiesData?.medium || [];
  const lowPrioritySkills = skillPrioritiesData?.low || [];

  // Helper to extract skill name (handle both string and object formats)
  const extractSkillName = (skill) => typeof skill === 'string' ? skill : skill?.name;

  // Filter out selected skills from priorities
  const unselectedHigh = highPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );
  const unselectedMedium = mediumPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );
  const unselectedLow = lowPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );

  return {
    // Hero section
    targetRole: persona.meta.roleLabel,
    skillsToLearn: persona.hero.skillsToLearn,
    estimatedEffort: persona.hero.estimatedEffort,
    videoUrl: persona.hero.videoUrl,

    // Skill Map section - pass entire skillMap with all config
    skillMap: persona.skillMap,

    // Current skills (from user selection in quiz)
    currentSkills: userSelectedSkills,

    // Skill priorities for the table
    skillPriorities: {
      high: unselectedHigh,
      medium: unselectedMedium,
      low: unselectedLow
    },

    // Company insights (already in correct format)
    companyInsights: persona.companyInsights,

    // Learning path
    learningPath: persona.learningPath,

    // Projects
    projects: persona.projects
  };
}

/**
 * Transform persona data to match experimental roadmap component expectations
 * Maps persona JSON structure to what RoadmapNewExperimental expects
 * @param {Object} persona - Persona JSON data
 * @param {Array<string>} userSelectedSkills - Skills user selected in quiz
 * @returns {Object} Config object for experimental component
 */
export function transformPersonaForExperimental(persona, userSelectedSkills = []) {
  // DEBUG: Log persona structure
  console.log('🔄 transformPersonaForExperimental called with:');
  console.log('  persona keys:', Object.keys(persona || {}));
  console.log('  persona.learningPath:', persona?.learningPath);
  console.log('  persona.learningPath.phases:', persona?.learningPath?.phases);
  console.log('  persona.learningPath.phases.length:', persona?.learningPath?.phases?.length);

  // SAFE: Get skillPriorities with proper null checking
  const skillPrioritiesData = persona?.skillMap?.skillPriorities;

  if (!skillPrioritiesData) {
    console.warn('⚠️ WARNING: skillPriorities not found in persona. Using empty arrays.');
  }

  const highPrioritySkills = skillPrioritiesData?.high || [];
  const mediumPrioritySkills = skillPrioritiesData?.medium || [];
  const lowPrioritySkills = skillPrioritiesData?.low || [];

  // Helper to extract skill name (handle both string and object formats)
  const extractSkillName = (skill) => typeof skill === 'string' ? skill : skill?.name;

  // Filter out selected skills from priorities
  const unselectedHigh = highPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );
  const unselectedMedium = mediumPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );
  const unselectedLow = lowPrioritySkills.filter(
    skill => !userSelectedSkills.includes(extractSkillName(skill))
  );

  // Get hero data - all personas should have consistent structure now
  const skillsToLearn = persona.hero?.skillsToLearn || 8;
  const estimatedEffort = persona.hero?.estimatedEffort;
  const videoUrl = persona.hero?.videoUrl;

  return {
    metadata: {
      roleLabel: persona.meta?.roleLabel,
      level: persona.meta?.level,
      userType: persona.meta?.userType,
      personaId: persona.meta?.personaId
    },

    hero: {
      title: persona.hero?.title,
      skillsToLearn: skillsToLearn,
      stats: {
        estimatedEffort: estimatedEffort
      },
      videoUrl: videoUrl
    },

    skillMap: {
      // Pass entire skillMap from persona including radarAxes, thresholds, and other config
      ...persona.skillMap,
      // Ensure axes field is also available for backward compatibility
      axes: persona.skillMap?.radarAxes || persona.skillMap?.axes
    },

    skillsGap: {
      title: 'Understand Where You Stand Right Now',
      description: 'Identify your skill gaps and focus on what matters most.'
    },

    currentSkills: userSelectedSkills,

    missingSkills: {
      highPriority: unselectedHigh,
      mediumPriority: unselectedMedium,
      lowPriority: unselectedLow
    },

    companyInsights: persona.companyInsights,

    learningPath: persona.learningPath,

    // Projects wrapped in object for ProjectsSection compatibility
    projects: {
      projects: persona.projects
    }
  };
}

