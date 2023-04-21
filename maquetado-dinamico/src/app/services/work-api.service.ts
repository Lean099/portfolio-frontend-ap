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
  private bearerToken : string = `Bearer ${this.accesstoken}`
  private httpOptions = {
    headers: new HttpHeaders()
        .set('Content-Type',  'application/json')
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
        this.getAllUserWork()
      }
    })
  }

  updateAllUserWork(allWorks: Array<Work>){
    this.allUserWork.next(allWorks)
  }

  createWork(newWork: Work){
    return this._http.post(`${this.apiUrl}/api/work/create/${this.idLoggedUser}`,
    {
      company: newWork.company,
      job: newWork.job,
      startdate: newWork.startdate,
      enddate: newWork.enddate,
      idPicture: null
    }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(newWorkSaved => {
      this.allUserWork.value?.push(newWorkSaved as Work);
      this.updateAllUserWork(this.allUserWork.value as Array<Work>)
    });
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

  updateWork(idWork: string, newDataWork: Work){
    return this._http.post(`${this.apiUrl}/api/work/update/${idWork}`,
    {
      company: newDataWork.company,
      job: newDataWork.job,
      startdate: newDataWork.startdate,
      enddate: newDataWork.enddate
    }, { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(updatedWork => {
      let w = updatedWork as Work
      if(this.allUserWork.value){
        for (let index = 0; index < this.allUserWork.value?.length; index++) {
          if(this.allUserWork.value[index].id === w.id){
            this.allUserWork.value[index].company = w.company
            this.allUserWork.value[index].job = w.job
            this.allUserWork.value[index].startdate = w.startdate
            this.allUserWork.value[index].enddate = w.enddate
            break;
          }
        }
      }
      this.updateAllUserWork(this.allUserWork.value as Array<Work>);
    });
  }

  deleteWork(idWork: string) {
    console.log(idWork)
    console.log(this.httpOptions)
    console.log(this.accesstoken)
    return this._http.delete(`${this.apiUrl}/api/work/delete/${idWork}`, 
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(message=>{
      console.log(message)
      let index = this.allUserWork.value?.findIndex(obj => obj.id === idWork)
      console.log("Index:", index)
      if(index !== -1){
        console.log("Entro al if")
        //this.allUserWork.getValue()?.slice(index, 1)
        console.log("Antes del update:", this.allUserWork)
        this.updateAllUserWork(this.allUserWork.getValue()?.filter(obj => obj.id !== idWork) as Work[])
        console.log("Despues del update:", this.allUserWork)
      }
    });
  }

}
