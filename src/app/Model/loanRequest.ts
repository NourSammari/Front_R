
export interface LoanRequest {
    ID?: string;
    LoanAmount?: number;
    LoanDuration?: string;
    InterestRate?: number;
    ReasonForLoan?: string;
    Status?: string;
    PathDocument?: string;
    CompanyID?: string;
    UserID?: string;
}

export interface LoanRequestDemande {
    LoanAmount?: number;
    LoanDuration?: string;
    InterestRate?: number;
    ReasonForLoan?: string;
    PathDocument?: string;
}

export interface LoanRequestPagination {
    Items?: LoanRequestDetails[];
    Page?: number;
    Limit?: number;
    TotalCount?: number;
}

export interface LoanRequestDetails {
    ID?: string;
    LoanAmount?: number;
    LoanDuration?: string;
    InterestRate?: number;
    ReasonForLoan?: string;
    Status?: string;
    PathDocument?: string;
    UserID?: string;
    CreatedAt?: Date;
}

export interface LoanRequestCount {
    Count?: number;
}

export interface LoanRequestIn {
    Status?: string;
}
