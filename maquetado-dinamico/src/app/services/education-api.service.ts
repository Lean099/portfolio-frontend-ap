import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../environments/environment';
import { Education } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EducationApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private allUserEducation = new BehaviorSubject<Array<Education>|null>(null)
  allUserEducation$ = this.allUserEducation.asObservable()
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

  updateAllUserEducation(allEducation: Array<Education>){
    this.allUserEducation.next(allEducation);
  }

  createEducation(newEducation: Education) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/education/create/${this.idLoggedUser}`, 
    {
      institution: newEducation.institution,
      degree: newEducation.degree,
      enddate: newEducation.enddate,
      idPicture: null
    }, this.httpOptions);
  }

  getAllUserEducation() {
    return this._http.get(`${this.apiUrl}/api/education/all/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(allEducation => this.updateAllUserEducation(allEducation as Array<Education>));
  }

  getSingleEducation(idEducation : string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/education/${idEducation}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  updateEducation(idEducation: string, newDataEducation: Education) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/education/update/${idEducation}`, 
    {
      institution: newDataEducation.institution,
      degree: newDataEducation.degree,
      enddate: newDataEducation.enddate
    }, this.httpOptions);
  }

  deleteEducation(idEducation: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/education/delete/${idEducation}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
