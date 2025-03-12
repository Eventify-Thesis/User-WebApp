import React, { useState } from "react";
import { Dropdown, Button } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation();

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
    setSelectedDates([start, end]);
    setVisible(false);
  };

  // Handle Apply
  const handleApply = () => {
    if (tempDates) {
      setSelectedDates(tempDates);
    }
    setVisible(false);
  };

  // Handle Reset
  const handleReset = () => {
    setTempDates([null, null]);
    setSelectedDates([null, null]);
  };

  return (
    <Dropdown
      open={visible}
      onOpenChange={setVisible}
      trigger={["click"]}
      dropdownRender={() => (
        <DropdownContent>
          {/* Quick Select Buttons */}
          <QuickSelectButtons>
            <Button onClick={() => handleDateSelection("today")}>{t('filters.today')}</Button>
            <Button onClick={() => handleDateSelection("week")}>{t('filters.thisWeekend')}</Button>
            <Button onClick={() => handleDateSelection("month")}>{t('filters.thisMonth')}</Button>
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
