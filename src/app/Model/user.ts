export interface Users {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: string;
    country?: string;
    phoneNumber?: string;
    dateOfHire?: Date;
    leaveBalance?: number;
    cvPath?: string;
    lastLogin?: Date;
    departmentName?: string;
 // roleId?: string;
    companyId?: string;
  }

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleName?: string;
    companyID: string;
    country?: string;
    status?: boolean;
    createdAt?: Date;
  }

  export interface UsersPagination {
    items: User[];
    page: number;
    limit: number;
    totalCount: number;
  }

  export interface UsersTable {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
  }

  export interface UsersList {
    id: string;
    name: string;
  }

  export interface UsersCount {
    count: number;
  }

  export interface UsersDetails {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    status?: boolean;
    createdAt?: Date;
  }

  export interface UserIn {
    compnayID?:string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role_name: string;
  }

  export interface AddTrainingUser {
    id: string;
  }

