import React, { useEffect, useState } from 'react';
import { Banner } from '@/components/home/Banner/Banner';
import { CategorySection } from '@/components/home/CategorySection/CategorySection';
import { EventCardGrid } from '@/components/home/EventCardGrid/EventCardGrid';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/useResponsive';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { LocationSection } from '@/components/home/LocationSection/LocationSection';
import { Footer } from '@/components/home/Footer/Footer';
import { Hero } from '@/components/home/Hero/Hero';
import { useGetEvents } from '@/queries/useGetEvents';

const categories = [
  { name: "entertainment"},
  { name: "education" },
  { name: "cultural" },
  { name: "sport" },
  { name: "technology" },
  { name: "travel" },
];

const images = [
  "https://salt.tkbcdn.com/ts/ds/6e/0c/af/7d24dc88c6955aa0caeca421046956ad.jpg",
  "https://salt.tkbcdn.com/ts/ds/99/38/15/19919dffe776b8990327c2c461750391.jpg",
  "https://www.mancity.com/meta/media/m1hfn5z1/landscape_hospitality.jpg",
  "https://vnmedia.vn/file/8a10a0d36ccebc89016ce0c6fa3e1b83/042024/1._poster_30_anh_trai_say_hi_20240426164638.jpg",
];

const eventCategory = "Upcoming Events";

const HomePage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const { data: events, isLoading } = useGetEvents();

  const newCategory = categories.map(category => ({
    name: (t('homePage.' + category.name)),
    imageUrl: 'https://img.freepik.com/free-photo/black-silhouettes-music-concert-poster-concept_1194-617147.jpg?t=st=1740554758~exp=1740558358~hmac=2531f930e011ee92729f45a071e833c0772c9cd7cab164a553ecb14aa05b3d25&w=1800'
  }));

  if (isLoading) return <p>Loading...</p>;

  const desktopLayout = (
    <>
      <Hero/>
      <Banner images={images} />
      <CategorySection categories={newCategory} />
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
