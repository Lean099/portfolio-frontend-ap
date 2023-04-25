import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MyErrorStateMatcher } from 'src/app/others/configs';
import { Education } from 'src/app/others/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { EducationApiService } from 'src/app/services/education-api.service';
import { PictureApiService } from 'src/app/services/picture-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {

  image : any = "https://res.cloudinary.com/lean99/image/upload/v1680901576/Ap/No_Image_Available_ivbumq.jpg"

  isLogged : boolean = false;
  userEducation : Array<any> = [];

  forms = new FormGroup({
    institutionFormControl: new FormControl('', [Validators.required]),
    degreeFormControl: new FormControl('', [Validators.required]),
    enddateFormControl: new FormControl('', [Validators.required])
  })

  matcher = new MyErrorStateMatcher()

  inputFile : any

  constructor(
    private _api : ApiService,
    private _user : UserApiService,
    private _education : EducationApiService,
    private _picture : PictureApiService
  )
  {
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      if(defaultData!=null){
        this.userEducation = defaultData?.education as Array<any>
      }
    })
    this._education.allUserEducation$.subscribe(allEducation => {
      let studies = allEducation as any[]
      if(studies!=null){
        for (let index = 0; index < studies.length; index++) {
          studies[index].edit = false;
        }
        this.userEducation = studies
      }
      return;
    })
  }
  
  toggleEdit(id: string|null) : void {
    let value = this.userEducation.find(el => el.id===id)!.edit
    this.userEducation.find(el => el.id===id)!.edit = !value
    if(!value){
      let obj = this.userEducation.find(el => el.id===id)
      this.forms.controls.institutionFormControl.setValue(obj.institution as string)
      this.forms.controls.degreeFormControl.setValue(obj.degree as string)
      this.forms.controls.enddateFormControl.setValue(obj.enddate)
    }else{
      this.clearInputs()
    }
  }

  clearInputs(){
    this.forms.reset()
  }

  addNewEducation(){
    let newEducation : Education = {
      id: null,
      idUser: null,
      institution: this.forms.controls.institutionFormControl.getRawValue(),
      degree: this.forms.controls.degreeFormControl.getRawValue(),
      enddate: moment(this.forms.get('enddateFormControl')?.value).toDate(),
      idPicture: null
    }
    this._education.createEducation(newEducation)
    this.clearInputs()
  }

  editEducation(idEducation: string){
    const newDataEducation : Education = {
      id: null,
      idUser: null,
      institution: this.forms.controls.institutionFormControl.dirty ? this.forms.controls.institutionFormControl.getRawValue() : null,
      degree: this.forms.controls.degreeFormControl.dirty ? this.forms.controls.degreeFormControl.getRawValue() : null,
      enddate: this.forms.controls.enddateFormControl.dirty ? moment(this.forms.get('enddateFormControl')?.value).toDate() : null,
      idPicture: null
    }
    this._education.updateEducation(idEducation, newDataEducation)
  }

  deleteEducation(idEducation: string){
    this._education.deleteEducation(idEducation)
  }

  onFileSelected(event: any): void{
    this.inputFile = event.target.files[0];
  }

  resetInputFile(){
    this.inputFile = null
  }

  updateEducationImage(idEntity: string){
    this._picture.uploadPicture('education', this.inputFile, idEntity)
  }

  deleteEducationImage(idEntity: string){
    this._picture.deletePicture('education', idEntity)
  }

}
