import { useState } from "react";
import styled from "styled-components";
import { EventGrid } from "@/components/favourited/EventGrid/EventGrid";
import { useTranslation } from "react-i18next";
import { FrownOutlined } from "@ant-design/icons";

const initialEvents = [
  {
    id: "1",
    eventName: "1589 - TRUNG QUÂN- 15 YEARS LIVE CONCERT",
    price: "420.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://images.tkbcdn.com/1/1560/600/Upload/eventcover/2023/09/11/A79B0F",
    isInterested: true,
  },
  {
    id: "2",
    eventName: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
    isInterested: true,
  },
  {
    id: "3",
    eventName: "MY TAM: Da Nang Shows",
    price: "420.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://media.baoquangninh.vn/upload/image/202406/medium/2224177_c560a8ede1478be87a3ab40cbb61efeb.png",
    isInterested: true,
  },
  {
    id: "4",
    eventName: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
    isInterested: true,
  },
];

const Container = styled.div`
  background-color: black;
  min-height: 100vh;
  padding: 20px;
  color: white;
  box-sizing: border-box;

  @media (max-width: 991px) {
    padding: 0 40px;
  }

  @media (max-width: 640px) {
    padding: 0 20px;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: rgb(214, 205, 32);
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background: #222;
  color: white;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

const NoEventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const SadIcon = styled(FrownOutlined)`
  font-size: 48px;
  color: gray;
  margin-bottom: 10px;
`;

const NoEventsText = styled.span`
  font-size: 18px;
  color: gray;
  text-align: center;
`;


export default function FavouritedPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteEvents, setFavoriteEvents] = useState(initialEvents);
  const [fadingEvents, setFadingEvents] = useState<string[]>([]);

  // Filter events based on search query
  const filteredEvents = favoriteEvents.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Remove event after fade-out animation
  const handleUnbookmark = (id: string) => {
    setFadingEvents((prev) => [...prev, id]); // Add event to fading list

    setTimeout(() => {
      setFavoriteEvents((prev) => prev.filter((event) => event.id !== id));
      setFadingEvents((prev) => prev.filter((eventId) => eventId !== id)); // Clean up
    }, 300); // Match animation duration
  };

  return (
    <Container>
      <Title>{t("favourited.title")}</Title>
      <SearchInput
        type="text"
        placeholder={t("favourited.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredEvents.length > 0 ? (
        <EventGrid events={filteredEvents} onUnbookmark={handleUnbookmark} fadingEvents={fadingEvents} />
      ) : (
        <NoEventsContainer>
          <SadIcon />
          <NoEventsText>{t("favourited.noFavourited")}</NoEventsText>
        </NoEventsContainer>
      )}
    </Container>
  );
}
