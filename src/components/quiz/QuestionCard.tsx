import React from 'react';
import styled from 'styled-components';
import { QuizQuestion } from '@/domain/QuizModel';
import tick from '@/assets/svg/tick.svg';
import cross from '@/assets/svg/cross.svg';

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;
`;

const OptionButton = styled.button<{ bgColor: string; selected: boolean }>`
  background-color: ${props => props.bgColor};
  color: white;
  font-weight: 900;
  font-size: 2rem;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid black;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => !props.selected && 'transform: scale(1.02);'}
  }

  ${props =>
    props.selected &&
    `
    box-shadow: 0 0 0 6px #f6ce3a;
  `}
`;

const Explanation = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 16px;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
`;

const colors = ['#d8334a', '#3778bf', '#DAA520', '#4ca64c'];

interface QuestionCardProps {
  question: QuizQuestion | undefined;
  selectedOption: number | null;
  onSelectOption: (optionId: number) => void;
  showAnswerResult?: boolean;
  correctOption?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, onSelectOption, showAnswerResult, correctOption }) => {
  if (!question) return null;

  return (
    <>
      <OptionGrid>
        {question.options.map((option, index) => {
          let isCorrect = correctOption === option.id;
          let isSelected = selectedOption === option.id;
          let showResult = !!showAnswerResult;
          let darken = showResult && !isCorrect;
          return (
            <OptionButton
              key={option.id}
              bgColor={colors[index]}
              selected={isSelected}
              onClick={() => !showResult && onSelectOption(option.id)}
              type="button"
              style={darken ? { filter: 'brightness(0.7)', opacity: 0.7 } : {}}
              disabled={showResult}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>{option.text}</span>
                {showResult && (
                  <span style={{ display: 'flex', alignItems: 'center', marginLeft: 12, fontSize: '2rem' }}>
                    <img
                      src={isCorrect ? tick : cross}
                      alt={isCorrect ? 'tick' : 'cross'}
                      style={{ width: '2rem', height: '2rem', display: 'block' }}
                    />
                  </span>
                )}
              </span>
            </OptionButton>
          );
        })}
      </OptionGrid>
      {question.explanation && (
        <Explanation>{question.explanation}</Explanation>
      )}
    </>
  );
};

export default QuestionCard;
