import { BaseCol } from '@/components/common/BaseCol/BaseCol';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { useResponsive } from '@/hooks/useResponsive';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TicketInfo } from './TicketInfo/TicketInfo';
import { QuestionsTable } from './QuestionsTable';
import { useGetEventQuestions } from '@/queries/useGetEventQuestions';
import { IdParam } from '@/types/types';
import { Spin } from 'antd';

interface QuestionnaireFormProps {
  eventId: IdParam;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  eventId,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();

  const { data: questions, isLoading } = useGetEventQuestions(eventId);

  const desktopLayout = (
    <BaseRow
      align="top"
      gutter={[20, 10]}
      style={{
        width: '100%',
      }}
    >
      <BaseCol xl={18} xxl={16}>
        <QuestionsTable questions={questions} />
      </BaseCol>
      <BaseCol xl={6} xxl={8}>
        <TicketInfo />
      </BaseCol>
    </BaseRow>
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
