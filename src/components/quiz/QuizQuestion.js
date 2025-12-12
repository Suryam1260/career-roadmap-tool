import React from 'react';
import styled from 'styled-components';
import { Check } from 'phosphor-react';
import scalerBot from '../../assets/scaler-bot.png';

const Container = styled.div`
  margin-bottom: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 800px;
  width: 100%;
  scroll-margin-top: 100px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const QuestionBubbleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const QuestionBubble = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 50%;
    transform: translateY(-50%);
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
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 12px solid #fefce8;
  }
`;

const Question = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
`;

const OptionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
`;

const Option = styled.button`
  background: ${props => props.selected ? '#E3EEFF' : '#FFFFFF'};
  border: 2px solid ${props => props.selected ? '#0041CA' : '#e2e8f0'};
  border-radius: 0;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 70px;

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
  font-weight: 500;
  line-height: 1.4;
`;

const CheckIcon = styled.div`
  color: #0041CA;
  display: flex;
  align-items: center;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;
  flex-shrink: 0;
`;

const QuizQuestion = ({ question, options, selectedValue, onSelect, questionNumber, totalQuestions }) => {
  const handleOptionClick = (option) => {
    // Pass the entire option object (has both value and label)
    onSelect(option);
  };

  return (
    <Container>
      <QuestionBubbleWrapper>
        <Avatar>
          <AvatarImage src={scalerBot} alt="Scaler Bot" />
        </Avatar>
        <QuestionBubble>
          <Question>
            {questionNumber && totalQuestions && (
              <QuestionNumber>{questionNumber}/{totalQuestions}</QuestionNumber>
            )}
            <span>{question}</span>
          </Question>
        </QuestionBubble>
      </QuestionBubbleWrapper>
      <OptionsList>
        {options.map((option) => (
          <Option
            key={option.value}
            selected={selectedValue === option.value}
            onClick={() => handleOptionClick(option)}
          >
            <OptionIconWrapper selected={selectedValue === option.value}>
              {option.icon || option.label.charAt(0)}
            </OptionIconWrapper>
            <OptionContent>
              <OptionText>{option.label}</OptionText>
              <CheckIcon selected={selectedValue === option.value}>
                <Check size={24} weight="bold" />
              </CheckIcon>
            </OptionContent>
          </Option>
        ))}
      </OptionsList>
    </Container>
  );
};

export default QuizQuestion;
