/**
 * COMPOSITION HELPERS
 *
 * Helper functions for the roadmap composition engine:
 * 1. deepMerge() - Intelligently merge nested objects
 * 2. applyUserDataOverrides() - Apply quiz responses as customizations
 * 3. enrichRoadmapConfig() - Add calculated values (skills gap, fit analysis, etc)
 */

/**
 * Deep merge two objects intelligently
 *
 * Rules:
 * - Arrays are replaced (not merged)
 * - Objects are recursively merged
 * - Later values override earlier values
 * - null/undefined values are skipped
 *
 * @param {Object} target - Base object
 * @param {Object} source - Object to merge in
 * @returns {Object} Merged object
 */
export function deepMerge(target = {}, source = {}) {
  if (!source || typeof source !== 'object') {
    return target;
  }

  const result = { ...target };

  for (const key in source) {
    if (!source.hasOwnProperty(key)) continue;

    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue === null || sourceValue === undefined) {
      continue; // Skip null/undefined values
    }

    if (Array.isArray(sourceValue)) {
      result[key] = sourceValue; // Replace arrays completely
    } else if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue); // Recursively merge objects
    } else {
      result[key] = sourceValue; // Override with source value
    }
  }

  return result;
}

/**
 * Apply user-data-driven overrides to the composed config
 *
 * This function customizes the roadmap based on specific quiz responses:
 *
 * 1. problemSolving (0-100):
 *    - 0-10: Add DSA fundamentals phase, more practice
 *    - 11-50: Include DSA in learning path
 *    - 51-100: Skip basic DSA, assume strong foundation
 *
 * 2. systemDesign ('not-yet', 'learning', 'once', 'multiple'):
 *    - not-yet: System design in phase 2-3, basics first
 *    - learning: System design in phase 2, intermediate
 *    - once: System design in phase 2, advanced
 *    - multiple: System design in phase 1, expert level
 *
 * 3. portfolio ('none', 'inactive', 'limited-1-5', 'active-5+'):
 *    - none: Start with tier1 simple projects
 *    - inactive: Start with tier1 projects, rebuild portfolio
 *    - limited-1-5: Start with tier1-tier2 mix
 *    - active-5+: Start with tier2-tier3, showcase projects
 *
 * 4. timePerWeek (5-50 hours):
 *    - 5-10 hrs/week: Extend timeline by 40%
 *    - 10-20 hrs/week: Standard timeline
 *    - 20+ hrs/week: Compress timeline by 20%
 *
 * 5. currentSkills (array of skills):
 *    - Remove "Language Fundamentals" phase if strong in language
 *    - Adjust skill gap radar based on existing skills
 *    - Customize skill recommendations
 *
 * @param {Object} config - Composed config to customize
 * @param {Object} quizResponses - User's quiz answers
 * @param {Object} modularPersona - Persona info
 * @returns {Object} Customized config
 */
