/**
 * ⚠️ DEPRECATED - DO NOT USE
 *
 * This file is deprecated and should not be used in new code.
 * Skills are now loaded from persona JSON files via quizSkillLoader.js
 *
 * ❌ OLD (deprecated):
 *   import { getAllSkillsForRole } from './skillDefinitions';
 *
 * ✅ NEW (use instead):
 *   import { loadSkillsForQuiz } from './quizSkillLoader';
 *
 * Reason for deprecation:
 * - Persona JSON files are now the single source of truth for all skill data
 * - Skills are loaded dynamically based on role + level + userType
 * - Axis mappings and priorities come from persona files
 * - This file contained hardcoded fallbacks that could get out of sync
 *
 * Migration path:
 * - Use quizSkillLoader.loadSkillsForQuiz(quizResponses) to load skills
 * - Skills are cached automatically for performance
 * - All skill metadata (axes, priorities) included in persona files
 */

// Inline skills mapping for each role
// MUST match persona JSON files exactly for proper axis calculation
// Skills are tagged to radar axes in persona files
const rolesSkillsMapping = {
  "Backend Engineer": {
    "high": ["Python", "Java", "Node.js", "SQL", "REST APIs", "Git", "Data Structures", "Algorithms", "System Design Basics", "Database Design"],
    "medium": ["Microservices", "Docker", "Redis/Caching", "PostgreSQL", "MongoDB", "Message Queues", "CI/CD", "Linux", "API Security", "Performance Optimization"],
    "low": ["Kubernetes", "Distributed Systems", "Event-Driven Architecture", "GraphQL", "AWS/Cloud", "Monitoring & Logging", "Database Sharding", "Load Balancing"]
  },
  "Frontend Engineer": {
    "high": ["HTML/CSS", "JavaScript", "React", "TypeScript", "Git", "Responsive Design", "State Management", "REST APIs", "CSS Frameworks", "Testing Basics"],
    "medium": ["Next.js", "Redux/Zustand", "Component Design", "Performance Optimization", "Accessibility", "Build Tools", "Browser DevTools", "API Integration", "CSS-in-JS", "Unit Testing"],
    "low": ["Server-Side Rendering", "Micro Frontends", "Design Systems", "Web Security", "WebSockets", "PWA", "GraphQL Client", "E2E Testing"]
  },
  "Full Stack Engineer": {
    "high": ["JavaScript", "Node.js", "React", "SQL", "REST APIs", "Git", "HTML/CSS", "Database Basics", "Data Structures", "Algorithms"],
    "medium": ["TypeScript", "Next.js", "PostgreSQL", "MongoDB", "Docker", "Authentication", "API Design", "State Management", "Testing", "Linux"],
    "low": ["Microservices", "CI/CD", "AWS/Cloud", "Redis/Caching", "GraphQL", "Kubernetes", "System Design", "Performance Optimization"]
  },
  "DevOps Engineer": {
    "high": ["Linux", "Docker", "Git", "Shell Scripting", "CI/CD", "Networking Basics", "Cloud Basics", "Infrastructure as Code", "Monitoring Basics", "Security Basics"],
    "medium": ["Kubernetes", "Terraform", "AWS/GCP/Azure", "Ansible", "Jenkins/GitHub Actions", "Prometheus/Grafana", "Log Management", "Container Orchestration", "Networking", "Troubleshooting"],
    "low": ["Service Mesh", "Advanced Kubernetes", "Multi-Cloud", "Cost Optimization", "Disaster Recovery", "Security Hardening", "Performance Tuning", "Chaos Engineering"]
  },
  "Data Science Engineer": {
    "high": ["Python", "SQL", "Statistics", "Data Analysis", "Git", "Pandas/NumPy", "Data Visualization", "Machine Learning Basics", "Jupyter", "ETL Basics"],
    "medium": ["Scikit-learn", "Deep Learning", "Feature Engineering", "Model Evaluation", "Big Data Basics", "Spark", "Data Pipelines", "Cloud Platforms", "A/B Testing", "Data Cleaning"],
    "low": ["MLOps", "Real-time ML", "NLP", "Computer Vision", "Advanced Statistics", "Distributed Computing", "Model Deployment", "AutoML"]
  }
};

// Build skill definitions from roles skills mapping
const SKILL_DEFINITIONS = {};

