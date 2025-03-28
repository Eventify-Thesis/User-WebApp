import React from "react";
import { ConfigProvider } from "antd";
import * as s from "./OrderTabs.styles";
import { useTranslation } from "react-i18next";

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (key: string) => void;
  subTab: string;
  setSubTab: (key: string) => void;
}



const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, setActiveTab, subTab, setSubTab }) => {
  const { t } = useTranslation();

  const mainTabs = [
    { key: "all", label: t("orderHistory.all") },
    { key: "success", label: t("orderHistory.finished") },
    { key: "processing", label: t("orderHistory.processing") },
    { key: "canceled", label: t("orderHistory.canceled") },
  ];

  const subTabs = [
    { key: "upcoming", label: t("orderHistory.upcoming") },
    { key: "ended", label: t("orderHistory.past") },
  ];
  
  return (
    <>
      {/* Main Tabs */}
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: "gray", // Default text color (unselected)
              itemSelectedColor: "white", // Selected tab text color
            },
          },
        }}
      >
        <s.StyledTabs activeKey={activeTab} onChange={setActiveTab} centered items={mainTabs} />
      </ConfigProvider>

      {/* Sub Tabs */}
      {(activeTab === "all" || activeTab === "success") && (
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "gray", // Default text color (unselected)
                itemSelectedColor: "white", // Selected tab text color
                inkBarColor: "#4CAF50", // Green underline
              },
            },
          }}
        >
          <s.SubTabs activeKey={subTab} onChange={setSubTab} centered items={subTabs} />
        </ConfigProvider>
      )}
    </>
  );
};

export default OrderTabs;
