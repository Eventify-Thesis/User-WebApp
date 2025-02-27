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
const categories = [
  { name: "entertainment"},
  { name: "education" },
  { name: "cultural" },
  { name: "sport" },
  { name: "technology" },
  { name: "travel" },
];
const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBjQ6cacjUhWGAxXt_j-UgOdQhDAo3ce9Eg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgrIRhLAtatO1uBu28Gf98B84CqDnZC5SUrA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgrIRhLAtatO1uBu28Gf98B84CqDnZC5SUrA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBjQ6cacjUhWGAxXt_j-UgOdQhDAo3ce9Eg&s",
];
const eventInfo = {
  eventCategory: "Upcoming Events", events: [
    {
      title: "The Road to Jobs and Internships: Starting with LinkedIn",
      date: new Date(Date.parse("2023-01-13")),
      price: "499,000 VND",
      interestedCount: 21,
      venue: "Online",
      image: "https://salt.tkbcdn.com/ts/ds/44/e2/90/76fb84dbfdcd86e99f720aca467ffd04.png",
    },
    {
      title: "Online Zumba Dance Fitness Class over Zoom",
      date: new Date(Date.parse("2023-01-13")),
      price: "70,000 VND",
      interestedCount: 10,
      venue: "Zoom",
      image: "https://salt.tkbcdn.com/ts/ds/44/e2/90/76fb84dbfdcd86e99f720aca467ffd04.png",
    },
    {
      title: "Easy Book Folding: Christmas Edition",
      date: new Date(Date.parse("2023-01-13")), 
      price: "FREE",
      interestedCount: 10,
      venue: "Community Library",
      image: "https://salt.tkbcdn.com/ts/ds/44/e2/90/76fb84dbfdcd86e99f720aca467ffd04.png",
    },
  ]
};


const HomePage: React.FC = () => {
  
  const { isTablet, isDesktop } = useResponsive();

  const { t } = useTranslation();

  const newCategory = categories.map(category => ({
    name: (t('homePage.' + category.name)),
    imageUrl: 'https://img.freepik.com/free-photo/black-silhouettes-music-concert-poster-concept_1194-617147.jpg?t=st=1740554758~exp=1740558358~hmac=2531f930e011ee92729f45a071e833c0772c9cd7cab164a553ecb14aa05b3d25&w=1800'
  }));
  const desktopLayout = (
    <>
      <Hero/>
      <Banner images={images} />
      <CategorySection categories={newCategory} />
      <EventCardGrid eventCategory={eventInfo.eventCategory} events={eventInfo.events} />
      <LocationSection/>
      <Footer/>
    </>
  );
  
  const mobileAndTabletLayout = <>
      <Hero/>
      <Banner images={images} />
      <EventCardGrid eventCategory={eventInfo.eventCategory} events={eventInfo.events} />
      <LocationSection/>
  </>;
  
  return (
    <>
      <PageTitle>{t('homePage.title')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default HomePage;
