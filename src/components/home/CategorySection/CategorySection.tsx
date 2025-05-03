"use client";
import React from "react";
import { useTranslation } from 'react-i18next';
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
  onCategoryClick
}) => {
  const { t } = useTranslation();
  return (
    <s.Section>
      <s.Title>{t('homePage.exploreCategories')}</s.Title>
      <s.CategoriesGrid>
        {categories.map((category, index) => (
          <s.CategoryCard
            key={index}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => onCategoryClick(category.code)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCategoryClick(category.code);
              }
            }}
          >
            <s.CategoryImage imageUrl={category.imageUrl} />
            <s.CategoryName>{category.name}</s.CategoryName>
          </s.CategoryCard>
        ))}
      </s.CategoriesGrid>
    </s.Section>
  );
};
