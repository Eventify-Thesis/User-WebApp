import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import * as s from './CategoryEventSection.styles'; 
import EventCard from '@/components/EventList/EventCard/EventCard'; 

interface Props {
  title: string; 
  events: any[]; 
}

const CategoryEventSection: React.FC<Props> = ({ title, events }) => {
  const { t } = useTranslation();

  const slidesToShow = events.length < 6 ? events.length : 6;

  const showArrows = events.length > slidesToShow;

  const settings = {
    dots: true,
    slidesToShow: slidesToShow,
    pauseOnHover: true,
    cssEase: 'linear',
    arrows: showArrows,
    infinite: false, 
    centerMode: false, 
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, events.length) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(1, events.length) },
      },
    ],
  };

  // Show carousel only if more than 3 events, otherwise use a grid/flex row
  const showCarousel = events.length > 3;
  return (
    <s.Section>
      <s.SectionTitle>
        <div>{t('homePage.explore')}</div>
        <div>{title}</div>
      </s.SectionTitle>
      {showCarousel ? (
        <Slider {...settings}>
          {events.map((event, index) => (
            <s.EventCardWrapper key={index}>
              <EventCard {...event} />
            </s.EventCardWrapper>
          ))}
        </Slider>
      ) : (
        <s.GridWrapper>
          {events.map((event, index) => (
            <s.EventCardWrapper key={index}>
              <EventCard {...event} />
            </s.EventCardWrapper>
          ))}
        </s.GridWrapper>
      )}
    </s.Section>
  );
};

export default CategoryEventSection;
