export const GTMEventType = {
  PAGE_VIEW: 'we_page_load',
  SECTION_VIEW: 'gtm_section_view',
  CLICK: 'gtm_custom_click',
  HOVER: 'hover',
  FORM_SUBMIT_STATUS: 'form_submit_status'
};

function isUndefined(v) {
  return typeof v === 'undefined';
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge(target, source) {
  const out = Array.isArray(target) ? { ...target } : { ...target };
  Object.keys(source || {}).forEach((key) => {
    const sVal = source[key];
    const tVal = out[key];
    if (isObject(tVal) && isObject(sVal)) {
      out[key] = deepMerge(tVal, sVal);
    } else {
      out[key] = sVal;
    }
  });
  return out;
}

function removeEmptyKeys(obj) {
  if (!isObject(obj)) return obj;
  const out = {};
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (!isUndefined(v) && v !== null && v !== '') {
      out[k] = isObject(v) ? removeEmptyKeys(v) : v;
    }
  });
  return out;
}

const DEFAULT_CONFIG = {
  isEnabled: true,
  attributes: {}
};

class Tracker {
  constructor(config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    this._platform = 'web';
    this._isLoggedIn = false;
    this._isEnabled = Boolean(finalConfig.isEnabled);
    this._shouldTrack = true;
    this._superAttributes = finalConfig.attributes || {};
    this._pendingList = [];
    this._pushToPendingList = false;

    this._initialiseDataLayer();
  }

  _isWindowUndefined() {
    return typeof window === 'undefined';
  }

  _initialiseDataLayer() {
    if (this._isWindowUndefined()) return;
    window.dataLayer = window.dataLayer || [];
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get shouldTrack() {
    return this._shouldTrack;
  }

  get superAttributes() {
    return this._superAttributes;
  }

  set superAttributes(attributes) {
    this._superAttributes = deepMerge(this.superAttributes, attributes);
  }

  set isLoggedIn(status) {
    this._isLoggedIn = status;
  }

  set pushToPendingList(shouldPush) {
    this._pushToPendingList = shouldPush;
    if (!shouldPush) {
      this._pushPendingEvents();
    }
  }

  _pushPendingEvents() {
    if (this._pendingList.length) {
      this._pendingList.forEach(({ event, attributes }) =>
        this._trackEvent(event, attributes)
      );
      this._pendingList = [];
    }
  }

  _createEventPayload(event, _attributes) {
    const { custom: customAttributes, ...attributes } = _attributes;
    const {
      custom: customSuperAttributes = {},
      attributes: superAttributes = {}
    } = this.superAttributes;

    return {
      event,
      attributes: {
        is_logged_in: this._isLoggedIn,
        ...superAttributes,
        ...attributes
      },
      custom_attributes: {
        ...customSuperAttributes,
        ...(customAttributes || {})
      }
    };
  }

  _pushToDataLayer(payload) {
    window.dataLayer.push({
      _clear: true,
      ...payload
    });
  }

  _logEvent(payload) {
    // no-op
  }

  sectionView(attributes) {
    this._trackEvent(GTMEventType.SECTION_VIEW, attributes);
  }

  _trackEvent(event, _attributes) {
    if (!this.isEnabled) return;
    if (this._pushToPendingList) {
      this._pendingList.push({ event: String(event), attributes: _attributes });
      return;
    }

    const attributes = removeEmptyKeys(_attributes);
    const eventPayload = this._createEventPayload(String(event), attributes);

    if (this.shouldTrack) {
      this._pushToDataLayer(eventPayload);
    } else {
      this._logEvent(eventPayload);
    }
  }

  _createPageViewAttributes(attributes) {
    const { title } = window.document;
    const url = new URL(window.location.href);
    return {
      page_title: title,
      page_path: url.pathname,
      page_url: url.href,
      query_params: Object.fromEntries(url.searchParams),
      ...attributes
    };
  }

  pushRawEvent(event) {
    this._pushToDataLayer(event);
  }

  click(attributes) {
    this._trackEvent(GTMEventType.CLICK, attributes);
  }

  pageview(attributes = {}) {
    const finalAttributes = this._createPageViewAttributes(attributes);
    this._trackEvent(GTMEventType.PAGE_VIEW, finalAttributes);
  }

  hover(attributes) {
    this._trackEvent(GTMEventType.HOVER, attributes);
  }

  formSubmitStatus(attributes) {
    this._trackEvent(GTMEventType.FORM_SUBMIT_STATUS, attributes);
  }
}

const tracker = new Tracker({});
export default tracker;


