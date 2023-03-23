import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';
import { Picture } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PictureApiService {

  private apiUrl : string = environment.apiUrl;
  private accesstoken : string = "";
  private idLoggedUser : string = "";
  private bannerAndProfilePicture = new BehaviorSubject<Array<Picture>|null>(null);
  bannerAndProfilePicture$ = this.bannerAndProfilePicture.asObservable();
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
    })
  }

  uploadBannerAndProfilePicture(bannerAndProfilePicture: Array<Picture>){
    this.bannerAndProfilePicture.next(bannerAndProfilePicture);
  }

  // Al parecer no hace falta configurar el content-type en el header porque el navegador lo hace por nosotros
  // entonces solo paso el token
  // el idEntity podra venir null o con el id, todo depende del tipo de picture
  uploadPicture(typePicture: string, file: File, idEntity: string) : Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idEntity', idEntity);
    return this._http.post(`${this.apiUrl}/api/picture/upload/${this.idLoggedUser}/${typePicture}`,
    formData, 
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  getPicture(idPicture: string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/picture/findOne/${idPicture}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  getBannerAndProfilePicture() {
    return this._http.get(`${this.apiUrl}/api/picture/profileAndBanner/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(bannerAndProfilePicture => this.uploadBannerAndProfilePicture(bannerAndProfilePicture as Array<Picture>));
  }

  deletePicture(typePicture: string, idEntity: string) : Observable<any>{
    const options = {
      body: {
        idUser: this.idLoggedUser,
        idEntity: idEntity,
        type: typePicture
      },
      headers: this.httpOptions.headers
    }
    return this._http.request('delete', `${this.apiUrl}/api/picture/delete`, options);
    //return this._http.delete(`${this.apiUrl}/api/picture/delete`, {});
  }

}
