import { getDeviceType } from './platform';
import { getURLWithUTMParams } from './url';

export class ApiError extends Error {
  constructor(message, response, json) {
    super(message);
    this.name = 'ApiError';
    this.isFromServer = true;
    this.response = response;
    this.responseJson = json;
  }
}

export async function parseJsonResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch {
    // ignore invalid or empty JSON
  }

  // Handle flash messages from server
  if (response.headers.has('X-Flash-Messages')) {
    const flashHeader = response.headers.get('X-Flash-Messages') || '{}';
    try {
      const { error, notice } = JSON.parse(flashHeader) || {};
      if (error || notice) {
        const flashError = error || notice;
        if (json && typeof json === 'object') {
          Object.assign(json, { flashError });
        } else {
          json = { flashError };
        }
      }
    } catch {
      // ignore invalid JSON in flash header
    }
  }

  if (response.ok) return json;
  throw new ApiError(response.statusText, response, json);
}

export async function apiRequest(method, path, body = null, options = {}) {
  const deviceType = getDeviceType();
  const csrfMeta = typeof document !== 'undefined' 
    ? document.querySelector('meta[name="csrf-token"]') 
    : null;

  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Accept-Flash': 'true',
    'App-Name': deviceType,
    ...(csrfMeta ? { 'X-CSRF-Token': csrfMeta.content } : {})
  };

  const defaultOptions = { method };

  if (options.dataType === 'FormData') {
    delete defaultHeaders['Content-Type'];
    defaultOptions.body = body;
  } else if (body && method !== 'GET') {
    defaultOptions.body = JSON.stringify(body);
  }

  const { headers, params, ...remainingOptions } = options;
  const finalOptions = {
    ...defaultOptions,
    headers: { ...defaultHeaders, ...(headers || {}) },
    credentials: 'same-origin',
    ...remainingOptions
  };

  // Add referrer with UTM params
  if (typeof window !== 'undefined') {
    finalOptions.referrer = getURLWithUTMParams();
  }

  if (params) {
    const usp = new URLSearchParams(params);
    path += `?${usp.toString()}`;
  } else if (method === 'GET' && body && typeof body === 'object') {
    const usp = new URLSearchParams(body);
    path += `?${usp.toString()}`;
  }

  const response = await fetch(path, finalOptions);
  return parseJsonResponse(response);
}

export async function generateJWT() {
  const csrfMeta = typeof document !== 'undefined'
    ? document.querySelector('meta[name="csrf-token"]')
    : null;
  let token;
  try {
    const headers = {
      'Content-Type': 'text/plain',
      'X-Requested-With': 'XMLHttpRequest',
      ...(csrfMeta?.content ? { 'X-CSRF-Token': csrfMeta.content } : {})
    };
    const response = await fetch('/generate-jwt', {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    if (!response.ok) throw new Error(String(response.status));
    token = await response.text();
  } catch (error) {
    throw error;
  }
  return token;
}
