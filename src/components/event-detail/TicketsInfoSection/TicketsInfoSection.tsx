import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';
import { Image, Typography, Collapse, Space } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import * as S from './TicketsInfoSection.styles';
import './TicketsInfoSection.styles.css';
import { ShowModel } from '@/domain/ShowModel';
import { useNavigate } from 'react-router-dom';

interface TicketInfoSectionProps {
  shows: ShowModel[];
}

const TicketsInfoSection: React.FC<TicketInfoSectionProps> = ({ shows }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isTablet, isDesktop } = useResponsive();
  const { Text } = Typography;
  const { Panel } = Collapse;

  const renderTicketDetails = (ticket: ShowModel['ticketTypes'][0]) => (
    <div style={{ padding: '8px' }}>
      {ticket.imageUrl && (
        <Image
          src={ticket.imageUrl}
          alt={ticket.name}
          style={{ maxWidth: '200px', marginBottom: '16px' }}
        />
      )}
      {ticket.description && (
        <div style={{ marginBottom: '16px', color: 'white' }}>
          {ticket.description}
        </div>
      )}
    </div>
  );

  const renderTicketTypes = (show: ShowModel) => (
    <Collapse
      ghost
      expandIcon={({ isActive }) => (
        <RightOutlined style={{ color: 'white' }} rotate={isActive ? 90 : 0} />
      )}
    >
      {show.ticketTypes.map((ticket) => (
        <Panel
          style={{
            backgroundColor: 'rgb(39, 39, 42)',
          }}
          key={ticket.id}
          header={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>
                {ticket.name}
              </Text>
              <Text style={{ color: 'var(--primary-color)' }}>
                {ticket.isFree ? t('eventDetailPage.free') : `$${ticket.price}`}
              </Text>
            </div>
          }
        >
          {renderTicketDetails(ticket)}
        </Panel>
      ))}
    </Collapse>
  );

  const showItems = shows.map((show) => ({
    key: show.id,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ color: 'white' }}>
          {dayjs(show.startTime).format('MMM D, YYYY HH:mm')}
        </Text>
        <S.BuyTicketButton
          onClick={() => {
            navigate(
              `/events/${show.eventId}/bookings/${show.id}/select-ticket`,
            );
          }}
        >
          {t('eventDetailPage.buyTicket')}
        </S.BuyTicketButton>
      </div>
    ),
    children: renderTicketTypes(show),
  }));

  return (
    <S.TicketInfoWrapper>
      <S.TicketInfoHeader>{t('eventDetailPage.ticketInfo')}</S.TicketInfoHeader>
      {shows.length > 0 ? (
        <S.TicketsList
          defaultActiveKey={[shows[0]?.id]}
          items={showItems}
          expandIcon={({ isActive }) => (
            <RightOutlined rotate={isActive ? 90 : 0} />
          )}
        />
      ) : (
        <Text type="secondary">{t('eventDetailPage.noTickets')}</Text>
      )}
    </S.TicketInfoWrapper>
  );
};

export default TicketsInfoSection;
