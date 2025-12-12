import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Check,
  GraduationCap,
  Briefcase,
  ArrowsClockwise,
  Users,
  Calendar,
  CalendarCheck,
  ChartLineUp,
  Trophy,
  Star,
  StarFour,
  Sparkle,
  Crown,
  Path,
  TrendUp,
  Rocket,
  CurrencyDollar,
  Code,
  UserCircle,
  IdentificationCard,
  Buildings,
  Storefront,
  Factory,
  PlayCircle,
  BookOpen,
  CheckCircle,
  Lightning,
  Clock,
  Timer,
  FireSimple,
  ThumbsUp,
  HandHeart,
  Target,
  ChartBar
} from 'phosphor-react';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0;
  gap: 36px;
  align-items: flex-start;

  /* Move content up on desktop if flag is set */
  @media (min-width: 769px) {
    margin-top: ${props => props.moveUpOnDesktop ? '-80px' : '0'};
  }

  @media (max-width: 768px) {
    gap: 24px;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    margin-top: 24px;
  }
`;

const MobileChatHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const MobileBotAvatar = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;

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
  padding: 14px 16px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  align-self: stretch;

  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 12px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 14px solid #fde047;
  }

  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 14px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 12px solid #fefce8;
  }
`;

const MobileChatText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
  white-space: pre-line;
  animation: ${slideInFromLeft} 0.6s ease-out;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BotAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
`;

const BotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 90%;
  width: auto;
  height: auto;

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

const ChatText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.6;
  animation: ${slideInFromLeft} 0.6s ease-out;
  white-space: pre-line;
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #fde047;

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 12px;
    padding-top: 10px;
  }
`;

const ProfileDetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const ProfileDetailIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #64748b;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ProfileDetailContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProfileDetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ProfileDetailValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const QuestionNumberBubble = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-self: stretch;
  width: 100%;

  @media (max-width: 768px) {
    gap: 32px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const QuestionLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 1rem;
    text-align: left;
  }
`;

const OptionsRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.singleColumn ? '1fr' : 'repeat(2, 1fr)'};
  gap: 12px;
  width: 100%;
  max-width: ${props => props.isFirstScreen ? '600px' : '100%'};
  margin: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const MultiSelectPillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 8px;
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
    padding: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 6px;
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
    padding: 0;
  }
`;

const MultiSelectPill = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  color: #1e293b;
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    border-color: #0041CA;
    background: ${props => props.selected ? '#E3EEFF' : '#f8f9fa'};
  }

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 8px;
    font-size: 0.7rem;
    min-height: 42px;
    gap: 6px;
  }
`;

const MultiSelectIconWrapper = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? '#0041CA' : '#f1f5f9'};
  color: ${props => props.selected ? '#FFFFFF' : '#64748b'};
  transition: all 0.2s ease;
  border-radius: 0;

  @media (max-width: 768px) {
    width: 26px;
    height: 26px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const MultiSelectText = styled.div`
  flex: 1;
  font-size: 0.8rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    line-height: 1.4;
  }
`;

const MultiSelectCheckIcon = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0041CA;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const OptionPill = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  color: ${props => props.selected ? '#0041CA' : '#1e293b'};
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 16px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 100%;
  min-height: 64px;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    border-color: #0041CA;
    background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  }

  &:focus {
    outline: none;
    border-color: #0041CA;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    min-height: 56px;
    gap: 10px;
  }
`;

const OptionIconWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 0;
  background: ${props => props.selected ? '#0041CA' : '#f1f5f9'};
  color: ${props => props.selected ? 'white' : '#64748b'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const OptionText = styled.div`
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: ${props => props.isFirstScreen ? '600' : '400'};
  line-height: 1.4;
`;

const OptionTextColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const OptionLabel = styled.div`
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionDescription = styled.div`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 400;
  line-height: 1.4;
  margin-top: 2px;
`;

const RecommendedBadge = styled.span`
  background: #10b981;
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CheckIcon = styled.div`
  color: #0041CA;
  display: flex;
  align-items: center;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;
  flex-shrink: 0;
`;

// Icon mapping for profile details
const getProfileDetailIcon = (iconName) => {
  const icons = {
    'Briefcase': <Briefcase size={20} weight="duotone" />,
    'Clock': <Clock size={20} weight="duotone" />,
    'Target': <Target size={20} weight="duotone" />,
    'Buildings': <Buildings size={20} weight="duotone" />,
    'TrendUp': <TrendUp size={20} weight="duotone" />
  };
  return icons[iconName] || <Target size={20} weight="duotone" />;
};

// Icon mapping for options (moved outside component for consistency)
const getOptionIcon = (value) => {
  const icons = {
  // Screen 1: Profile (Non-Tech)
  'non-tech': <UserCircle size={20} weight="duotone" />,
  'it-services': <Briefcase size={20} weight="duotone" />,
  'technical': <Code size={20} weight="duotone" />,
  'fresh-graduate': <GraduationCap size={20} weight="duotone" />,

  // Screen 1: Profile (Tech)
  'student-freshgrad': <GraduationCap size={20} weight="duotone" />,
  'swe-product': <Buildings size={20} weight="duotone" />,
  'swe-service': <Briefcase size={20} weight="duotone" />,

  // Experience levels
  '0': <GraduationCap size={20} weight="duotone" />,
  '0-2': <Clock size={20} weight="duotone" />,
  '3-5': <Briefcase size={20} weight="duotone" />,
  '5+': <Trophy size={20} weight="duotone" />,

  // Skills (Non-Tech)
  'communication': <Users size={20} weight="duotone" />,
  'analytical': <ChartLineUp size={20} weight="duotone" />,
  'operations': <Target size={20} weight="duotone" />,
  'self-learning': <BookOpen size={20} weight="duotone" />,

  // Screen 2: Motivation
  'salary-growth': <CurrencyDollar size={20} weight="duotone" />,
  'interest': <Star size={20} weight="duotone" />,
  'job-stability': <CheckCircle size={20} weight="duotone" />,
  'peer-influence': <Users size={20} weight="duotone" />,

  // Target Roles (Non-Tech)
  'backend': <Code size={20} weight="duotone" />,
  'fullstack': <Crown size={20} weight="duotone" />,
  'data-ml': <ChartBar size={20} weight="duotone" />,
  'data-analyst': <ChartLineUp size={20} weight="duotone" />,
  'not-sure': <Target size={20} weight="duotone" />,

  // Target Roles (Tech)
  'faang-product': <Trophy size={20} weight="duotone" />,
  'backend-fullstack': <Code size={20} weight="duotone" />,
  'techlead-architect': <Crown size={20} weight="duotone" />,

  // Company types
  'product': <Buildings size={20} weight="duotone" />,
  'startup': <Rocket size={20} weight="duotone" />,
  'service': <Briefcase size={20} weight="duotone" />,
  'domain-specific': <Target size={20} weight="duotone" />,

  // Screen 3: Preparation (Non-Tech)
  'completed-course': <GraduationCap size={20} weight="duotone" />,
  'self-learning': <BookOpen size={20} weight="duotone" />,
  'just-exploring': <Path size={20} weight="duotone" />,
  'havent-tried': <PlayCircle size={20} weight="duotone" />,
  'follow-tutorials': <BookOpen size={20} weight="duotone" />,
  'solve-problems': <Code size={20} weight="duotone" />,

  // Coding Practice (Tech)
  '0-10': <PlayCircle size={20} weight="duotone" />,
  '11-50': <Clock size={20} weight="duotone" />,
  '51-100': <FireSimple size={20} weight="duotone" />,
  '100+': <Trophy size={20} weight="duotone" />,

  // System Design (Tech)
  'led-multiple': <Crown size={20} weight="duotone" />,
  'participated': <Users size={20} weight="duotone" />,
  'learning': <BookOpen size={20} weight="duotone" />,

  // Portfolio (Tech)
  'active-5plus': <Trophy size={20} weight="duotone" />,
  'limited-1to5': <CheckCircle size={20} weight="duotone" />,
  'inactive': <Clock size={20} weight="duotone" />,
  'no-portfolio': <Target size={20} weight="duotone" />,

  // Interview Practice (Tech)
  'weekly': <Trophy size={20} weight="duotone" />,
  'monthly': <CalendarCheck size={20} weight="duotone" />,
  'rarely': <Clock size={20} weight="duotone" />,
  'never': <Target size={20} weight="duotone" />,

  // Time investment options
  '6-10': <Timer size={20} weight="duotone" />,
  '10+': <FireSimple size={20} weight="duotone" />
  };

  return icons[value] || null;
};

const CTAButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: 32px;
    padding: 0;
    display: ${props => props.hideMobile ? 'none' : 'flex'};
  }
