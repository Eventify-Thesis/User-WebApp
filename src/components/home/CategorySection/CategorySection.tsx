"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";
import * as s from "./CategorySection.styles";

interface CategoryProps {
  name: string;
  imageUrl: string;
  code: string;
}

interface CategorySectionProps {
  categories: CategoryProps[];
  onCategoryClick: (code: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onCategoryClick,
}) => {
  const { t } = useTranslation();

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: -3000, // Negative number for no delay
    speed: 3000,
    arrows: false,
    slidesToShow: 4, // Show 4 cards at a time
    slidesToScroll: 1,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <s.Section>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <s.CategoryCard
            key={category.code} // Unique key for each category
            role="button"
            tabIndex={0}
            onClick={() => onCategoryClick(category.code)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onCategoryClick(category.code);
              }
            }}
          >
            <s.CategoryImage imageUrl={category.imageUrl} />
            <s.CategoryName>{category.name}</s.CategoryName>
          </s.CategoryCard>
        ))}
      </Slider>
    </s.Section>
  );
};
