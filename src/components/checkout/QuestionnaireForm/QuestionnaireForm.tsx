import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionsTable } from './QuestionsTable';
import { useGetEventQuestions } from '@/queries/useGetEventQuestions';
import { IdParam } from '@/types/types';
import { Spin } from 'antd';
import styled from 'styled-components';
import { useGetFormAnswers } from '@/queries/useGetFormAnswers';

interface QuestionnaireFormProps {
  eventId: IdParam;
  showId: IdParam;
  bookingCode: string;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  eventId,
  showId,
  bookingCode,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();

  const { data: questions, isLoading } = useGetEventQuestions(eventId);
  const { data: formAnswers, isLoading: isFormAnswersLoading } =
    useGetFormAnswers(showId, bookingCode);

  const questionsWithAnswers = React.useMemo(() => {
    if (!questions || !formAnswers) return [];

    return questions.map((question) => {
      // Find answer in order questions
      const orderAnswer = formAnswers.order.questions.find(
        (q) => q.question_id === question.id,
      );

      // Find answer in attendees questions (taking the first match)
      const attendeeAnswer = formAnswers.attendees
        ?.find((attendee) =>
          attendee.questions.some((q) => q.question_id === question.id),
        )
        ?.questions.find((q) => q.question_id === question.id);

      const answer = orderAnswer || attendeeAnswer;

      return {
        ...question,
        answer: answer?.response?.answer || '',
      };
    });
  }, [questions, formAnswers]);

  const desktopLayout = (
    <FormContainer>
      {isFormAnswersLoading ? (
        <Spin size="large" />
      ) : (
        <QuestionsTable questions={questionsWithAnswers} />
      )}
    </FormContainer>
  );

  const mobileAndTabletLayout = <div>Mobile and Tablet</div>;

  return (
    <>
      {isLoading ? (
        <Spin size="large" />
      ) : isDesktop ? (
        desktopLayout
      ) : (
        mobileAndTabletLayout
      )}
    </>
  );
};

const FormContainer = styled.div`
  width: 100%;
  min-width: 600px;
`;
