import React, { useState } from 'react';
import styled from 'styled-components';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Crosshair, CheckCircle } from 'phosphor-react';
import { calculateAxisScores, getBaselineScores } from '../../utils/axisCalculator';

// Default skill descriptions (used if radarAxes not provided)
const defaultSkillDescriptions = {
  'DSA': {
    title: 'Data Structures & Algorithms',
    description: 'Your proficiency in solving coding problems using efficient data structures and algorithmic thinking. Essential for technical interviews and backend optimization.'
  },
  'System Design': {
    title: 'System Design',
    description: 'Your ability to design scalable systems, databases, and architectures. Critical for senior-level roles and building production-grade applications.'
  },
  'System Des.': {
    title: 'System Design',
    description: 'Your ability to design scalable systems, databases, and architectures. Critical for senior-level roles and building production-grade applications.'
  },
  'Projects': {
    title: 'Project Experience',
    description: 'Your hands-on experience building real-world projects. Demonstrates practical knowledge and problem-solving abilities to employers.'
  },
  'Languages': {
    title: 'Backend Languages',
    description: 'Your proficiency in backend programming languages like Python, Java, Go, Node.js, etc. The foundation for backend development work.'
  },
  'Databases': {
    title: 'Database & SQL',
    description: 'Your knowledge of database design, SQL queries, and data management. Essential for data-driven applications and backend systems.'
  }
};

// Custom tooltip component for radar chart - positioned above center with down arrow
// MOBILE: Disabled on mobile devices (< 768px)
const CustomTooltip = ({ active, payload, position, skillDescriptions = defaultSkillDescriptions }) => {
  // MOBILE CHECK: Disable tooltip on mobile devices
  const [isMobileView, setIsMobileView] = React.useState(false);

  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Don't show tooltip on mobile
  if (isMobileView) {
    return null;
  }

  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const skillInfo = skillDescriptions[dataPoint.category];

    // Get the position of the hover point relative to the chart container
    const tooltipX = position?.x || 0;
    const tooltipY = position?.y || 0;

    // ========================================
    // TOOLTIP POSITIONING - EASILY ADJUSTABLE
    // ========================================

    // HORIZONTAL OFFSET (X-axis)
    // How much to shift left/right from center
    // Positive = shift right, Negative = shift left
    // Examples: 0 = centered, 20 = right, -20 = left
    const horizontalOffset = 28;

    // VERTICAL OFFSET (Y-axis)
    // How much to shift up/down from hover point
    // Negative = up (away from chart), Positive = down (toward chart)
    // Examples: -90 = up, 0 = same level, 50 = down
    const verticalOffset = -30;

    return (
      <TooltipBox style={{
        position: 'absolute',

        // HORIZONTAL: Centers tooltip and applies offset
        left: '50%',
        transform: `translateX(${horizontalOffset}%)`,

        // VERTICAL: Positions relative to hover point with offset
        top: `${tooltipY + verticalOffset}px`,

        pointerEvents: 'none'
      }}>
        <TooltipTitle>{skillInfo?.title}</TooltipTitle>
        <TooltipDescription>{skillInfo?.description}</TooltipDescription>
      </TooltipBox>
    );
  }
  return null;
};

// Separate component for skill badge to handle logo state properly
const SkillBadge = ({ skill }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <KnownSkillBadge>
      {!logoError ? (
        <SkillLogo
          src={`https://img.logo.dev/${skill.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com?token=pk_X-18mHGdQfuhjN7ywKkE-Q`}
          onError={() => setLogoError(true)}
          alt=""
        />
      ) : (
        <CheckCircle size={18} weight="fill" color="#10b981" style={{ flexShrink: 0 }} />
      )}
      {skill}
    </KnownSkillBadge>
  );
};

