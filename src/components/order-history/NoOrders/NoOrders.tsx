import NoOrdersImage from "@/assets/NotExistState.webp";
import * as s from "./NoOrders.styles";
import { useTranslation } from "react-i18next";

const NoOrders = () => {
  const { t } = useTranslation();

  return (
    <s.NoOrdersContainer>
      <s.ImageWrapper>
        <s.Image src={NoOrdersImage} alt="No Orders available" />
      </s.ImageWrapper>
      <s.Text>{t("orderHistory.noOrders")}.</s.Text>
    </s.NoOrdersContainer>
  );
};

export default NoOrders;
