import { httpApi } from "@/api/http.api";
import { mockTicketInformation } from "@/mocks/ticketInformation";

export const ticketClient = {
  getTicketsByOrder: async (orderId: string) => {
    // Simulate API call and return mock data
    return mockTicketInformation.filter((ticket) => ticket.orderId === orderId)

    // When API is implemented, use the actual API call
    // const response = await httpApi.get<any>(`/orders/${orderId}/tickets`);
    // return response.data.data;
  },
};
