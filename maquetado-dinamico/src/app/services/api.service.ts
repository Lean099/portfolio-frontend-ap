import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { environment } from '../environments/environment'
import { LoginResponse, User } from '../others/interfaces'

// npm run ng serve -- --host=0.0.0.0 --disable-host-check

interface LoginData {
  accessToken : string
  idUser : string
  isLogged : boolean
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL = environment.apiUrl;
  private loginData = new BehaviorSubject<LoginData>({ accessToken: "", idUser: "", isLogged: false});
  loginData$ = this.loginData.asObservable();
  //userIsLoggedChange : Subject<boolean> = new Subject<boolean>();

  constructor(
    private _http : HttpClient
  ){
    //this.userIsLoggedChange.subscribe((value)=>{
      //this.loginData.isLogged = value
    //})
  }

  updateLoginData(newLoginData : any){
    this.loginData.next(newLoginData)
  }

  login(email: string, password: string) {
    console.log(email, password)
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      })
    };
    const body = new HttpParams()
    .set('username', email)
    .set('password', password);
    this._http.post<LoginResponse>(`${this.apiURL}/login`,
                                   body.toString(),
                                   httpOptions)
                                   .subscribe(response => { this.updateLoginData({ accessToken: response.access_token, idUser: response.id_user, isLogged: true}) })
      console.log(this.loginData.getValue())
  }

  logout(){
    console.log("Justo antes de logout:", this.loginData.getValue())
    this.updateLoginData({accessToken: "", idUser: "", isLogged: false})
    console.log("Despues de logout:", this.loginData.getValue())
  }


}
