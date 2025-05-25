import React from "react";
import * as s from "./CategoryCard.styles";

interface CategoryCardProps {
  title: string;
  image: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, onClick }) => (
  <s.StyledCard onClick={onClick}>
    <s.ImageContainer>
      <s.Image src={image} alt={title} />
    </s.ImageContainer>
    <s.TitleOverlay>{title}</s.TitleOverlay>
  </s.StyledCard>
);

export default CategoryCard;
