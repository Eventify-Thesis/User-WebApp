import { httpApi } from "@/api/http.api";
import BuyerModel from "@/domain/BuyerModel";
import { mockBuyers } from "@/mocks/buyers"; 

export const buyerClient = {
  getBuyerByEmail: async (email: string): Promise<BuyerModel | null> => {
    // Simulate fetching buyer from mock data
    const buyer = mockBuyers.find((b) => b.email === email);
    return buyer || null;

    // When API is implemented, use the actual API call:
    // const response = await httpApi.get<any>(`/buyers?email=${email}`);
    // return response.data.data;
  },
};
