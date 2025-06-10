import React from 'react';
import { Tabs, Badge, Group, Box, Text } from '@mantine/core';
import { IconCheck, IconClock, IconX, IconList } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import './OrderTabs.css';

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  subTab: string;
  setSubTab: (key: string) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  setActiveTab,
  subTab,
  setSubTab,
}) => {
  const { t } = useTranslation();

  const getTabIcon = (tabKey: string) => {
    switch (tabKey) {
      case 'all':
        return <IconList size={18} />;
      case 'success':
        return <IconCheck size={18} />;
      case 'processing':
        return <IconClock size={18} />;
      case 'canceled':
        return <IconX size={18} />;
      default:
        return null;
    }
  };

  const getTabColor = (tabKey: string) => {
    switch (tabKey) {
      case 'all':
        return '#facc15';
      case 'success':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'canceled':
        return '#ef4444';
      default:
        return '#facc15';
    }
  };

  const mainTabs = [
    {
      key: 'all',
      label: t('orderHistory.all'),
      icon: getTabIcon('all'),
      color: getTabColor('all'),
    },
    {
      key: 'success',
      label: t('orderHistory.finished'),
      icon: getTabIcon('success'),
      color: getTabColor('success'),
    },
    {
      key: 'processing',
      label: t('orderHistory.processing'),
      icon: getTabIcon('processing'),
      color: getTabColor('processing'),
    },
    {
      key: 'canceled',
      label: t('orderHistory.canceled'),
      icon: getTabIcon('canceled'),
      color: getTabColor('canceled'),
    },
  ];

  const subTabs = [
    {
      key: 'upcoming',
      label: t('orderHistory.upcoming'),
      color: '#3b82f6',
    },
    {
      key: 'ended',
      label: t('orderHistory.past'),
      color: '#6b7280',
    },
  ];

  return (
    <Box className="modern-tabs-container">
      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || 'all')}
        className="main-tabs"
        variant="pills"
        radius="xl"
      >
        <Tabs.List className="main-tabs-list">
          {mainTabs.map((tab) => (
            <Tabs.Tab
              key={tab.key}
              value={tab.key}
              className={`main-tab ${activeTab === tab.key ? 'active' : ''}`}
              style={
                {
                  '--tab-color': tab.color,
                } as React.CSSProperties
              }
            >
              <Group gap="xs" className="tab-content">
                {tab.icon}
                <Text size="sm" fw={600}>
                  {tab.label}
                </Text>
              </Group>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* Sub Tabs */}
      {(activeTab === 'all' || activeTab === 'success') && (
        <Box className="sub-tabs-container">
          <Tabs
            value={subTab}
            onChange={(value) => setSubTab(value || 'ended')}
            className="sub-tabs"
            variant="default"
          >
            <Tabs.List className="sub-tabs-list">
              {subTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  className={`sub-tab ${subTab === tab.key ? 'active' : ''}`}
                  style={
                    {
                      '--tab-color': tab.color,
                    } as React.CSSProperties
                  }
                >
                  <Text size="sm" fw={500}>
                    {tab.label}
                  </Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default OrderTabs;
