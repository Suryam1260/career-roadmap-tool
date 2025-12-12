import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useProfile } from '../../context/UnifiedContext';
import styled, { keyframes } from 'styled-components';
import QuizUI from './QuizUI';
import { getQuizScreens, isScreenComplete } from './QuizConfig';
import ScalerLogo from '../../assets/scaler-logo.svg';
import { CaretLeft, CaretRight, Check, MapTrifold, BookOpen, Buildings, ChartBar, Clock } from 'phosphor-react';
import ChatBot from '../../assets/ChatBot.png';
import { loadSkillsForQuiz } from '../../utils/quizSkillLoader';

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

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const QuizContainer = styled.div`
  min-height: 100vh;
  background: #F8F9FA;
  position: relative;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }
`;

const LeftPanel = styled.div`
  width: 40%;
  background: #F5F8FC;
  padding: 32px 60px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const TrustBadgeSection = styled.div`
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    margin-top: 20px;
    padding-top: 16px;
  }
`;

const TrustBadgeTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const LogoTicker = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to right, #F8F9FA 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to left, #F8F9FA 0%, transparent 100%);
    z-index: 2;
    pointer-events: none;

    @media (max-width: 768px) {
      width: 40px;
    }
  }
`;

const LogoTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;
  animation: ${scroll} 25s linear infinite;
  width: fit-content;
  will-change: transform;

  @media (max-width: 768px) {
    gap: 36px;
    padding-right: 36px;
  }
`;

const CompanyLogo = styled.img`
  height: 36px;
  width: auto;
  object-fit: contain;
  opacity: 0.8;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 30px;
  }
`;

const RightPanel = styled.div`
  width: 60%;
  background: #FFFFFF;
  padding: 32px;
  min-height: 100vh;
  border-left: 1px solid #e2e8f0;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100vw;
    border-left: none;
    padding: 12px;
    min-height: 100vh;
    padding-bottom: 100px;
    overflow-x: hidden;
    box-sizing: border-box;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Logo = styled.div`
  svg {
    height: 32px;
    width: auto;
  }
`;

const WelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 440px;
`;

const LeftPanelChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 0;
`;

const LeftPanelBotAvatar = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const LeftPanelChatBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 18px 20px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  flex: 1;
  max-width: 600px;

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 14px solid #fde047;
  }

  &::after {
    content: '';
    position: absolute;
    left: -10px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 12px solid #fefce8;
  }
`;

const LeftPanelChatText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
  white-space: pre-line;
  animation: ${slideInFromLeft} 0.6s ease-out;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #c71f69;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
`;

const WelcomeDescription = styled.p`
  font-size: 1rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 24px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.9rem;
  color: #475569;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #c71f69;
`;

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #e2e8f0;
  z-index: 300;
  display: block;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #0041CA;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ChatbotContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 120px;
  max-width: 440px;
`;

const ChatbotWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ChatbotAvatar = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const BotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatMessage = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  animation: ${slideInFromLeft} 0.6s ease-out;

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 14px solid #fde047;
  }

  &::after {
    content: '';
    position: absolute;
    left: -10px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 12px solid #fefce8;
  }
`;

const QuizContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.centered ? 'center' : 'flex-start'};
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  padding: ${props => props.centered ? '40px 24px' : '100px 24px 40px'};
  width: 100%;

  @media (max-width: 768px) {
    padding: ${props => props.centered ? '20px 0' : '0'};
    align-items: ${props => props.centered ? 'center' : 'flex-start'};
    justify-content: ${props => props.centered ? 'center' : 'flex-start'};
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const BackButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const NextButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const TopNavigationWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 0;
  z-index: 10;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopNavigation = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const SmallCTAButton = styled.button`
  background: #B30158;
  color: white;
  border: 2px solid #B30158;
  border-radius: 0;
  padding: 10px 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  white-space: nowrap;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #8A0145;
    border-color: #8A0145;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CarouselDotsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 40px;
`;

const Dot = styled.div`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 0;
  background: ${props => props.active ? '#64748b' : '#cbd5e1'};
  transition: all 0.3s ease;
  cursor: ${props => props.active ? 'default' : 'pointer'};

  &:hover {
    background: ${props => props.active ? '#64748b' : '#94a3b8'};
  }
`;


const MobileChatbotSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
    margin-top: 32px;
  }
