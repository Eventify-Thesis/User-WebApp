import { useQuery } from "@tanstack/react-query";
import { ticketClient } from "@/api/ticket.client";
import TicketModel from "@/domain/TicketModel";

export const GET_TICKETS_QUERY_KEY = "tickets";

export const useGetTickets = (orderId: string) => {
  return useQuery<TicketModel[]>({
    queryKey: [GET_TICKETS_QUERY_KEY, orderId],
    queryFn: () => ticketClient.getTicketsByOrder(orderId),
    refetchOnWindowFocus: false,
  });
};
