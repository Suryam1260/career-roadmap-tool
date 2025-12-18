"""
SKILLS ANALYSIS - Weighted Match Score Algorithm

This module implements the core skill analysis logic based on Scaler CRT algorithm.

Key Features:
1. Weighted match score calculation (priority-based)
2. Skill gap analysis (categorized by priority)
3. Skill prioritization and recommendations

Algorithm:
- HIGH priority skills = weight 3
- MEDIUM priority skills = weight 2
- LOW priority skills = weight 1

Match Score = (weighted_score / total_weight) × 100

Example:
User has: Python (HIGH=3), Docker (MEDIUM=2) = 5 points
Role needs: 10 HIGH (30 points) + 8 MEDIUM (16 points) = 46 total points
Match Score: (5 / 46) × 100 = 11%
"""

from typing import List, Dict, Any
from priority_data import (
    get_explicit_priorities,
    get_all_skills_for_role,
    get_priority_weight,
)


def calculate_match_score(
    user_skills: List[str], role_category: str
) -> Dict[str, Any]:
    """
    Calculate weighted match score for a user's skills against a target role.

    This is the CORE ALGORITHM that determines how ready a user is for their target role.

    Args:
        user_skills: List of skills the user has
        role_category: Target role category (e.g., 'Backend Engineering')

    Returns:
        Dictionary with:
        - matchScore: Percentage (0-100)
        - weightedScore: User's weighted score
        - totalWeight: Maximum possible weight for the role
        - skillCoverage: Same as matchScore (for compatibility)

    Example:
        >>> calculate_match_score(['Python', 'Git'], 'Backend Engineering')
        {
            'matchScore': 26,
            'weightedScore': 6,
            'totalWeight': 23,
            'skillCoverage': 26
        }
    """
    # Get priority mapping for this role
    priorities = get_explicit_priorities(role_category)
    all_role_skills = list(priorities.keys())

    if not all_role_skills:
        return {
            "matchScore": 0,
            "weightedScore": 0,
            "totalWeight": 0,
            "skillCoverage": 0,
        }

    weighted_score = 0
    total_weight = 0

    # Calculate weighted scores
    for skill in all_role_skills:
        priority = priorities.get(skill, "LOW")
        weight = get_priority_weight(priority)

        total_weight += weight

        # If user has this skill, add its weight to their score
        if skill in user_skills:
            weighted_score += weight

    # Calculate percentage
    match_score = (
        round((weighted_score / total_weight) * 100) if total_weight > 0 else 0
    )

    return {
        "matchScore": match_score,
        "weightedScore": weighted_score,
        "totalWeight": total_weight,
        "skillCoverage": match_score,  # Alias for compatibility
    }


def analyze_skill_gaps(
    user_skills: List[str], role_category: str
) -> Dict[str, Any]:
    """
    Analyze user's skill gaps against target role requirements.

    Categorizes skills into:
    - existingSkills: Skills user already has (relevant to role)
    - missingSkills: Skills user needs to learn (by priority)

    Args:
        user_skills: List of skills the user has
        role_category: Target role category

    Returns:
        Dictionary with:
        - existingSkills: List of relevant skills user has
        - missingSkills: Dict with highPriority, mediumPriority, lowPriority lists
        - totalSkillsNeeded: Total number of skills for this role
        - skillsAcquired: Number of skills user has

    Example:
        >>> analyze_skill_gaps(['Python', 'Git'], 'Backend Engineering')
        {
            'existingSkills': ['Python', 'Git'],
            'missingSkills': {
                'highPriority': ['Java', 'Node.js', 'Data Structures & Algorithms', ...],
                'mediumPriority': ['Docker', 'Kubernetes', ...],
                'lowPriority': ['AWS/Cloud Platforms', ...]
            },
            'totalSkillsNeeded': 22,
            'skillsAcquired': 2
        }
    """
    # Get all skills and priorities for this role
    priorities = get_explicit_priorities(role_category)
    all_role_skills = list(priorities.keys())

    # Filter existing skills (only count those relevant to the role)
    existing_skills = [skill for skill in user_skills if skill in all_role_skills]

    # Find missing skills
    missing_skills = [skill for skill in all_role_skills if skill not in user_skills]

    # Categorize missing skills by priority
    high_priority = []
    medium_priority = []
    low_priority = []

    for skill in missing_skills:
        priority = priorities.get(skill, "LOW")

        if priority == "HIGH":
            high_priority.append(skill)
        elif priority == "MEDIUM":
            medium_priority.append(skill)
        else:
            low_priority.append(skill)

    return {
        "existingSkills": existing_skills,
        "missingSkills": {
            "highPriority": high_priority,
            "mediumPriority": medium_priority,
            "lowPriority": low_priority,
        },
        "totalSkillsNeeded": len(all_role_skills),
        "skillsAcquired": len(existing_skills),
    }


