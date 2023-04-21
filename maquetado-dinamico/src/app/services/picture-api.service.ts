import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiService } from './api.service';
import { Education, Picture, Work } from '../others/interfaces';
import { WorkApiService } from './work-api.service';
import { EducationApiService } from './education-api.service';
import { UserApiService } from './user-api.service';

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

  allUserWork : Work[] = []
  allUserEducation : Education[] = []

  constructor(
    private _http : HttpClient,
    private _api : ApiService,
    private _user : UserApiService,
    private _work : WorkApiService,
    private _education : EducationApiService
  )
  {
    this._api.loginData$.subscribe(loginData => { 
      this.accesstoken = loginData.accessToken
      this.idLoggedUser = loginData.idUser
    })
    this._work.allUserWork$.subscribe(allWork =>{
      this.allUserWork = allWork as Work[]
    })
    /*this._education.allUserEducation$.subscribe(allEducation =>{
      this.allUserEducation = allEducation as Education[]
    })*/
  }

  updateBannerAndProfilePicture(bannerAndProfilePicture: Array<Picture>){
    this.bannerAndProfilePicture.next(bannerAndProfilePicture);
  }

  // Al parecer no hace falta configurar el content-type en el header porque el navegador lo hace por nosotros
  // entonces solo paso el token
  // el idEntity podra venir null o con el id, todo depende del tipo de picture
  uploadPicture(typePicture: string, file: File, idEntity: string|null){
    const formData = new FormData();
    formData.append("file", file);
    if(idEntity!=null){
      formData.append('idEntity', idEntity);
    }
    return this._http.post(`${this.apiUrl}/api/picture/upload/${this.idLoggedUser}/${typePicture}`,
    formData, 
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(data => {
      console.log(data)
      if(idEntity!=null){
        if(typePicture=='work'){
          this._work.getSingleWork(idEntity).subscribe(work =>{
            let index = this.allUserWork?.findIndex(obj => obj.id === work.id)
            if(index!=-1){
              this.allUserWork[index].idPicture = work.idPicture
              console.log(this.allUserWork)
              this._work.updateAllUserWork(this.allUserWork)
            }
          })
        }else{
          this._education.getSingleEducation(idEntity).subscribe(education =>{
            let index = this.allUserEducation.findIndex(obj => obj.id === education.id)
            if(index!=-1){
              this.allUserEducation[index].idPicture = education.idPicture
              this._education.updateAllUserEducation(this.allUserEducation)
            }
            
          })
        }
      }else{
        this._user.getUser()
      }
    })
  }

  getPicture(idPicture: string) : Observable<any>{
    return this._http.get(`${this.apiUrl}/api/picture/findOne/${idPicture}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) });
  }

  getBannerAndProfilePicture() {
    return this._http.get(`${this.apiUrl}/api/picture/profileAndBanner/${this.idLoggedUser}`,
    { headers: new HttpHeaders({ Authorization: `Bearer ${this.accesstoken}` }) })
    .subscribe(bannerAndProfilePicture => this.updateBannerAndProfilePicture(bannerAndProfilePicture as Array<Picture>));
  }

  deletePicture(typePicture: string, idEntity: string|null){
    const options = {
      body: {
        idUser: this.idLoggedUser,
        idEntity: idEntity,
        type: typePicture
      },
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `Bearer ${this.accesstoken}`
      })
    }
    this._http.request('delete', `${this.apiUrl}/api/picture/delete`, options).subscribe(res =>{
      if(idEntity!=null){
        if(typePicture=='work'){
          this._work.getSingleWork(idEntity).subscribe(work =>{
            let index = this.allUserWork.findIndex(obj => obj.id === work.id)
            if(index!=-1){
              this.allUserWork[index].idPicture = work.idPicture;
              this._work.updateAllUserWork(this.allUserWork)
            }
          })
        }else{
          this._education.getSingleEducation(idEntity).subscribe(education =>{
            let index = this.allUserEducation.findIndex(obj => obj.id === education.id)
            if(index!=-1){
              this.allUserEducation[index].idPicture = education.idPicture
              this._education.updateAllUserEducation(this.allUserEducation)
            }
          })
        }
      }else{
        this._user.getUser()
      }
    })
    //return this._http.delete(`${this.apiUrl}/api/picture/delete`, {});
  }

}