`;

const CTAButton = styled.button`
  background: #B30158;
  color: white;
  border: none;
  border-radius: 0;
  padding: 18px 64px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(179, 1, 88, 0.25);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  max-width: 100%;

  &:hover {
    background: #8A0145;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(179, 1, 88, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 16px 48px;
    font-size: 0.875rem;
    letter-spacing: 1.2px;
  }
`;

const GroupedQuestionScreen = ({
  questions = [],
  responses = {},
  onResponse,
  initialChatText,
  profileDetails = null,
  chatResponseMap,
  questionStartIndex = 1,
  totalQuestions = 11,
  onAutoAdvance,
  onChatTextChange,
  hideChat = false,
  showMobileChat = false,
  showChatAboveQuestions = false,
  singleColumn = false,
  moveUpOnDesktop = false,
  isFirstScreen = false
}) => {
  const [chatText, setChatText] = useState(initialChatText);

  // Sync local chatText state when initialChatText prop changes (e.g., when navigating between screens)
  useEffect(() => {
    setChatText(initialChatText);
  }, [initialChatText]);

  // Safety check
  if (!questions || questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  // Helper function to check if all questions on this screen are answered
  // Can optionally pass updatedResponses for checking before state updates
  const areAllQuestionsAnswered = (responsesToCheck = responses) => {
    return questions.every(q => {
      const value = responsesToCheck[q.id];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleCTAClick = (questionId, ctaValue, shouldSaveResponse = true) => {
    // Only save response for info-with-cta types
    // For multi-select and single-select, the data is already saved when user makes selections
    if (shouldSaveResponse) {
      onResponse(questionId, { value: ctaValue, label: 'Continue' });
    }

    // Auto-advance after CTA click
    if (onAutoAdvance) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onAutoAdvance();
      }, 500);
    }
  };

  const handleMultiSelectToggle = (questionId, optionValue) => {
    const currentSelections = responses[questionId] || [];
    let newSelections;

    if (currentSelections.includes(optionValue)) {
      // Deselect
      newSelections = currentSelections.filter(val => val !== optionValue);
    } else {
      // Select
      newSelections = [...currentSelections, optionValue];
    }

    onResponse(questionId, { value: newSelections });
  };

  const handleOptionSelect = (questionId, option, questionIndex) => {
    // Don't do anything if this option is already selected
    if (responses[questionId] === option.value) {
      return;
    }

    onResponse(questionId, option);

    // Check if all questions on this screen will be answered after this selection
    const updatedResponses = { ...responses, [questionId]: option.value };
    const isLastQuestion = questionIndex === questions.length - 1;
    const isSingleQuestion = questions.length === 1;

    // Only update chat bubble if NOT (single question OR last question on screen)
    // This prevents jarring chat text changes right before auto-advance
    console.log('🔍 Chat Update Debug:', {
      questionId,
      optionValue: option.value,
      isSingleQuestion,
      isLastQuestion,
      hasChatResponseMap: !!chatResponseMap,
      chatResponseMapKeys: chatResponseMap ? Object.keys(chatResponseMap) : [],
      chatResponseForQuestion: chatResponseMap?.[questionId],
      shouldUpdate: !isSingleQuestion && !isLastQuestion
    });

    if (!isSingleQuestion && !isLastQuestion) {
      if (chatResponseMap && chatResponseMap[questionId] && chatResponseMap[questionId][option.value]) {
        const newChatText = chatResponseMap[questionId][option.value];
        console.log('✅ Updating chat text to:', newChatText);
        setChatText(newChatText);

        // Call the parent callback to update chat in left panel
        if (onChatTextChange) {
          console.log('📤 Calling onChatTextChange callback');
          onChatTextChange(newChatText);
        }
      } else {
        console.log('❌ No chat response found for:', { questionId, optionValue: option.value });
      }
    }

    // Auto-scroll to next question (if not last question on this screen)
    if (!isLastQuestion) {
      // Scroll to next question after a brief delay
      setTimeout(() => {
        const nextQuestionElement = document.querySelector(`[data-question-index="${questionIndex + 1}"]`);
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }

    // Auto-advance if all questions on this screen are answered
    // Use updatedResponses to check immediately without waiting for state
    if (isLastQuestion && onAutoAdvance) {
      if (areAllQuestionsAnswered(updatedResponses)) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onAutoAdvance();
        }, 300); // Slight delay for visual feedback before advancing
      }
    }
  };

  return (
    <Container moveUpOnDesktop={moveUpOnDesktop}>
      {/* Desktop chat header */}
      {!hideChat && (
        <Header>
          <BotAvatar>
            <BotImage src="/ChatBot.png" alt="Chat Bot" />
          </BotAvatar>
          <ChatBubble>
            <ChatText key={chatText}>{chatText}</ChatText>
          </ChatBubble>
        </Header>
      )}

      {/* Mobile chat header */}
      {showMobileChat && initialChatText && (
        <MobileChatHeader>
          <MobileBotAvatar>
            <img src="/ChatBot.png" alt="Chat Bot" />
          </MobileBotAvatar>
          <MobileChatBubble>
            <MobileChatText key={chatText}>{chatText}</MobileChatText>
          </MobileChatBubble>
        </MobileChatHeader>
      )}

      {/* Chat above questions (first screen only) */}
      {showChatAboveQuestions && initialChatText && (
        <Header>
          <BotAvatar>
            <BotImage src="/ChatBot.png" alt="Chat Bot" />
          </BotAvatar>
          <ChatBubble>
            <ChatText>{initialChatText}</ChatText>
          </ChatBubble>
        </Header>
      )}

      <QuestionsContainer>
        {questions.map((question, questionIndex) => {
          // For multi-select, ensure we have an array. For others, use the actual value
          const currentSelections = question.type === 'multi-select-pills'
            ? (Array.isArray(responses[question.id]) ? responses[question.id] : [])
            : responses[question.id];
          const hasSelections = Array.isArray(currentSelections) && currentSelections.length > 0;

          return (
            <QuestionGroup key={question.id} data-question-index={questionIndex}>
              {/* Special handling for info-with-cta type */}
              {question.type === 'info-with-cta' ? (
                <CTAButtonWrapper hideMobile={profileDetails && profileDetails.length > 0}>
                  <CTAButton onClick={() => handleCTAClick(question.id, question.ctaValue)}>
                    {question.ctaLabel || 'Continue'}
                  </CTAButton>
                </CTAButtonWrapper>
              ) : question.type === 'multi-select-pills' ? (
                <>
                  <QuestionLabel fullWidth>{question.question}</QuestionLabel>
                  <MultiSelectPillsContainer>
                    {question.options && question.options.map((option) => {
                      const isSelected = currentSelections.includes(option.value);
                      return (
                        <MultiSelectPill
                          key={option.value}
                          selected={isSelected}
                          onClick={() => handleMultiSelectToggle(question.id, option.value)}
                        >
                          <MultiSelectIconWrapper selected={isSelected}>
                            {option.icon || <Code size={18} weight="duotone" />}
                          </MultiSelectIconWrapper>
                          <MultiSelectText selected={isSelected}>
                            {option.label}
                          </MultiSelectText>
                          <MultiSelectCheckIcon selected={isSelected}>
                            <Check size={20} weight="bold" />
                          </MultiSelectCheckIcon>
                        </MultiSelectPill>
                      );
                    })}
                  </MultiSelectPillsContainer>
                  {/* Show Continue button if at least one skill is selected */}
                  {hasSelections && (
                    <CTAButtonWrapper hideMobile={true}>
                      <CTAButton onClick={() => handleCTAClick(question.id, 'continue', false)}>
                        BUILD MY ROADMAP
                      </CTAButton>
                    </CTAButtonWrapper>
                  )}
                </>
              ) : question.type === 'button-grid' ? (
                <>
                  <QuestionLabel>{question.question}</QuestionLabel>
                  <OptionsRow singleColumn={singleColumn} isFirstScreen={isFirstScreen}>
                    {question.options && question.options.map((option) => {
                      const isSelected = responses[question.id] === option.value;
                      return (
                        <OptionPill
                          key={option.value}
                          selected={isSelected}
                          onClick={() => handleOptionSelect(question.id, option, questionIndex)}
                        >
                          <OptionIconWrapper selected={isSelected}>
                            {option.icon || getOptionIcon(option.value)}
                          </OptionIconWrapper>
                          <OptionContent>
                            <OptionTextColumn>
                              <OptionText isFirstScreen={isFirstScreen}>{option.label}</OptionText>
                              {option.description && (
                                <OptionDescription>{option.description}</OptionDescription>
                              )}
                            </OptionTextColumn>
                            <CheckIcon selected={isSelected}>
                              <Check size={20} weight="bold" />
                            </CheckIcon>
                          </OptionContent>
                        </OptionPill>
                      );
                    })}
                  </OptionsRow>
                </>
              ) : question.type === 'radio-buttons' ? (
                <>
                  <QuestionLabel>{question.question}</QuestionLabel>
                  <OptionsRow isFirstScreen={isFirstScreen}>
                    {question.options && question.options.map((option) => {
                      const isSelected = responses[question.id] === option.value;
                      return (
                        <OptionPill
                          key={option.value}
                          selected={isSelected}
                          onClick={() => handleOptionSelect(question.id, option, questionIndex)}
                        >
                          <OptionIconWrapper selected={isSelected}>
                            {option.icon || getOptionIcon(option.value)}
                          </OptionIconWrapper>
                          <OptionContent>
                            <OptionText isFirstScreen={isFirstScreen}>{option.label}</OptionText>
                            <CheckIcon selected={isSelected}>
                              <Check size={20} weight="bold" />
                            </CheckIcon>
                          </OptionContent>
                        </OptionPill>
                      );
                    })}
                  </OptionsRow>
                  {/* Show GENERATE ROADMAP button for last question (timeline) */}
                  {responses[question.id] && question.id === 'timeline' && (
                    <CTAButtonWrapper>
                      <CTAButton onClick={() => handleCTAClick(question.id, 'continue', false)}>
                        GENERATE ROADMAP
                      </CTAButton>
                    </CTAButtonWrapper>
                  )}
                </>
              ) : question.type === 'single-select-cards' ? (
                <>
                  <QuestionLabel>{question.question}</QuestionLabel>
                  {question.subtitle && (
                    <QuestionLabel style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b', marginTop: '-20px' }}>
                      {question.subtitle}
                    </QuestionLabel>
                  )}
                  <OptionsRow singleColumn isFirstScreen={isFirstScreen}>
                    {question.options && question.options.map((option) => {
                      const isSelected = responses[question.id] === option.value;
                      return (
                        <OptionPill
                          key={option.value}
                          selected={isSelected}
                          onClick={() => handleOptionSelect(question.id, option, questionIndex)}
                        >
                          <OptionIconWrapper selected={isSelected}>
                            {option.icon || getOptionIcon(option.value)}
                          </OptionIconWrapper>
                          <OptionTextColumn>
                            <OptionLabel>
                              {option.label}
                              {option.recommended && <RecommendedBadge>Recommended</RecommendedBadge>}
                            </OptionLabel>
                            {option.description && (
                              <OptionDescription>{option.description}</OptionDescription>
                            )}
                          </OptionTextColumn>
                          <CheckIcon selected={isSelected}>
                            <Check size={20} weight="bold" />
                          </CheckIcon>
                        </OptionPill>
                      );
                    })}
                  </OptionsRow>
                  {/* Show Generate Roadmap button if an option is selected */}
                  {responses[question.id] && (
                    <CTAButtonWrapper>
                      <CTAButton onClick={() => handleCTAClick(question.id, 'continue', false)}>
                        GENERATE ROADMAP
                      </CTAButton>
                    </CTAButtonWrapper>
                  )}
                </>
              ) : (
                <>
                  <QuestionLabel>{question.question}</QuestionLabel>
                  <OptionsRow isFirstScreen={isFirstScreen}>
                    {question.options && question.options.map((option) => {
                      const isSelected = responses[question.id] === option.value;
                      return (
                        <OptionPill
                          key={option.value}
                          selected={isSelected}
                          onClick={() => handleOptionSelect(question.id, option, questionIndex)}
                        >
                          <OptionIconWrapper selected={isSelected}>
                            {option.icon || getOptionIcon(option.value)}
                          </OptionIconWrapper>
                          <OptionContent>
                            <OptionText isFirstScreen={isFirstScreen}>{option.label}</OptionText>
                            <CheckIcon selected={isSelected}>
                              <Check size={20} weight="bold" />
                            </CheckIcon>
                          </OptionContent>
                        </OptionPill>
                      );
                    })}
                  </OptionsRow>
                </>
              )}
            </QuestionGroup>
          );
        })}
      </QuestionsContainer>
    </Container>
  );
};

export default GroupedQuestionScreen;
