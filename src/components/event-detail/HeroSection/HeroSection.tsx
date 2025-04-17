import { useResponsive } from '@/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import * as S from './HeroSection.styles';
import './HeroSection.styles.css';
import { EventDetailResponse } from '@/domain/EventModel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { ShowModel } from '@/domain/ShowModel';
import { TicketTypeModel } from '@/domain/TicketTypeModel';

interface HeroSectionProps {
  event: EventDetailResponse;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  const { t, i18n } = useTranslation();
  const { isTablet, isDesktop } = useResponsive();
  const {
    price,
    startTime,
    endTime,
    eventName,
    venueName,
    address,
    eventBannerUrl,
  } = event;

  let formattedAddress;
  if (i18n.language === 'vi') {
    formattedAddress = address.addressVi;
  } else {
    formattedAddress = address.addressEn;
  }

  const formattedStartTime = dayjs(startTime)
    .locale(i18n.language)
    .format('dddd, MMMM D, YYYY HH:mm');

  // Get the minimum price of all ticket types
  const minPrice = event.shows?.reduce(
    (min: number, show: ShowModel) =>
      show.ticketTypes.reduce(
        (min: number, ticketType: TicketTypeModel) =>
          ticketType.price < min ? ticketType.price : min,
        min,
      ),
    Infinity,
  );

  const desktopLayout = (
    <S.HeroSectionWrapper>
      <S.EventContent>
        <div id="circle1" className="circle"></div>
        <div id="circle2" className="circle"></div>
        <S.EventInfo>
          <S.EventTitle>{eventName}</S.EventTitle>
          <S.EventDate>
            <S.IC icon="mdi:calendar" width="24" height="24" />
            {formattedStartTime}
          </S.EventDate>
          <S.VenueInfo>
            <S.IC icon="mdi:map-marker" width="24" height="24" />
            <S.VenueName>{venueName}</S.VenueName>
          </S.VenueInfo>
          <S.Address>{formattedAddress}</S.Address>
        </S.EventInfo>
        <S.PriceSection>
          <S.PriceInfo>
            <S.PriceLabel>{t('eventDetailPage.priceFrom')}</S.PriceLabel>
            <S.Price>{minPrice}</S.Price>
          </S.PriceInfo>
          <S.BuyTicketButton>
            {t('eventDetailPage.buyTicket')}
          </S.BuyTicketButton>
        </S.PriceSection>
      </S.EventContent>
      <div id="img-wrapper-banner">
        <S.EventImage src={eventBannerUrl} alt="Event banner" />
      </div>
    </S.HeroSectionWrapper>
  );

  const mobileAndTabletLayout = (
    <S.HeroSectionWrapper>
      <S.EventContent>
        <div id="circle1" className="circle"></div>
        <div id="circle2" className="circle"></div>
        <S.EventInfo>
          <S.EventTitle>{eventName}</S.EventTitle>
          <S.EventDate>
            <S.IC icon="mdi:calendar" width="24" height="24" />
            {formattedStartTime}
          </S.EventDate>
          <S.VenueInfo>
            <S.IC icon="mdi:map-marker" width="24" height="24" />
            <S.VenueName>{venueName}</S.VenueName>
          </S.VenueInfo>
          <S.Address>{formattedAddress}</S.Address>
        </S.EventInfo>
        <S.PriceSection>
          <S.PriceInfo>
            <S.PriceLabel>{t('eventDetailPage.priceFrom')}</S.PriceLabel>
            <S.Price>{minPrice}</S.Price>
          </S.PriceInfo>
          <S.BuyTicketButton>
            {t('eventDetailPage.buyTicket')}
          </S.BuyTicketButton>
        </S.PriceSection>
      </S.EventContent>
      <div id="img-wrapper-banner">
        <S.EventImage src={eventBannerUrl} alt="Event banner" />
      </div>
    </S.HeroSectionWrapper>
  );

  return <>{isDesktop ? desktopLayout : mobileAndTabletLayout}</>;
};
