import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

interface CalendarDropdownProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  children: React.ReactNode;
}

const CalendarDropdown: React.FC<CalendarDropdownProps> = ({
  selectedDates,
  setSelectedDates,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [tempDates, setTempDates] = useState<[Dayjs | null, Dayjs | null] | null>(selectedDates);
  const [selectedFilter, setSelectedFilter] = useState<"today" | "week" | "month" | null>(null);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();

  // Handle date selection
  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    setTempDates(dates as [Dayjs | null, Dayjs | null]);
  };

  // Predefined date filters
  const handleDateSelection = (type: "today" | "week" | "month") => {
    const today = dayjs();
    let start: Dayjs | null = null;
    let end: Dayjs | null = null;

    if (type === "today") {
      start = today.startOf("day");
      end = today.endOf("day");
    } else if (type === "week") {
      start = today.startOf("week");
      end = today.endOf("week");
    } else if (type === "month") {
      start = today.startOf("month");
      end = today.endOf("month");
    }

    setTempDates([start, end]);
    setSelectedFilter(type);
  };

  const getButtonStyle = (type: "today" | "week" | "month") => {
    return type === selectedFilter ? { backgroundColor: "#1890ff", color: "white" } : {};
  };

  // Handle Apply
  const handleApply = () => {
    if (tempDates) {
      setSelectedDates(tempDates);
      updateURLParams(tempDates);
    }
    setVisible(false);
  };

  // Handle Reset
  const handleReset = () => {
    setTempDates([null, null]);
    setSelectedFilter(null);
  };

  const updateURLParams = (dates: [Dayjs | null, Dayjs | null]) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (dates[0]) {
      searchParams.set('startDate', dates[0].format('YYYY-MM-DD'));
    } else {
      searchParams.delete('startDate');
    }
    if (dates[1]) {
      searchParams.set('endDate', dates[1].format('YYYY-MM-DD'));
    } else {
      searchParams.delete('endDate');
    }
    navigate({ search: searchParams.toString() });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate && endDate) {
      const newDates: [Dayjs | null, Dayjs | null] = [dayjs(startDate), dayjs(endDate)];
      setTempDates(newDates);
      setSelectedDates(newDates);
      updateURLParams(newDates);
    } else {
      setTempDates([null, null]);
      setSelectedDates([null, null]);
    }
  }, [search]);

  return (
    <Dropdown
      open={visible}
      onOpenChange={setVisible}
      trigger={["click"]}
      dropdownRender={() => (
        <DropdownContent>
          {/* Quick Select Buttons */}
          <QuickSelectButtons>
            <Button style={getButtonStyle("today")} onClick={() => handleDateSelection("today")}>{t('filters.today')}</Button>
            <Button style={getButtonStyle("week")} onClick={() => handleDateSelection("week")}>{t('filters.thisWeekend')}</Button>
            <Button style={getButtonStyle("month")} onClick={() => handleDateSelection("month")}>{t('filters.thisMonth')}</Button>
          </QuickSelectButtons>

          {/* Date Picker */}
          <RangePicker
            value={tempDates}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder={[t('filters.startDate'), t('filters.endDate')]}
            style={{ width: "100%", marginTop: "10px" }}
          />

          {/* Buttons */}
          <ButtonContainer>
            <Button onClick={handleReset}>{t('filters.reset')}</Button>
            <Button type="primary" onClick={handleApply}>
              {t('filters.apply')}
            </Button>
          </ButtonContainer>
        </DropdownContent>
      )}
    >
      {children}
    </Dropdown>
  );
};

// Styled components
const DropdownContent = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  width: 320px;
`;

const QuickSelectButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export default CalendarDropdown;
