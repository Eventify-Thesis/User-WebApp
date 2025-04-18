import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Button, Collapse } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import * as S from './DescriptionSection.styles';
import './Description.styles.css';

interface DescriptionSectionProps {
  description?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
}) => {
  const { t } = useTranslation();
  const { isTablet, isDesktop } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const collapsibleContent = (
    <div style={{ marginTop: '8px', position: 'relative' }}>
      <div
        style={{
          display: isExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: 20,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.15',
          fontSize: '14px',
          color: 'rgb(39, 39, 42)',
          margin: 0,
        }}
        dangerouslySetInnerHTML={{ __html: description || '' }}
      />

      {/* Fade-out Effect */}
      {!isExpanded && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            height: '120px',
            background:
              'linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)',
            zIndex: 3,
          }}
          onClick={toggleExpand}
        />
      )}

      {/* Arrow Button */}
      <div
        style={{
          position: 'absolute',
          zIndex: 4,
          textAlign: 'center',
          width: '100%',
          padding: '10px 0',
          bottom: '-20px',
          cursor: 'pointer',
        }}
        onClick={toggleExpand}
      >
        <Button
          type="text"
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
          onClick={toggleExpand}
          style={{ color: 'rgb(39, 39, 42)' }}
        />
      </div>
    </div>
  );

  const label = t('eventDetailPage.description');

  const desktopLayout = (
    <S.DescriptionCollapse
      defaultActiveKey={['1']}
      collapsible="icon"
      items={[
        {
          key: '1',
          label: label,
          children: collapsibleContent,
          showArrow: false,
        },
      ]}
    ></S.DescriptionCollapse>
  );

  const mobileAndTabletLayout = (
    <S.DescriptionCollapse
      defaultActiveKey={['1']}
      collapsible="icon"
      items={[
        {
          key: '1',
          label: label,
          children: collapsibleContent,
          showArrow: false,
        },
      ]}
    ></S.DescriptionCollapse>
  );
  return <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>;
};