Object.entries(rolesSkillsMapping).forEach(([roleName, skillsByPriority]) => {
  let skills = [];

  // Extract skill names from priority object (high, medium, low)
  Object.entries(skillsByPriority).forEach(([priorityKey, skillList]) => {
    if (Array.isArray(skillList)) {
      skillList.forEach(skill => {
        if (typeof skill === 'string') {
          skills.push({
            name: skill,
            priority: priorityKey,
            category: 'general',
            description: ''
          });
        } else {
          skills.push(skill);
        }
      });
    }
  });

  SKILL_DEFINITIONS[roleName] = {
    skills: skills,
    metadata: {
      radarCategories: ['DSA', 'System Design', 'Projects', 'Communication'] // Default radar axes
    },
  };

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[skillDefinitions] Loaded ${skills.length} skills for ${roleName}`);
  }
});

/**
 * Get skill definition for a specific role
 */
export function getSkillDefinition(role) {
  return SKILL_DEFINITIONS[role] || SKILL_DEFINITIONS['Backend Engineer'];
}

/**
 * Get all skills for a role
 */
export function getAllSkillsForRole(role) {
  const definition = getSkillDefinition(role);
  return definition.skills || [];
}

/**
 * Get radar chart categories/axes for a role
 */
export function getRadarCategories(role) {
  const definition = getSkillDefinition(role);
  return definition.metadata.radarCategories || [];
}

/**
 * Get skills by priority level
 */
export function getSkillsByPriority(role, priority) {
  const skills = getAllSkillsForRole(role);
  return skills.filter(skill => skill.priority === priority);
}

/**
 * Calculate missing skills for a user
 */
export function calculateMissingSkills(role, userCurrentSkills = []) {
  const allSkills = getAllSkillsForRole(role);

  const missingSkills = allSkills.filter(skill =>
    !userCurrentSkills.includes(skill.name)
  );

  return {
    highPriority: missingSkills.filter(s => s.priority === 'critical'),
    mediumPriority: missingSkills.filter(s => s.priority === 'high'),
    lowPriority: missingSkills.filter(s => s.priority === 'medium'),
    all: missingSkills,
    totalCount: missingSkills.length,
  };
}

/**
 * Calculate estimated timeline for learning missing skills
 */
export function calculateEstimatedTimeline(role, userCurrentSkills = []) {
  const missing = calculateMissingSkills(role, userCurrentSkills);

  const totalWeeks = missing.all.reduce((sum, skill) =>
    sum + (skill.estimatedWeeks || 4), 0
  );

  // Convert weeks to months
  const months = Math.ceil(totalWeeks / 4);

  return {
    totalWeeks,
    totalMonths: months,
    breakdown: {
      highPriority: missing.highPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
      mediumPriority: missing.mediumPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
      lowPriority: missing.lowPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
    },
  };
}

/**
 * Calculate skill match score (0-100)
 */
export function calculateSkillMatchScore(role, userCurrentSkills = []) {
  const allSkills = getAllSkillsForRole(role);

  if (allSkills.length === 0) return 0;

  const userMatches = userCurrentSkills.filter(skill =>
    allSkills.some(s => s.name === skill)
  );

  const matchScore = (userMatches.length / allSkills.length) * 100;
  return Math.round(matchScore);
}

/**
 * Get skills mapped to radar axes for visualization
 */
export function getSkillsByRadarAxis(role, userCurrentSkills = []) {
  const definition = getSkillDefinition(role);
  const allSkills = definition.skills || [];
  const axes = definition.metadata.radarCategories || [];

  const result = {};

  axes.forEach(axis => {
    const axisSkills = allSkills.filter(s => s.radarAxis === axis);
    const userMatches = userCurrentSkills.filter(skill =>
      axisSkills.some(s => s.name === skill)
    );

    result[axis] = {
      total: axisSkills.length,
      matched: userMatches.length,
      percentage: (userMatches.length / axisSkills.length) * 100,
      skills: axisSkills,
      userHasSkills: userMatches,
    };
  });

  return result;
}

/**
 * Get interview-critical skills for a role
 */
export function getInterviewCriticalSkills(role) {
  const skills = getAllSkillsForRole(role);
  return skills.filter(skill => skill.interviewCritical === true);
}

/**
 * Check if role has skill definition
 */
export function hasSkillDefinition(role) {
  return role in SKILL_DEFINITIONS;
}

/**
 * Get all supported roles
 */
export function getSupportedRoles() {
  return Object.keys(SKILL_DEFINITIONS);
}

/**
 * Validate skill name against role definition
 */
export function isValidSkillForRole(role, skillName) {
  const skills = getAllSkillsForRole(role);
  return skills.some(s => s.name === skillName);
}

/**
 * Get skill details
 */
export function getSkillDetail(role, skillName) {
  const skills = getAllSkillsForRole(role);
  return skills.find(s => s.name === skillName) || null;
}

export default {
  getSkillDefinition,
  getAllSkillsForRole,
  getRadarCategories,
  getSkillsByPriority,
  calculateMissingSkills,
  calculateEstimatedTimeline,
  calculateSkillMatchScore,
  getSkillsByRadarAxis,
  getInterviewCriticalSkills,
  hasSkillDefinition,
  getSupportedRoles,
  isValidSkillForRole,
  getSkillDetail,
};
