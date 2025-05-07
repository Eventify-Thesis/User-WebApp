import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as s from './ShowcaseEventSection.styles';
import EventCard from '../EventCard/EventCard';

interface Props {
  eventsThisWeek: any[];
  eventsThisMonth: any[];
}

const ShowcaseEventSection: React.FC<Props> = ({ eventsThisWeek, eventsThisMonth }) => {
  const [activeTab, setActiveTab] = useState<'weekend' | 'month'>('weekend');
  const { t } = useTranslation();

  const currentEvents = activeTab === 'weekend' ? eventsThisWeek : eventsThisMonth;

  return (
    <s.Section>
      <s.TabSelector>
        <s.Tab active={activeTab === 'weekend'} onClick={() => setActiveTab('weekend')}>
          {t('homePage.thisWeekend')}
        </s.Tab>
        <s.Slash>/</s.Slash>
        <s.Tab active={activeTab === 'month'} onClick={() => setActiveTab('month')}>
          {t('homePage.thisMonth')}
        </s.Tab>
      </s.TabSelector>

      {/* Grid layout for events including the title card */}
      <s.Grid>
        {/* Special Card for Section Title */}
        <s.CardWrapper>
          <s.SectionTitleCard>
            <div>{t('homePage.popularEvents')}</div>
            <div>{activeTab === 'weekend' ? t('homePage.thisWeekend') : t('homePage.thisMonth')}</div>
          </s.SectionTitleCard>
        </s.CardWrapper>

        {/* Event Cards */}
        {(currentEvents || []).map((event) => (
          <s.CardWrapper key={event.id}>
            <EventCard {...event} />
          </s.CardWrapper>
        ))}
      </s.Grid>
    </s.Section>
  );
};

export default ShowcaseEventSection;
