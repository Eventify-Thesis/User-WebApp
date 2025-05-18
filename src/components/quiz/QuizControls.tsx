import React from 'react';
import styled from 'styled-components';

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => (props.disabled ? '#888' : '#3778bf')};
  color: ${props => (props.disabled ? '#ccc' : 'white')};
  font-weight: 900;
  font-size: 1.25rem;
  padding: 16px 48px;
  border: none;
  border-radius: 50px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => (props.disabled ? '#888' : '#2c5d8b')};
  }
`;

interface QuizControlsProps {
  onSubmit: () => void;
  hasSelected: boolean;
  isLastQuestion: boolean;
}

import { useTranslation } from 'react-i18next';

const QuizControls: React.FC<QuizControlsProps> = ({ onSubmit, hasSelected, isLastQuestion }) => {
  const { t } = useTranslation();
  return (
    <ControlsWrapper>
      <SubmitButton disabled={!hasSelected} onClick={onSubmit}>
        {isLastQuestion ? t('quiz.submitQuiz') : t('quiz.nextQuestion')}
      </SubmitButton>
    </ControlsWrapper>
  );
};

export default QuizControls;
