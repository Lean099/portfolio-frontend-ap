import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Work } from 'src/app/others/interfaces';
import { UserApiService } from 'src/app/services/user-api.service';
import { WorkApiService } from 'src/app/services/work-api.service';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { PictureApiService } from 'src/app/services/picture-api.service';
import { MyErrorStateMatcher } from 'src/app/others/configs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {

  image = "https://res.cloudinary.com/lean99/image/upload/v1680901576/Ap/No_Image_Available_ivbumq.jpg"
  
  isLogged : boolean = false;
  userWork : Array<any> = [];

  companyFormControl = new FormControl('', [Validators.required]);
  jobFormControl = new FormControl('', [Validators.required]);
  range = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  });

  inputFile : any

  matcher = new MyErrorStateMatcher()
  
  constructor(
    private _user : UserApiService,
    private _work : WorkApiService,
    private _picture : PictureApiService,
    private _api : ApiService
  )
  {
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      if(defaultData!=null){
        this.userWork = defaultData?.work as Array<any>
      }
    })
    this._work.allUserWork$.subscribe(allWork => {
      let works = allWork as any[]
      if(works!=null){
        for (let index = 0; index < works.length; index++) {
          works[index].edit = false;
        }
        this.userWork = works
        this.clearInputs()
      }
      return;
    })
  }
  
  toggleEdit(id : string|null) : void {
    let value = this.userWork.find(el => el.id===id)!.edit
    this.userWork.find(el => el.id===id)!.edit = !value
    if(!value){
      let obj = this.userWork.find(el => el.id===id)
      this.companyFormControl.setValue(obj.company as string)
      this.jobFormControl.setValue(obj.job as string)
      this.range.controls.start.setValue(obj.startdate)
      this.range.controls.end.setValue(obj.enddate)
    }else{
      this.clearInputs()
    }
  }

  clearInputs(){
    this.companyFormControl.reset()
    this.jobFormControl.reset()
    this.range.reset()
  }

  addNewExperience(){
    let newWork : Work = {
      id: null,
      idUser: null,
      company: this.companyFormControl.getRawValue(),
      job: this.jobFormControl.getRawValue(),
      startdate: moment(this.range.get('start')?.value).toDate(),
      enddate: moment(this.range.get('end')?.value).toDate(),
      idPicture: null
    }
    this._work.createWork(newWork);
    this.clearInputs()
  }

  editWork(idWork : string){
    const newDataWork : Work  = {
      company: this.companyFormControl.dirty ? this.companyFormControl.getRawValue() : null,
      job: this.jobFormControl.dirty ? this.jobFormControl.getRawValue() : null,
      startdate: this.range.controls.start.dirty ? moment(this.range.get('start')?.value).toDate() : null,
      enddate: this.range.controls.end.dirty ? moment(this.range.get('end')?.value).toDate() : null,
      id: null,
      idUser: null,
      idPicture: null
    }
    this._work.updateWork(idWork, newDataWork)
  }

  deleteWork(idWork : string){
    this._work.deleteWork(idWork)
  }

  onFileSelected(event: any): void {
    this.inputFile = event.target.files[0];
  }

  resetInputFile(){
    const fileInput = document.getElementById('fileInputExperience') as HTMLInputElement;
    fileInput.value = '';
    this.inputFile = null
  }

  updateWorkImage(idEntity: string){
    this._picture.uploadPicture('work', this.inputFile, idEntity);
  }

  deleteWorkImage(idEntity: string){
    this._picture.deletePicture('work', idEntity)
  }

}
