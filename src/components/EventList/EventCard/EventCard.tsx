import * as s from './EventCard.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import EventModel from '@/domain/EventModel';

interface EventCardProps extends EventModel {
  minimumPrice?: number;
  startTime?: Date;
  isInterested?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  eventName,
  eventLogoUrl,
  eventBannerUrl,
  minimumPrice,
  startTime,
  isInterested: initialFavorited = false,
}) => {
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const toggleFavorite = () => {
    setIsFavorited((prev: any) => !prev);
  };

  return (
    <s.Card>
      <s.ImageWrapper>
        <s.EventImage src={eventBannerUrl} alt={eventName} />

        {/* Bookmark/Favorite Icon */}
        <s.BookmarkIcon onClick={toggleFavorite}>
          {isFavorited ? (
            <StarFilled style={{ fontSize: '24px', color: '#FFD700' }} />
          ) : (
            <StarOutlined style={{ fontSize: '24px', color: 'white' }} />
          )}
        </s.BookmarkIcon>
      </s.ImageWrapper>

      <s.EventTitle title={eventName}>{eventName}</s.EventTitle>
      <s.EventPrice>
        {minimumPrice ? t('homePage.from') + ' ' + Math.floor(minimumPrice) : 'N/A'}
      </s.EventPrice>
      <s.EventDate>
        {/* Convert seconds to milliseconds by multiplying by 1000*/}
        {startTime ? '📅 ' + new Date(Number(startTime) * 1000).toDateString() : 'N/A'}
      </s.EventDate>
    </s.Card>
  );
};

export default EventCard;
