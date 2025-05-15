import React from 'react';
import { OrganizerCard } from './OrganizerCard';
import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import { Box, Title } from '@mantine/core';

interface OrganizerInfoProps {
  organizerName: string;
  organizerDescription: string;
  organizerImage: string;
}

export const OrganizerInfoSection: React.FC<OrganizerInfoProps> = ({
  organizerName,
  organizerDescription,
  organizerImage,
}) => {
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  const desktopLayout = (
    <Box>
      <Title order={2} className="section-title">
        {t('eventDetailPage.organizer')}
      </Title>
      <OrganizerCard
        organizerName={organizerName}
        organizerDescription={organizerDescription}
        organizerImage={organizerImage}
      />
    </Box>
  );

  const mobileAndTabletLayout = (
    <Box>
      <Title order={2} className="section-title">
        {t('eventDetailPage.organizer')}
      </Title>
      <OrganizerCard
        organizerName={organizerName}
        organizerDescription={organizerDescription}
        organizerImage={organizerImage}
      />
    </Box>
  );

  return <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>;
};


