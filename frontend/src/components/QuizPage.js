import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useProfile } from '../context/UnifiedContext';
import styled, { keyframes } from 'styled-components';
import QuizOrchestrator from './quiz/QuizOrchestrator';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const QuizContainer = styled.div`
  min-height: calc(100vh - 74px);
  background: #FFFFFF;
  position: relative;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 20px 160px;
`;

const QuizContent = styled.div`
  min-height: 400px;
  animation: ${fadeIn} 1.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  @media print {
    display: none;
  }
`;

const NavigationContent = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviousButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  padding: 8px 20px;
  border-radius: 0;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
    background: #FAFAFA;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  background: ${props => props.disabled ? '#e2e8f0' : '#FFFFFF'};
  color: ${props => props.disabled ? '#94a3b8' : '#1e293b'};
  border: 2px solid ${props => props.disabled ? '#e2e8f0' : '#e2e8f0'};
  padding: 8px 24px;
  border-radius: 0;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.disabled ? '#e2e8f0' : '#FAFAFA'};
    border-color: ${props => props.disabled ? '#e2e8f0' : '#0041CA'};
  }
`;

const ValidationWarning = styled.div`
  background: ${props => props.severity === 'warning' ? '#FEF3C7' : '#DBEAFE'};
  border-left: 4px solid ${props => props.severity === 'warning' ? '#F59E0B' : '#3B82F6'};
  padding: 16px 20px;
  margin-bottom: 32px;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #1e293b;
  line-height: 1.6;
  animation: ${fadeIn} 0.5s ease;

  strong {
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }
`;

function QuizPage({ onProgressChange, quizMode = 'final' }) {
  const router = useRouter();
  const {
    evaluationResults
  } = useProfile();

  // Redirect to results if evaluation already exists (prevent direct URL access)
  useEffect(() => {
    if (evaluationResults) {
      router.replace('/results');
    }
  }, [evaluationResults, router]);

  // Always render quiz orchestrator
  return <QuizOrchestrator onProgressChange={onProgressChange} />;
}

export default QuizPage;
