import styled from "styled-components";

interface StyledProps {
  $primaryColor?: string;
  $textColor?: string;
  $imageUrl?: string;
}

export const OrderContainer = styled.div<StyledProps>`
  display: flex;
  align-items: stretch;
  background: ${(props) => props.$primaryColor || "red"};
  padding: 2px 12px;
  margin: 0 auto;
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  max-width: 90%;
  border-radius: 12px;
  color: white;
  overflow: hidden;
  gap: 5px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: #18181d;
    border-radius: 50%;
  }

  &:before {
    top: 50%;
    left: -8px;
    transform: translateY(-50%);
  }

  &:after {
    top: 50%;
    right: -8px;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    padding: 2px 8px;
    gap: 4px;
  }
`;

export const DateBox = styled.div<StyledProps>`
  background: ${(props) => props.$primaryColor || "red"};
  color: ${(props) => props.$textColor || "#fff"};
  padding: 8px;
  text-align: center;
  font-weight: bold;
  border-radius: 6px;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 14px;

  --zigzag:
    conic-gradient(from   45deg at left,  #0000, #000 1deg 89deg, #0000 90deg) left / 51% 5px repeat-y,
    conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right / 51% 5px repeat-y;

  -webkit-mask: var(--zigzag);
          mask: var(--zigzag);

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px;
    min-width: 45px;
  }
`;

export const OrderInfoContainer = styled.div<StyledProps>`
  flex-grow: 1;
  background: ${(props) =>
    props.$imageUrl
      ? `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url(${props.$imageUrl})`
      : props.$primaryColor || "#fff"};
  background-size: cover;
  background-position: right;
  padding: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  color: white;

  h3 {
    margin-bottom: 3px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }

  p {
    margin: 3px 0;
    font-size: 12px;
    display: flex;
    align-items: center;
    color: white;
  }

  svg {
    margin-right: 5px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    h3 {
      font-size: 14px;
    }
    p {
      font-size: 11px;
    }
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 3px;
  flex-wrap: wrap;
`;
