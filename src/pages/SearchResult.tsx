"use client";
import { useState } from "react";
import styled from "styled-components";
import type { Dayjs } from "dayjs";
import EventFilters from "@/components/search-result/FilterContainer/FilterContainer";
import { EventGrid } from "@/components/search-result/EventList/EventGrid/EventGrid";

const events = [
  {
    id: 1,
    title: "ART WORKSHOP 'UJI MATCHA CHEESECAKE TARTE'",
    price: "420.000đ",
    date: "04 tháng 03, 2025",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/49e4c3587b8fbaa866ba74be4007470e57f89267",
  },
  {
    id: 2,
    title: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: "04 tháng 03, 2025",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
  },
  {
    id: 1,
    title: "ART WORKSHOP 'UJI MATCHA CHEESECAKE TARTE'",
    price: "420.000đ",
    date: "04 tháng 03, 2025",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/49e4c3587b8fbaa866ba74be4007470e57f89267",
  },
  {
    id: 2,
    title: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: "04 tháng 03, 2025",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
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

export default function SearchResults() {
    const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [filterData, setFilterData] = useState<{
        location: string;
        isFree: boolean;
        categories: string[];
    }>({
        location: "Toàn quốc",
        isFree: false,
        categories: [],
    });

    return (
        <Container>
            <EventFilters selectedDates={selectedDates} setSelectedDates={setSelectedDates} filterData={filterData} setFilterData={setFilterData} />
            <EventGrid events={events}/>
        </Container>
    );
};
