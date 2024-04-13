import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from 'app/Model/session';
import { ExitPermissionDemande,ExitPermissionCount , ExitPermissionDetails } from 'app/Model/exitPermission';
import { ApiResponse } from 'app/Model/apiresponse';

@Injectable({
  providedIn: 'root'
})

export class ExitPermissionService {

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

  addExitPermission(companyID: string, exitPermission: ExitPermissionDemande): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exit_permission/${companyID}`, exitPermission , { headers: this.headers });
  }

  getAllExitPermissionsByUser(userID: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/exit_permission/user/${userID}`, { headers: this.headers });
  }

  getAllExitPermissionsByCompany(companyID: string, page : number , limit : number): Observable<ApiResponse> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<ApiResponse>(`${this.apiUrl}/exit_permission/company/${companyID}?page=${page}&limit=${limit}`, { params: params, headers: this.headers });
  }

  getExitPermissionCountByUser(userID: string): Observable<ExitPermissionCount> {
    return this.http.get<ExitPermissionCount>(`${this.apiUrl}/exit_permission/${userID}/count`, { headers: this.headers });
  }

  getExitPermissionCountByCompany(companyID: string): Observable<ExitPermissionCount> {
    return this.http.get<ExitPermissionCount>(`${this.apiUrl}/exit_permission/count/${companyID}`, { headers: this.headers });
  }

  getExitPermission(userID: string, exitPermissionID: string): Observable<ExitPermissionDetails> {
    return this.http.get<ExitPermissionDetails>(`${this.apiUrl}/exit_permission/${userID}/${exitPermissionID}`, { headers: this.headers });
  }

  updateExitPermission(userID: string, exitPermissionID: string, exitPermission: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/exit_permission/${userID}/${exitPermissionID}`, exitPermission, { headers: this.headers });
  }

  deleteExitPermission(userID: string, exitPermissionID: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/exit_permission/${userID}/${exitPermissionID}`, { headers: this.headers });
  }
}
