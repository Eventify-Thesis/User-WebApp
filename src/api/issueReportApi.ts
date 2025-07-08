import { httpApi } from './http.api';

export interface IssueReport {
  id: number;
  userId: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  // User display fields (populated by backend)
  userFirstName?: string;
  userLastName?: string;
  userImageUrl?: string;
}

export enum IssueCategory {
  BUG = 'bug',
  TRANSACTION = 'transaction',
  UI_UX = 'ui_ux',
  FEATURE_REQUEST = 'feature_request',
  ACCOUNT = 'account',
  OTHER = 'other',
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface CreateIssueReportRequest {
  title: string;
  description: string;
  category: IssueCategory;
  priority?: IssuePriority;
  imageUrls?: string[];
}

export interface UpdateIssueReportRequest {
  title?: string;
  description?: string;
  category?: IssueCategory;
  priority?: IssuePriority;
  imageUrls?: string[];
}

export interface IssueReportListResponse {
  issueReports: IssueReport[];
  total: number;
  page: number;
  totalPages: number;
}

export const issueReportApi = {
  createIssueReport: async (
    data: CreateIssueReportRequest,
  ): Promise<IssueReport> => {
    const response = await httpApi.post('/issue-reports', data);
    return response.data;
  },

  getUserIssueReports: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<IssueReportListResponse> => {
    const response = await httpApi.get(
      `/issue-reports?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getIssueReport: async (issueReportId: number): Promise<IssueReport> => {
    const response = await httpApi.get(`/issue-reports/${issueReportId}`);
    return response.data;
  },

  updateIssueReport: async (
    issueReportId: number,
    data: UpdateIssueReportRequest,
  ): Promise<IssueReport> => {
    const response = await httpApi.put(`/issue-reports/${issueReportId}`, data);
    return response.data;
  },

  deleteIssueReport: async (issueReportId: number): Promise<void> => {
    await httpApi.delete(`/issue-reports/${issueReportId}`);
  },

  // Category options for forms
  getCategoryOptions: () => [
    { value: IssueCategory.BUG, label: '🐛 Bug Report' },
    { value: IssueCategory.TRANSACTION, label: '💳 Transaction Issue' },
    { value: IssueCategory.UI_UX, label: '🎨 UI/UX Issue' },
    { value: IssueCategory.FEATURE_REQUEST, label: '✨ Feature Request' },
    { value: IssueCategory.ACCOUNT, label: '👤 Account Issue' },
    { value: IssueCategory.OTHER, label: '❓ Other' },
  ],

  // Priority options for forms
  getPriorityOptions: () => [
    { value: IssuePriority.LOW, label: '🟢 Low' },
    { value: IssuePriority.MEDIUM, label: '🟡 Medium' },
    { value: IssuePriority.HIGH, label: '🟠 High' },
    { value: IssuePriority.URGENT, label: '�� Urgent' },
  ],
};
