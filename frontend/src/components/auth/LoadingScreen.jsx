import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  font-family: system-ui, -apple-system, sans-serif;
`;

const LogoWrapper = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 1.5rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 1.125rem;
  color: #94a3b8;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

/**
 * Loading screen shown while authentication is being checked
 */
export function LoadingScreen({ message = 'Loading...', subtitle = 'Please wait while we verify your session' }) {
  return (
    <Container>
      <LogoWrapper>
        <Logo 
          src="/scaler-logo.svg" 
          alt="Scaler" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </LogoWrapper>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
      <LoadingText>{message}</LoadingText>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}

export default LoadingScreen;

