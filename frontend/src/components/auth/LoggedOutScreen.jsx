import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  padding: 1.5rem;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 0.75rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #94a3b8;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const RedirectMessage = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem;
`;

const CountdownText = styled.span`
  color: #6366f1;
  font-weight: 600;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const REDIRECT_DELAY_SECONDS = 3;

/**
 * Screen shown when user is logged out
 * Includes auto-redirect countdown and manual retry button
 */
export function LoggedOutScreen({ 
  onRetry, 
  autoRedirect = true,
  redirectDelay = REDIRECT_DELAY_SECONDS,
  title = 'Session Expired',
  message = 'Your session has expired or you are not logged in. Please sign in to continue.'
}) {
  const [countdown, setCountdown] = useState(redirectDelay);

  useEffect(() => {
    if (!autoRedirect || !onRetry) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, onRetry]);

  return (
    <Container>
      <Card>
        <IconWrapper>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </IconWrapper>
        
        <Title>{title}</Title>
        <Message>{message}</Message>
        
        {autoRedirect && countdown > 0 && (
          <RedirectMessage>
            Redirecting to sign in in <CountdownText>{countdown}</CountdownText> seconds...
          </RedirectMessage>
        )}
        
        <Button onClick={onRetry}>
          Sign In Now
        </Button>
      </Card>
    </Container>
  );
}

export default LoggedOutScreen;

