// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/Model/user';
import { ApiResponse } from 'app/Model/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
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

  createUser(Companyid: string,user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/${Companyid}`, user, { headers: this.headers });
  }

  getUsers(Companyid: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${Companyid}`, { headers: this.headers });
  }

  getUser(Companyid: string,id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${Companyid}/${id}`, { headers: this.headers });
  }

  updateUser(Companyid: string,id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${Companyid}/${id}`, user, { headers: this.headers });
  }

  deleteUser(Companyid: string,id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${Companyid}/${id}`, { headers: this.headers });
  }
}
