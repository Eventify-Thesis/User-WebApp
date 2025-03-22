import { useQuery } from "@tanstack/react-query";
import { buyerClient } from "@/api/buyer.client";
import BuyerModel from "@/domain/BuyerModel";

export const GET_BUYER_QUERY_KEY = "buyer";

export const useGetBuyerByEmail = (email: string) => {
  return useQuery<BuyerModel | null>({
    queryKey: [GET_BUYER_QUERY_KEY, email],
    queryFn: () => buyerClient.getBuyerByEmail(email),
    enabled: !!email, // Prevents query from running if email is empty
    refetchOnWindowFocus: false,
  });
};
