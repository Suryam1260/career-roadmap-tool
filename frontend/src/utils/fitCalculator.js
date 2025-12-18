/**
 * FIT CALCULATOR - Dynamic fit analysis based on user's current status
 *
 * Simple logic:
 * - Fit level based on (currentCompanyType → targetCompanyType) matrix
 * - "Why Feasible" = generic positive statements based on fit level
 * - "What You Need" = personalized based on user's weak axes from axisCalculator
 *
 * No hardcoding per persona - same logic works for all personas.
 */

// ============================================
// FIT MATRIX: currentCompany → targetCompany
// ============================================
// Values: 'easy' | 'doable' | 'challenging' | 'stretch'
const FIT_MATRIX = {
  'fresher': {
    'service': 'easy',
    'high-growth': 'doable',
    'unicorns': 'challenging',
    'big-tech': 'stretch'
  },
  'service': {
    'service': 'easy',
    'high-growth': 'doable',
    'unicorns': 'challenging',
    'big-tech': 'stretch'
  },
  'high-growth': {
    'service': 'easy',
    'high-growth': 'easy',
    'unicorns': 'doable',
    'big-tech': 'challenging'
  },
  'unicorns': {
    'service': 'easy',
    'high-growth': 'easy',
    'unicorns': 'easy',
    'big-tech': 'doable'
  },
  'big-tech': {
    'service': 'easy',
    'high-growth': 'easy',
    'unicorns': 'easy',
    'big-tech': 'easy'
  }
};

// ============================================
// FIT LEVEL CONFIG
// ============================================
const FIT_LEVELS = {
  'easy': {
    color: 'green',
    label: 'Great Fit',
    message: 'This transition is very achievable with your current background.'
  },
  'doable': {
    color: 'green',
    label: 'Good Fit',
    message: 'This is achievable with some focused preparation.'
  },
  'challenging': {
    color: 'orange',
    label: 'Stretch Goal',
    message: 'This requires significant preparation but is definitely achievable.'
  },
  'stretch': {
    color: 'orange',
    label: 'Ambitious Goal',
    message: 'This is a big career jump - plan for 6+ months of dedicated prep.'
  }
};

// ============================================
// "WHY FEASIBLE" TEMPLATES - Based on fit level + context
// ============================================
const WHY_FEASIBLE_TEMPLATES = {
  'easy': [
    'Your current experience directly transfers to this company type',
    'The interview bar aligns well with your skill level',
    'Many engineers make this transition successfully'
  ],
  'doable': [
    'Your technical foundation is solid for this transition',
    'With focused preparation, you can bridge the gaps',
    'Your experience level is appropriate for roles at these companies'
  ],
  'challenging': [
    'Your fundamentals are in place - it\'s about leveling up',
    'Many successful engineers have made this jump before you',
    'The gap is bridgeable with dedicated effort'
  ],
  'stretch': [
    'Your determination to aim high is valuable',
    'This goal is achievable with a structured long-term plan',
    'Consider building intermediate experience to strengthen your profile'
  ]
};

// ============================================
// "WHAT YOU NEED" TEMPLATES - Based on weak axes
// ============================================
const AXIS_IMPROVEMENT_TEMPLATES = {
  'algorithms': {
    weak: 'Your DSA skills need strengthening - aim for consistent LeetCode practice',
    veryWeak: 'DSA is a critical gap - prioritize solving 100+ problems across patterns'
  },
  'systemDesign': {
    weak: 'Build system design knowledge through case studies and mock interviews',
    veryWeak: 'System design is essential for this level - deep dive into architecture patterns'
  },
  'database': {
    weak: 'Strengthen your database fundamentals - schema design and query optimization',
    veryWeak: 'Database skills need significant work - focus on both SQL and NoSQL patterns'
  },
  'devops': {
    weak: 'Expand your DevOps knowledge - CI/CD, containers, and cloud basics',
    veryWeak: 'DevOps exposure is limited - hands-on projects will help bridge this gap'
  },
  'skills': {
    weak: 'Broaden your skill coverage - you\'re missing some foundational areas',
    veryWeak: 'Your skill breadth is narrow - focus on building a stronger foundation'
  }
};

// Generic "What You Need" based on target company type
const TARGET_COMPANY_REQUIREMENTS = {
  'service': [
    'Polish your communication skills for client-facing roles',
    'Be prepared for aptitude tests in the hiring process'
  ],
  'high-growth': [
    'Demonstrate ownership and end-to-end delivery capability',
    'Show you can thrive in fast-paced, ambiguous environments'
  ],
  'unicorns': [
    'Strong DSA fundamentals are non-negotiable',
    'Referrals significantly improve your chances - start networking'
  ],
  'big-tech': [
    'DSA mastery is the primary filter - no shortcuts here',
    'System design depth is expected at mid+ levels',
    'Behavioral preparation matters - STAR method responses'
  ]
};

/**
 * Calculate fit analysis for a target company type
 *
 * @param {string} currentCompanyType - User's current company type from quiz
 * @param {string} targetCompanyType - Company type being viewed (high-growth, unicorns, service, big-tech)
 * @param {Object} userAxisScores - User's axis scores from axisCalculator (not used anymore)
 * @param {Object} baselineScores - Baseline scores for comparison (not used anymore)
 * @param {Object} companyData - Company data from persona (includes whatYouNeed)
 * @returns {Object} Fit analysis with level, color, message, whyFeasible, whatYouNeed
 */
