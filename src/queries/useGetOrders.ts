import { useQuery } from "@tanstack/react-query";
import { orderClient } from "@/api/order.client";
import { IdParam } from "@/types/types";
import OrderModel from "@/domain/OrderModel";

export const GET_ORDERS_QUERY_KEY = "orders";

export const useGetOrders = (userId: IdParam, status: string, timeframe: "UPCOMING" | "PAST") => {
  return useQuery<OrderModel[]>({
    queryKey: [GET_ORDERS_QUERY_KEY, status, timeframe],
    queryFn: () => orderClient.getUserOrders(userId, status, timeframe),
    refetchOnWindowFocus: false,
  });
};

export const GET_ORDER_BY_ID_QUERY_KEY = "orderById";

export const useGetOrderById = (orderId: IdParam) => {
  return useQuery<OrderModel>({
    queryKey: [GET_ORDER_BY_ID_QUERY_KEY, orderId],
    queryFn: async () => {
      const order = await orderClient.getOrderById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    },
    enabled: !!orderId, // Prevents the query from running if orderId is undefined
    refetchOnWindowFocus: false,
  });
};