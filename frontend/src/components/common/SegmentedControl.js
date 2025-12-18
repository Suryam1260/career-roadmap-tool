import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 0;
  padding: 4px;
  gap: 4px;
`;

const Segment = styled.button`
  padding: 8px 20px;
  border: none;
  background: ${props => props.active ? '#ffffff' : 'transparent'};
  color: ${props => props.active ? '#1e293b' : '#64748b'};
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  box-shadow: ${props => props.active ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background: ${props => props.active ? '#ffffff' : '#e2e8f0'};
  }

  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: 0.8rem;
  }
`;

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <Container>
      {options.map((option) => (
        <Segment
          key={option.value}
          active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Segment>
      ))}
    </Container>
  );
};

export default SegmentedControl;