`;

const MobileChatbotAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MobileChatBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px;
  position: relative;
  align-self: stretch;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #fde047;
  }

  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 22px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fefce8;
  }
`;

const MobileChatbotText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #1e293b;
  margin: 0;
  font-weight: 500;
`;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 20px;
  display: none;
  z-index: 100;

  @media (max-width: 768px) {
    display: flex;
    justify-content: ${props => props.isLastStep ? 'space-between' : 'space-between'};
    align-items: center;
    gap: 12px;
  }
`;

const MobileWelcomeScreen = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    padding: 20px 20px 100px;
    background: #fbfbfb;
  }
`;

const MobileWelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
`;

const StickyMobileCTA = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #D80566;
  color: white;
  border: none;
  padding: 18px 32px;
  border-radius: 0;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &:hover {
    background: #b8044d;
  }
`;

const LastStepNavButton = styled.button`
  background: ${props => props.variant === 'primary' ? '#D70666' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#1e293b'};
  border: 2px solid ${props => props.variant === 'primary' ? '#D70666' : '#e2e8f0'};
  padding: ${props => props.variant === 'primary' ? '14px 24px' : '14px 16px'};
  border-radius: 0;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: ${props => props.variant === 'primary' ? '1px' : '0'};
  text-transform: ${props => props.variant === 'primary' ? 'uppercase' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  flex: ${props => props.variant === 'primary' ? '1' : 'none'};
  width: ${props => props.variant === 'primary' ? 'auto' : '60px'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#b8044d' : '#f8fafc'};
    border-color: ${props => props.variant === 'primary' ? '#b8044d' : '#cbd5e1'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const NavButton = styled.button`
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
  padding: 14px 16px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 50px;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const FinalModeQuiz = ({ onProgressChange }) => {
  const router = useRouter();
  const {
    background,
    setBackground,
    quizResponses,
    setQuizResponse,
    clearQuizResponses,
    goals,
    evaluationResults
  } = useProfile();

  // Redirect to results if evaluation already exists (prevent direct URL access)
  useEffect(() => {
    if (evaluationResults) {
      router.replace('/results');
    }
  }, [evaluationResults, router]);

  // Career Roadmap Tool - only 2 questions, no background selection
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // Default to false for SSR
  const [showMobileWelcome, setShowMobileWelcome] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [skillsLoaded, setSkillsLoaded] = useState(false); // Track if skills are loaded
  const [chatText, setChatText] = useState("Let's get started with your profile"); // Dynamic chat text

  // Set isMobile on client-side only and listen for window resize
  useEffect(() => {
    // Mark as mounted and set initial value
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug: Log quiz state on mount and when it changes
  useEffect(() => {
    console.log('🔄 Quiz State Update:', {
      currentStep,
      quizResponsesKeys: Object.keys(quizResponses || {}),
      quizResponses: quizResponses,
      skillsLoaded
    });
  }, [currentStep, quizResponses, skillsLoaded]);

  // Get quiz screens based on background selection (tech or non-tech)
  // Initially use 'tech' as default, will update when background is selected
  const userBackground = quizResponses?.background || null;
  // Memoize quizScreens to prevent useEffect from running on every render
  const quizScreens = useMemo(() => {
    return userBackground ? getQuizScreens(userBackground) : getQuizScreens('tech');
  }, [userBackground]);
  const totalSteps = quizScreens.length;

  // Update chat text when screen changes (NOT when responses change within same screen)
  useEffect(() => {
    if (currentStep >= 0 && currentStep < quizScreens.length) {
      const screen = quizScreens[currentStep];
      const initialText = screen.getDynamicChatText
        ? screen.getDynamicChatText(quizResponses)
        : screen.initialChatText;
      console.log('🔄 [QuizOrchestrator] useEffect updating chatText:', initialText);
      setChatText(initialText || "Let's continue!");
    }
  }, [currentStep, quizScreens]); // Removed quizResponses to prevent race condition

  useEffect(() => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    onProgressChange?.(progress);
  }, [currentStep, totalSteps, onProgressChange]);

  // Preload skills from persona BEFORE reaching the skills screen
  useEffect(() => {
    // Check if we have enough info to determine persona (role + level)
    const hasRole = quizResponses?.targetRole;
    const hasLevel = quizResponses?.yearsOfExperience;
    const hasBackground = quizResponses?.background;

    if (hasRole && hasLevel && hasBackground) {
      // Reset loaded state when persona changes
      setSkillsLoaded(false);

      // Preload skills early so they're ready when user reaches skills screen
      loadSkillsForQuiz(quizResponses)
        .then((skills) => {
          console.log(`✅ Preloaded ${skills.length} skills from persona (early loading)`);
          setSkillsLoaded(true); // Force re-render
        })
        .catch((error) => {
          console.error('❌ Failed to preload skills:', error);
          setSkillsLoaded(false);
        });
    }
  }, [quizResponses?.targetRole, quizResponses?.yearsOfExperience, quizResponses?.background]);

  const handleQuizResponse = (questionId, option) => {
    console.log('📝 Quiz Response:', { questionId, option, type: typeof option });

    // For Career Roadmap Tool - store responses
    if (Array.isArray(option)) {
      // Multi-select (skills)
      console.log('  → Multi-select:', option.length, 'items');
      setQuizResponse(questionId, option);
    } else if (typeof option === 'string') {
      // Single select (timeline)
      console.log('  → String value:', option);
      setQuizResponse(questionId, option);
    } else if (option && typeof option === 'object') {
      // Object with value/label
      console.log('  → Object value:', option.value, 'label:', option.label);
      setQuizResponse(questionId, option.value);
      const labelFields = ['currentRole', 'targetRole', 'targetCompany'];
      if (labelFields.includes(questionId)) {
        setQuizResponse(`${questionId}Label`, option.label);
      }
    } else {
      console.warn('  ⚠️ Unexpected option type or null/undefined');
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to roadmap page
      try {
        router.push('/roadmap-experimental-v2');
      } catch (error) {
        // Fallback for navigation issues
        window.location.href = '/roadmap-experimental-v2';
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      router.push('/');
      return;
    }

    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canProceed = () => {
    const screenIndex = currentStep;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];

      // CRITICAL FIX: Block navigation if next screen is skills and skills aren't loaded yet
      const nextScreenIndex = screenIndex + 1;
      if (nextScreenIndex < quizScreens.length) {
        const nextScreen = quizScreens[nextScreenIndex];
        if (nextScreen?.id === 'skills' && !skillsLoaded) {
          console.log('⏳ Blocking navigation: Skills not loaded yet');
          return false;
        }
      }

      // Use isScreenComplete from QuizConfig
      const complete = isScreenComplete(screen, quizResponses, quizResponses);
      console.log(`🔍 Can proceed? ${complete} (Screen: ${screen.id || screenIndex})`);
      return complete;
    }

    return false;
  };

  const renderContent = () => {
    const screenIndex = currentStep;

    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];

      // Safety check
      if (!screen || !screen.questions) {
        return <div>Error: Invalid screen configuration</div>;
      }

      // Process dynamic profile details (for welcome screen)
      const profileDetails = screen.getDynamicProfileDetails
        ? screen.getDynamicProfileDetails(quizResponses)
        : null;

      // Process questions with dynamic options and dynamic question text
      const processedQuestions = screen.questions.map(question => {
        const processed = { ...question };

        // Handle dynamic options
        if (question.getDynamicOptions) {
          processed.options = question.getDynamicOptions(quizResponses);
        }

        // Handle dynamic question text
        if (question.getDynamicQuestion) {
          processed.question = question.getDynamicQuestion(quizResponses);
        }

        return processed;
      });

      console.log('Processed questions:', processedQuestions);

      const handleChatTextChange = (newText) => {
        console.log('📤 [QuizOrchestrator] onChatTextChange callback called with:', newText);
        setChatText(newText);
      };

      return (
        <QuizUI
          key={`screen-${screenIndex}-${skillsLoaded}`} // Force re-render when skills load
          questions={processedQuestions}
          responses={quizResponses}
          onResponse={handleQuizResponse}
          initialChatText={chatText}
          chatResponseMap={screen.chatResponseMap}
          onChatTextChange={handleChatTextChange}
          profileDetails={profileDetails}
          questionStartIndex={screenIndex + 1}
          onAutoAdvance={handleNext}
          hideChat={true}
          showMobileChat={true}
          showChatAboveQuestions={currentStep === 0}
          singleColumn={screen.singleColumn || false}
          moveUpOnDesktop={screen.moveUpOnDesktop || false}
          isFirstScreen={currentStep === 0}
        />
      );
    }

    return null;
  };

  const companies = [
    { name: 'Razorpay', logo: 'https://cdn.brandfetch.io/razorpay.com/w/400/h/400' },
    { name: 'Swiggy', logo: 'https://cdn.brandfetch.io/swiggy.com/w/400/h/400' },
    { name: 'CRED', logo: 'https://cdn.brandfetch.io/cred.club/w/400/h/400' },
    { name: 'Unacademy', logo: 'https://cdn.brandfetch.io/unacademy.com/w/400/h/400' },
    { name: 'Zoho', logo: 'https://cdn.brandfetch.io/zoho.com/w/400/h/400' },
    { name: 'Paytm', logo: 'https://cdn.brandfetch.io/paytm.com/w/400/h/400' },
    { name: 'PhonePe', logo: 'https://cdn.brandfetch.io/phonepe.com/w/400/h/400' },
    { name: 'Zomato', logo: 'https://cdn.brandfetch.io/zomato.com/w/400/h/400' }
  ];

  const renderLeftPanel = () => {
    // Always show logo at top
    const logoSection = (
      <LogoContainer>
        <Logo>
          <ScalerLogo aria-label="Scaler" />
        </Logo>
      </LogoContainer>
    );

    // Trust badge ticker (shown at bottom for all steps)
    const trustBadgeSection = (
      <TrustBadgeSection>
        <TrustBadgeTitle>Trusted by our alumni, who are working at</TrustBadgeTitle>
        <LogoTicker>
          <LogoTrack>
            {/* First set of logos */}
            {companies.map((company, index) => (
              <CompanyLogo
                key={`logo-${index}`}
                src={company.logo}
                alt={company.name}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <CompanyLogo
                key={`logo-duplicate-${index}`}
                src={company.logo}
                alt={company.name}
              />
            ))}
          </LogoTrack>
        </LogoTicker>
      </TrustBadgeSection>
    );

    // For all screens except background (step 0), show chatbot on left
    if (currentStep > 0 && currentStep < quizScreens.length) {
      console.log('🖥️  [Desktop] Rendering LeftPanelChatText with chatText:', chatText);
      return (
        <>
          {logoSection}
          <LeftPanelChatContainer>
            <LeftPanelBotAvatar>
              <img src={ChatBot.src || ChatBot} alt="Chat Bot" />
            </LeftPanelBotAvatar>
            <LeftPanelChatBubble>
              <LeftPanelChatText key={chatText}>{chatText}</LeftPanelChatText>
            </LeftPanelChatBubble>
          </LeftPanelChatContainer>
          {trustBadgeSection}
        </>
      );
    }

    // For other steps, show Career Roadmap Generator branding
    return (
      <>
        {logoSection}
        <WelcomeContent>
          <WelcomeTitle>Get Your Free Career Roadmap</WelcomeTitle>
          <WelcomeSubtitle>Personalized in just a minute</WelcomeSubtitle>
          <WelcomeDescription>
            A personalized, step-by-step plan to land your dream tech role. Get curated resources, company insights, and interview prep strategies.
          </WelcomeDescription>

          <FeaturesList>
            <Feature>
              <IconContainer><MapTrifold size={18} weight="regular" /></IconContainer>
              Skill-by-Skill Learning Path
            </Feature>
            <Feature>
              <IconContainer><Buildings size={18} weight="regular" /></IconContainer>
              Company Interview Insights
            </Feature>
            <Feature>
              <IconContainer><Clock size={18} weight="regular" /></IconContainer>
              Timeline-Based Planning
            </Feature>
          </FeaturesList>
        </WelcomeContent>
        {trustBadgeSection}
      </>
    );
  };

  const handleDotClick = (index) => {
    if (index < currentStep && index >= 0) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const isLastStep = currentStep === totalSteps - 1;

  const handleMobileContinue = () => {
    setShowMobileWelcome(false);
  };

  // Show mobile welcome screen (only after mount to avoid hydration mismatch)
  if (isMounted && isMobile && showMobileWelcome && currentStep === 0) {
    return (
      <MobileWelcomeScreen>
        <MobileWelcomeContent>
          <LogoContainer>
            <Logo>
              <ScalerLogo aria-label="Scaler" />
            </Logo>
          </LogoContainer>
          <WelcomeContent>
            <WelcomeTitle>Get Your Free Career Roadmap</WelcomeTitle>
            <WelcomeSubtitle>Personalized in just a minute</WelcomeSubtitle>
            <WelcomeDescription>
              A personalized, step-by-step plan to land your dream tech role. Get curated resources, company insights, and interview prep strategies.
            </WelcomeDescription>

            <FeaturesList>
              <Feature>
                <IconContainer><MapTrifold size={18} weight="regular" /></IconContainer>
                Skill-by-Skill Learning Path
              </Feature>
              <Feature>
                <IconContainer><BookOpen size={18} weight="regular" /></IconContainer>
                Curated Videos & Resources
              </Feature>
              <Feature>
                <IconContainer><Buildings size={18} weight="regular" /></IconContainer>
                Company Interview Insights
              </Feature>
              <Feature>
                <IconContainer><ChartBar size={18} weight="regular" /></IconContainer>
                Progress Tracking Milestones
              </Feature>
              <Feature>
                <IconContainer><Clock size={18} weight="regular" /></IconContainer>
                Timeline-Based Planning
              </Feature>
            </FeaturesList>
          </WelcomeContent>

          {/* Trust Badge Ticker for Mobile */}
          <TrustBadgeSection>
            <TrustBadgeTitle>Trusted by our alumni, who are working at</TrustBadgeTitle>
            <LogoTicker>
              <LogoTrack>
                {companies.map((company, index) => (
                  <CompanyLogo
                    key={`logo-${index}`}
                    src={company.logo}
                    alt={company.name}
                  />
                ))}
                {companies.map((company, index) => (
                  <CompanyLogo
                    key={`logo-duplicate-${index}`}
                    src={company.logo}
                    alt={company.name}
                  />
                ))}
              </LogoTrack>
            </LogoTicker>
          </TrustBadgeSection>
        </MobileWelcomeContent>
        <StickyMobileCTA onClick={handleMobileContinue}>
          Continue
        </StickyMobileCTA>
      </MobileWelcomeScreen>
    );
  }

  return (
    <QuizContainer>
      {/* Mobile progress bar */}
      <ProgressBarContainer>
        <ProgressBarFill progress={progress} />
      </ProgressBarContainer>

      <LeftPanel>
        {renderLeftPanel()}
      </LeftPanel>

      <RightPanel>
        {isMounted && !isMobile && (
          <TopNavigationWrapper>
            <DesktopNavigation>
              <BackButton onClick={handlePrevious} disabled={currentStep === 0}>
                <CaretLeft size={20} weight="regular" />
              </BackButton>
              {/* Show "Build my roadmap" CTA on skills screen */}
              {quizScreens[currentStep]?.id === 'skills' && (
                <SmallCTAButton
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Build my roadmap
                </SmallCTAButton>
              )}
              {!isLastStep && quizScreens[currentStep]?.id !== 'skills' ? (
                <NextButton onClick={handleNext} disabled={!canProceed()}>
                  <CaretRight size={20} weight="regular" />
                </NextButton>
              ) : null}
            </DesktopNavigation>

            <CarouselDotsContainer>
              {[...Array(totalSteps)].map((_, index) => (
                <Dot
                  key={index}
                  active={index === currentStep}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </CarouselDotsContainer>
          </TopNavigationWrapper>
        )}

        <QuizContent key={currentStep} centered={currentStep === 0}>
          {renderContent()}
        </QuizContent>
      </RightPanel>

      {/* Mobile bottom navigation */}
      {isMounted && isMobile && (
        <BottomNavigation isLastStep={isLastStep}>
          {!isLastStep ? (
            <>
              <NavButton
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <CaretLeft size={20} weight="regular" />
              </NavButton>
              <LastStepNavButton
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed()}
                style={{ flex: 1 }}
              >
                CONTINUE
              </LastStepNavButton>
            </>
          ) : (
            <>
              <NavButton onClick={handlePrevious}>
                <CaretLeft size={20} weight="regular" />
              </NavButton>
              <LastStepNavButton variant="primary" onClick={handleNext} disabled={!canProceed()} style={{ flex: 1 }}>
                GENERATE ROADMAP
              </LastStepNavButton>
            </>
          )}
        </BottomNavigation>
      )}
    </QuizContainer>
  );
};

export default FinalModeQuiz;
