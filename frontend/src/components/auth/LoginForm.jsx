import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Phone, SignIn, CheckCircle, WarningCircle } from 'phosphor-react';
import { PrimaryButton, LoadingSpinner } from './ui';
import { validatePhone } from '../../utils/validation';
import TurnstileWidget from '../../utils/Turnstile';
import tracker from '../../utils/tracker';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 28px;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 540px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border: 2px solid #f9a8d4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #b30158;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;

  span.required {
    color: #dc2626;
  }
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const CountryCode = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  background: #f8fafc;
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.hasError ? '#dc2626' : props.focused ? '#b30158' : '#94a3b8'};
  transition: color 0.2s ease;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 0;
  background: #ffffff;
  font-size: 0.95rem;
  color: #1e293b;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#b30158'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(179, 1, 88, 0.1)'};
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
    letter-spacing: normal;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
  
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #dc2626;
  animation: ${shake} 0.3s ease-in-out;

  svg {
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 0;
  font-size: 0.9rem;
  color: #166534;
  font-weight: 500;
`;

const ErrorBanner = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-left: 4px solid #dc2626;
  border-radius: 0;
  font-size: 0.9rem;
  color: #991b1b;
  font-weight: 500;
  animation: ${shake} 0.4s ease-in-out;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
`;

const SecondaryLink = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  text-align: center;

  &:hover {
    color: #b30158;
  }

  span {
    color: #b30158;
    font-weight: 600;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const SecondaryLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LoginForm = ({
  onSubmit,
  onSignUpClick,
  onEmailLoginClick,
  submitStatus = 'idle',
  errorMessage = '',
  successMessage = '',
  initialPhone = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [
    turnstileAppearance, setTurnstileAppearance
  ] = useState('interaction-only');
  const turnstileRef = useRef(null);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const isError = submitStatus === 'error';

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    
    if (error) {
      setError('');
    }
  }, [error]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setFocused(false);

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
    } else if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
    }
  }, [phoneNumber]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setTouched(true);

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!turnstileToken) {
      setTurnstileAppearance('always');
      setError('Please complete the verification');
      return;
    }

    onSubmit?.(phoneNumber, turnstileToken);
    if (turnstileRef.current
      && typeof turnstileRef.current.reset === 'function'
    ) {
      turnstileRef.current.reset();
    }
    setTurnstileToken('');
  }, [phoneNumber, onSubmit, turnstileToken]);

  const displayError = touched && (error || (isError && errorMessage));

  return (
    <FormContainer>
      <FormHeader>
        <IconWrapper>
          <SignIn size={32} weight="fill" />
        </IconWrapper>
        <FormTitle>Login</FormTitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage role="alert" aria-live="polite">
          <CheckCircle size={20} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {isError && errorMessage && !error && (
        <ErrorBanner role="alert" aria-live="polite">
          <WarningCircle size={20} weight="fill" />
          {errorMessage}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </Label>
          <PhoneInputWrapper>
            <CountryCode>
              <span role="img" aria-label="India">🇮🇳</span>&nbsp;+91
            </CountryCode>
            <InputWrapper>
              <InputIcon 
                hasError={!!displayError}
                focused={focused}
              >
                <Phone size={20} weight="regular" />
              </InputIcon>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={(e) => {
                  handleBlur();
                  if (e.target.value) {
                    tracker.click({
                      click_type: 'login_phone_number_filled',
                      click_text: e.target.value
                    });
                  }
                }}
                onFocus={() => {
                  handleFocus();
                  if (!turnstileToken) {
                    setTurnstileAppearance('always');
                  }
                }}
                hasError={!!displayError}
                disabled={isLoading || isSuccess}
                autoComplete="tel"
                inputMode="numeric"
                autoFocus
              />
            </InputWrapper>
          </PhoneInputWrapper>
          {displayError && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {error || errorMessage}
            </ErrorMessage>
          )}
        </FieldGroup>

        <TurnstileWidget
          ref={turnstileRef}
          onTokenObtained={setTurnstileToken}
          appearance={turnstileAppearance}
        />

        <ButtonGroup>
          <PrimaryButton 
            type="submit" 
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Sending OTP...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle size={20} weight="fill" />
                OTP Sent
              </>
            ) : (
              'Continue with OTP'
            )}
          </PrimaryButton>

          {(onEmailLoginClick || onSignUpClick) && <Divider>or</Divider>}

          <SecondaryLinkContainer>
            {onEmailLoginClick && (
              <SecondaryLink
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEmailLoginClick?.();
                }}
              >
              Use <span>email & password</span> instead
              </SecondaryLink>
            )}

            {onSignUpClick && (
              <SecondaryLink
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSignUpClick?.();
                }}
              >
              Don't have an account? <span>Sign up</span>
              </SecondaryLink>
            )}
          </SecondaryLinkContainer>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default LoginForm;

