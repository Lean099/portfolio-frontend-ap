import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment'
import { Credentials, DefaultUser, User, UserPersonalInfo } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private apiUrl : string = environment.apiUrl;
  private defaultUserId : string = environment.defaultUserId;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private defaultDataUser = new BehaviorSubject<DefaultUser|null>(null);
  defaultDataUser$ = this.defaultDataUser.asObservable();
  private user = new BehaviorSubject<User|null>(null);
  user$ = this.user.asObservable();
  
  constructor(
    private _http : HttpClient,
    private _api : ApiService
  ) 
  { 
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
      if(loginData.isLogged){
        this.getUser()
      }
    })
  }

  updateDefaultDataUser(newUpdateDataUser: DefaultUser){
    this.defaultDataUser.next(newUpdateDataUser)
  }

  updateUser(newUser: any){
    this.user.next(newUser)
  }

  getDefaultUserData(){
    this._http.get(`${this.apiUrl}/api/user/defaultUser/${this.defaultUserId}`)
    .subscribe(defaultUser => this.updateDefaultDataUser(defaultUser as DefaultUser))
  }

  createUser(email: string, password: string) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/user/create`,
    {
      firstname: null,
      lastname: null,
      email: email,
      password: password,
      about: null,
      dob: null,
      address: null,
      idProfilePicture: null,
      idBannerPicture: null
    }, { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) });
  }

  getUser(){
    return this._http.get(`${this.apiUrl}/api/user/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(user => this.updateUser(user));
  }

  updatePersonalInformation(userPersonalInfo: UserPersonalInfo) {
    return this._http.post(`${this.apiUrl}/api/user/updatePI`,
    {
      id: this.idLoggedUser,
      firstname: userPersonalInfo.firstname,
      lastname: userPersonalInfo.lastname,
      dob: userPersonalInfo.dob,
      phone: userPersonalInfo.phone,
      about: userPersonalInfo.about,
      githubUrl: userPersonalInfo.githubUrl,
      linkedinUrl: userPersonalInfo.linkedinUrl
    }, { headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo actualizar la informacion de usuario'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
     
  }

  updateEmailAndPassword(credentials: Credentials){
    return this._http.post(`${this.apiUrl}/api/user/updateEP`,
    {
      id: this.idLoggedUser,
      email: credentials.email,
      password: credentials.password
    }, { headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo actualizar las credenciales del usuario'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
    
  }
  
}
