import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Radio, Switch, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
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
    filterData.locationDisplay === "other place" ? filterData.locationValue : ""
  );

  const [customCategory, setCustomCategory] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const firstLoadRef = useRef(true); // ⬅️ Add this ref

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const city = searchParams.get("city");
    const categories = searchParams.get("categories");
  
    let locationDisplay = "";
    let locationValue = "";
    let tempCustomLocation = "";
    let categoryList: string[] = [];
    let customCats = "";
  
    if (city) {
      const normalizedCity = city.toLowerCase();
      const predefinedCities = ["", "ho chi minh", "ha noi", "da lat"];
  
      if (predefinedCities.includes(normalizedCity)) {
        locationDisplay = city;
        locationValue = city;
      } else {
        locationDisplay = "other place";
        locationValue = city;
        tempCustomLocation = city;
      }
    }
  
    if (categories) {
      const list = categories.split(",").map((c) => c.trim().toLowerCase());
      const validCategories = ["music", "art", "sport"];
      const matched = list.filter((c) => validCategories.includes(c));
      const custom = list.filter((c) => !validCategories.includes(c));
      categoryList = [...matched, ...(custom.length > 0 ? ["other"] : [])];
      customCats = custom.join(", ");
    }
  
    const newFilterData = {
      locationDisplay,
      locationValue,
      categories: categoryList,
    };
  
    setFilterData(newFilterData);
    setTempData(newFilterData); // 🧠 sync initial temp state too
    setCustomLocation(tempCustomLocation);
    setCustomCategory(customCats);
  
    firstLoadRef.current = false;
  }, [search]);  

  const updateURLParams = ({ locationValue, categories }) => {
    const searchParams = new URLSearchParams(window.location.search);
  
    if (locationValue) {
      searchParams.set('city', locationValue);
    } else {
      searchParams.delete('city');
    }
  
    if (categories.length > 0) {
      searchParams.set('categories', categories.join(','));
    } else {
      searchParams.delete('categories');
    }
  
    navigate({ search: searchParams.toString() });
  };  


  const handleApply = () => {
    let categories = tempData.categories;
    if (categories.includes("other") && customCategory.trim()) {
      categories = [
        ...categories.filter((c) => c !== "other"),
        ...customCategory.split(",").map((s) => s.trim()).filter(Boolean),
      ];
    }
  
    const isOther = tempData.locationDisplay === "other place";
    const locationValue = isOther ? customLocation : tempData.locationDisplay;
  
    setFilterData({
      locationDisplay: tempData.locationDisplay,
      locationValue,
      categories,
    });
  
    if (!firstLoadRef.current) {
      updateURLParams({ locationValue, categories });
    }
  
    setVisible(false);
  };

  const handleReset = () => {
    setTempData({
      locationDisplay: "",
      locationValue: "",
      categories: [],
    });
    setCustomLocation("");
    setCustomCategory("");
    setFilterData({
      locationDisplay: "",
      locationValue: "",
      categories: [],
    });
  
    if (!firstLoadRef.current) {
      updateURLParams({
        locationValue: "",
        categories: [],
      });
    }
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
              value={tempData.locationDisplay}
              onChange={(e) => {
                const newLocation = e.target.value;
                setTempData({ ...tempData, locationDisplay: newLocation });

                if (newLocation !== "other place") {
                  setCustomLocation("");
                }
              }}
            >
              <StyledRadio value="">{t("filters.nationwide")}</StyledRadio>
              <StyledRadio value="Ho Chi Minh">{t("filters.hcm")}</StyledRadio>
              <StyledRadio value="Ha Noi">{t("filters.hanoi")}</StyledRadio>
              <StyledRadio value="Da Lat">{t("filters.dalat")}</StyledRadio>
              <StyledRadio value="other place">{t("filters.otherLocation")}</StyledRadio>
            </Radio.Group>

            {tempData.locationDisplay === "other place" && (
              <StyledInput
                placeholder={t("filters.enterLocation")}
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                autoFocus
              />
            )}
          </Section>

          <Section>
            <SectionTitle>{t("filters.category")}</SectionTitle>
            <Checkbox.Group
              value={tempData.categories}
              onChange={(values) => {
                setTempData({ ...tempData, categories: values as string[] });
                // If "other" is unchecked, clear the custom input
                if (!(values as string[]).includes('other')) setCustomCategory('');
              }}
              options={[
                { label: t("filters.liveMusic"), value: "music" },
                { label: t("filters.theaterArts"), value: "art" },
                { label: t("filters.sports"), value: "sport" },
                { label: (
                    <span>
                      {t("filters.other")}
                      {tempData.categories.includes('other') && (
                        <input
                          type="text"
                          placeholder={t("filters.otherPlaceholder") || "Enter custom categories"}
                          style={{ marginLeft: 8, width: 120 }}
                          value={customCategory}
                          onChange={e => setCustomCategory(e.target.value)}
                          onClick={e => e.stopPropagation()} // Prevents checkbox toggle
                        />
                      )}
                    </span>
                  ), value: "other" },
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
