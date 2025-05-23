import { useQuery } from '@tanstack/react-query';
import { findAllInterest } from '@/api/interest.client';
import { PaginationResponse } from '@/types/types';
import { InterestModel } from '@/domain/InterestModel';

export const useGetInterests = (
  userId: string,
  page = 1,
  limit = 10,
  enabled = true
) => {
  return useQuery<PaginationResponse<InterestModel>>({
    queryKey: ['user-interests', userId, page, limit],
    queryFn: () => findAllInterest(userId, page, limit),
    enabled: !!userId && enabled,
  });
};
