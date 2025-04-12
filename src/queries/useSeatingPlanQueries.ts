import { useQuery } from '@tanstack/react-query';
import { seatingPlanClient } from '@/api/seating-plan.client';
import { AxiosError } from 'axios';
import { IdParam } from '@/types/types';
import { SeatingPlanModel } from '@/domain/SeatingPlanModel';
import { SeatingPlanCategoryModel } from '@/domain/SeatingPlanCategoryModel';

export const SEATING_PLAN_QUERY_KEYS = {
  detail: 'seatingPlanDetail',
  categories: 'seatingPlanCategories',
};

export const useGetSeatingPlanDetail = (eventId: IdParam, planId: IdParam) => {
  return useQuery<SeatingPlanModel, AxiosError>({
    queryKey: [SEATING_PLAN_QUERY_KEYS.detail, eventId, planId],
    queryFn: async () => {
      const data = await seatingPlanClient.getDetail(eventId, planId);
      return data;
    },
    enabled: !!eventId && !!planId,
  });
};

export const useGetSeatingPlanCategories = (
  eventId: IdParam,
  planId: IdParam,
  options?: { enabled?: boolean },
) => {
  return useQuery<SeatingPlanCategoryModel[], AxiosError>({
    queryKey: [SEATING_PLAN_QUERY_KEYS.categories, eventId, planId],
    queryFn: async () => {
      const data = await seatingPlanClient.getCategories(eventId, planId);
      console.log(data);
      return data;
    },
    enabled: (options?.enabled ?? true) && !!eventId && !!planId,
  });
};
