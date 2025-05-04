import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/useResponsive';
import styled from 'styled-components';
import { BaseSteps } from '@/components/common/BaseSteps/BaseSteps';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation();

  const steps = [
    {
      title: t('checkout.chooseTicket'),
    },
    {
      title: t('checkout.questionnaire'),
    },
    {
      title: t('checkout.payment'),
    },
  ].slice(0, totalSteps);

  return (
    <Container>
      <StepsWrapper>
        {isDesktop ? (
          <Steps current={currentStep - 1} items={steps} />
        ) : (
          <MobileSteps current={currentStep - 1} items={steps} />
        )}
      </StepsWrapper>
    </Container>
  );
};

export default ProgressBar;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem;
  background-color: rgb(39, 39, 42);

  .mantine-Stepper-root {
    width: 100%;
  }

  .mantine-Stepper-stepLabel {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  .mantine-Stepper-step[data-progress] {
    .mantine-Stepper-stepIcon {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }

  .mantine-Stepper-separator[data-active] {
    background-color: var(--primary-color);
  }

  .mantine-Stepper-stepIcon {
    background-color: transparent;
    border: 2px solid white;
    color: white;

    &[data-completed] {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }

  .mantine-Stepper-separator {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const StepsWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

const Steps = styled(BaseSteps)`
  width: 100%;
`;

const MobileSteps = styled(Steps)`
  .mantine-Stepper-stepLabel {
    display: none;
  }

  .mantine-Stepper-separator {
    margin: 0 8px;
  }
`;
