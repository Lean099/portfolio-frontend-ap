import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, onErrorResumeNext, catchError, throwError } from 'rxjs';
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
  error: any

  constructor(
    private _http : HttpClient
  ){ }

  updateLoginData(newLoginData : any){
    this.loginData.next(newLoginData)
  }

  login(email: string, password: string) : Observable<any> {
    console.log(email, password)
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      })
    };
    const body = new HttpParams()
    .set('username', email)
    .set('password', password);
    /*this._http.post<LoginResponse>(`${this.apiURL}/login`,
                                   body.toString(),
                                   httpOptions)
                                   .subscribe(response => { 
                                      this.updateLoginData({ accessToken: response.access_token, idUser: response.id_user, isLogged: true})
                                   })*/
    return this._http.post<LoginResponse>(`${this.apiURL}/login`,
                                   body.toString(),
                                   httpOptions).pipe(
                                    catchError((error: HttpErrorResponse)=>{
                                      if (error.status === 403) {
                                        return throwError(()=> new Error('Email o Contraseña incorrectos.'));
                                      } else if (error.status >= 400 && error.status < 500) {
                                        return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
                                      } else {
                                        return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
                                      }
                                    })
                                   )
                                   /*.subscribe({
                                    next: (response)=> this.updateLoginData({ accessToken: response.access_token, idUser: response.id_user, isLogged: true}),
                                    error: (e)=> { console.log(e); this.error=e }
                                   })*/        
      console.log(this.loginData.getValue())
      /*console.log(this.error)
      if(this.error){
        return this.error
      }*/
  }

  logout(){
    console.log("Justo antes de logout:", this.loginData.getValue())
    this.updateLoginData({accessToken: "", idUser: "", isLogged: false})
    console.log("Despues de logout:", this.loginData.getValue())
  }


}