export function applyUserDataOverrides(config, quizResponses, modularPersona) {
  const customized = JSON.parse(JSON.stringify(config)); // Deep clone

  // ========== 1. PROBLEM SOLVING LEVEL ADJUSTMENT ==========
  const problemSolving = quizResponses.problemSolving || 0;

  if (problemSolving <= 10 && customized.learningPath?.phases) {
    // Add DSA phase at the beginning
    const dsaPhase = {
      phaseNumber: 0,
      title: "Foundation: Data Structures & Algorithms Basics",
      duration: "4-6 weeks",
      description: "Master fundamental DSA concepts needed for interviews",
      keyTopics: [
        "Arrays and Strings",
        "Linked Lists",
        "Stacks and Queues",
        "Trees and Graphs",
        "Basic Sorting and Searching"
      ],
      learningPoints: [
        {
          title: "Arrays & Strings",
          description: "Master array manipulation and string processing"
        },
        {
          title: "Data Structures",
          description: "Understand lists, trees, graphs fundamentally"
        },
        {
          title: "Time & Space Complexity",
          description: "Learn Big O notation and optimization"
        },
        {
          title: "Basic Algorithms",
          description: "Sorting, searching, and graph traversal"
        }
      ],
      target: {
        metric: "50 LeetCode Problems",
        description: "Solve easy to medium DSA problems"
      },
      whyItMatters: [
        "DSA is the foundation of coding interviews",
        "Companies test problem-solving ability heavily",
        "Strong fundamentals accelerate learning"
      ]
    };

    // Insert DSA phase at beginning
    customized.learningPath.phases = [dsaPhase, ...customized.learningPath.phases];
    customized.learningPath.totalPhases = customized.learningPath.phases.length;

    // Extend timeline
    customized.hero.stats.estimatedDuration = "6-9 months";
  } else if (problemSolving <= 50 && customized.learningPath?.phases) {
    // Emphasize DSA in phase 1
    if (customized.learningPath.phases[0]) {
      customized.learningPath.phases[0].keyTopics = [
        "Data Structures & Algorithms",
        ...customized.learningPath.phases[0].keyTopics
      ];
    }
  }

  // ========== 2. SYSTEM DESIGN LEVEL ADJUSTMENT ==========
  const systemDesign = quizResponses.systemDesign || 'learning';

  if (systemDesign === 'multiple' && customized.learningPath?.phases) {
    // Move system design to phase 1
    if (customized.learningPath.phases[0]) {
      customized.learningPath.phases[0].keyTopics.unshift("System Design Basics");
    }
  } else if (systemDesign === 'not-yet' && customized.learningPath?.phases) {
    // Keep system design in later phases, mark as learning
    if (customized.learningPath.phases[1]) {
      customized.learningPath.phases[1].description =
        "Learn system design fundamentals for " + modularPersona.role;
    }
  }

  // ========== 3. PORTFOLIO LEVEL ADJUSTMENT ==========
  const portfolio = quizResponses.portfolio || 'none';

  if (customized.projects) {
    if (portfolio === 'active-5+') {
      // Start with tier2 projects, show advanced work
      customized.projects.recommendedStartingTier = 'tier2';
      customized.projects.guidance = 'Focus on complex, production-like projects that showcase advanced thinking';
    } else if (portfolio === 'limited-1-5') {
      // Mix of tier1 and tier2
      customized.projects.recommendedStartingTier = 'tier1-tier2';
    } else if (portfolio === 'inactive') {
      // Rebuild portfolio from tier1
      customized.projects.guidance = 'Start fresh - build a strong portfolio from scratch';
      customized.projects.recommendedStartingTier = 'tier1';
    }
    // else 'none' defaults to tier1 already
  }

  // ========== 4. TIME PER WEEK ADJUSTMENT ==========
  const timePerWeek = quizResponses.timePerWeek || 15;

  if (timePerWeek < 10 && customized.hero?.stats?.estimatedDuration) {
    // Extend timeline by 40%
    const duration = customized.hero.stats.estimatedDuration;
    if (duration.includes('3-6')) {
      customized.hero.stats.estimatedDuration = '5-9 months';
    } else if (duration.includes('6-9')) {
      customized.hero.stats.estimatedDuration = '9-12 months';
    } else if (duration.includes('9-12')) {
      customized.hero.stats.estimatedDuration = '12-16 months';
    }

    // Adjust effort stat to reflect this
    customized.hero.stats.estimatedEffort.value = '5-10';
  } else if (timePerWeek > 20 && customized.hero?.stats?.estimatedDuration) {
    // Compress timeline by 20%
    const duration = customized.hero.stats.estimatedDuration;
    if (duration.includes('6-9')) {
      customized.hero.stats.estimatedDuration = '4-7 months';
    } else if (duration.includes('9-12')) {
      customized.hero.stats.estimatedDuration = '6-9 months';
    } else if (duration.includes('3-6')) {
      customized.hero.stats.estimatedDuration = '2-4 months';
    }

    // Adjust effort stat
    customized.hero.stats.estimatedEffort.value = '20-30';
  }

  // ========== 5. CURRENT SKILLS ADJUSTMENT ==========
  if (quizResponses.currentSkills && Array.isArray(quizResponses.currentSkills)) {
    // Update skill gap baseline based on current skills
    if (customized.skillsGap?.baselineCompetency) {
      // Boost baseline for relevant skills user already has
      const skillsToBoost = quizResponses.currentSkills;

      for (const axis of Object.keys(customized.skillsGap.baselineCompetency)) {
        // Check if any current skill relates to this axis
        const isRelevant = skillsToBoost.some(skill =>
          skill.toLowerCase().includes(axis.toLowerCase().replace(/ /g, '_'))
        );

        if (isRelevant) {
          // Boost baseline by 15 points for skills they already have
          customized.skillsGap.baselineCompetency[axis] = Math.min(
            customized.skillsGap.baselineCompetency[axis] + 15,
            40 // Cap at 40 to show progress needed
          );
        }
      }
    }

    // Store current skills in config for reference
    customized.userSkills = quizResponses.currentSkills;
  }

  // ========== 6. TIMELINE PREFERENCE ==========
  if (quizResponses.timeline) {
    customized.userTimeline = quizResponses.timeline;
  }

  return customized;
}

/**
 * Enrich the composed config with calculated values
 *
 * This adds data that's computed rather than stored:
 * - Skill gap analysis (radar values, match score)
 * - Fit analysis per company type
 * - Project recommendations
 * - Learning path timeline calculations
 *
 * @param {Object} config - Config to enrich
 * @param {Object} quizResponses - Quiz responses for calculations
 * @param {Object} profileData - User profile data
 * @returns {Object} Enriched config
 */
