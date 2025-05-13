import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Box, Title, Button } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import './DescriptionSection.css';

interface DescriptionSectionProps {
  description?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const renderDescription = () => (
    <Box className="description-content" mt="md" pos="relative">
      <Box
        style={{
          maxHeight: isExpanded ? 'none' : '300px',
          overflow: isExpanded ? 'visible' : 'hidden',
          position: 'relative',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: description || '' }} />
        
        {/* Fade-out Effect */}
        {!isExpanded && (
          <Box
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
              height: '120px',
              background: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%)',
              zIndex: 3,
            }}
          />
        )}
      </Box>
      
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
        }}
      >
        <Button
          variant="subtle"
          color="gray"
          onClick={toggleExpand}
          rightSection={isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        >
          {isExpanded ? t('eventDetailPage.showLess') : t('eventDetailPage.showMore')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Title order={2} className="section-title">
        {t('eventDetailPage.description')}
      </Title>
      {renderDescription()}
    </>
  );
};
