import { getCookie } from './cookie';
import { BYPASS_UTM, UTM_MEDIUM, UTM_SOURCE } from '../constants/analytics';

export function getURLWithUTMParams() {
  let pageUrl = window.location.href;
  const utmQuery = getCookie(BYPASS_UTM);
  if (
    !pageUrl.includes(UTM_MEDIUM)
    && !pageUrl.includes(UTM_SOURCE)
    && utmQuery
  ) {
    const nonUtmQuery = window.location.search;
    pageUrl += nonUtmQuery ? `&${utmQuery}` : `?${utmQuery}`;
  }
  return pageUrl;
}

export function getPathWithQueryParams(path) {
  const currentSearch = window.location.search;
  return currentSearch ? `${path}${currentSearch}` : path;
}

// Nudge display tracking using sessionStorage
const NUDGE_SHOWN_KEY = 'masterclass_nudge_shown';

export function hasNudgeBeenShown(eventId) {
  if (!eventId) return false;
  try {
    const shownNudges = JSON.parse(sessionStorage.getItem(NUDGE_SHOWN_KEY) || '{}');
    return shownNudges[eventId] === true;
  } catch (e) {
    return false;
  }
}

export function markNudgeAsShown(eventId) {
  if (!eventId) return;
  try {
    const shownNudges = JSON.parse(sessionStorage.getItem(NUDGE_SHOWN_KEY) || '{}');
    shownNudges[eventId] = true;
    sessionStorage.setItem(NUDGE_SHOWN_KEY, JSON.stringify(shownNudges));
  } catch (e) {
    // Silently fail if sessionStorage is not available
  }
}