export function enrichRoadmapConfig(config, quizResponses, profileData) {
  const enriched = JSON.parse(JSON.stringify(config));

  // ========== 1. SKILL GAP CALCULATION ==========
  if (enriched.skillsGap) {
    // Calculate match score based on current skills
    const currentSkills = quizResponses.currentSkills || [];
    const skillsByPriority = enriched.skillsGap.skillsByPriority || {};

    // Count skills by priority
    let highMatches = 0;
    let mediumMatches = 0;
    let lowMatches = 0;

    const highPrioritySkills = skillsByPriority.highPriority?.skill || [];
    const mediumPrioritySkills = skillsByPriority.mediumPriority?.skill || [];
    const lowPrioritySkills = skillsByPriority.lowPriority?.skill || [];

    currentSkills.forEach(skill => {
      if (highPrioritySkills.includes(skill)) highMatches++;
      else if (mediumPrioritySkills.includes(skill)) mediumMatches++;
      else if (lowPrioritySkills.includes(skill)) lowMatches++;
    });

    // Calculate weighted match score
    const totalHigh = highPrioritySkills.length;
    const totalMedium = mediumPrioritySkills.length;
    const totalLow = lowPrioritySkills.length;

    const weightedCurrent = highMatches * 3 + mediumMatches * 2 + lowMatches * 1;
    const weightedTotal = totalHigh * 3 + totalMedium * 2 + totalLow * 1;

    enriched.skillsGap.matchScore = Math.round((weightedCurrent / weightedTotal) * 100);

    // Update radar values based on current skills
    if (enriched.skillsGap.radarAxes && enriched.skillsGap.baselineCompetency) {
      enriched.skillsGap.radarAxes.forEach(axis => {
        // This is where you'd calculate axis-specific competency
        // For now, use baseline value
        if (!enriched.skillsGap.currentCompetency) {
          enriched.skillsGap.currentCompetency = {};
        }
        enriched.skillsGap.currentCompetency[axis] = enriched.skillsGap.baselineCompetency[axis];
      });
    }
  }

  // ========== 2. COMPANY FIT ANALYSIS ==========
  // REMOVED: Fit analysis is now handled dynamically by fitCalculator.js
  // CompaniesSection calculates fit on-the-fly based on:
  // - currentCompanyType from quiz (currentRole for tech, currentBackground for non-tech)
  // - targetCompanyType (selected tab)
  // - userAxisScores from axisCalculator.js

  // ========== 3. LEARNING PATH CALCULATIONS ==========
  if (enriched.learningPath?.phases) {
    let totalWeeks = 0;
    enriched.learningPath.phases.forEach((phase, index) => {
      // Parse duration and calculate weeks
      const durationMatch = phase.duration.match(/(\d+)(?:-(\d+))?\s*weeks/);
      if (durationMatch) {
        const weeks = parseInt(durationMatch[2] || durationMatch[1]);
        totalWeeks += weeks;
        phase.phaseNumber = index + 1;
      }

      // Calculate estimated end date for each phase
      phase.estimatedWeeks = durationMatch ? parseInt(durationMatch[1]) : 0;
    });

    enriched.learningPath.totalEstimatedWeeks = totalWeeks;
    enriched.learningPath.totalEstimatedMonths = Math.round(totalWeeks / 4);
  }

  // ========== 4. PROJECT RECOMMENDATIONS ==========
  if (enriched.projects) {
    // Determine which tier to start with based on experience
    const yearsExp = parseInt(profileData.yearsExperience?.split('-')[0] || '0');

    if (yearsExp === 0) {
      enriched.projects.recommendedStartingTier = enriched.projects.recommendedStartingTier || 'tier1';
    } else if (yearsExp <= 3) {
      enriched.projects.recommendedStartingTier = enriched.projects.recommendedStartingTier || 'tier1-tier2';
    } else {
      enriched.projects.recommendedStartingTier = enriched.projects.recommendedStartingTier || 'tier2-tier3';
    }

    // Calculate total project timeline
    let totalProjectWeeks = 0;
    ['tier1', 'tier2', 'tier3'].forEach(tier => {
      if (enriched.projects[tier]) {
        enriched.projects[tier].forEach(project => {
          const durationMatch = project.duration.match(/(\d+)(?:-(\d+))?\s*weeks/);
          if (durationMatch) {
            totalProjectWeeks += parseInt(durationMatch[1]);
          }
        });
      }
    });

    enriched.projects.totalEstimatedWeeks = totalProjectWeeks;
  }

  // ========== 5. ADD COMPLETION STATUS ==========
  enriched.completionStatus = {
    currentSkillsSelected: !!quizResponses.currentSkills?.length,
    timelineSelected: !!quizResponses.timeline,
    readyToStart: true,
    generatedAt: new Date().toISOString()
  };

  return enriched;
}

export default {
  deepMerge,
  applyUserDataOverrides,
  enrichRoadmapConfig
};
