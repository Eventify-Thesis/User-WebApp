import * as s from './EventCard.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import EventModel from '@/domain/EventModel';
import { IconCalendar, IconMapPin } from '@tabler/icons-react';

interface EventCardProps extends EventModel {
  minimumPrice?: number;
  address?: string;
  startTime?: Date;
  isInterested?: boolean;
}

const EventCard: React.FC<EventCardProps & { onUnbookmark: (id: number) => void; isFading: boolean }> = ({
  id,
  eventName,
  eventLogoUrl,
  eventBannerUrl,
  address,
  minimumPrice,
  startTime,
  isInterested: initialInterested = false,
  onUnbookmark,
  isFading,
}) => {
  const { t } = useTranslation();
  const [isInterested, setIsInterested] = useState(initialInterested);

  const toggleInterest = () => {
    setIsInterested(false);
    onUnbookmark(id);
  };

  return (
    <s.Card className={isFading ? "fade-out" : ""}>
      <s.ImageWrapper>
        <s.EventImage src={eventBannerUrl} alt={eventName} />

        {/* Bookmark/Interest Icon */}
        <s.BookmarkIcon onClick={toggleInterest}>
          {isInterested ? (
            <StarFilled style={{ fontSize: '24px', color: '#FFD700' }} />
          ) : (
            <StarOutlined style={{ fontSize: '24px', color: 'white' }} />
          )}
        </s.BookmarkIcon>
      </s.ImageWrapper>

      <s.EventTitle>{eventName}</s.EventTitle>
      {minimumPrice && <s.EventPrice>{t('homePage.from')} {minimumPrice} VND</s.EventPrice>}
      <s.EventAddress>
        <IconMapPin size={16} stroke={1.5} style={{ flexShrink: 0 }} />
        <s.EventAddressText title={address}>{address ? address : "N/A"}</s.EventAddressText>
      </s.EventAddress>
      <s.EventDate>
        <IconCalendar size={16} stroke={1.5} style={{ flexShrink: 0 }} />
        {startTime  ? new Date(startTime).toLocaleDateString() : "N/A"}
      </s.EventDate>
    </s.Card>
  );
};

export default EventCard;
