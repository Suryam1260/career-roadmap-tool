/**
 * SKILLS API ENDPOINT - Get skills for a specific target role
 *
 * GET /api/skills/[targetRole]
 *
 * Returns all skills for a given role with their priorities (HIGH, MEDIUM, LOW)
 * Used by frontend to dynamically load skills for the skills question
 *
 * Example:
 * GET /api/skills/Backend%20Engineering
 *
 * Returns:
 * {
 *   role: "Backend Engineering",
 *   skills: {
 *     high: ["Python", "Java", "Node.js", ...],
 *     medium: ["Docker", "Kubernetes", ...],
 *     low: ["AWS/Cloud Platforms", ...]
 *   },
 *   allSkills: ["Python", "Java", ...] // Combined array sorted by priority
 * }
 */

import { SKILL_PRIORITIES } from '../../../src/utils/skillPriorities';

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { targetRole } = req.query;

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole parameter is required' });
  }

  // Decode URL-encoded role name
  const decodedRole = decodeURIComponent(targetRole);

  // Check if role exists
  if (!SKILL_PRIORITIES[decodedRole]) {
    return res.status(404).json({
      error: 'Role not found',
      availableRoles: Object.keys(SKILL_PRIORITIES),
    });
  }

  const roleData = SKILL_PRIORITIES[decodedRole];

  // Prepare response
  const response = {
    role: decodedRole,
    skills: {
      high: roleData.HIGH || [],
      medium: roleData.MEDIUM || [],
      low: roleData.LOW || [],
    },
    // Combined array (sorted by priority)
    allSkills: [
      ...(roleData.HIGH || []),
      ...(roleData.MEDIUM || []),
      ...(roleData.LOW || []),
    ],
    totalSkills: (roleData.HIGH?.length || 0) + (roleData.MEDIUM?.length || 0) + (roleData.LOW?.length || 0),
  };

  return res.status(200).json(response);
}
