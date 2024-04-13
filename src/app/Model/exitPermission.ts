export interface ExitPermissionIn {
    status?: string;
  }

export  interface ExitPermissionCount {
    count?: number;
  }

export  interface ExitPermissionDemande {
    reason?: string;
    start_date?: string;
    return_date?: string;
    type?: string;
  }

export  interface ExitPermissionDetails {
    id?: string;
    reason?: string;
    status?: string;
    UserId?: string;
    createdAt?: string;
  }

export  interface ExitPermissionPagination {
    items?: ExitPermissionDetails[];
    page?: number;
    limit?: number;
    totalCount?: number;
  }