const SkillMap = ({
  currentSkills,
  targetRole,
  quizResponses,
  evaluationResults,
  background,
  existingSkills,
  missingSkills,
  // Persona-driven props (optional, falls back to hardcoded if not provided)
  radarAxes,
  averageBaseline,
  skillMapThresholds,
  skillPriorities  // NEW: pass all available skills to calculate skills axis
}) => {
  // Check if mobile view
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Build skill descriptions from radarAxes if provided, otherwise use defaults
  const buildSkillDescriptions = () => {
    if (radarAxes && Array.isArray(radarAxes)) {
      const descriptions = {};
      radarAxes.forEach(axis => {
        descriptions[axis.label] = {
          title: axis.title,
          description: axis.description
        };
      });
      return descriptions;
    }
    return defaultSkillDescriptions;
  };

  const skillDescriptions = buildSkillDescriptions();

  // Extract all skills from skillPriorities to calculate skills axis (as full objects with axes)
  const extractAllSkills = () => {
    if (!skillPriorities || typeof skillPriorities !== 'object') {
      return [];
    }

    const allSkills = [];
    Object.keys(skillPriorities).forEach(priority => {
      const skillsAtPriority = skillPriorities[priority] || [];
      skillsAtPriority.forEach(skill => {
        // Push the full skill OBJECT (with name and axes), not just the name
        if (typeof skill === 'string') {
          allSkills.push({ name: skill, axes: [] });
        } else if (skill && typeof skill === 'object') {
          allSkills.push(skill);
        }
      });
    });

    return allSkills;
  };

  const allSkillsForRole = extractAllSkills();

  // DEBUG: Log what SkillMapNew is receiving
  if (typeof window !== 'undefined') {
    console.log('🗺️ SkillMapNew DEBUG:');
    console.log('   Props received:');
    console.log('     - currentSkills:', currentSkills);
    console.log('     - skillPriorities keys:', Object.keys(skillPriorities || {}));
    console.log('     - skillPriorities.high count:', skillPriorities?.high?.length || 0);
    console.log('     - radarAxes:', radarAxes?.map(a => a.key));
    console.log('   Extracted allSkillsForRole:', allSkillsForRole.length, 'skills');
    console.log('   First 3 skills with axes:', allSkillsForRole.slice(0, 3).map(s => ({ name: s.name, axes: s.axes })));
  }

  // Use the axis calculator to get dynamic scores
  const userAxisScores = calculateAxisScores(
    quizResponses || {},
    currentSkills || [],
    allSkillsForRole,
    skillMapThresholds || {},
    background || 'tech'
  );

  // Get baseline scores from persona (flat structure, no userType needed)
  const baselineScores = getBaselineScores(skillMapThresholds || {});

  // Prepare data for radar chart using dynamic axis scores
  const buildRadarData = () => {
    if (radarAxes && Array.isArray(radarAxes) && radarAxes.length > 0) {
      // Build from persona-driven axes using dynamic scores
      return radarAxes.map(axis => {
        // Get user score from calculated axis scores
        // IMPORTANT: Don't lowercase - axisCalculator stores keys as-is (camelCase)
        const axisKey = axis.key || '';
        // NO FALLBACK - if score doesn't exist, use 0 (not 50!)
        let userLevel = userAxisScores[axisKey] !== undefined ? userAxisScores[axisKey] : 0;

        // Get baseline from persona's threshold configuration
        const baselineValue = baselineScores[axisKey] !== undefined ? baselineScores[axisKey] : 50;

        return {
          category: axis.label,
          user: Math.round(userLevel),
          average: Math.round(baselineValue),
          fullMark: 100,
        };
      });
    }

    // Fall back: if no radarAxes, build from calculated scores with default axes
    return [
      {
        category: 'Skills',
        user: Math.round(userAxisScores.skills || 0),
        average: Math.round(baselineScores.skills || 50),
        fullMark: 100,
      },
      {
        category: 'DSA',
        user: Math.round(userAxisScores.dsa || 0),
        average: Math.round(baselineScores.dsa || 50),
        fullMark: 100,
      },
      {
        category: isMobile ? 'System Des.' : 'System Design',
        user: Math.round(userAxisScores.systemDesign || 0),
        average: Math.round(baselineScores.systemDesign || 50),
        fullMark: 100,
      },
    ];
  };

  const data = buildRadarData();

  return (
    <ContentWrapper>
        {/* Chart - centered with gradient background */}
        <ChartColumn>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              cx="50%"
              cy="45%"
              outerRadius="80%"
              margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip skillDescriptions={skillDescriptions} />} />

              {/* Average learner (dotted outline) */}
              <Radar
                name={`Avg. ${targetRole}`}
                dataKey="average"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#94a3b8', r: 4 }}
                activeDot={{ fill: '#60a5fa', r: 7 }}
              />

              {/* User's skills (filled area) */}
              <Radar
                name="My Skills"
                dataKey="user"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.5}
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ fill: '#1e40af', r: 8, strokeWidth: 2, stroke: '#fff' }}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem'
                }}
                iconType="rect"
                formatter={(value) => (
                  <span style={{ marginLeft: '8px', marginRight: '24px' }}>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartColumn>
      </ContentWrapper>
  );
};

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 40px 0 32px 0;
`;

const SkillMapContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 32px 24px;
  margin: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 24px 0 !important;
    margin: 0 -20px !important; /* Break out of ContentArea's 20px padding */
    border-left: none !important;
    border-right: none !important;
    width: auto !important;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  padding: 20px 20px 0 20px;
  margin-top: -36px;

  @media (max-width: 1024px) {
    padding: 20px 20px 0 40px;
  }

  @media (max-width: 768px) {
    padding: 24px 0 10px 0;
    margin-top: -34px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ChartColumn = styled.div`
  width: 100%;
  max-width: 700px;
  height: 440px;
  min-width: 0;
  overflow: visible;
  position: relative;

  @media (max-width: 768px) {
    height: 400px;
    max-width: 100%;
    padding: 0;
  }
