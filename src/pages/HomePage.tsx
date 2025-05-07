import React, { useEffect, useState } from 'react';
import { Banner } from '@/components/home/Banner/Banner';
import { CategorySection } from '@/components/home/CategorySection/CategorySection';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { LocationSection } from '@/components/home/LocationSection/LocationSection';
import { Footer } from '@/components/home/Footer/Footer';
import { Hero } from '@/components/home/Hero/Hero';
import { useGetEvents } from '@/queries/useGetEvents';
import { useSearchMetadata } from '@/queries/useSearchMetadata';
import { useGetEventsThisMonth } from '@/queries/useGetEventsThisMonth';
import { useGetEventsThisWeek } from '@/queries/useGetEventsThisWeek';
import { useGetEventsByCategory } from '@/queries/useGetEventsByCategory';
import { Loading } from '@/components/common/Loading/Loading';
import ShowcaseEventSection from '@/components/EventList/ShowcaseEventSection/ShowcaseEventSection';
import { formatEvents } from '@/utils/eventFormatter';
import { Typography } from 'antd';
import CategoryEventSection from '@/components/home/CategoryEventSection/CategoryEventSection';

const images = [
  "https://salt.tkbcdn.com/ts/ds/6e/0c/af/7d24dc88c6955aa0caeca421046956ad.jpg",
  "https://salt.tkbcdn.com/ts/ds/99/38/15/19919dffe776b8990327c2c461750391.jpg",
  "https://www.mancity.com/meta/media/m1hfn5z1/landscape_hospitality.jpg",
  "https://vnmedia.vn/file/8a10a0d36ccebc89016ce0c6fa3e1b83/042024/1._poster_30_anh_trai_say_hi_20240426164638.jpg",
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isTablet, isDesktop } = useResponsive();
  const { t, i18n } = useTranslation();
  const { data: events, isLoading } = useGetEvents();
  const { data: searchMetadata, isLoading: isSearchMetadataLoading } = useSearchMetadata();
  const { data: eventsThisMonth, isLoading: isEventsThisMonthLoading } = useGetEventsThisMonth();
  const { data: eventsThisWeek, isLoading: isEventsThisWeekLoading } = useGetEventsThisWeek();
  const { data: eventsByCategory, isLoading: isEventsByCategoryLoading } = useGetEventsByCategory();
  const lang = i18n.language;
  if (isLoading || isSearchMetadataLoading) return <Loading/>;
  
  const newCategory = searchMetadata?.data.result.categories.map((category: any) => ({
    name: category.name[lang] || category.name['en'], // fallback to English if current language not found
    imageUrl: category.image,
    code: category.code,
  }));

  const formattedEventsThisMonth = formatEvents(eventsThisMonth || []);
  const formattedEventsThisWeek = formatEvents(eventsThisWeek || []);

  const desktopLayout = (
    <>
      <Hero/>
      <Banner images={images} />
      {eventsThisWeek && eventsThisMonth && <ShowcaseEventSection
        eventsThisWeek={formattedEventsThisWeek}
        eventsThisMonth={formattedEventsThisMonth}
      />}
      {newCategory && <CategorySection categories={newCategory} 
        onCategoryClick={(code) => {
          // Navigate to SearchResult with categories=code and empty query
          navigate(`/search-result?query=&categories=${code}`);
        }}
      />}
      {/* Render EventCardGrids for each category with at least one event */}
      <div>
      {eventsByCategory &&
        Object.entries(eventsByCategory).map(([key, category]) => {
          if (!category.events || category.events.length === 0) return null;
          const title = category.title?.[i18n.language] || category.title?.en || key;
          const formattedEvents = formatEvents(category.events).map(event => ({
            ...event,
            date: new Date(event.startTime * 1000),
            eventBannerURL: event.eventBannerUrl,
            price: event.minimumPrice,
          }));

          return (
            <CategoryEventSection
              key={key}
              title={title} // Title of the section
              events={formattedEvents} // Event data for carousel
            />
          );
        })}
    </div>
      <LocationSection/>
      <Footer/>
    </>
  );
  
  const mobileAndTabletLayout =
    <>
      <Hero/>
      <Banner images={images} />
      {eventsThisWeek && eventsThisMonth && <ShowcaseEventSection
        eventsThisWeek={formattedEventsThisWeek}
        eventsThisMonth={formattedEventsThisMonth}
      />}
      {eventsByCategory &&
        Object.entries(eventsByCategory).map(([key, category]) => {
          if (!category.events || category.events.length === 0) return null;
          const title = category.title?.[i18n.language] || category.title?.en || key;
          const formattedEvents = formatEvents(category.events).map(event => ({
            ...event,
            date: new Date(event.startTime * 1000),
            eventBannerURL: event.eventBannerUrl,
            price: event.minimumPrice,
          }));

          return (
            <CategoryEventSection
              key={key}
              title={title} // Title of the section
              events={formattedEvents} // Event data for carousel
            />
          );
        })}
      <LocationSection/>
      <Footer/>
    </>;
  
  return (
    <>
      <PageTitle>{t('homePage.title')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default HomePage;
