/**
 * CRT (Career Roadmap Tool) API utilities
 * 
 * These functions interact with the career-profile-evaluation backend
 * to store and retrieve quiz responses using an MD5 hash-based approach.
 */

const CRT_API_BASE = '/career-profile-tool/api/crt';

/**
 * Store quiz responses after roadmap generation.
 * Returns an MD5 hash key that can be used in admin URLs.
 * 
 * @param {Object} quizResponses - The full quiz responses object
 * @returns {Promise<string>} - The MD5 hash key (32 characters)
 * @throws {Error} - If the API call fails
 */
export async function storeCRTQuizResponses(quizResponses) {
  const response = await fetch(`${CRT_API_BASE}/store`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quizResponses })
  });

  if (!response.ok) {
    throw new Error('Failed to store quiz responses');
  }

  const data = await response.json();
  return data.hash_key;
}

/**
 * Fetch quiz responses for admin view using the hash key.
 * 
 * @param {string} hashKey - The MD5 hash key from the admin URL
 * @param {Object} credentials - Admin credentials (optional, for future auth)
 * @param {string} credentials.username - Admin username
 * @param {string} credentials.password - Admin password
 * @returns {Promise<Object>} - Object containing hash_key, quiz_responses, and created_at
 * @throws {Error} - If credentials are invalid or hash not found
 */
export async function fetchCRTQuizResponses(hashKey, credentials = null) {
  const headers = {};
  
  // Add auth header if credentials provided (for future use)
  if (credentials && credentials.username && credentials.password) {
    headers['Authorization'] = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
  }

  const response = await fetch(`${CRT_API_BASE}/admin/view/${hashKey}`, {
    headers
  });

  if (response.status === 401) {
    throw new Error('Invalid credentials');
  }

  if (response.status === 404) {
    throw new Error('Roadmap data not found');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch quiz responses');
  }

  return await response.json();
}

