/**
 * Roadmap Backend API Client
 * 
 * Handles communication with the Python backend for session storage.
 */

const getApiBaseUrl = () => {
  // In browser, use relative URL in production (same origin via nginx)
  // or direct backend URL in development
  if (typeof window !== 'undefined') {
    // If NEXT_PUBLIC_API_BASE_URL is set, use it
    // Otherwise, use empty string for same-origin requests (production)
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (envUrl) {
      return envUrl;
    }
    // Production: use same origin (nginx proxies to backend)
    return '';
  }
  // Server-side: use direct backend URL
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://backend:8000';
};

/**
 * Save quiz responses to backend and get session hash
 * 
 * @param {Object} quizResponses - The quiz responses to save
 * @returns {Promise<{session_hash: string, admin_url_path: string}>}
 */
export async function saveRoadmapSession(quizResponses) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/career-roadmap-tool/api/session`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ quiz_responses: quizResponses })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to save roadmap session:', error);
    throw error;
  }
}

/**
 * Retrieve quiz responses by session hash
 * 
 * @param {string} sessionHash - The 32-character MD5 hash
 * @returns {Promise<{quiz_responses: Object, created_at: string, updated_at: string}>}
 */
export async function getRoadmapSession(sessionHash) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/career-roadmap-tool/api/session/${sessionHash}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Session not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to retrieve roadmap session:', error);
    throw error;
  }
}

/**
 * Check backend health
 * 
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/career-roadmap-tool/api/health`;
  
  try {
    const response = await fetch(url, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}

