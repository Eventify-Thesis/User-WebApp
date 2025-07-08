import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  issueReportApi,
  CreateIssueReportRequest,
  UpdateIssueReportRequest,
} from '@/api/issueReportApi';
import { showError, showSuccess } from '@/utils/notifications';
import { GET_USER_ISSUE_REPORTS_QUERY_KEY } from '@/queries/useGetIssueReports';

export const useCreateIssueReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIssueReportRequest) => {
      return issueReportApi.createIssueReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_USER_ISSUE_REPORTS_QUERY_KEY],
      });
      showSuccess(
        'Issue report submitted successfully! Our team will review it shortly.',
      );
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to submit issue report',
      );
    },
  });
};

export const useUpdateIssueReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      issueReportId,
      data,
    }: {
      issueReportId: number;
      data: UpdateIssueReportRequest;
    }) => {
      return issueReportApi.updateIssueReport(issueReportId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_USER_ISSUE_REPORTS_QUERY_KEY],
      });
      showSuccess('Issue report updated successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update issue report',
      );
    },
  });
};

export const useDeleteIssueReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (issueReportId: number) => {
      return issueReportApi.deleteIssueReport(issueReportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_USER_ISSUE_REPORTS_QUERY_KEY],
      });
      showSuccess('Issue report deleted successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to delete issue report',
      );
    },
  });
};
