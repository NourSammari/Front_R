import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanRequest } from 'app/Model/loanRequest';
import { LoanRequestIn } from 'app/Model/loanRequest';
import { LoanRequestDemande } from 'app/Model/loanRequest';
import { LoanRequestCount } from 'app/Model/loanRequest';
import { UserData } from 'app/Model/session';
import { ApiResponse } from 'app/Model/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class LoanRequestsService {
  private apiUrl = 'http://localhost:8080/api';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const userDataString = localStorage.getItem('userData');
    let accessToken = '';

    if (userDataString) {
      try {
        const userData: UserData = JSON.parse(userDataString);
        accessToken = userData.data.accessToken || '';
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    } else {
      console.warn('No userData found in localStorage');
    }

    console.log('Access Token:', accessToken);

    this.headers = new HttpHeaders();
    if (accessToken) {
      this.headers = this.headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  addLoanRequest(companyId: string, request: LoanRequestDemande): Observable<any> {
    return this.http.post(`${this.apiUrl}/loan_requests/${companyId}`, request, { headers: this.headers });
  }

  getAllLoanRequestsByUser(userId: string, page: number, limit: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/loan_requests/user/${userId}?page=${page}&limit=${limit}`, { headers: this.headers });
  }


  getAllLoanRequestsByCompany(companyId: string , page : number , limit : number): Observable<ApiResponse> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<ApiResponse>(`${this.apiUrl}/loan_requests/company/${companyId}?page=${page}&limit=${limit}`,  { params: params, headers: this.headers });
  }

  getLoanRequestsCountByUser(userId: string): Observable<LoanRequestCount> {
    return this.http.get<LoanRequestCount>(`${this.apiUrl}/loan_requests/user/${userId}/count`, { headers: this.headers });
  }

  getLoanRequestsCountByCompany(companyId: string): Observable<LoanRequestCount> {
    return this.http.get<LoanRequestCount>(`${this.apiUrl}/loan_requests/company/${companyId}/count`, { headers: this.headers });
  }

  getLoanRequestById(userId: string, loanRequestId: string): Observable<LoanRequest> {
    return this.http.get<LoanRequest>(`${this.apiUrl}/loan_requests/user/${userId}/${loanRequestId}`, { headers: this.headers });
  }

  updateLoanRequest(userId: string, loanRequestId: string, request: LoanRequestIn): Observable<any> {
    return this.http.put(`${this.apiUrl}/loan_requests/user/${userId}/${loanRequestId}`, request, { headers: this.headers });
  }

  deleteLoanRequest(userId: string, loanRequestId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/loan_requests/user/${userId}/${loanRequestId}`, { headers: this.headers });
  }
}
