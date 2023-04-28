import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment'
import { ApiService } from './api.service';
import { Work } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WorkApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private allUserWork = new BehaviorSubject<Array<Work>|null>(null)
  allUserWork$ = this.allUserWork.asObservable()

  constructor(
    private _http : HttpClient,
    private _api : ApiService 
  ) 
  { 
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
      if(loginData.isLogged){
        this.getAllUserWork()
      }
    })
  }

  updateAllUserWork(allWorks: Array<Work>){
    this.allUserWork.next(allWorks)
  }

  createWork(newWork: Work) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/work/create/${this.idLoggedUser}`,
    {
      company: newWork.company,
      job: newWork.job,
      startdate: newWork.startdate,
      enddate: newWork.enddate,
      idPicture: null
    }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${this.accesstoken}` }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo crear nueva experiencia'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
  }

  getAllUserWork(){
    return this._http.get(`${this.apiUrl}/api/work/all/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(allWorks => this.updateAllUserWork(allWorks as Array<Work>));
  }

  getSingleWork(idWork : string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/work/${idWork}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  updateWork(idWork: string, newDataWork: Work) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/work/update/${idWork}`,
    {
      company: newDataWork.company,
      job: newDataWork.job,
      startdate: newDataWork.startdate,
      enddate: newDataWork.enddate
    }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${this.accesstoken}` }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo editar la experiencia'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
  }

  deleteWork(idWork: string) {
    return this._http.delete(`${this.apiUrl}/api/work/delete/${idWork}`, 
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo eliminar la experiencia'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
  }

}
