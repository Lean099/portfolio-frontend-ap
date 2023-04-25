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
      linkGithub: newProject.linkGithub,
      linkProject: newProject.linkProject
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(newProjectSaved =>{
      this.allUserProject.value?.push(newProjectSaved as Project)
      this.updateAllUserProject(this.allUserProject.value as Array<Project>)
    });
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
      linkGithub: newDataProject.linkGithub,
      linkProject: newDataProject.linkProject
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(updatedProject =>{
      let p = updatedProject as Project
      if(this.allUserProject.value){
        for (let index = 0; index < this.allUserProject.value?.length; index++) {
          if(this.allUserProject.value[index].id === p.id){
            this.allUserProject.value[index].name = p.name
            this.allUserProject.value[index].description = p.description
            this.allUserProject.value[index].linkGithub = p.linkGithub
            this.allUserProject.value[index].linkProject = p.linkProject
            break;
          }
        }
      }
      this.updateAllUserProject(this.allUserProject.value as Array<Project>)
    });
  }

  deleteProject(idProject: string){
    return this._http.delete(`${this.apiUrl}/api/project/delete/${idProject}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(message =>{
      let index = this.allUserProject.value?.findIndex(obj => obj.id===idProject)
      if(index!==-1){
        this.updateAllUserProject(this.allUserProject.getValue()?.filter(obj => obj.id!==idProject) as Array<Project>)
      }
    });
  }

}
