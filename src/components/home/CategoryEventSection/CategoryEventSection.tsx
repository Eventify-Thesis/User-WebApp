import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Title, Text } from '@mantine/core';
import EventCard from '@/components/EventList/EventCard/EventCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './CategoryEventSection.css';

interface Props {
  title: string;
  events: any[];
  userId?: string | null;
}

const CategoryEventSection: React.FC<Props> = ({ title, events, userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Always show 4 events horizontally unless there are fewer than 4
  const slidesToShow = events.length < 4 ? events.length : 4;

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

  const handleEventClick = (event: any) => {
    if (event.url) {
      navigate(`${event.url}-${event.id}`);
    } else {
      navigate(`${event.eventName}-${event.id}`);
    }
  };

  const eventsWithAddress = events.map((event) => {
    if (
      !event.street ||
      !event.ward ||
      !event.district ||
      !event.city ||
      !event.country
    ) {
      return {
        ...event,
        address: 'Online',
      };
    }
    return {
      ...event,
      address:
        event.street +
        ', ' +
        event.ward +
        ', ' +
        'District ' +
        event.district +
        ', ' +
        event.city +
        ', ' +
        event.country,
    };
  });

  // Show carousel only if more than 3 events, otherwise use a grid/flex row
  const showCarousel = events.length > 3;
  return (
    <Box
      py={{ base: 40, md: 80 }}
      px={{ base: 16, sm: 20, md: 40 }}
      style={{
        padding: '2rem 4rem',
        backgroundColor: '#27272A',
      }}
      w="100%"
    >
      <Box mb={30} ml={{ base: 0, sm: 30 }}>
        <Title order={2} fw={700} fz={32} c="white">
          {t('homePage.explore')}
        </Title>
        <Text fz={24} mt={4} c="#facc15" fw={500}>
          {title}
        </Text>
      </Box>
      {showCarousel ? (
        <div className="slider-container">
          <Slider {...settings}>
            {eventsWithAddress.map((event, index) => (
              <div key={index} className="event-card-wrapper">
                <EventCard
                  {...event}
                  onClick={() => handleEventClick(event)}
                  userId={userId}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="grid-wrapper">
          {eventsWithAddress.map((event, index) => (
            <div key={index} className="event-card-wrapper">
              <EventCard
                style={{
                  width: '20rem !important',
                }}
                {...event}
                onClick={() => handleEventClick(event)}
                userId={userId}
              />
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default CategoryEventSection;
