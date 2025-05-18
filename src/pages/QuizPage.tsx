import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useShowQuiz } from '@/queries/useShowQuiz';
import { useSubmitAnswer } from '@/mutations/useSubmitAnswer';
import QuizHeader from '@/components/quiz/QuizHeader';
import Timer from '@/components/quiz/Timer';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizControls from '@/components/quiz/QuizControls';
import styled from 'styled-components';
import { QuizAnswer } from '@/domain/QuizModel';
const Container = styled.div`
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background-color: #1e2a78;
  color: white;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

import { useRef } from 'react';
export default function QuizPage() {
  const { eventId, showId } = useParams<{ eventId: string; showId: string }>();
  const eventIdNumber = eventId ? parseInt(eventId) : NaN;
  const showIdNumber = showId ? parseInt(showId) : NaN;

  // hooks
  const { data: quiz, isLoading } = useShowQuiz(eventIdNumber, showIdNumber);
  const { mutate: submitAnswer } = useSubmitAnswer();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNextQuestion = () => {
    setShowAnswerResult(false);
    if (quiz?.questions && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // hoàn thành
    }
  };
  const handleShowResultAndNext = () => {
    setShowAnswerResult(true);
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    resultTimeoutRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 5000);
  };
  useEffect(() => {
    return () => {
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  // reset index nếu out-of-bound
  useEffect(() => {
    if (!quiz?.questions) return;
    if (currentQuestionIndex >= quiz.questions.length) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
    }
  }, [quiz, currentQuestionIndex]);

  const { t } = useTranslation();

  if (isNaN(showIdNumber)) {
    return <Container>{t('quiz.invalidShowId')}</Container>;
  }

  if (isLoading) {
    return <Container>{t('quiz.loadingQuiz')}</Container>;
  }

  if (!quiz || !quiz.questions) {
    return <Container>{t('quiz.quizNotFound')}</Container>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion || !currentQuestion.timeLimit) return;

    setTimeLeft(currentQuestion.timeLimit);
    
    let timer: NodeJS.Timeout;
    let timerActive = true;

    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (timerActive) {
            timerActive = false;
            handleTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      timerActive = false;
    };
  }, [currentQuestion]);

  const handleTimeUp = () => {
    if (currentQuestion) {
      submitAnswer({
        quizId: quiz.id,
        questionId: currentQuestion.id,
        selectedOption: selectedOption ?? -1, // -1 means no answer
        userId: 'current-user-id',
        timeTaken: currentQuestion.timeLimit!
      });
      setAnswers(prev => [...prev, {
        quizId: quiz.id,
        questionId: currentQuestion.id,
        userId: 'current-user-id',
        selectedOption: selectedOption ?? -1,
        isCorrect: selectedOption === currentQuestion.correctOption,
        timeTaken: currentQuestion.timeLimit!
      }]);
      handleShowResultAndNext();
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion || selectedOption === null) return;

    submitAnswer({
      quizId: quiz.id,
      questionId: currentQuestion.id,
      selectedOption: selectedOption,
      userId: 'current-user-id',
      timeTaken: currentQuestion.timeLimit! - timeLeft,
    });

    setAnswers(prev => [...prev, {
      quizId: quiz.id,
      questionId: currentQuestion.id,
      userId: 'current-user-id',
      selectedOption: selectedOption,
      isCorrect: selectedOption === currentQuestion.correctOption,
      timeTaken: currentQuestion.timeLimit! - timeLeft,
    }]);
    handleShowResultAndNext();
  };

  return (
    <Container>
      <QuizHeader
        title={quiz.title}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
      />

      {currentQuestion.timeLimit && (
        <Timer timeLeft={timeLeft} totalTime={currentQuestion.timeLimit} />
      )}

      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={optionId => !showAnswerResult && setSelectedOption(optionId)}
        showAnswerResult={showAnswerResult}
        correctOption={currentQuestion?.correctOption}
      />

      <QuizControls
        onSubmit={handleSubmit}
        hasSelected={selectedOption !== null}
        isLastQuestion={currentQuestionIndex === quiz.questions.length - 1}
      />
    </Container>
  );
}
