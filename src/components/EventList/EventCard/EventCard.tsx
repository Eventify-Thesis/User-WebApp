import * as s from './EventCard.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import EventModel from '@/domain/EventModel';

const EventCard: React.FC<EventModel> = ({
  id,
  eventName,
  eventLogoURL,
  eventBannerURL,
  lowest_price,
  soonest_start_time,
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
        <s.EventImage src={eventBannerURL} alt={eventName} />

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
        {lowest_price ? t('homePage.from') + ' ' + Math.floor(lowest_price) : 'N/A'}
      </s.EventPrice>
      <s.EventDate>
        {soonest_start_time ? '📅 ' + new Date(soonest_start_time).toDateString() : 'N/A'}
      </s.EventDate>
    </s.Card>
  );
};

export default EventCard;
