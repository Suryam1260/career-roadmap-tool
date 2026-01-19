import React, { useState, useCallback, useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  User, 
  Envelope, 
  Phone, 
  CaretDown, 
  CheckCircle, 
  WarningCircle, 
  GraduationCap
} from 'phosphor-react';
import { PrimaryButton, LoadingSpinner } from './ui';
import { validateEmail, validatePhone } from '../../utils/validation';
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
  max-width: 460px;
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
  margin-bottom: 20px;
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
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
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 46px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 0;
  background: #ffffff;
  font-size: 0.9rem;
  color: #1e293b;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#b30158'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(179, 1, 88, 0.1)'};
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px ${props => props.hasIcon ? '46px' : '16px'};
  border: 2px solid ${props => props.hasError ? '#dc2626' : '#e2e8f0'};
  border-radius: 0;
  background: #ffffff;
  font-size: 0.9rem;
  color: ${props => props.value ? '#1e293b' : '#94a3b8'};
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#b30158'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(179, 1, 88, 0.1)'};
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }

  option {
    color: #1e293b;
  }

  option[value=""] {
    color: #94a3b8;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  pointer-events: none;
  transition: transform 0.2s ease;
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 10px;
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

const PhoneInput = styled(Input)`
  flex: 1;
  padding-left: 16px;
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
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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
  padding: 8px;
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

const generateGradYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  years.push({ value: '', label: 'Select year' });
  
  for (let year = currentYear + 5; year >= currentYear; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  
  for (let year = currentYear - 1; year >= currentYear - 15; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  
  return years;
};

const SignUpForm = ({
  onSubmit,
  onLoginClick,
  submitStatus = 'idle',
  errorMessage = '',
  successMessage = '',
  initialValues = {}
}) => {
  const gradYearOptions = useMemo(() => generateGradYearOptions(), []);

  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone_number: initialValues.phone_number || '',
    grad_year: initialValues.grad_year || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [
    turnstileAppearance, setTurnstileAppearance
  ] = useState('interaction-only');
  const turnstileRef = useRef(null);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const isError = submitStatus === 'error';

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);

    const value = formData[field];
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email';
        break;
      case 'phone_number':
        if (!value.trim()) error = 'Phone number is required';
        else if (!validatePhone(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'grad_year':
        if (!value.trim()) error = 'Please select graduation year';
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [formData]);

  const handleFocus = useCallback((field) => {
    setFocusedField(field);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!validatePhone(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.grad_year) {
      newErrors.grad_year = 'Please select graduation year';
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone_number: true,
      grad_year: true
    });

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      setTurnstileAppearance('always');
      return;
    }

    const cleanedPhone = formData.phone_number.replace(/\D/g, '');
    
    onSubmit?.({
      ...formData,
      phone_number: cleanedPhone,
      turnstile_token: turnstileToken
    });
    if (turnstileRef.current
      && typeof turnstileRef.current.reset === 'function'
    ) {
      turnstileRef.current.reset();
    }
    setTurnstileToken('');
  }, [formData, validateForm, onSubmit, turnstileToken]);

  const handlePhoneInput = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    handleChange('phone_number', value);
  }, [handleChange]);

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>Create Account</FormTitle>
        <FormSubtitle>
          Join thousands of professionals accelerating their tech careers
        </FormSubtitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage>
          <CheckCircle size={20} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {isError && errorMessage && (
        <ErrorBanner>
          <WarningCircle size={20} weight="fill" />
          {errorMessage}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        

        <FieldGroup>
          <Label htmlFor="name">
            Full Name <span className="required">*</span>
          </Label>
          <InputWrapper>
            <InputIcon 
              hasError={touched.name && errors.name}
              focused={focusedField === 'name'}
            >
              <User size={20} weight="regular" />
            </InputIcon>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={(e) => {
                handleBlur('name');
                if (e.target.value) {
                  tracker.click({
                    click_type: 'signup_name_filled',
                    click_text: e.target.value
                  });
                }
              }}
              onFocus={() => handleFocus('name')}
              hasError={touched.name && errors.name}
              disabled={isLoading || isSuccess}
              autoComplete="name"
            />
          </InputWrapper>
          {touched.name && errors.name && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {errors.name}
            </ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="email">
            Email Address <span className="required">*</span>
          </Label>
          <InputWrapper>
            <InputIcon 
              hasError={touched.email && errors.email}
              focused={focusedField === 'email'}
            >
              <Envelope size={20} weight="regular" />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => {
                handleBlur('email');
                if (e.target.value) {
                  tracker.click({
                    click_type: 'signup_email_filled',
                    click_text: e.target.value
                  });
                }
              }}
              onFocus={() => handleFocus('email')}
              hasError={touched.email && errors.email}
              disabled={isLoading || isSuccess}
              autoComplete="email"
            />
          </InputWrapper>
          {touched.email && errors.email && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {errors.email}
            </ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </Label>
          <PhoneInputWrapper>
            <CountryCode>
              <span role="img" aria-label="India">🇮🇳</span>&nbsp;+91
            </CountryCode>
            <InputWrapper style={{ flex: 1 }}>
              <InputIcon 
                hasError={touched.phone_number && errors.phone_number}
                focused={focusedField === 'phone_number'}
                style={{ left: 14 }}
              >
                <Phone size={20} weight="regular" />
              </InputIcon>
              <PhoneInput
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.phone_number}
                onChange={handlePhoneInput}
                onBlur={(e) => {
                  handleBlur('phone_number');
                  if (e.target.value) {
                    tracker.click({
                      click_type: 'signup_phone_number_filled',
                      click_text: e.target.value
                    });
                  }
                }}
                onFocus={() => {
                  handleFocus('phone_number');
                  if (!turnstileToken) {
                    setTurnstileAppearance('always');
                  }
                }}
                hasError={touched.phone_number && errors.phone_number}
                disabled={isLoading || isSuccess}
                autoComplete="tel"
                inputMode="numeric"
                style={{ paddingLeft: 46 }}
              />
            </InputWrapper>
          </PhoneInputWrapper>
          {touched.phone_number && errors.phone_number && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {errors.phone_number}
            </ErrorMessage>
          )}
        </FieldGroup>
                
        <FieldGroup>
          <Label htmlFor="grad_year">
                  Graduation Year <span className="required">*</span>
          </Label>
          <SelectWrapper>
            <InputIcon 
              hasError={touched.grad_year && errors.grad_year}
              focused={focusedField === 'grad_year'}
            >
              <GraduationCap size={20} weight="regular" />
            </InputIcon>
            <Select
              id="grad_year"
              value={formData.grad_year}
              onChange={(e) => handleChange('grad_year', e.target.value)}
              onBlur={(e) => {
                handleBlur('grad_year');
                if (e.target.value) {
                  tracker.click({
                    click_type: 'signup_grad_year_filled',
                    click_text: e.target.value
                  });
                }
              }}
              onFocus={() => handleFocus('grad_year')}
              hasError={touched.grad_year && errors.grad_year}
              hasIcon={true}
              disabled={isLoading || isSuccess}
            >
              {gradYearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <SelectIcon>
              <CaretDown size={20} weight="bold" />
            </SelectIcon>
          </SelectWrapper>
          {touched.grad_year && errors.grad_year && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {errors.grad_year}
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
                Creating Account...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle size={20} weight="fill" />
                Account Created
              </>
            ) : (
              'Create Account'
            )}
          </PrimaryButton>

          {onLoginClick && (
            <SecondaryLink type="button" onClick={onLoginClick}>
              Already have an account? <span>Log in</span>
            </SecondaryLink>
          )}
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default SignUpForm;

