import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'app/Model/apiresponse';
import { LeaveRequestDetails ,LeaveRequestDemande , LeaveRequestIn} from 'app/Model/leaveRequest';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private apiUrl = 'http://localhost:8080/api';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const userDataString = localStorage.getItem('userData');
    let accessToken = '';

    if (userDataString) {
      try {
        const userData: any = JSON.parse(userDataString);
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

  createLeaveRequest(companyID: string, request: LeaveRequestDemande): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave_requests/${companyID}`, request, { headers: this.headers });
  }

  getLeaveRequestsByUser(userID: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/leave_requests/user/${userID}`, { headers: this.headers });
  }

  getLeaveRequestsByCompany(companyID: string, page : number , limit : number): Observable<ApiResponse> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<ApiResponse>(`${this.apiUrl}/leave_requests/company/${companyID}?page=${page}&limit=${limit}`, { params: params, headers: this.headers });
  }

  getLeaveRequestById(userID: string, requestID: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/leave_requests/${userID}/${requestID}`, { headers: this.headers });
  }

  updateLeaveRequest(userID: string, requestID: string, request: any): Observable<LeaveRequestIn> {
    return this.http.put(`${this.apiUrl}/leave_requests/${userID}/${requestID}`, request, { headers: this.headers });
  }

  deleteLeaveRequest(userID: string, requestID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/leave_requests/${userID}/${requestID}`, { headers: this.headers });
  }
}
