
export interface AdvanceSalaryRequest {
id?: string;
amount?: number;
reason?: string;
status?: string;
createdAt?: Date;
}

export interface AdvanceSalaryRequestCount {
count?: number;
}

export interface AdvanceSalaryRequestPagination {
items?: AdvanceSalaryRequest[];
page?: number;
limit?: number;
totalCount?: number;
}

export interface AdvanceSalaryRequestDetails {
id?: string;
userId?: string;
amount?: number;
status?: string;
reason?: string;
createdAt?: Date;
}

export interface AdvanceSalaryRequestIn {
status?: string;
}
