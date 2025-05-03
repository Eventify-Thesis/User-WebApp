import React, { useEffect, useState } from 'react';
import { Banner } from '@/components/home/Banner/Banner';
import { CategorySection } from '@/components/home/CategorySection/CategorySection';
import { EventCardGrid } from '@/components/home/EventCardGrid/EventCardGrid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { LocationSection } from '@/components/home/LocationSection/LocationSection';
import { Footer } from '@/components/home/Footer/Footer';
import { Hero } from '@/components/home/Hero/Hero';
import { useGetEvents } from '@/queries/useGetEvents';
import { useSearchMetadata } from '@/queries/useSearchMetadata';
import { Loading } from '@/components/common/Loading/Loading';

const images = [
  "https://salt.tkbcdn.com/ts/ds/6e/0c/af/7d24dc88c6955aa0caeca421046956ad.jpg",
  "https://salt.tkbcdn.com/ts/ds/99/38/15/19919dffe776b8990327c2c461750391.jpg",
  "https://www.mancity.com/meta/media/m1hfn5z1/landscape_hospitality.jpg",
  "https://vnmedia.vn/file/8a10a0d36ccebc89016ce0c6fa3e1b83/042024/1._poster_30_anh_trai_say_hi_20240426164638.jpg",
];

const eventCategory = "Upcoming Events";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isTablet, isDesktop } = useResponsive();
  const { t, i18n } = useTranslation();
  const { data: events, isLoading } = useGetEvents();
  const { data: searchMetadata, isLoading: isSearchMetadataLoading } = useSearchMetadata();
  const lang = i18n.language;

  if (isLoading || isSearchMetadataLoading) return <Loading/>;

  console.log(searchMetadata);

  const newCategory = searchMetadata?.data.result.categories.map((category: any) => ({
    name: category.name[lang] || category.name['en'], // fallback to English if current language not found
    imageUrl: category.image,
    code: category.code,
  }));


  const desktopLayout = (
    <>
      <Hero/>
      <Banner images={images} />
      {newCategory && <CategorySection categories={newCategory} 
        onCategoryClick={(code) => {
          // Navigate to SearchResult with categories=code and empty query
          navigate(`/search-result?query=&categories=${code}`);
        }}
      />}
      <EventCardGrid eventCategory={eventCategory} events={events || []} />
      <LocationSection/>
      <Footer/>
    </>
  );
  
  const mobileAndTabletLayout =
    <>
      <Hero/>
      <Banner images={images} />
      <EventCardGrid eventCategory={eventCategory} events={events || []} />
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
