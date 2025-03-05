import * as s from './EventCard.styles';
import { useTranslation } from 'react-i18next';
const EventCard: React.FC<s.EventProps> = ({ id, title, price, date, image }) => {
  const { t } = useTranslation();

  return (
    <s.Card>
      <s.ImageWrapper>
        <s.EventImage src={image} alt={title} />

        <s.BookmarkIcon
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c1046de208fdc3515ce14eddbcf778ad27b67628f7ecbfaa210063a9427c5c9?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
                  alt="Bookmark"
                />
      </s.ImageWrapper>

      <s.EventTitle>{title}</s.EventTitle>
      <s.EventPrice>{t('homePage.from')} {price}</s.EventPrice>
      <s.EventDate>📅 {date}</s.EventDate>
    </s.Card>
  );
};

export default EventCard;