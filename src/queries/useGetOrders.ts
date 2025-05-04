import { useQuery } from "@tanstack/react-query";
import { orderClient } from "@/api/order.client";
import { IdParam, PaginationResponse } from "@/types/types";
import OrderModel from "@/domain/OrderModel";

export const GET_ORDERS_QUERY_KEY = "orders";

export const useGetEventOrders = (status: string, time: "UPCOMING" | "PAST") => {
  return useQuery<PaginationResponse<OrderModel>>({
    queryKey: [GET_ORDERS_QUERY_KEY, status, time],
    queryFn: () => orderClient.getEventOrders(status, time),
    refetchOnWindowFocus: false,
  });
};

export const GET_ORDER_DETAIL_QUERY_KEY = "orderDetail";

export const useGetOrderDetail = (orderId: IdParam) => {
  return useQuery<OrderModel>({
    queryKey: [GET_ORDER_DETAIL_QUERY_KEY, orderId],
    queryFn: async () => {
      const order = await orderClient.getOrderDetail(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    },
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
};