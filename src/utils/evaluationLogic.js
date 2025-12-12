const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// TECH PATH: Quiz collects backend-compatible values directly, no transformation needed
// NON-TECH PATH: Portfolio is inferred from coding comfort level

// Derive current company type from current role
const deriveCurrentCompany = (currentRole) => {
  const roleToCompanyMap = {
    'swe-product': 'Product Company',
    'swe-service': 'Service Company',
    'devops': 'Tech Company',
    'qa-support': 'Tech Company',
    'career-switcher': 'Transitioning to tech'
  };
  return roleToCompanyMap[currentRole] || 'Current Company';
};

const inferPortfolio = (problemSolving) => {
  // For non-tech users, infer portfolio from their problem-solving level
  if (problemSolving === '51-100') {
    return 'limited-1-5'; // Some projects built during learning
  }
  if (problemSolving === '11-50') {
    return 'inactive'; // Maybe old tutorial projects
  }
  return 'none'; // Beginners typically don't have portfolio yet
};

const mapTechQuizResponses = (quizResponses = {}) => {
  // FIXED: Quiz now collects direct backend-compatible values
  // No transformation needed - use values directly from quiz
  const problemSolving = quizResponses.problemSolving || '0-10';
  const systemDesign = quizResponses.systemDesign || 'not-yet';
  const portfolio = quizResponses.portfolio || 'none';
  const currentRole = quizResponses.currentRole || 'career-switcher';

  return {
    currentRole,
    experience: quizResponses.experience || '0-2',
    targetRole: quizResponses.targetRole || 'fullstack-sde',
    problemSolving,
    systemDesign,
    portfolio,
    mockInterviews: 'never', // Not collected in new flow
    requirementType: quizResponses.primaryGoal || 'upskilling',
    targetCompany: quizResponses.targetCompany || 'Not specified',
    currentCompany: deriveCurrentCompany(currentRole), // FIXED: Derive from role, not target!
    currentSkill: quizResponses.currentSkill || problemSolving,
    // Pass labels for display (backend will use these instead of mapping)
    currentRoleLabel: quizResponses.currentRoleLabel || deriveCurrentCompany(currentRole),
    targetRoleLabel: quizResponses.targetRoleLabel || quizResponses.targetRole,
    targetCompanyLabel: quizResponses.targetCompanyLabel || quizResponses.targetCompany,
  };
};

// FIXED: Map actual codeComfort values collected in non-tech quiz
const deriveNonTechProblemSolving = (codeComfort) => {
  // Map based on actual quiz values: 'confident', 'learning', 'beginner', 'complete-beginner'
  switch (codeComfort) {
    case 'confident':
      return '51-100'; // Can solve simple problems independently
    case 'learning':
      return '11-50';  // Can follow tutorials but struggle alone
    case 'beginner':
      return '0-10';   // Understand concepts but can't code yet
    case 'complete-beginner':
      return '0-10';   // Haven't tried yet
    default:
      return '0-10';
  }
};

const mapNonTechQuizResponses = (quizResponses = {}) => {
  // FIXED: Use actual codeComfort field collected in quiz (not learningActivity)
  const inferredProblemSolving = deriveNonTechProblemSolving(quizResponses.codeComfort);

  return {
    currentRole: quizResponses.currentBackground || 'career-switcher',
    experience: quizResponses.experience || '0-2',
    targetRole: quizResponses.targetRole || 'exploring',
    problemSolving: inferredProblemSolving,
    systemDesign: 'not-yet', // Non-tech users typically don't have system design experience
    portfolio: inferPortfolio(inferredProblemSolving), // Inferred from problem-solving level
    mockInterviews: 'never',
    requirementType: quizResponses.motivation || 'career-switch', // FIXED: Use 'motivation' not 'primaryGoal'
    targetCompany: quizResponses.targetCompany || 'Transitioning from non-tech background',
    currentCompany: 'Transitioning from non-tech background',
    currentSkill: quizResponses.currentSkill || inferredProblemSolving,
    // Pass labels for display
    currentRoleLabel: quizResponses.currentBackgroundLabel || 'Career Switcher',
    targetRoleLabel: quizResponses.targetRoleLabel || quizResponses.targetRole,
    targetCompanyLabel: quizResponses.targetCompanyLabel || quizResponses.targetCompany,
  };
};

const normaliseGoals = (goals = {}) => ({
  requirementType: Array.isArray(goals.requirementType) ? goals.requirementType : [],
  targetCompany: goals.targetCompany || 'Not specified',
  topicOfInterest: Array.isArray(goals.topicOfInterest) ? goals.topicOfInterest : [],
});

const buildEvaluationPayload = (quizResponses, goals, background) => {
  if (!background) {
    throw new Error('User background is required before requesting evaluation.');
  }

  const mappedQuizResponses = background === 'tech'
    ? mapTechQuizResponses(quizResponses)
    : mapNonTechQuizResponses(quizResponses);

  return {
    background,
    quizResponses: mappedQuizResponses,
    goals: normaliseGoals(goals),
  };
};

export const evaluateProfile = async (quizResponses, goals, background, options = {}) => {
  const { signal } = options;
  const payload = buildEvaluationPayload(quizResponses, goals, background);

  // DEBUG: Log what we're sending
  console.log('\n' + '='.repeat(80));
  console.log('DEBUG: FRONTEND SENDING REQUEST');
  console.log('='.repeat(80));
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('='.repeat(80) + '\n');

  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Evaluation request failed with status ${response.status}: ${errorText || 'Unknown error'}`
    );
  }

  const data = await response.json();
  if (!data || !data.profile_evaluation) {
    throw new Error('Evaluation response missing "profile_evaluation" payload.');
  }

  // DEBUG: Log what we received
  console.log('\n' + '='.repeat(80));
  console.log('DEBUG: FRONTEND RECEIVED RESPONSE');
  console.log('='.repeat(80));
  console.log('Response profile_evaluation:', JSON.stringify(data.profile_evaluation, null, 2));
  console.log('='.repeat(80) + '\n');

  return data.profile_evaluation;
};

export { buildEvaluationPayload };
