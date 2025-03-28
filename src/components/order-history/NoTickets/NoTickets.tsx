import NoTicketsImage from "@/assets/NotExistState.webp";
import * as s from "./NoTickets.styles";
import { useTranslation } from "react-i18next";

const NoTickets = () => {
  const { t } = useTranslation();

  return (
    <s.NoTicketsContainer>
      <s.ImageWrapper>
        <s.Image src={NoTicketsImage} alt="No tickets available" />
      </s.ImageWrapper>
      <s.Text>{t("orderHistory.noTickets")}.</s.Text>
    </s.NoTicketsContainer>
  );
};

export default NoTickets;
