import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from 'app/Model/session';
import { AdvanceSalaryRequest, AdvanceSalaryRequestIn } from 'app/Model/advanceSalary';
import { ApiResponse } from 'app/Model/apiresponse';


@Injectable({
    providedIn: 'root'
  })

export class AdvanceSalaryRequestService {

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

    createAdvanceSalaryRequest(companyId: string, request: AdvanceSalaryRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/advance_salaryRequests/${companyId}`, request, { headers: this.headers });
    }

    getAdvanceSalaryRequestsByUser(userId: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/advance_salaryRequests/user/${userId}`, { headers: this.headers });
    }

    getAdvanceSalaryRequestsByCompany(companyId: string, page : number , limit : number): Observable<ApiResponse> {
        const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());
        return this.http.get<ApiResponse>(`${this.apiUrl}/advance_salaryRequests/company/${companyId}?page=${page}&limit=${limit}`, { params: params, headers: this.headers });
    }

    getAdvanceSalaryRequestById(userId: string, requestId: string): Observable<AdvanceSalaryRequest> {
        return this.http.get<AdvanceSalaryRequest>(`${this.apiUrl}/advance_salaryRequests/${userId}/${requestId}`, { headers: this.headers });
    }

    updateAdvanceSalaryRequest(userId: string, requestId: string, request: AdvanceSalaryRequestIn): Observable<any> {
        return this.http.put(`${this.apiUrl}/advance_salaryRequests/${userId}/${requestId}`, request, { headers: this.headers });
    }

    deleteAdvanceSalaryRequest(userId: string, requestId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/advance_salaryRequests/${userId}/${requestId}`, { headers: this.headers });
    }
}
