import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/useResponsive';
import styled from 'styled-components';
import { BaseSteps } from '@/components/common/BaseSteps/BaseSteps';
import { BASE_COLORS } from '@/styles/themes/constants';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
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
          <Steps
            current={currentStep - 1}
            items={steps}
          />
        ) : (
          <MobileSteps
            current={currentStep - 1}
            items={steps}
          />
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
`;

const StepsWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

const Steps = styled(BaseSteps)`
  width: 100%;
  
  && {
    .ant-steps-item {
      &-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        background: transparent;
        border: 2px solid ${BASE_COLORS.white};
        
        .ant-steps-icon {
          color: ${BASE_COLORS.white};
          font-size: 14px;
        }
      }

      &-title {
        font-size: 14px;
        font-weight: 500;
      }

      &-tail {
        &::after {
          background-color: rgba(255, 255, 255, 0.3) !important;
          height: 2px;
        }
      }

      /* Process Step */
      &-process {
        .ant-steps-item-icon {
          background: ${BASE_COLORS.yellow};
          border-color: ${BASE_COLORS.yellow};

          .ant-steps-icon {
            color: rgb(39, 39, 42);
          }
        }

        .ant-steps-item-title {
          color: ${BASE_COLORS.yellow} !important;
        }
      }

      /* Finished Step */
      &-finish {
        .ant-steps-item-icon {
          background: ${BASE_COLORS.white};
          border-color: ${BASE_COLORS.white};

          .ant-steps-icon {
            color: rgb(39, 39, 42);
          }
        }

        .ant-steps-item-title {
          color: ${BASE_COLORS.white} !important;
        }

        .ant-steps-item-tail::after {
          background-color: ${BASE_COLORS.white} !important;
        }
      }

      /* Waiting Step */
      &-wait {
        .ant-steps-item-icon {
          border-color: rgba(255, 255, 255, 0.3);
          
          .ant-steps-icon {
            color: rgba(255, 255, 255, 0.3);
          }
        }

        .ant-steps-item-title {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      }
    }
  }
`;

const MobileSteps = styled(Steps)`
  && {
    .ant-steps-item {
      &-icon {
        width: 28px;
        height: 28px;
        line-height: 28px;
        
        .ant-steps-icon {
          font-size: 12px;
        }
      }

      &-title {
        font-size: 11px;
        padding-inline-end: 8px;
      }
    }
  }
`;
