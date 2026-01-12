import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import OtpVerificationForm from './OtpVerificationForm';
import EmailPasswordLoginForm from './EmailPasswordLoginForm';
import {
  signUp,
  verifySignUpOtp,
  login,
  verifyLoginOtp,
  loginWithEmailPassword
} from '../../api/authService';
import tracker from '../../utils/tracker';

const Container = styled.div`
  display: flex;
  justify-content: center;
  background: #f8fafc;

  @media (max-width: 540px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 32px;
  }
`;

const AuthFlow = ({
  initialMode = 'login',
  onSuccess,
  reloadOnSuccess = true
}) => {
  const [pendingData, setPendingData] = useState({
    phoneNumber: '',
    email: '',
    userData: null
  });

  const [formState, setFormState] = useState({
    step: initialMode,
    authFlow: 'login',
    signup: {
      status: 'idle',
      error: ''
    },
    login: {
      status: 'idle',
      error: ''
    },
    otp: {
      status: 'idle',
      error: ''
    },
    email_login: {
      status: 'idle',
      error: ''
    }
  });

  const handleSignUp = useCallback(async (formData) => {
    setFormState(prev => ({ ...prev, signup: { status: 'loading', error: '' } }));

    tracker.click({
      click_type: 'signup_form_submitted',
      click_source: 'auth_flow'
    });

    const result = await signUp(formData);

    if (result.success) {
      setFormState(prev => ({ ...prev, authFlow: 'signup', signup: { status: 'success', error: '' } }));
      setPendingData({
        phoneNumber: result.phone_number,
        email: result.email,
        userData: formData
      });
      
      setTimeout(() => {
        setFormState(prev => ({ ...prev, step: 'otp', signup: { status: 'idle', error: '' } }));
      }, 500);

      tracker.click({
        click_type: 'signup_otp_requested',
        click_source: 'auth_flow'
      });
    } else {
      setFormState(prev => ({ ...prev, signup: { status: 'error', error: result.error || 'Sign up failed. Please try again.' } }));
    }

    return result;
  }, []);

  const handleLogin = useCallback(async (phoneNumber, turnstileToken) => {
    setFormState(prev => ({ ...prev, login: { status: 'loading', error: '' } }));

    tracker.click({
      click_type: 'login_form_submitted',
      click_source: 'auth_flow'
    });

    const result = await login(phoneNumber, turnstileToken);

    if (result.success) {
      setFormState(prev => ({ ...prev, login: { status: 'success', error: '' } }));
      setPendingData({
        phoneNumber: result.phone_number,
        email: '',
        userData: null
      });
      
      setTimeout(() => {
        setFormState(prev => ({ ...prev, step: 'otp', login: { status: 'idle', error: '' } }));
      }, 500);

      tracker.click({
        click_type: 'login_otp_requested',
        click_source: 'auth_flow'
      });
    } else {
      const errorMsg = result.notFound
        ? 'Account not found. Please sign up first.'
        : (result.error || 'Login failed. Please try again.');

      setFormState(prev => ({ ...prev, login: { status: 'error', error: errorMsg } }));

      if (result.notFound) {
        tracker.click({
          click_type: 'login_user_not_found',
          click_source: 'auth_flow'
        });
      }
    }

    return result;
  }, []);

  const handleEmailPasswordLogin = useCallback(async (email, password, turnstileToken) => {
    setFormState(prev => ({ ...prev, email_login: { status: 'loading', error: '' } }));

    tracker.click({
      click_type: 'email_login_form_submitted',
      click_source: 'auth_flow'
    });

    const result = await loginWithEmailPassword(email, password, turnstileToken);

    if (result.success) {
      setFormState(prev => ({ ...prev, email_login: { status: 'success', error: '' } }));

      tracker.click({
        click_type: 'email_login_success',
        click_source: 'auth_flow'
      });

      if (onSuccess) {
        onSuccess({
          flow: 'email_login',
          phoneNumber: '',
          email: email,
          userData: null
        });
      }

      if (reloadOnSuccess) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      setFormState(prev => ({ ...prev, email_login: { status: 'error', error: result.error || 'Login failed. Please try again.' } }));
      tracker.click({
        click_type: 'email_login_failed',
        click_source: 'auth_flow'
      });
    }

    return result;
  }, [onSuccess, reloadOnSuccess]);

  const handleVerifyOtp = useCallback(async (otp) => {
    setFormState(prev => ({ ...prev, otp: { status: 'loading', error: '' } }));

    tracker.click({
      click_type: 'otp_submitted',
      click_source: 'auth_flow',
      custom: { flow: formState.authFlow }
    });

    let result;

    if (formState.authFlow === 'signup') {
      result = await verifySignUpOtp(pendingData.phoneNumber, otp, pendingData.email);
    } else {
      result = await verifyLoginOtp(pendingData.phoneNumber, otp);
    }

    if (result.success) {
      setFormState(prev => ({ ...prev, otp: { status: 'success', error: '' } }));

      tracker.click({
        click_type: formState.authFlow === 'signup' ? 'signup_success' : 'login_success',
        click_source: 'auth_flow'
      });

      if (onSuccess) {
        onSuccess({
          flow: formState.authFlow,
          phoneNumber: pendingData.phoneNumber,
          email: pendingData.email,
          userData: pendingData.userData
        });
      }

      if (reloadOnSuccess) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      setFormState(prev => ({ ...prev, otp: { status: 'error', error: result.error || 'Invalid OTP. Please try again.' } }));
    }

    return result;
  }, [formState.authFlow, pendingData, onSuccess, reloadOnSuccess]);

  const handleBackFromOtp = useCallback(() => {
    setFormState(prev => ({ ...prev, step: formState.authFlow, otp: { status: 'idle', error: '' } }));
  }, [formState.authFlow]);

  const handleSwitchToSignUp = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'signup', authFlow: 'signup', login: { status: 'idle', error: '' } }));
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'login', authFlow: 'login', signup: { status: 'idle', error: '' }, email_login: { status: 'idle', error: '' } }));
  }, []);

  const handleSwitchToEmailLogin = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'email_login', login: { status: 'idle', error: '' }, email_login: { status: 'idle', error: '' } }));
    tracker.click({
      click_type: 'switch_to_email_login_clicked',
      click_source: 'auth_flow'
    });
  }, []);

  const handleSwitchToPhoneLogin = useCallback(() => {
    setFormState(prev => ({ ...prev, step: 'login', authFlow: 'login', signup: { status: 'idle', error: '' }, email_login: { status: 'idle', error: '' } }));
    tracker.click({
      click_type: 'switch_to_phone_login_clicked',
      click_source: 'auth_flow'
    });
  }, []);

  const displayPhoneNumber = pendingData.phoneNumber.replace('+91-', '');

  return (
    <Container>
      {formState.step === 'signup' && (
        <SignUpForm
          onSubmit={handleSignUp}
          onLoginClick={handleSwitchToLogin}
          submitStatus={formState.signup.status}
          errorMessage={formState.signup.error}
          successMessage={formState.signup.status === 'success' ? 'OTP sent to your phone!' : ''}
        />
      )}

      {formState.step === 'login' && (
        <LoginForm
          onSubmit={handleLogin}
          onSignUpClick={handleSwitchToSignUp}
          onEmailLoginClick={handleSwitchToEmailLogin}
          submitStatus={formState.login.status}
          errorMessage={formState.login.error}
          successMessage={formState.login.status === 'success' ? 'OTP sent to your phone!' : ''}
        />
      )}

      {formState.step === 'email_login' && (
        <EmailPasswordLoginForm
          onSubmit={handleEmailPasswordLogin}
          onPhoneLoginClick={handleSwitchToPhoneLogin}
          submitStatus={formState.email_login.status}
          errorMessage={formState.email_login.error}
          successMessage={formState.email_login.status === 'success' ? 'Logged in successfully!' : ''}
        />
      )}

      {formState.step === 'otp' && (
        <OtpVerificationForm
          phoneNumber={displayPhoneNumber}
          onSubmit={handleVerifyOtp}
          onBack={handleBackFromOtp}
          submitStatus={formState.otp.status}
          errorMessage={formState.otp.error}
          successMessage={formState.otp.status === 'success' ? 'Verified successfully!' : ''}
        />
      )}
    </Container>
  );
};

export default AuthFlow;

