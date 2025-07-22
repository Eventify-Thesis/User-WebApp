import { httpApi } from '@/api/http.api';
import OrderModel from '@/domain/OrderModel';
import { IdParam, PaginationResponse } from '@/types/types';

export const orderClient = {
  getEventOrders: async (
    status: string,
    time: 'UPCOMING' | 'PAST',
  ): Promise<PaginationResponse<OrderModel>> => {
    const response = await httpApi.get<any>(`/orders?status=${status}&time=${time}`);
    return response.data.data;
  },

  getOrderDetail: async (orderId: IdParam): Promise<OrderModel | null> => {
    const response = await httpApi.get<any>(`/orders/${orderId}`);
    return response.data.data;
  },

  getOrderDetailById: async (orderId: IdParam): Promise<OrderModel | null> => {
    const response = await httpApi.get<any>(`/orders/detail/${orderId}`);
    return response.data.data;
  },
};
