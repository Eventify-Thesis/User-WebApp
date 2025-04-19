import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface TicketItem {
  name: string;
  ticketTypeId: number;
  seatId: string;
  quantity: number;
  sectionId?: string;
  price: string;
  seatNumber?: string;
  rowLabel?: string;
  color?: string;
}

interface GroupedTickets {
  [key: string]: {
    name: string;
    id: number;
    quantity: number;
    price: string;
    seats: { id: string; rowLabel?: string; seatNumber?: string }[];
  };
}

interface TicketDetailsProps {
  items: TicketItem[];
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({ items }) => {
  const { t } = useTranslation();

  const groupedTickets = items.reduce<GroupedTickets>((acc, item) => {
    const key = `${item.ticketTypeId}`;
    if (!acc[key]) {
      acc[key] = {
        name: item.name,
        id: item.ticketTypeId,
        quantity: 0,
        price: item.price,
        seats: [],
      };
    }
    acc[key].quantity += item.quantity;
    if (item.seatId) {
      acc[key].seats.push({
        id: item.seatId,
        rowLabel: item.rowLabel,
        seatNumber: item.seatNumber,
      });
    }
    return acc;
  }, {});

  return (
    <TicketDetailsWrapper>
      <Title>{t('checkout.ticketDetails')}</Title>
      <TicketList>
        {Object.values(groupedTickets).map((ticket) => (
          <div key={ticket.id}>
            <TicketItem>
              <TicketTypeInfo>
                <TicketName>{ticket.name}</TicketName>
                <TicketQuantity>x{ticket.quantity}</TicketQuantity>
              </TicketTypeInfo>
              <PriceInfo>
                <UnitPrice>
                  {Number(ticket.price).toLocaleString('vi-VN')} đ
                </UnitPrice>
                <TotalPrice>
                  {(Number(ticket.price) * ticket.quantity).toLocaleString(
                    'vi-VN',
                  )}{' '}
                  đ
                </TotalPrice>
              </PriceInfo>
            </TicketItem>
            {ticket.seats.length > 0 && (
              <SeatList>
                {ticket.seats.map((seat) => (
                  <SeatTag key={seat.id}>
                    {seat.rowLabel
                      ? `${seat.rowLabel} - ${seat.seatNumber}`
                      : seat.seatNumber}
                  </SeatTag>
                ))}
              </SeatList>
            )}
          </div>
        ))}
      </TicketList>
    </TicketDetailsWrapper>
  );
};

const TicketDetailsWrapper = styled.div`
  margin: 16px 0;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #27272a;
`;

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TicketItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TicketTypeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #27272a;
`;

const TicketName = styled.div`
  font-weight: 500;
`;

const TicketQuantity = styled.div`
  font-weight: 500;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #71717a;
  font-size: 14px;
`;

const UnitPrice = styled.div``;

const TotalPrice = styled.div`
  font-weight: 500;
`;

const SeatList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SeatTag = styled.div`
  padding: 4px 8px;
  background-color: #f4f4f5;
  border-radius: 4px;
  font-size: 12px;
  color: #52525b;
`;
