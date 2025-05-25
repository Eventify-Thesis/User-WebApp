import { useQuery } from "@tanstack/react-query";
import { checkExist } from "@/api/interest.client";
import { InterestModel } from "@/domain/InterestModel";

export const useCheckInterestExist = (userId: string, eventId: number) => {
    return useQuery<InterestModel>({
        queryKey: ['interest-exist', userId, eventId],
        queryFn: () => checkExist(userId, eventId),
    });
};
