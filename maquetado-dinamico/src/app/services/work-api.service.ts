import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

  updateAllUserWork(allWorks: Array<Work>){
    this.allUserWork.next(allWorks)
  }

  createWork(newWork: Work) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/work/create/${this.idLoggedUser}`,
    {
      company: newWork.company,
      job: newWork.job,
      startdate: newWork.startDate,
      enddate: newWork.endDate,
      idPicture: null
    }, this.httpOptions);
  }

  // Tendremos que cambiar el backend para este porque no se puede enviar un body con get, solo es con este
  getAllUserWork(){
    return this._http.get(`${this.apiUrl}/api/work/all/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(allWorks => this.updateAllUserWork(allWorks as Array<Work>));
  }

  // Podemos ver la logica de este endpoint del backend para solucionar el endpoint de los getAll
  getSingleWork(idWork : string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/work/${idWork}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  updateWork(idWork: string, newDataWork: Work) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/work/update/${idWork}`,
    {
      company: newDataWork.company,
      job: newDataWork.job,
      startdate: newDataWork.startDate,
      enddate: newDataWork.endDate
    }, this.httpOptions);
  }

  deleteWork(idWork: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/work/delete/${idWork}`, 
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
