import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address } from '../others/interfaces';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private userAddress = new BehaviorSubject<Address|null>(null)
  userAddress$ = this.userAddress.asObservable()
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    })
  };

  constructor(
    private _http : HttpClient,
    private _api : ApiService,
    private _user : UserApiService
  ) 
  {
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
    })
  }

  updateUserAddress(address : Address){
    this.userAddress.next(address);
  }

  createAddress(newAddress: Address) : Observable<any>{
    return this._http.post(`${this.apiUrl}/api/address/create/${this.idLoggedUser}`,
    {
      country: newAddress.country,
      city: newAddress.city,
      province: newAddress.province
    }, { headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    }) });
  }

  // Este esta mal, en vez de pasarle el id del address deberiamos pasarle el id del usuario para me traiga su direccion
  // O podria crear otro endpoint similar en el backend pero que recibe el id del usuario
  getAddress() : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/address/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  // El id del address viene dentro del objeto (newDataAddress) que nos llega por parametro
  updateAddress(newDataAddress: Address){
    return this._http.post(`${this.apiUrl}/api/address/update`,
    {
      id: newDataAddress.id,
      country: newDataAddress.country,
      city: newDataAddress.city,
      province: newDataAddress.province
    }, { headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${this.accesstoken}`
    }) }).subscribe(address => {
      this._user.getUser()
    });
  }

  // Tengo dudas aqui, podria pasarle el id del address o del usuario, la idea es que borre el address del usuario y no el address mismo de su db
  // Lo voy a dejar con el id address por las dudas, quizas mas adelante lo veo
  deleteAddress(idAddress: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/address/delete/${idAddress}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
