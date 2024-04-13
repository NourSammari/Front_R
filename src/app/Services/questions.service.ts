import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { UserData } from 'app/Model/session';
import { ApiResponse } from 'app/Model/apiresponse';
import { Question } from 'app/Model/questions';


@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
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


  createQuestion(companyId: string, question: Question): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/questions/${companyId}`, question, { headers: this.headers });
  }

  UploadQuestions(companyId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/questions/${companyId}/upload`, formData, { headers: this.headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error uploading file:', error);
          throw error;
        })
      );
  }


  getQuestions( companyId: string , page : number , limit : number ): Observable<ApiResponse> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());
    return this.http.get<ApiResponse>(`${this.apiUrl}/questions/${companyId}`, { params: params, headers: this.headers });
  }

  getQuestion(companyId: string, questionId: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${companyId}/${questionId}`, { headers: this.headers });
  }

  updateQuestion(companyId: string, questionId: string, question: Question): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/questions/${companyId}/${questionId}`, question, { headers: this.headers });
  }

  deleteQuestion(companyId: string, questionId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/questions/${companyId}/${questionId}`, { headers: this.headers });
  }
}
