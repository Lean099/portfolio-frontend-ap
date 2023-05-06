import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Address } from '../others/interfaces';
import { environment } from '../../environments/environment';
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

  getAddress() : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/address/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

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
    }) }).pipe(
      catchError((error: HttpErrorResponse)=>{
        if (error.status < 400) {
          return throwError(()=> new Error('No se pudo actualizar la direccion del usuario'));
        } else if (error.status >= 400 && error.status < 500) {
          return throwError(()=> new Error('Ocurrió un error en la solicitud: ' + error.error.message));
        } else {
          return throwError(()=> new Error('Ocurrió un error en el servidor: ' + error.message));
        }
      })
     )
  
  }

  deleteAddress(idAddress: string) : Observable<any>{
    return this._http.delete(`${this.apiUrl}/api/address/delete/${idAddress}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

}
