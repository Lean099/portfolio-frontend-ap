import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
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

  constructor(
    private _http : HttpClient,
    private _api : ApiService
  )
  { 
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
      if(loginData.isLogged){
        this.getAllUserProject()
      }
    })
  }

  updateAllUserProject(allProject: Array<Project>){
    this.allUserProject.next(allProject);
  }

  createProject(newProject : Project){
    return this._http.post(`${this.apiUrl}/api/project/create/${this.idLoggedUser}`,
    {
      name: newProject.name,
      description: newProject.description,
      enddate: newProject.enddate,
      linkGithub: newProject.linkGithub,
      linkProject: newProject.linkProject
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo crear nuevo proyecto'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
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

  updateProject(idProject: string, newDataProject: Project){
    return this._http.post(`${this.apiUrl}/api/project/update/${idProject}`,
    {
      name: newDataProject.name,
      description: newDataProject.description,
      enddate: newDataProject.enddate,
      linkGithub: newDataProject.linkGithub,
      linkProject: newDataProject.linkProject
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo editar el proyecto'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
  }

  deleteProject(idProject: string){
    return this._http.delete(`${this.apiUrl}/api/project/delete/${idProject}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo eliminar el proyecto'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
  }

}
