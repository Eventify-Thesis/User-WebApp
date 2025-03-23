import * as s from './EventCard.styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import EventModel from '@/domain/EventModel';

const EventCard: React.FC<EventModel & { onUnbookmark: (id: string) => void; isFading: boolean }> = ({
  id,
  eventName,
  eventLogoURL,
  eventBannerURL,
  price,
  date,
  isInterested: initialFavorited = false,
  onUnbookmark,
  isFading,
}) => {
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const toggleFavorite = () => {
    setIsFavorited(false);
    onUnbookmark(id);
  };

  return (
    <s.Card className={isFading ? "fade-out" : ""}>
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

      <s.EventTitle>{eventName}</s.EventTitle>
      {price && <s.EventPrice>{t('homePage.from')} {price}</s.EventPrice>}
      <s.EventDate>📅 {date.toDateString()}</s.EventDate>
    </s.Card>
  );
};

export default EventCard;
