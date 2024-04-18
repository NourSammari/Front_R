import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from 'app/Model/session';
import { ApiResponse } from 'app/Model/apiresponse';
import { CandidatAnswerIn } from 'app/Model/test';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

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

      console.log('Access Token project  :', accessToken);

      this.headers = new HttpHeaders();
      if (accessToken) {
        this.headers = this.headers.set('Authorization', `Bearer ${accessToken}`);
      }
      console.log("header for test : ",this.headers);
    }

  createTest(companyID: string, candidatID: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tests/${companyID}/create/${candidatID}`,null,{ headers: this.headers });
  }

  ReadTests(companyID: string): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/tests/${companyID}`,{ headers: this.headers });
  }

  ReadQuestionsbyTest(companyID: string, testID: string): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/tests/${companyID}/TQuestions/${testID}`,{ headers: this.headers });
  }

  ReadScores(companyID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tests/${companyID}/scores`,{ headers: this.headers });
  }

  ReadTestsList(companyID: string, candidatID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tests/${companyID}/${candidatID}/list`,{ headers: this.headers });
  }

  ReadTestsCount(companyID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tests/{companyID}/count`,{ headers: this.headers });
  }

  UpdateCandidatAnswer(companyID: string, candidatID: string,testID: string,questionID: string , answer :  CandidatAnswerIn): Observable<any> {
    return this.http.put(`${this.apiUrl}/tests/${companyID}/${candidatID}/${testID}/${questionID}`,answer,{ headers: this.headers });
  }

  DeleteTest(companyID: string,testID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tests/${companyID}/${testID}`,{ headers: this.headers });
  }

  ReadTestAnswers(companyID: string, candidatID: string,testID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tests/${companyID}/${candidatID}/${testID}`,{ headers: this.headers });
  }

}