export function calculateFitAnalysis(
  currentCompanyType = 'fresher',
  targetCompanyType = 'high-growth',
  userAxisScores = {},
  baselineScores = {},
  companyData = null
) {
  // 1. Get fit level from matrix
  const normalizedCurrent = normalizeCompanyType(currentCompanyType);
  const fitLevel = FIT_MATRIX[normalizedCurrent]?.[targetCompanyType] || 'doable';
  const fitConfig = FIT_LEVELS[fitLevel];

  // 2. Generate "Why Feasible" - generic based on fit level
  const whyFeasible = [...WHY_FEASIBLE_TEMPLATES[fitLevel]];

  // 3. Get "What You Need" from persona data (or fallback to generated)
  let whatYouNeed = [];
  if (companyData?.whatYouNeed?.[fitLevel]) {
    // Use persona-specific guidance
    whatYouNeed = [...companyData.whatYouNeed[fitLevel]];
  } else {
    // Fallback to old logic if persona data not available
    whatYouNeed = generateWhatYouNeed(
      userAxisScores,
      baselineScores,
      targetCompanyType
    );
  }

  return {
    level: fitConfig.label,
    color: fitConfig.color,
    message: fitConfig.message,
    whyFeasible,
    whatYouNeed
  };
}

/**
 * Generate personalized "What You Need" based on user's weak axes
 */
function generateWhatYouNeed(userAxisScores, baselineScores, targetCompanyType) {
  const needs = [];

  // Find weak axes (score < baseline)
  const weakAxes = [];
  const veryWeakAxes = [];

  Object.keys(baselineScores).forEach(axis => {
    const userScore = userAxisScores[axis] || 0;
    const baseline = baselineScores[axis] || 50;
    const gap = baseline - userScore;

    if (gap > 20) {
      veryWeakAxes.push(axis);
    } else if (gap > 5) {
      weakAxes.push(axis);
    }
  });

  // Add personalized needs based on weak axes (max 2)
  veryWeakAxes.slice(0, 2).forEach(axis => {
    if (AXIS_IMPROVEMENT_TEMPLATES[axis]?.veryWeak) {
      needs.push(AXIS_IMPROVEMENT_TEMPLATES[axis].veryWeak);
    }
  });

  weakAxes.slice(0, 2 - needs.length).forEach(axis => {
    if (AXIS_IMPROVEMENT_TEMPLATES[axis]?.weak && needs.length < 2) {
      needs.push(AXIS_IMPROVEMENT_TEMPLATES[axis].weak);
    }
  });

  // Add target company specific requirements
  const targetReqs = TARGET_COMPANY_REQUIREMENTS[targetCompanyType] || [];
  targetReqs.forEach(req => {
    if (needs.length < 4) {
      needs.push(req);
    }
  });

  // Fallback if no specific needs identified
  if (needs.length === 0) {
    needs.push('Continue building depth in your current skill areas');
    needs.push('Focus on interview preparation and mock practice');
  }

  return needs;
}

/**
 * Normalize company type input to matrix keys
 *
 * Maps quiz values from QuizConfig.js:
 * - Tech: currentRole → swe-product, swe-service, devops, qa
 * - Non-Tech: currentBackground → sales-marketing, operations, design, finance, other
 */
function normalizeCompanyType(input) {
  if (!input) return 'fresher';

  const normalized = input.toLowerCase().trim();

  // Map various inputs to standard keys
  const mappings = {
    // === QUIZ VALUES (from QuizConfig.js) ===
    // Tech currentRole values
    'swe-product': 'high-growth',   // Product company SWE → high-growth experience (conservative estimate)
    'swe-service': 'service',       // Service company SWE → service experience
    'devops': 'high-growth',        // DevOps roles common in high-growth startups
    'qa': 'service',                // QA roles often in service companies

    // Non-Tech currentBackground values (all map to fresher - career switchers)
    'sales-marketing': 'fresher',
    'operations': 'fresher',
    'design': 'fresher',
    'finance': 'fresher',
    'other': 'fresher',

    // === LEGACY/ALTERNATIVE VALUES ===
    'fresher': 'fresher',
    'student': 'fresher',
    'no experience': 'fresher',
    'service': 'service',
    'service company': 'service',
    'it services': 'service',
    'consulting': 'service',
    'startup': 'high-growth',
    'high-growth': 'high-growth',
    'high growth': 'high-growth',
    'early stage': 'high-growth',
    'unicorn': 'unicorns',
    'unicorns': 'unicorns',
    'product company': 'unicorns',
    'product': 'unicorns',
    'big-tech': 'big-tech',
    'big tech': 'big-tech',
    'faang': 'big-tech',
    'maang': 'big-tech',
    'google': 'big-tech',
    'amazon': 'big-tech',
    'microsoft': 'big-tech',
    'meta': 'big-tech'
  };

  return mappings[normalized] || 'fresher';
}

/**
 * Get all fit analyses for all company types at once
 * Useful for pre-computing fits when component loads
 */
export function calculateAllFits(currentCompanyType, userAxisScores, baselineScores) {
  const companyTypes = ['high-growth', 'unicorns', 'service', 'big-tech'];

  const fits = {};
  companyTypes.forEach(target => {
    fits[target] = calculateFitAnalysis(
      currentCompanyType,
      target,
      userAxisScores,
      baselineScores
    );
  });

  return fits;
}

export default {
  calculateFitAnalysis,
  calculateAllFits,
  normalizeCompanyType
};
