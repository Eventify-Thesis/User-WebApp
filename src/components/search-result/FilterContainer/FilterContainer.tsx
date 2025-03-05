import { useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import CalendarModal from "./CalendarModal/CalendarModal";
import FilterModal from "./FilterModal/FilterModal";
import type { Dayjs } from "dayjs";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

interface EventFiltersProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  filterData: { location: string; isFree: boolean; categories: string[] };
  setFilterData: (data: { location: string; isFree: boolean; categories: string[] }) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedDates,
  setSelectedDates,
  filterData,
  setFilterData,
}) => {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  // Function to format the date label for the button
  const formatDateLabel = () => {
    if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
      return "Tất cả các ngày";
    }
     return `${selectedDates[0]
    .locale("vi")
    .format("DD [tháng] MM, YYYY")} - ${selectedDates[1]
    .locale("vi")
    .format("DD [tháng] MM, YYYY")}`;
  };

  return (
    <FilterContainer>
      <span>Kết quả tìm kiếm:</span>
      <FilterButton onClick={() => setCalendarVisible(true)}>
        <CalendarOutlined /> {formatDateLabel()}
      </FilterButton>
      <FilterButton onClick={() => setFilterModalVisible(true)}>
        <FilterOutlined /> Bộ lọc
      </FilterButton>

      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setCalendarVisible(false)}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterData={filterData}
        setFilterData={setFilterData}
      />
    </FilterContainer>
  );
};

export default EventFilters;
