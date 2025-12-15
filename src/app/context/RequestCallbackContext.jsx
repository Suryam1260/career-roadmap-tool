import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import RequestCallbackModal from '../../components/common/RequestCallbackModal';
import { submitRequestCallback } from '../../utils/requestCallbackApi';

const RequestCallbackContext = createContext(null);

/**
 * RequestCallbackProvider
 * - Exposes simple APIs to trigger a "Request Callback" flow from any button
 * - Manages modal visibility, form defaults, submission state, and success/error handling
 */
export const RequestCallbackProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Optional defaults/prefill for the form, set when flow is triggered
  const [defaults, setDefaults] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
    source: '',       // e.g., "Navbar CTA", "Hero Section", "Footer", etc.
    tags: [],         // e.g., ["roadmap", "quiz"]
    metadata: {}      // arbitrary extra context
  });

  /**
   * triggerRequestCallback
   * - Call from any button click to open the modal and optionally pass defaults/context
   */
  const triggerRequestCallback = useCallback((options = {}) => {
    setDefaults((prev) => ({
      ...prev,
      ...options
    }));
    setSubmitSuccess(false);
    setSubmitError(null);
    setIsOpen(true);
  }, []);

  const closeRequestCallback = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * submitRequest
   * - Handles form submission and posts data to our API route
   */
  const submitRequest = useCallback(async (formValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const payload = {
        ...defaults,
        ...formValues,
        // Ensure safe shapes
        tags: Array.isArray(defaults.tags) ? defaults.tags : [],
        metadata: typeof defaults.metadata === 'object' && defaults.metadata !== null ? defaults.metadata : {}
      };
      await submitRequestCallback(payload);
      setSubmitSuccess(true);
      // Optionally keep modal open to show success, caller can close after
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit callback request.');
    } finally {
      setIsSubmitting(false);
    }
  }, [defaults]);

  const value = useMemo(() => ({
    // State
    isOpen,
    isSubmitting,
    submitError,
    submitSuccess,
    defaults,

    // Actions
    triggerRequestCallback,
    closeRequestCallback,
    submitRequest
  }), [isOpen, isSubmitting, submitError, submitSuccess, defaults, triggerRequestCallback, closeRequestCallback, submitRequest]);

  return (
    <RequestCallbackContext.Provider value={value}>
      {children}
      {/* Central modal portal once at root */}
      <RequestCallbackModal />
    </RequestCallbackContext.Provider>
  );
};

export const useRequestCallback = () => {
  const ctx = useContext(RequestCallbackContext);
  if (!ctx) {
    throw new Error('useRequestCallback must be used within RequestCallbackProvider');
  }
  return ctx;
};

export default RequestCallbackContext;