`;

const ExplanationColumn = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0;

  @media (max-width: 1024px) {
    padding-left: 0;
    margin-top: 24px;
  }
`;

const ExplanationTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const ExplanationText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.7;
  margin: 0;

  strong {
    color: #1e293b;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

// Skills sections styled components
const KnownSkillsSection = styled.div`
  margin-bottom: 32px;
`;

const KnownSkillsHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const KnownSkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillLogo = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 2px;
`;

const KnownSkillBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 14px;
  color: #065f46;
  font-weight: 500;
`;

const MissingSkillsSection = styled.div`
  margin-top: 32px;
`;

const MissingSkillsHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MissingSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PriorityColumn = styled.div``;

const PriorityHeader = styled.div`
  margin-bottom: 12px;
`;

const PriorityTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SkillItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkillItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: ${props => props.bg || '#ffffff'};
  border: 1px solid ${props => props.borderColor || '#e2e8f0'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const SkillItemText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.color || '#1e293b'};
  font-weight: 500;
  flex: 1;
`;

const EmptySkillText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
  margin: 0;
`;

// ========================================
// TOOLTIP STYLING - MONOCHROMATIC GREY
// ========================================
// All tweakable values have comments below
// Easy to adjust colors, spacing, and appearance

const TooltipBox = styled.div`
  // ========== BACKGROUND COLOR ==========
  // TWEAK: Change background darkness
  // Options:
  //   #1a1a1a = very dark (almost black)
  //   #2d2d2d = current (dark grey) ← recommended
  //   #3a3a3a = lighter grey
  //   #4a4a4a = even lighter
  background: #2d2d2d;
  color: #ffffff;

  // ========== SPACING ==========
  padding: 14px 16px;

  // ========== CORNERS ==========
  // TWEAK: Border radius (0 = sharp corners, 4/8/12 = rounded)
  border-radius: 0;

  // ========== BORDER ==========
  // TWEAK: Border color and visibility
  // Current: 1px solid #3a3a3a (subtle grey)
  // Try: #404040 for darker, #505050 for lighter
  border: 1px solid #3a3a3a;

  // ========== SHADOW ==========
  // TWEAK: Box shadow (x y blur spread color)
  // More blur (16) = softer shadow
  // Less blur (8) = sharper shadow
  // Increase opacity for darker shadow (0.3 vs 0.5)
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);

  font-family: 'Plus Jakarta Sans', sans-serif;
  width: 340px;
  z-index: 100;
  position: relative;

  // ========== TRIANGLE POINTER ==========
  // Triangle pointing DOWN to the skill map
  // The triangle color must match the background!
  // If you change background color above, update the border-top color here
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -8px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    // TWEAK: Triangle color - must match background color (#2d2d2d)
    border-top: 8px solid #2d2d2d;
  }
`;

const TooltipTitle = styled.div`
  font-weight: 700;
  // TWEAK: Title font size (12/13/14/15 are good values)
  font-size: 14px;
  // TWEAK: Title text color
  // Options: #ffffff (pure white), #f0f0f0 (off-white), #e0e0e0 (light grey)
  color: #ffffff;
  margin-bottom: 8px;
  width: 100%;
`;

const TooltipDescription = styled.div`
  // TWEAK: Description font size (11/12/13/14)
  font-size: 13px;
  // TWEAK: Description text color
  // Current: #f0f0f0 (off-white for contrast)
  // Try: #ffffff (pure white), #e0e0e0 (lighter grey)
  color: #f0f0f0;
  // TWEAK: Line height (1.4/1.5/1.6/1.7) - higher = more spacing between lines
  line-height: 1.6;
  margin-bottom: 10px;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export default SkillMap;
export {
  SkillBadge,
  KnownSkillsContainer,
  KnownSkillsHeader,
  KnownSkillsSection,
  MissingSkillsGrid,
  PriorityColumn,
  PriorityHeader,
  PriorityTitle,
  SkillItemsContainer,
  SkillItemCard,
  SkillItemText,
  EmptySkillText
};
