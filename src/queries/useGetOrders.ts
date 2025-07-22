import { useQuery } from '@tanstack/react-query';
import { orderClient } from '@/api/order.client';
import { bookingClient } from '@/api/booking.client';
import { IdParam, PaginationResponse } from '@/types/types';
import { OrderModel } from '@/domain/OrderModel';

export const GET_ORDERS_QUERY_KEY = 'orders';

export const useGetEventOrders = (
  status: string,
  time: 'UPCOMING' | 'PAST',
) => {
  return useQuery<PaginationResponse<OrderModel>>({
    queryKey: [GET_ORDERS_QUERY_KEY, status, time],
    queryFn: () => orderClient.getEventOrders(status, time),
    refetchOnWindowFocus: false,
  });
};

export const GET_ORDER_DETAIL_QUERY_KEY = 'orderDetail';

export const useGetOrderDetail = (orderPublicId: IdParam) => {
  return useQuery<OrderModel>({
    queryKey: [GET_ORDER_DETAIL_QUERY_KEY, orderPublicId],
    queryFn: async () => {
      const order = await orderClient.getOrderDetail(orderPublicId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    },
    enabled: !!orderPublicId,
    refetchOnWindowFocus: false,
  });
};

export const useGetOrderDetailById = (orderId: IdParam) => {
  return useQuery<OrderModel>({
    queryKey: [GET_ORDER_DETAIL_QUERY_KEY, orderId],
    queryFn: async () => {
      const order = await orderClient.getOrderDetailById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    },
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
};

export const GET_ORDER_BY_INTERNAL_ID_QUERY_KEY = 'orderByInternalId';

export const useGetOrderByInternalId = (orderId: number) => {
  return useQuery<OrderModel>({
    queryKey: [GET_ORDER_BY_INTERNAL_ID_QUERY_KEY, orderId],
    queryFn: () => bookingClient.getOrderByInternalId(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
};
