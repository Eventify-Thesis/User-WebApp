import styled from "styled-components";

export const Card = styled.div`
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  padding: 10px;
  text-align: left;
  transition: opacity 0.3s ease, transform 0.3s ease;
  width: 100%; /* Ensure the card takes full width of the container */
  
  &:hover {
    transform: translateY(-5px); /* Elevate the card on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    background-color: #333; /* Darken the background slightly on hover */
  }
  
  /* Apply a subtle glowing effect */
  &:hover {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
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
  font-size: 18px;
  margin: 10px 0;
  font-weight: 700; /* Make the title bold */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff; /* Ensure title stands out */
`;

export const EventPrice = styled.p`
  color: rgb(214, 205, 32);
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); /* Add text shadow to make price stand out */
`;

export const EventDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ccc;
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