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
      if(loginData.isLogged){
        this.getAllUserEducation()
      }
    })
  }

  updateAllUserEducation(allEducation: Array<Education>){
    this.allUserEducation.next(allEducation);
  }

  createEducation(newEducation: Education) {
    return this._http.post(`${this.apiUrl}/api/education/create/${this.idLoggedUser}`, 
    {
      institution: newEducation.institution,
      degree: newEducation.degree,
      enddate: newEducation.enddate,
      idPicture: null
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(newEducationSaved=>{
      this.allUserEducation.value?.push(newEducationSaved as Education)
      this.updateAllUserEducation(this.allUserEducation.value as Array<Education>)
    });
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

  updateEducation(idEducation: string, newDataEducation: Education){
    return this._http.post(`${this.apiUrl}/api/education/update/${idEducation}`, 
    {
      institution: newDataEducation.institution,
      degree: newDataEducation.degree,
      enddate: newDataEducation.enddate
    }, { headers: new HttpHeaders({'Content-Type':  'application/json', Authorization: `Bearer ${this.accesstoken}`}) }).subscribe(updatedEducation=>{
      let e = updatedEducation as Education
      if(this.allUserEducation.value){
        for (let index = 0; index < this.allUserEducation.value?.length; index++) {
          if(this.allUserEducation.value[index].id === e.id){
            this.allUserEducation.value[index].institution = e.institution
            this.allUserEducation.value[index].degree = e.degree
            this.allUserEducation.value[index].enddate = e.enddate
            break;
          }
        }
      }
      this.updateAllUserEducation(this.allUserEducation.value as Array<Education>)
    });
  }

  deleteEducation(idEducation: string) {
    return this._http.delete(`${this.apiUrl}/api/education/delete/${idEducation}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(message =>{
      let index = this.allUserEducation.value?.findIndex(obj => obj.id===idEducation)
      if(index!==-1){
        this.updateAllUserEducation(this.allUserEducation.getValue()?.filter(obj => obj.id!==idEducation) as Array<Education>)
      }
    });
  }

}
