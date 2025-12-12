/**
 * AXIS CALCULATOR - Calculate user's performance on each radar axis
 *
 * Score Calculation:
 * - skills: percentage of total skills selected (breadth)
 * - algorithms/DSA: skill score + quiz problemSolving bonus
 * - systemDesign: skill score + quiz systemDesign bonus
 * - Other axes: percentage of tagged skills selected
 *
 * Quiz answers (problemSolving, systemDesign) add BONUS points to axes
 * This reflects both what you know AND your experience level
 */

/**
 * Calculate all axis scores for user
 *
 * @param {Object} quizResponses - User's quiz responses (problemSolving, systemDesign, etc.)
 * @param {Array} selectedSkills - Skills user selected in quiz (strings or objects with .name)
 * @param {Array} allSkillsForRole - ALL skills from persona (objects with .name and .axes)
 * @param {Object} thresholds - Persona's threshold config (includes quizMapping)
 * @param {string} userType - 'tech' or 'nontech'
 * @returns {Object} Object with axis keys and scores (0-100)
 */
export function calculateAxisScores(quizResponses = {}, selectedSkills = [], allSkillsForRole = [], thresholds = {}, userType = 'tech') {
  const scores = {};

  // Helper functions
  const getSkillName = (skill) => typeof skill === 'string' ? skill : skill?.name;
  const getSkillAxes = (skill) => typeof skill === 'string' ? [] : (skill?.axes || []);

  // Convert selectedSkills to names for comparison
  const selectedSkillNames = selectedSkills.map(getSkillName);

  // ============================================
  // AXIS: SKILLS (Breadth) - % of skills selected
  // ============================================
  const totalSkills = allSkillsForRole?.length || 1;
  const selectedCount = selectedSkillNames?.length || 0;
  scores.skills = Math.round((selectedCount / totalSkills) * 100);

  // ============================================
  // DYNAMIC AXES: Calculate from skill tags
  // ============================================
  // Collect all unique axes from skills
  const allAxesSet = new Set();
  allSkillsForRole.forEach(skill => {
    const axes = getSkillAxes(skill);
    axes.forEach(axis => allAxesSet.add(axis));
  });

  // Calculate base score for each axis (from skill selection)
  allAxesSet.forEach(axisKey => {
    if (axisKey === 'skills') return; // Already calculated

    // Find skills tagged with this axis
    const axisSkills = allSkillsForRole.filter(skill => {
      const axes = getSkillAxes(skill);
      return axes.includes(axisKey);
    });

    // Count user's selected skills with this axis
    const selectedAxisSkills = axisSkills.filter(skill =>
      selectedSkillNames.includes(getSkillName(skill))
    );

    // Base score = percentage of axis skills selected (scaled to 60 max)
    // This leaves room for quiz bonus to add up to 40 more
    // NO FALLBACK - if no skills tagged to this axis, base is 0 (not 30!)
    const baseScore = axisSkills.length > 0
      ? Math.round((selectedAxisSkills.length / axisSkills.length) * 60)
      : 0;

    scores[axisKey] = baseScore;
  });

  // ============================================
  // ADD QUIZ BONUSES from thresholds.quizMapping
  // ============================================
  const quizMapping = thresholds?.quizMapping || {};

  Object.entries(quizMapping).forEach(([quizKey, config]) => {
    const targetAxis = config.axis;
    const valueMap = config.values || {};
    const userAnswer = quizResponses?.[quizKey];

    if (userAnswer && valueMap[userAnswer] !== undefined) {
      const bonus = valueMap[userAnswer];
      // Add bonus to axis score (ensure we have a base)
      scores[targetAxis] = (scores[targetAxis] || 0) + bonus;
    }
  });

  // ============================================
  // CAP ALL SCORES AT 100
  // ============================================
  Object.keys(scores).forEach(axis => {
    scores[axis] = Math.min(100, Math.max(0, scores[axis]));
  });

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('📊 Axis Calculator:');
    console.log('   Input - allSkillsForRole count:', allSkillsForRole?.length || 0);
    console.log('   Input - selectedSkills:', selectedSkillNames);
    console.log('   Input - quizResponses:', quizResponses);
    console.log('   Input - thresholds.quizMapping:', thresholds?.quizMapping);
    console.log('   Unique axes found:', Array.from(allAxesSet));
    console.log('   Final Scores:', scores);
  }

  return scores;
}

/**
 * Get baseline scores for a persona
 * Reads flat baseline directly from persona (no tech/nonTech nesting)
 *
 * @param {Object} thresholds - Persona's threshold mappings
 * @returns {Object} Baseline scores for each axis
 */
export function getBaselineScores(thresholds = {}) {
  // Read flat baseline directly - no nesting, no fallbacks
  const baseline = thresholds?.averageBaseline || {};

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('📊 getBaselineScores:', baseline);
  }

  return baseline;
}

/**
 * Identify which axes user is weak on (score below baseline)
 *
 * @param {Object} userScores - User's calculated axis scores
 * @param {Object} baselineScores - Expected baseline scores
 * @returns {Array} Array of axis keys where user is weak
 */
export function identifyWeakAxes(userScores = {}, baselineScores = {}) {
  const weakAxes = [];

  // Check each axis
  Object.keys(baselineScores).forEach(axis => {
    const userScore = userScores[axis] || 0;
    const baseline = baselineScores[axis] || 50;

    if (userScore < baseline) {
      weakAxes.push(axis);
    }
  });

  return weakAxes;
}

/**
 * Calculate skill completeness axis from selection count
 * Simple: (selected / total) * 100
 *
 * @param {number} selectedCount - Number of skills selected
 * @param {number} totalAvailable - Total available skills
 * @returns {number} Score 0-100
 */
export function calculateSkillsAxis(selectedCount = 0, totalAvailable = 1) {
  return Math.round((selectedCount / totalAvailable) * 100);
}

/**
 * Map quiz answer to axis score using persona's thresholds
 *
 * @param {string} answer - User's quiz answer
 * @param {Object} thresholdMap - Threshold mapping for that axis
 * @returns {number} Score 0-100
 */
export function mapAnswerToScore(answer = '', thresholdMap = {}) {
  return thresholdMap[answer] || 10; // Default 10 if answer not found
}

export default {
  calculateAxisScores,
  getBaselineScores,
  identifyWeakAxes,
  calculateSkillsAxis,
  mapAnswerToScore
};
