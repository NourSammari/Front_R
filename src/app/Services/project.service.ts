import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CodeProject, ProjectIn } from 'app/Model/project';
import { UserData } from 'app/Model/session';
import { ApiResponse } from 'app/Model/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

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
      console.log("header for project :",this.headers);
    }

  createProject(project: ProjectIn, companyID: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${companyID}`, project,{ headers: this.headers });
  }

  getProjects(companyID: string): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/projects/${companyID}`,{ headers: this.headers });
  }

  getProjectDetails(companyID: string, projectID: string): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/projects/${companyID}/${projectID}`,{ headers: this.headers });
  }

  updateProject(project: ProjectIn, companyID: string, projectID: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${companyID}/${projectID}`, project,{ headers: this.headers });
  }

  deleteProject(companyID: string, projectID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${companyID}/${projectID}`,{ headers: this.headers });
  }

  assignProjectToCandidate(companyID: string, candidateID: string, codeProject: CodeProject): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${companyID}/${candidateID}/assign`, codeProject,{ headers: this.headers });
  }
  
}
