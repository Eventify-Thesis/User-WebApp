"use client";
import React from "react";
import { useTranslation } from 'react-i18next';
import * as s from "./CategorySection.styles";

interface CategoryProps {
  name: string;
  imageUrl?: string;
}

interface CategorySectionProps {
  categories: CategoryProps[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
}) => {
  const { t } = useTranslation();
  return (
    <s.Section>
      <s.Title>{t('homePage.exploreCategories')}</s.Title>
      <s.CategoriesGrid>
        {categories.map((category, index) => (
          <s.CategoryCard key={index}>
            <s.CategoryImage imageUrl={category.imageUrl} />
            <s.CategoryName>{category.name}</s.CategoryName>
          </s.CategoryCard>
        ))}
      </s.CategoriesGrid>
    </s.Section>
  );
};
