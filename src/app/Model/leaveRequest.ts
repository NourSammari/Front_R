export interface LeaveRequestIn {
    status?: string;
  }

  export interface LeaveRequestCount {
    count?: number;
  }

  export interface LeaveRequestDetails {
    id?: string;
    start_date?: string;
    end_date?: string;
    leave_type?: string;
    status?: string;
    reason?: string;
    user_id?: string;
    createdAt?: string;
  }

  export interface LeaveRequestDemande {
    start_date?: string;
    end_date?: string;
    leave_type?: string;
    reason?: string;
  }

  export interface LeavePagination {
    items?: LeaveRequestDetails[];
    page?: number;
    limit?: number;
    totalCount?: number;
  }
