import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const TitleBox = styled.div`
  display: inline-block;
  background: white;
  border-radius: 8px;
  padding: 16px 48px;
  margin-bottom: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  color: #1e2a78;
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0;
`;

const QuestionInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.125rem;
`;

interface QuizHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
}

import { useTranslation } from 'react-i18next';

const QuizHeader: React.FC<QuizHeaderProps> = ({ title, currentQuestion, totalQuestions }) => {
  const { t } = useTranslation();
  return (
    <HeaderWrapper>
      <TitleBox>
        <Title>{title}</Title>
      </TitleBox>
      <QuestionInfo>
        {t('quiz.questionInfo', { current: currentQuestion, total: totalQuestions })}
      </QuestionInfo>
    </HeaderWrapper>
  );
};

export default QuizHeader;
