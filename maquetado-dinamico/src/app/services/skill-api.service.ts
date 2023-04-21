import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../environments/environment';
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

  updateAllUserSkill(allSkill : Array<Skill>){
    this.allUserSkill.next(allSkill);
  }

  createSkill(newSkill: Skill) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/skill/create/${this.idLoggedUser}`,
    {
      skillName: newSkill.skillName,
      percentage: newSkill.percentage
    }, this.httpOptions);
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

  updateSkill(idSkill: string, newDataSkill: Skill) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/skill/update/${idSkill}`,
    {
      skillName: newDataSkill.skillName,
      percentage: newDataSkill.percentage
    }, this.httpOptions);
  }

  deleteSkill(idSkill: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/skill/delete/${idSkill}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
