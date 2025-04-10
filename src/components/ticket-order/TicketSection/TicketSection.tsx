import { useState } from "react";
import { Carousel, Modal } from "antd";
import { useTranslation } from "react-i18next";
import * as s from "./TicketSection.styles";
import Ticket from "@/domain/TicketModel";

interface TicketSectionProps {
  tickets: Ticket[];
  imageUrl: string
}

const TicketSection: React.FC<TicketSectionProps> = ({ tickets, imageUrl }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const showQRCode = (qrUrl: string) => {
    setSelectedQR(qrUrl);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedQR(null);
  };

  return (
    <s.TicketSectionContainer>
      <s.CarouselContainer>
        <Carousel dots draggable swipe touchMove>
          {tickets.map((ticket) => (
            <s.TicketSlide key={ticket.id}>
              <s.EventTitle>{ticket.eventName}</s.EventTitle>
              <s.EventImageWrapper>
                <s.EventImage src={imageUrl} alt={ticket.eventName} />
              </s.EventImageWrapper>
              <s.TicketCard>
                <s.TicketDetails>
                  <s.DetailText>
                    {t("ticketSection.ticketType")}: <strong>{t("ticketSection." + ticket.ticketType)}</strong>
                  </s.DetailText>
                  <s.DetailText>
                    {t("ticketSection.area")}: <strong>{ticket.area}</strong>
                  </s.DetailText>
                  <s.DetailText>
                    {t("ticketSection.row")}: <strong>{ticket.row}</strong> - {t("ticketSection.seat")}: <strong>{ticket.seat}</strong>
                  </s.DetailText>
                  <s.DetailText>
                    {t("ticketSection.time")}:
                    <strong>{`${ticket.startTime} - ${ticket.endTime}, ${new Date(ticket.date).toLocaleDateString("en-GB")}`}</strong>
                  </s.DetailText>
                </s.TicketDetails>
                <s.QRCodeSection onClick={() => showQRCode(ticket.qrCode)}>
                  {t("ticketSection.qrPrompt")}
                </s.QRCodeSection>
              </s.TicketCard>
            </s.TicketSlide>
          ))}
        </Carousel>
      </s.CarouselContainer>
      <Modal open={isModalVisible} onCancel={handleClose} footer={null} centered>
        {selectedQR && <img src={selectedQR} alt="QR Code" style={{ width: "100%" }} />}
      </Modal>
    </s.TicketSectionContainer>
  );
};

export default TicketSection;