def prioritize_skills(
    skills: List[str], role_category: str
) -> List[Dict[str, Any]]:
    """
    Prioritize a list of skills by their importance for the role.

    Sorts skills by priority weight (HIGH → MEDIUM → LOW).

    Args:
        skills: List of skill names to prioritize
        role_category: Target role category

    Returns:
        List of dictionaries with:
        - skill: Skill name
        - priority: 'HIGH', 'MEDIUM', or 'LOW'
        - priorityScore: Weight value (3, 2, or 1)
        - reason: Description of priority level

    Example:
        >>> prioritize_skills(['Python', 'Docker', 'Serverless'], 'Backend Engineering')
        [
            {'skill': 'Python', 'priority': 'HIGH', 'priorityScore': 3, 'reason': 'Essential skill for this role'},
            {'skill': 'Docker', 'priority': 'MEDIUM', 'priorityScore': 2, 'reason': 'Important supporting skill'},
            {'skill': 'Serverless', 'priority': 'LOW', 'priorityScore': 1, 'reason': 'Nice-to-have skill'}
        ]
    """
    priorities = get_explicit_priorities(role_category)

    priority_reasons = {
        "HIGH": "Essential skill for this role",
        "MEDIUM": "Important supporting skill",
        "LOW": "Nice-to-have skill",
    }

    prioritized = []

    for skill in skills:
        priority = priorities.get(skill, "LOW")
        priority_score = get_priority_weight(priority)
        reason = priority_reasons.get(priority, "Additional skill")

        prioritized.append(
            {
                "skill": skill,
                "priority": priority,
                "priorityScore": priority_score,
                "reason": reason,
            }
        )

    # Sort by priority score (descending: HIGH first, then MEDIUM, then LOW)
    prioritized.sort(key=lambda x: x["priorityScore"], reverse=True)

    return prioritized


def get_top_skills_to_learn(
    missing_skills: Dict[str, List[str]], count: int = 3
) -> List[str]:
    """
    Get top N skills to learn, prioritized by importance.

    Focuses on HIGH priority gaps first, then MEDIUM, then LOW.

    Args:
        missing_skills: Dict from analyze_skill_gaps()
        count: Number of skills to return (default: 3)

    Returns:
        List of top skill names to learn

    Example:
        >>> get_top_skills_to_learn({
        ...     'highPriority': ['Java', 'System Design'],
        ...     'mediumPriority': ['Docker'],
        ...     'lowPriority': ['Serverless']
        ... }, count=3)
        ['Java', 'System Design', 'Docker']
    """
    top_skills = []

    # Add HIGH priority first
    top_skills.extend(missing_skills.get("highPriority", []))

    # Add MEDIUM priority if we need more
    if len(top_skills) < count:
        top_skills.extend(missing_skills.get("mediumPriority", []))

    # Add LOW priority if we still need more
    if len(top_skills) < count:
        top_skills.extend(missing_skills.get("lowPriority", []))

    # Return only the requested count
    return top_skills[:count]


def generate_skill_analysis(
    user_skills: List[str], role_category: str
) -> Dict[str, Any]:
    """
    Complete skill analysis for a user (combines all analysis functions).

    This is the main function to call for a comprehensive analysis.

    Args:
        user_skills: List of skills the user has
        role_category: Target role category

    Returns:
        Complete analysis including:
        - Match score
        - Skill gaps
        - Prioritized existing and missing skills
        - Top 3 skills to learn

    Example:
        >>> generate_skill_analysis(['Python', 'Git'], 'Backend Engineering')
        {
            'matchScore': 26,
            'weightedScore': 6,
            'totalWeight': 23,
            'existingSkills': ['Python', 'Git'],
            'missingSkills': {...},
            'prioritizedExisting': [...],
            'prioritizedMissing': [...],
            'topSkillsToLearn': ['Java', 'Node.js', 'Data Structures & Algorithms']
        }
    """
    # Calculate match score
    match_data = calculate_match_score(user_skills, role_category)

    # Analyze skill gaps
    gap_data = analyze_skill_gaps(user_skills, role_category)

    # Prioritize existing skills
    prioritized_existing = prioritize_skills(
        gap_data["existingSkills"], role_category
    )

    # Prioritize missing skills
    all_missing = (
        gap_data["missingSkills"]["highPriority"]
        + gap_data["missingSkills"]["mediumPriority"]
        + gap_data["missingSkills"]["lowPriority"]
    )
    prioritized_missing = prioritize_skills(all_missing, role_category)

    # Get top 3 skills to focus on
    top_skills = get_top_skills_to_learn(gap_data["missingSkills"], count=3)

    return {
        # Match score data
        "matchScore": match_data["matchScore"],
        "weightedScore": match_data["weightedScore"],
        "totalWeight": match_data["totalWeight"],
        "skillCoverage": match_data["skillCoverage"],
        # Skill lists
        "existingSkills": gap_data["existingSkills"],
        "missingSkills": gap_data["missingSkills"],
        "totalSkillsNeeded": gap_data["totalSkillsNeeded"],
        "skillsAcquired": gap_data["skillsAcquired"],
        # Prioritized lists
        "prioritizedExisting": prioritized_existing,
        "prioritizedMissing": prioritized_missing,
        # Recommendations
        "topSkillsToLearn": top_skills,
    }
