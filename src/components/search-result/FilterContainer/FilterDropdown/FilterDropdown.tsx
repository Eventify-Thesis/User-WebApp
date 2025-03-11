import React, { useState } from "react";
import { Dropdown, Radio, Switch, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { FilterDropdownProps, DropdownContent, Section, SectionTitle, StyledRadio, StyledInput, ButtonContainer, StyledButton, StyledPrimaryButton } from "./FilterDropdown.styles";

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterData,
  setFilterData,
  children,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [tempData, setTempData] = useState(filterData);
  const [customLocation, setCustomLocation] = useState(
    filterData.location === "Vị trí khác" ? filterData.location : ""
  );

  const handleApply = () => {
    const updatedLocation =
      tempData.location === "Vị trí khác" ? customLocation : tempData.location;

    setFilterData({ ...tempData, location: updatedLocation });
    setVisible(false);
  };

  const handleReset = () => {
    setTempData({ location: "Toàn quốc", isFree: false, categories: [] });
    setCustomLocation("");
  };

  return (
    <Dropdown
      open={visible}
      onOpenChange={setVisible}
      trigger={["click"]}
      dropdownRender={() => (
        <DropdownContent>
          <Section>
            <SectionTitle>{t("filters.location")}</SectionTitle>
            <Radio.Group
              value={tempData.location}
              onChange={(e) => {
                const newLocation = e.target.value;
                setTempData({ ...tempData, location: newLocation });

                if (newLocation !== "Vị trí khác") {
                  setCustomLocation("");
                }
              }}
            >
              <StyledRadio value="Toàn quốc">{t("filters.nationwide")}</StyledRadio>
              <StyledRadio value="Hồ Chí Minh">{t("filters.hcm")}</StyledRadio>
              <StyledRadio value="Hà Nội">{t("filters.hanoi")}</StyledRadio>
              <StyledRadio value="Đà Lạt">{t("filters.dalat")}</StyledRadio>
              <StyledRadio value="Vị trí khác">{t("filters.otherLocation")}</StyledRadio>
            </Radio.Group>

            {tempData.location === "Vị trí khác" && (
              <StyledInput
                placeholder={t("filters.enterLocation")}
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                autoFocus
              />
            )}
          </Section>

          <Section>
            <SectionTitle>{t("filters.price")}</SectionTitle>
            <Switch
              checked={tempData.isFree}
              onChange={(checked) =>
                setTempData({ ...tempData, isFree: checked })
              }
            />{" "}
            {t("filters.free")}
          </Section>

          <Section>
            <SectionTitle>{t("filters.category")}</SectionTitle>
            <Checkbox.Group
              value={tempData.categories}
              onChange={(values) =>
                setTempData({ ...tempData, categories: values as string[] })
              }
              options={[
                t("filters.liveMusic"),
                t("filters.theaterArts"),
                t("filters.sports"),
                t("filters.other"),
              ]}
            />
          </Section>

          <ButtonContainer>
            <StyledButton onClick={handleReset}>{t("filters.reset")}</StyledButton>
            <StyledPrimaryButton type="primary" onClick={handleApply}>
              {t("filters.apply")}
            </StyledPrimaryButton>
          </ButtonContainer>
        </DropdownContent>
      )}
    >
      {children}
    </Dropdown>
  );
};


export default FilterDropdown;
