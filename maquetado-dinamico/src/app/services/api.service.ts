import { Injectable } from '@angular/core';
import { LoginResponse } from '../others/interfaces'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api_url : string = 'www.miapidespringboot.com'

  constructor(
    //private _http : HttpClient
  ){}

  login(username : string, password: string) : LoginResponse {
    password = btoa(password) // Esto le da una pequeña encriptacion (que no es segura)
    //return this._http.post<LoginResponse>(`{this.api_url}/login`, { username: username, password: password })
    return { success: true, user: { _id: '1', username: 'Leandro', password: '123', avatar: 'foto', isLogged: true }, token: 'mytoken' }
  }

}
