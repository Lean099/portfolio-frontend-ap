import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../environments/environment'
import { DefaultUser, User } from '../others/interfaces';

interface UserPersonalInfo{
      firstname: string|null,
      lastname: string|null,
      dob: string|Date|null,
      phone: string|null,
      about: string|null,
      githubUrl: string|null,
      linkedinUrl: string|null
}

interface Credentials{
  email: string|null
  password: string|null
}

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
    console.log(this.defaultDataUser.getValue())
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
    console.log("Dentro del getUser:", this.idLoggedUser, this.accesstoken)
    return this._http.get(`${this.apiUrl}/api/user/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) }).subscribe(user => this.updateUser(user));
  }

  updatePersonalInformation(userPersonalInfo: UserPersonalInfo) {
    this._http.post(`${this.apiUrl}/api/user/updatePI`,
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
    }) }).subscribe(updatedUser => this.updateUser(updatedUser));
    // Una vez actualize el usuario asi sea un pequeño dato el componente al estar subscripto recibira automaticamente la actualizacion
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
    }) }).subscribe(updatedUser => this.updateUser(updatedUser));
  }
    // Una vez actualize el usuario asi sea un pequeño dato el componente al estar subscripto recibira automaticamente la actualizacion
}
