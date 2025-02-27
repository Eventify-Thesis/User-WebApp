import styled from "styled-components";

export const Section = styled.section`
  margin: 60px auto 0;
  width: 100%;
  max-width: 1926px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

export const Title = styled.h2`
  color: #000000;
  font-family: Montserrat, sans-serif;
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;

  &::after {
    content: "";
    width: 50px;
    height: 4px;
    background-color: #007bff;
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 30px;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  max-width: 100%;
  
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
`;

export const CategoryCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
  }
`;

export const CategoryImage = styled.div<{ imageUrl?: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : "none")};
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  ${CategoryCard}:hover & {
    transform: scale(1.1);
  }
`;

export const CategoryName = styled.h3`
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;

  ${CategoryCard}:hover & {
    color: #007bff;
  }
`;
