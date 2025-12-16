import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const OVERLAY_ID = "request-callback-modal";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 32px;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #1e293b;
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
`;

const Select = styled.select`
  border: 1px solid #cbd5e1;
  background: white;
  color: #1e293b;
  border-radius: 0;
  height: 46px;
  padding: 0 16px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #b30158;
    box-shadow: 0 0 0 1px #b30158;
  }

  &:hover {
    border-color: #94a3b8;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  border: none;
  border-radius: 0;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;

  &:hover {
    color: #1e293b;
    background: #f8fafc;
  }
`;

const PrimaryButton = styled(Button)`
  background: #b30158;
  color: white;

  &:hover:not(:disabled) {
    background: #8a0145;
  }

  &:active:not(:disabled) {
    background: #700038;
  }
`;

const StatusMessage = styled.div`
  padding: 12px 16px;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid;
`;

const SuccessMessage = styled(StatusMessage)`
  background: #dcfce7;
  color: #166534;
  border-color: #86efac;
`;

const ErrorMessage = styled(StatusMessage)`
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
;      transform: rotate(360deg);
    }
  }
`;

const programOptions = [
  { value: '', label: 'Select a program' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'academy', label: 'Software Development' },
  { value: 'devops', label: 'DevOps' },
  { value: 'ai_ml', label: 'AI/ML' }
];

const RequestCallbackModal = ({
  isOpen,
  program,
  onChangeField,
  onClose,
  onSubmit,
  submissionStatus = 'idle',
  errorMessage = ''
}) => {
  const isLoading = submissionStatus === "loading";
  const isSuccess = submissionStatus === "success";
  const isError = submissionStatus === "error";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const submitHandler = useCallback((event) => {
    event.preventDefault();
    onSubmit();
  }, [onSubmit]);

  if (!isOpen) {
    return null;
  }

  const content = (
    <Overlay
      id={OVERLAY_ID}
      role="presentation"
      onClick={(event) => {
        if (event.target.id === OVERLAY_ID) {
          onClose();
        }
      }}
    >
      <Modal role="dialog" aria-modal="true" aria-labelledby="callback-title">
        <Header>
          <Title id="callback-title">Request a callback</Title>
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            ×
          </CloseButton>
        </Header>
        <Description>
          Share a few details and we'll reach out with tailored guidance for
          your goals.
        </Description>
        {isSuccess && (
          <SuccessMessage>
            ✓ Request submitted successfully! We'll reach out soon.
          </SuccessMessage>
        )}
        {isError && (
          <ErrorMessage>
            {errorMessage || 'Something went wrong. Please try again.'}
          </ErrorMessage>
        )}
        <Form
          onSubmit={submitHandler}
        >
          <Field>
            Program
            <Select
              value={program}
              onChange={(event) => onChangeField('program', event.target.value)}
              required
              disabled={isLoading || isSuccess}
            >
              {programOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Actions>
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              disabled={!program || isLoading || isSuccess}
            >
              {isLoading && <LoadingSpinner />}
              {isLoading ? 'Submitting...' : 'Request callback'}
            </PrimaryButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );

  return ReactDOM.createPortal(content, document.body);
};

RequestCallbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  program: PropTypes.string.isRequired,
  onChangeField: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submissionStatus: PropTypes.oneOf(['idle', 'loading', 'success', 'error']),
  errorMessage: PropTypes.string
};

export default RequestCallbackModal;



