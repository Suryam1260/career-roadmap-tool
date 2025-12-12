/**
 * PersonaCalculator
 *
 * Determines which monolithic persona file to load based on quiz responses.
 * Handles normalization of user inputs to standard persona naming conventions.
 */

/**
 * Determines which persona file to load based on quiz responses
 * @param {Object} quizResponses - User's quiz responses containing:
 *   - background: 'tech' | 'non-tech'
 *   - targetRole: User's target role (e.g., 'Backend Engineer')
 *   - yearsOfExperience: Years of experience (e.g., '0-2', '2-5', '5-8', '8+')
 * @returns {string} Persona filename (e.g., 'mid_tech_backend.json')
 */
export function determinePersonaFile(quizResponses) {
  if (!quizResponses) {
    console.error('❌ Invalid quiz responses');
    return 'mid_tech_backend.json'; // Safe fallback
  }

  // 1. Extract and normalize background
  const userType = normalizeBackground(quizResponses.background);

  // 2. Extract and normalize experience level
  const level = normalizeLevel(quizResponses.yearsOfExperience);

  // 3. Extract and normalize role
  const role = normalizeRole(quizResponses.targetRole);

  // 4. Construct and return filename
  const filename = `${level}_${userType}_${role}.json`;

  console.log('🎯 Persona Calculator:');
  console.log(`  Background: ${quizResponses.background} → ${userType}`);
  console.log(`  Level: ${quizResponses.yearsOfExperience} → ${level}`);
  console.log(`  Role: ${quizResponses.targetRole} → ${role}`);
  console.log(`  📄 Persona file: ${filename}`);

  return filename;
}

/**
 * Normalize background to standard format
 * @param {string} background - Raw background value from quiz
 * @returns {string} 'tech' | 'nontech'
 */
function normalizeBackground(background) {
  if (!background) return 'tech'; // Default to tech

  const normalized = background.toLowerCase().trim();

  // Handle both formats: 'non-tech' and 'nontech'
  if (normalized === 'non-tech' || normalized === 'nontech') {
    return 'nontech';
  }

  // Assume anything else is tech background
  return 'tech';
}

/**
 * Normalize years of experience to level
 * @param {string|number} yearsOfExperience - Raw experience value
 * @returns {string} 'entry' | 'mid' | 'senior'
 */
function normalizeLevel(yearsOfExperience) {
  if (!yearsOfExperience) return 'entry'; // Default to entry

  const normalized = String(yearsOfExperience).toLowerCase().trim();

  // Entry level: 0-2 years
  if (
    normalized === '0-2' ||
    normalized === '0' ||
    normalized === '1' ||
    normalized === '2' ||
    normalized === 'entry' ||
    normalized === 'junior' ||
    normalized === 'fresher'
  ) {
    return 'entry';
  }

  // Mid level: 2-5 years (includes 5 as boundary)
  if (
    normalized === '2-5' ||
    normalized === '3' ||
    normalized === '4' ||
    normalized === '5' ||
    normalized === 'mid' ||
    normalized === 'intermediate'
  ) {
    return 'mid';
  }

  // Senior level: 5+ years
  if (
    normalized === '5-8' ||
    normalized === '8+' ||
    normalized === '8' ||
    normalized === '9' ||
    normalized === '10' ||
    normalized.startsWith('10+') ||
    normalized.startsWith('15+') ||
    normalized === 'senior' ||
    normalized === 'expert'
  ) {
    return 'senior';
  }

  // Try parsing as number for flexibility
  try {
    const years = parseFloat(normalized);
    if (!isNaN(years)) {
      if (years <= 2) return 'entry';
      if (years <= 5) return 'mid';
      return 'senior';
    }
  } catch (error) {
    console.warn(`⚠️ Could not parse experience years: ${yearsOfExperience}`);
  }

  return 'mid'; // Safe default
}

/**
 * Normalize role to standard format
 * @param {string} targetRole - Raw role value from quiz
 * @returns {string} One of: backend, frontend, fullstack, devops, data
 */
function normalizeRole(targetRole) {
  if (!targetRole) return 'backend'; // Default to backend

  const normalized = targetRole.toLowerCase().trim();

  // Role mapping table
  const roleMap = {
    // Backend
    'backend engineer': 'backend',
    'backend': 'backend',
    'server engineer': 'backend',
    'backend developer': 'backend',

    // Frontend
    'frontend engineer': 'frontend',
    'frontend': 'frontend',
    'frontend developer': 'frontend',
    'react developer': 'frontend',
    'ui engineer': 'frontend',
    'ux engineer': 'frontend',

    // Full Stack
    'full stack engineer': 'fullstack',
    'full-stack engineer': 'fullstack',
    'fullstack engineer': 'fullstack',
    'fullstack': 'fullstack',
    'full stack': 'fullstack',
    'full-stack': 'fullstack',
    'full stack developer': 'fullstack',
    'mern': 'fullstack',
    'mean': 'fullstack',

    // DevOps
    'devops engineer': 'devops',
    'devops': 'devops',
    'sre': 'devops',
    'site reliability engineer': 'devops',
    'infrastructure engineer': 'devops',
    'platform engineer': 'devops',
    'cloud engineer': 'devops',

    // Data
    'data engineer': 'data',
    'data': 'data',
    'data scientist': 'data',
    'analytics engineer': 'data',
    'big data engineer': 'data',
    'ml engineer': 'data',
    'machine learning engineer': 'data'
  };

  // Check for exact match
  if (roleMap[normalized]) {
    return roleMap[normalized];
  }

  // Partial matching for flexibility
  if (normalized.includes('backend') || normalized.includes('server')) {
    return 'backend';
  }
  if (normalized.includes('frontend') || normalized.includes('react') || normalized.includes('ui')) {
    return 'frontend';
  }
  if (normalized.includes('fullstack') || normalized.includes('full-stack') || normalized.includes('full stack')) {
    return 'fullstack';
  }
  if (normalized.includes('devops') || normalized.includes('sre') || normalized.includes('platform') || normalized.includes('infra')) {
    return 'devops';
  }
  if (normalized.includes('data') || normalized.includes('ml') || normalized.includes('analytics')) {
    return 'data';
  }

  // Safe default
  console.warn(`⚠️ Unknown role: ${targetRole}, defaulting to backend`);
  return 'backend';
}

/**
 * Get persona path for frontend loading
 * @param {Object} quizResponses - User's quiz responses
 * @returns {string} Full path to persona file
 */
export function getPersonaPath(quizResponses) {
  const filename = determinePersonaFile(quizResponses);
  return `/personas/complete/${filename}`;
}
