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
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(newSkillSaved =>{
      this.allUserSkill.value?.push(newSkillSaved as Skill)
      this.updateAllUserSkill(this.allUserSkill.value as Array<Skill>)
    })
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
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(updatedSkill =>{
      let s = updatedSkill as Skill
      if(this.allUserSkill.value){
        for (let index = 0; index < this.allUserSkill.value?.length; index++) {
          if(this.allUserSkill.value[index].id === s.id){
            this.allUserSkill.value[index].skillName = s.skillName
            this.allUserSkill.value[index].percentage = s.percentage
            break;
          }
        }
      }
      this.updateAllUserSkill(this.allUserSkill.value as Array<Skill>)
    });
  }

  deleteSkill(idSkill: string){
    return this._http.delete(`${this.apiUrl}/api/skill/delete/${idSkill}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(message => {
      let index = this.allUserSkill.value?.findIndex(obj => obj.id === idSkill)
      if(index!==-1){
        this.updateAllUserSkill(this.allUserSkill.getValue()?.filter(obj => obj.id!==idSkill) as Array<Skill>)
      }
    });
  }

}
