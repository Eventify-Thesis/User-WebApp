import React from 'react';
import { Banner } from '@/components/home/Banner/Banner';
import { CategorySection } from '@/components/home/CategorySection/CategorySection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { PatternBackground } from '@/components/common/PatternBackground/PatternBackground';

import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { LocationSection } from '@/components/home/LocationSection/LocationSection';
import { Footer } from '@/components/home/Footer/Footer';
import { Hero } from '@/components/home/Hero/Hero';
import { useSearchMetadata } from '@/queries/useSearchMetadata';
import { useGetEventsThisMonth } from '@/queries/useGetEventsThisMonth';
import { useGetEventsThisWeek } from '@/queries/useGetEventsThisWeek';
import { useGetEventsByCategory } from '@/queries/useGetEventsByCategory';
import { Loading } from '@/components/common/Loading/Loading';
import ShowcaseEventSection from '@/components/EventList/ShowcaseEventSection/ShowcaseEventSection';
import { formatEvents } from '@/utils/eventFormatter';
import CategoryEventSection from '@/components/home/CategoryEventSection/CategoryEventSection';
import { useAuth } from '@clerk/clerk-react';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import placeholderImage from '@/assets/images/placeholder_image.png';

const images = [
  'https://salt.tkbcdn.com/ts/ds/6e/0c/af/7d24dc88c6955aa0caeca421046956ad.jpg',
  'https://salt.tkbcdn.com/ts/ds/99/38/15/19919dffe776b8990327c2c461750391.jpg',
  'https://www.mancity.com/meta/media/m1hfn5z1/landscape_hospitality.jpg',
  'https://vnmedia.vn/file/8a10a0d36ccebc89016ce0c6fa3e1b83/042024/1._poster_30_anh_trai_say_hi_20240426164638.jpg',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { isTablet, isDesktop } = useResponsive();
  const { t, i18n } = useTranslation();
  const { data: searchMetadata, isLoading: isSearchMetadataLoading } =
    useSearchMetadata();
  const { data: eventsThisMonth, isLoading: isEventsThisMonthLoading } =
    useGetEventsThisMonth(userId ? userId : undefined);
  const { data: eventsThisWeek, isLoading: isEventsThisWeekLoading } =
    useGetEventsThisWeek(userId ? userId : undefined);
  const { data: eventsByCategory, isLoading: isEventsByCategoryLoading } =
    useGetEventsByCategory(userId ? userId : undefined);
  const { data: eventsForCarousel, isLoading: isEventsForCarouselLoading } = 
    useSearchSemanticEvents({
      query: '',
      limit: 4,
    }); // limit to 4 events for carousel, 2 per slide
    
  const formattedEventsForCarousel = eventsForCarousel?.map(event => ({
    ...event,
    eventLogoUrl: event.eventLogoUrl || placeholderImage
  })) || [];
  
  const lang = i18n.language;

  // Show content progressively instead of waiting for everything
  const showCategories = !isSearchMetadataLoading && searchMetadata;
  const showEvents =
    !isEventsThisMonthLoading &&
    !isEventsThisWeekLoading &&
    eventsThisMonth &&
    eventsThisWeek;
  const showCategoryEvents = !isEventsByCategoryLoading && eventsByCategory;

  const newCategory = searchMetadata?.data?.result?.categories?.map(
    (category: any) => ({
      name: category.name[lang] || category.name['en'], // fallback to English if current language not found
      imageUrl: category.image,
      code: category.code,
    }),
  );

  const formattedEventsThisMonth = formatEvents(eventsThisMonth || []);
  const formattedEventsThisWeek = formatEvents(eventsThisWeek || []);

  const desktopLayout = (
    <>
      <Hero />
      <PatternBackground color="#000" patternColor="#fff">
        {showCategories ? (
          <CategorySection
            categories={newCategory}
            onCategoryClick={(code) => {
              // Navigate to SearchResult with categories=code and empty query
              navigate(`/search-result?query=&categories=${code}`);
            }}
          />
        ) : (
          <div style={{ height: '200px' }}>
            <Loading />
          </div>
        )}
        {eventsForCarousel && <Banner events={formattedEventsForCarousel} images={images} />}
      </PatternBackground>
      <PatternBackground color="#000" patternColor="#fff">
        {showEvents ? (
          <ShowcaseEventSection
            eventsThisWeek={formattedEventsThisWeek}
            eventsThisMonth={formattedEventsThisMonth}
            userId={userId}
          />
        ) : (
          <div style={{ height: '400px' }}>
            <Loading />
          </div>
        )}

        {/* Render EventCardGrids for each category with at least one event */}
        <div style={{ margin: '0' }}>
          {showCategoryEvents ? (
            Object.entries(eventsByCategory).map(([key, category]) => {
              if (!category.events || category.events.length === 0) return null;
              const title =
                category.title?.[i18n.language] || category.title?.en || key;
              const formattedEvents = formatEvents(category.events).map(
                (event) => ({
                  ...event,
                  date: new Date(event.startTime * 1000),
                  eventBannerURL: event.eventLogoUrl,
                  price: event.minimumPrice,
                }),
              );

              return (
                <CategoryEventSection
                  key={key}
                  title={title} // Title of the section
                  events={formattedEvents} // Event data for carousel
                  userId={userId}
                />
              );
            })
          ) : (
            <div style={{ height: '300px' }}>
              <Loading />
            </div>
          )}
        </div>
        <LocationSection />
      </PatternBackground>
      <Footer />
    </>
  );

  const mobileAndTabletLayout = (
    <>
      <Hero />
      <PatternBackground color="#000" patternColor="#fff">
        {showCategories ? (
          <CategorySection
            categories={newCategory}
            onCategoryClick={(code) => {
              // Navigate to SearchResult with categories=code and empty query
              navigate(`/search-result?query=&categories=${code}`);
            }}
          />
        ) : (
          <div style={{ height: '200px' }}>
            <Loading />
          </div>
        )}
        {eventsForCarousel && <Banner events={formattedEventsForCarousel} images={images} />}
      </PatternBackground>

      <PatternBackground color="#000" patternColor="#fff">
        {showEvents ? (
          <ShowcaseEventSection
            eventsThisWeek={formattedEventsThisWeek}
            eventsThisMonth={formattedEventsThisMonth}
            userId={userId}
          />
        ) : (
          <div style={{ height: '400px' }}>
            <Loading />
          </div>
        )}
          {showCategoryEvents ? (
            Object.entries(eventsByCategory).map(([key, category]) => {
              if (!category.events || category.events.length === 0) return null;
              const title =
                category.title?.[i18n.language] || category.title?.en || key;
              const formattedEvents = formatEvents(category.events).map(
                (event) => ({
                  ...event,
                  date: new Date(event.startTime * 1000),
                  eventBannerURL: event.eventBannerUrl,
                  price: event.minimumPrice,
                }),
              );

              return (
                <CategoryEventSection
                  key={key}
                  title={title} // Title of the section
                  events={formattedEvents} // Event data for carousel
                  userId={userId}
                />
              );
            })
          ) : (
            <div style={{ height: '300px' }}>
              <Loading />
            </div>
          )}
        <LocationSection />
      </PatternBackground>
      <Footer />
    </>
  );

  return (
    <>
      <PageTitle>{t('homePage.title')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default HomePage;
