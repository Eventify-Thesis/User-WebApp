import styled from "styled-components";

export const Card = styled.div`
  background-color: #111;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  padding: 10px;
  text-align: left;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.fade-out {
    opacity: 0;
    transform: translateY(20px);
  }
`;

// Wrapper to apply hover effect
export const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px; 

  &:hover img {
    transform: scale(1.1);
  }

  &:hover::after {
    animation: shine 0.8s ease-in-out forwards;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 70%
    );
    transition: left 0.8s ease-in-out;
  }

  @keyframes shine {
    from {
      left: -100%;
    }
    to {
      left: 100%;
    }
  }
`;

export const EventImage = styled.img`
  width: 100%;
  display: block;
  border-radius: 10px;
  transition: transform 0.5s ease-in-out;
  height: 150px; /* Set a fixed height */
  object-fit: cover;
`;

export const EventTitle = styled.h3`
  font-size: 19px;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EventPrice = styled.p`
  color: rgb(214, 205, 32);
  font-weight: bold;
`;

export const EventDate = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #ccc;
`;

export const EventAddress = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #ccc;
  max-width: 100%;
`;

export const EventAddressText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  min-width: 0;
  max-width: 100%;
`;

export const BookmarkIcon = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;