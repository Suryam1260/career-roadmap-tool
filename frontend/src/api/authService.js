import { AUTH_ENDPOINTS } from './endpoints';
import attribution from '../utils/attribution';
import { apiRequest, ApiError } from '../utils/api';

const BASE_ERROR_MESSAGES = {
  400: 'Invalid request. Please check your details.',
  401: 'Incorrect email or password.',
  403: 'Email already registered with another account.',
  404: 'Account not found. Please sign up first.',
  406: 'Verification expired. Please refresh and try again.',
  409: 'Phone number is linked to a different email.',
  422: 'Please fill all required fields correctly.',
  429: 'Too many requests. Please try again in a few minutes.',
  500: 'Server error. Please try again later.'
};

function resolveApiError(error, fallbackMessage = 'Something went wrong. Please try again.') {
  if (!(error instanceof ApiError)) {
    return { message: 'Network error. Please check your connection.' };
  }
  const status = error.response?.status;
  const json = error.responseJson || {};
  const flashError = json?.flashError;
  const statusMessage = json.message || BASE_ERROR_MESSAGES[status];
  return { message: flashError || statusMessage || fallbackMessage, status };
}

export async function signUp(userData) {
  attribution.setAttribution('career_roadmap_signup');

  const payload = {
    user: {
      name: userData.name,
      email: userData.email,
      phone_number: `+91-${userData.phone_number}`,
      orgyear: userData.grad_year || ''
    },
    'cf-turnstile-response': userData.turnstile_token,
    type: 'marketing',
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    }
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.SIGN_UP, payload);
    return {
      success: true,
      phone_number: `+91-${userData.phone_number}`,
      email: userData.email
    };

  } catch (error) {
    console.error('Sign up error:', error);
    const { message } = resolveApiError(error);
    return { success: false, error: message };
  }
}

export async function verifySignUpOtp(phoneNumber, otp, email) {
  const payload = {
    user: {
      phone_number: phoneNumber,
      otp: otp,
      email: email,
      type: 'marketing'
    },
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    }
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.SIGN_UP_VERIFY, payload);
    return { success: true };

  } catch (error) {
    console.error('Verify sign up OTP error:', error);
    const { status, message } = resolveApiError(error);
    if (status === 422) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    return { success: false, error: message };
  }
}

export async function login(phoneNumber, turnstileToken) {
  attribution.setAttribution('career_roadmap_login');

  const formattedPhone = `+91-${phoneNumber}`;
  const payload = {
    user: { phone_number: formattedPhone },
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    },
    'cf-turnstile-response': turnstileToken
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.LOGIN, payload);
    return {
      success: true,
      phone_number: formattedPhone
    };

  } catch (error) {
    console.error('Login error:', error);
    const { status, message } = resolveApiError(error);
    if (status === 404) {
      return {
        success: false,
        error: 'Account not found. Please sign up first.',
        notFound: true
      };
    }
    return { success: false, error: message };
  }
}

export async function verifyLoginOtp(phoneNumber, otp) {
  const payload = {
    user: {
      phone_number: phoneNumber,
      otp: otp
    },
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    }
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.LOGIN_VERIFY, payload);
    return { success: true };

  } catch (error) {
    console.error('Verify login OTP error:', error);
    const { status, message } = resolveApiError(error);
    if (status === 422) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
    return { success: false, error: message };
  }
}

export async function loginWithEmailPassword(email, password, turnstileToken) {
  attribution.setAttribution('career_roadmap_login_email');
  
  const payload = {
    user: { email, password },
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    },
    'cf-turnstile-response': turnstileToken
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.LOGIN_WITH_EMAIL_PASSWORD, payload);
    return { success: true };
  } catch (error) {
    console.error('Email/password login error:', error);
    const { status, message } = resolveApiError(error);
    if (status === 401) {
      return { success: false, error: BASE_ERROR_MESSAGES[401] };
    }
    if (status === 404) {
      return { success: false, error: BASE_ERROR_MESSAGES[404], notFound: true };
    }
    return { success: false, error: message };
  }
}

export async function resendOtp(phoneNumber, type = 'signup') {
  const endpoint = type === 'login' ? AUTH_ENDPOINTS.LOGIN : AUTH_ENDPOINTS.SIGN_UP;
  
  const payload = {
    user: { phone_number: phoneNumber },
    attributions: {
      ...attribution.getAttribution(),
      product: 'scaler',
      sub_product: 'career_roadmap_tool'
    }
  };

  try {
    await apiRequest('POST', endpoint, payload);
    return { success: true };

  } catch (error) {
    console.error('Resend OTP error:', error);
    const { message } = resolveApiError(error, 'Failed to resend OTP. Please try again.');
    return { success: false, error: message };
  }
}

export default {
  signUp,
  verifySignUpOtp,
  login,
  verifyLoginOtp,
  loginWithEmailPassword,
  resendOtp
};

