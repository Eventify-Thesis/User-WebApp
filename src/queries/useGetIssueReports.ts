import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  issueReportApi,
  IssueReport,
  IssueReportListResponse,
} from '@/api/issueReportApi';

export const GET_USER_ISSUE_REPORTS_QUERY_KEY = 'getUserIssueReports';
export const GET_ISSUE_REPORT_QUERY_KEY = 'getIssueReport';

export const useGetUserIssueReports = (
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery<IssueReportListResponse, AxiosError>({
    queryKey: [GET_USER_ISSUE_REPORTS_QUERY_KEY, page, limit],
    queryFn: async () => {
      const data = await issueReportApi.getUserIssueReports(page, limit);
      return data;
    },
  });
};

export const useGetIssueReport = (issueReportId: number | undefined) => {
  return useQuery<IssueReport, AxiosError>({
    queryKey: [GET_ISSUE_REPORT_QUERY_KEY, issueReportId],
    queryFn: async () => {
      if (!issueReportId) throw new Error('Issue report ID is required');
      const data = await issueReportApi.getIssueReport(issueReportId);
      return data;
    },
    enabled: !!issueReportId,
  });
};
