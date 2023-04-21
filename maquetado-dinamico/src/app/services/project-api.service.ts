import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Project } from '../others/interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private allUserProject = new BehaviorSubject<Array<Project>|null>(null);
  allUserProject$ = this.allUserProject.asObservable()
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    })
  };

  constructor(
    private _http : HttpClient,
    private _api : ApiService
  )
  { 
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
    })
  }

  updateAllUserProject(allProject: Array<Project>){
    this.allUserProject.next(allProject);
  }

  createProject(newProject : Project) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/project/create/${this.idLoggedUser}`,
    {
      name: newProject.name,
      description: newProject.description,
      linkGithub: newProject.linkGithub,
      linkProject: newProject.linkProject
    }, this.httpOptions);
  }
  
  getAllUserProject() {
    return this._http.get(`${this.apiUrl}/api/project/all/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(allProject => this.updateAllUserProject(allProject as Array<Project>));
  }

  getSingleProject(idProject: string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/project/${idProject}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  updateProject(idProject: string, newDataProject: Project) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/project/update/${idProject}`,
    {
      name: newDataProject.name,
      description: newDataProject.description,
      linkGithub: newDataProject.linkGithub,
      linkProject: newDataProject.linkProject
    }, this.httpOptions);
  }

  deleteProject(idProject: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/project/delete/${idProject}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
