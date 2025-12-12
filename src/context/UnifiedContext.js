import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from 'react';

/**
 * UNIFIED CONTEXT - Combines ProfileContext and RoadmapContext
 *
 * This context manages all application state including:
 * - Profile data imported from Profile Evaluator
 * - Quiz responses and user goals
 * - Current skills and timeline selections
 * - Generated roadmap data
 * - Evaluation results
 * - UI state (loading, errors)
 */

const UnifiedContext = createContext();

// Load state from localStorage (SSR-aware for Next.js)
// Only load state if it's less than 24 hours old (prevent stale data)
const loadStateFromStorage = () => {
  if (typeof window === 'undefined') return null; // Skip during SSR
  try {
    const savedState = localStorage.getItem('scalerCareerRoadmapState');
    if (savedState) {
      const parsed = JSON.parse(savedState);

      // Check timestamp - clear if older than 24 hours
      if (parsed._timestamp) {
        const ageInMs = Date.now() - parsed._timestamp;
        const ageInHours = ageInMs / (1000 * 60 * 60);

        if (ageInHours > 24) {
          console.warn('⚠️ Cached state is older than 24 hours. Clearing stale data.');
          localStorage.removeItem('scalerCareerRoadmapState');
          return null;
        }
      }

      return parsed;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return null;
};

// Save state to localStorage (SSR-aware for Next.js)
const saveStateToStorage = (state) => {
  if (typeof window === 'undefined') return; // Skip during SSR
  try {
    // Add timestamp to track state age
    const stateWithTimestamp = {
      ...state,
      _timestamp: Date.now()
    };
    localStorage.setItem('scalerCareerRoadmapState', JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const defaultState = {
  // ===== FROM PROFILE EVALUATOR =====
  // Imported profile data from Free Profile Evaluator
  // FUTURE: Will be fetched from Scaler.com API
  profileData: null,

  // User background type
  background: null, // 'non-tech' or 'tech'

  // Quiz responses from profile evaluator
  quizResponses: {},

  // User goals and requirements
  goals: {
    requirementType: [],
    targetCompany: '',
    topicOfInterest: []
  },

  // Profile evaluation results
  evaluationResults: null,

  // ===== ROADMAP-SPECIFIC DATA =====
  // Skills selected by user in roadmap flow
  currentSkills: [],

  // Timeline preference (e.g., "6-9 months", "9-12 months")
  timeline: null,

  // Generated roadmap data
  roadmap: null,

  // ===== UI STATE =====
  loading: false,
  error: null,
};

// Load from localStorage if available, otherwise use defaultState
// With the new quiz flow, there are no async hydration issues
const initialState = loadStateFromStorage() || defaultState;

// Action types
const ActionTypes = {
  // Profile Evaluator actions
  SET_BACKGROUND: 'SET_BACKGROUND',
  SET_QUIZ_RESPONSE: 'SET_QUIZ_RESPONSE',
  CLEAR_QUIZ_RESPONSES: 'CLEAR_QUIZ_RESPONSES',
  SET_GOALS: 'SET_GOALS',
  SET_EVALUATION_RESULTS: 'SET_EVALUATION_RESULTS',

  // Roadmap actions
  SET_PROFILE_DATA: 'SET_PROFILE_DATA',
  SET_CURRENT_SKILLS: 'SET_CURRENT_SKILLS',
  SET_TIMELINE: 'SET_TIMELINE',
  SET_ROADMAP: 'SET_ROADMAP',

  // UI state actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',

  // Reset actions
  RESET_ALL: 'RESET_ALL',
  RESET_ROADMAP_ONLY: 'RESET_ROADMAP_ONLY',
};

const unifiedReducer = (state, action) => {
  switch (action.type) {
    // ===== PROFILE EVALUATOR ACTIONS =====
    case ActionTypes.SET_BACKGROUND:
      return {
        ...state,
        background: action.payload
      };

    case ActionTypes.SET_QUIZ_RESPONSE:
      return {
        ...state,
        quizResponses: {
          ...state.quizResponses,
          [action.payload.question]: action.payload.answer
        }
      };

    case ActionTypes.CLEAR_QUIZ_RESPONSES:
      return {
        ...state,
        quizResponses: {}
      };

    case ActionTypes.SET_GOALS:
      return {
        ...state,
        goals: {
          ...state.goals,
          ...action.payload
        }
      };

    case ActionTypes.SET_EVALUATION_RESULTS:
      return {
        ...state,
        evaluationResults: action.payload
      };

    // ===== ROADMAP ACTIONS =====
    case ActionTypes.SET_PROFILE_DATA:
      return {
        ...state,
        profileData: action.payload
      };

    case ActionTypes.SET_CURRENT_SKILLS:
      return {
        ...state,
        currentSkills: action.payload
      };

    case ActionTypes.SET_TIMELINE:
      return {
        ...state,
        timeline: action.payload
      };

    case ActionTypes.SET_ROADMAP:
      return {
        ...state,
        roadmap: action.payload,
        loading: false
      };

    // ===== UI STATE ACTIONS =====
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    // ===== RESET ACTIONS =====
    case ActionTypes.RESET_ALL:
      return defaultState;

    case ActionTypes.RESET_ROADMAP_ONLY:
      return {
        ...state,
        currentSkills: [],
        timeline: null,
        roadmap: null,
        error: null
      };

    default:
      return state;
  }
};

export const UnifiedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(unifiedReducer, initialState);
  const isResetting = useRef(false);

  // Save to localStorage whenever state changes (except during reset)
  useEffect(() => {
    if (!isResetting.current) {
      saveStateToStorage(state);
    }
  }, [state]);

  // ===== PROFILE EVALUATOR METHODS =====
  const setBackground = useCallback((background) => {
    dispatch({ type: ActionTypes.SET_BACKGROUND, payload: background });
  }, []);

  const setQuizResponse = useCallback((question, answer) => {
    dispatch({ type: ActionTypes.SET_QUIZ_RESPONSE, payload: { question, answer } });
  }, []);

  const clearQuizResponses = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_QUIZ_RESPONSES });
  }, []);

  const setGoals = useCallback((goals) => {
    dispatch({ type: ActionTypes.SET_GOALS, payload: goals });
  }, []);

  const setEvaluationResults = useCallback((results) => {
    dispatch({ type: ActionTypes.SET_EVALUATION_RESULTS, payload: results });
  }, []);

  // ===== ROADMAP METHODS =====
  const setProfileData = useCallback((data) => {
    dispatch({ type: ActionTypes.SET_PROFILE_DATA, payload: data });
  }, []);

  const setCurrentSkills = useCallback((skills) => {
    dispatch({ type: ActionTypes.SET_CURRENT_SKILLS, payload: skills });
  }, []);

  const setTimeline = useCallback((timeline) => {
    dispatch({ type: ActionTypes.SET_TIMELINE, payload: timeline });
  }, []);

  const setRoadmap = useCallback((roadmap) => {
    dispatch({ type: ActionTypes.SET_ROADMAP, payload: roadmap });
  }, []);

  // ===== UI STATE METHODS =====
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  // ===== RESET METHODS =====
  const resetAll = useCallback(() => {
    isResetting.current = true;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('scalerCareerRoadmapState');
    }
    dispatch({ type: ActionTypes.RESET_ALL });
    setTimeout(() => {
      isResetting.current = false;
    }, 100);
  }, []);

  const resetRoadmapOnly = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_ROADMAP_ONLY });
  }, []);

  // Backward compatibility aliases
  const resetProfile = resetAll; // Alias for ProfileContext compatibility
  const resetRoadmap = resetRoadmapOnly; // Alias for RoadmapContext compatibility

  const value = useMemo(() => ({
    // State
    ...state,

    // Profile Evaluator methods
    setBackground,
    setQuizResponse,
    clearQuizResponses,
    setGoals,
    setEvaluationResults,

    // Roadmap methods
    setProfileData,
    setCurrentSkills,
    setTimeline,
    setRoadmap,

    // UI state methods
    setLoading,
    setError,

    // Reset methods
    resetAll,
    resetRoadmapOnly,
    resetProfile, // Backward compatibility
    resetRoadmap, // Backward compatibility
  }), [
    state,
    setBackground,
    setQuizResponse,
    clearQuizResponses,
    setGoals,
    setEvaluationResults,
    setProfileData,
    setCurrentSkills,
    setTimeline,
    setRoadmap,
    setLoading,
    setError,
    resetAll,
    resetRoadmapOnly,
    resetProfile,
    resetRoadmap,
  ]);

  return (
    <UnifiedContext.Provider value={value}>
      {children}
    </UnifiedContext.Provider>
  );
};

// Custom hook to use the unified context
export const useUnified = () => {
  const context = useContext(UnifiedContext);
  if (!context) {
    throw new Error('useUnified must be used within UnifiedProvider');
  }
  return context;
};

// Backward compatibility hooks
export const useProfile = useUnified; // Alias for components using ProfileContext
export const useRoadmap = useUnified; // Alias for components using RoadmapContext

export default UnifiedContext;
