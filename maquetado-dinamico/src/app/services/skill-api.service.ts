import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Skill } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SkillApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private allUserSkill = new BehaviorSubject<Array<Skill>|null>(null);
  allUserSkill$ = this.allUserSkill.asObservable();

  constructor(
    private _http : HttpClient,
    private _api : ApiService
  ) 
  { 
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
      if(loginData.isLogged){
        this.getAllUserSkill()
      }
    })
  }

  updateAllUserSkill(allSkill : Array<Skill>){
    this.allUserSkill.next(allSkill);
  }

  createSkill(newSkill: Skill){
    return this._http.post(`${this.apiUrl}/api/skill/create/${this.idLoggedUser}`,
    {
      skillName: newSkill.skillName,
      percentage: newSkill.percentage
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo crear nueva habilidad'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )

  }

  getAllUserSkill() {
    return this._http.get(`${this.apiUrl}/api/skill/all/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(allSkill => this.updateAllUserSkill(allSkill as Array<Skill>));
  }

  getSingleSkill(idSkill: string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/skill/${idSkill}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  updateSkill(idSkill: string, newDataSkill: Skill){
    return this._http.post(`${this.apiUrl}/api/skill/update/${idSkill}`,
    {
      skillName: newDataSkill.skillName,
      percentage: newDataSkill.percentage
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo editar la habilidad'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
  }

  deleteSkill(idSkill: string){
    return this._http.delete(`${this.apiUrl}/api/skill/delete/${idSkill}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo eliminar la habilidad'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
  }

}
