import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MyErrorStateMatcher, configForToastr } from 'src/app/others/configs';
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

  image : any = environment.defaultElementImage

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
    private _picture : PictureApiService,
    private toastr : ToastrService
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
        this.clearInputs()
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

  showError(message: string){
    this.toastr.error(message, '', configForToastr)
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
    this._education.createEducation(newEducation).subscribe({
      next: (newEducationSaved)=>{
        this.userEducation?.push(newEducationSaved as Education)
        this._education.updateAllUserEducation(this.userEducation as Array<Education>)
        this.toastr.success('Se agrego nueva educacion exitosamente!', '', configForToastr)
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
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
    this._education.updateEducation(idEducation, newDataEducation).subscribe({
      next: (updatedEducation)=>{
        let e = updatedEducation as Education
        if(this.userEducation){
          for (let index = 0; index < this.userEducation?.length; index++) {
            if(this.userEducation[index].id === e.id){
              this.userEducation[index].institution = e.institution
              this.userEducation[index].degree = e.degree
              this.userEducation[index].enddate = e.enddate
              break;
            }
          }
        }
        this._education.updateAllUserEducation(this.userEducation as Array<Education>)
        this.toastr.success('Se edito educacion exitosamente!', '', configForToastr)
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  deleteEducation(idEducation: string){
    this._education.deleteEducation(idEducation).subscribe({
      next: (message)=>{
        let index = this.userEducation?.findIndex(obj => obj.id===idEducation)
        if(index!==-1){
          this._education.updateAllUserEducation(this.userEducation?.filter(obj => obj.id!==idEducation) as Array<Education>)
          this.toastr.warning('Se elimino la educacion exitosamente!', '', configForToastr);
        }
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  onFileSelected(event: any): void{
    this.inputFile = event.target.files[0];
  }

  resetInputFile(inputName: string){
    const fileInput = document.getElementById(inputName) as HTMLInputElement;
    fileInput.value = '';
    this.inputFile = null
  }

  updateEducationImage(idEntity: string){
    this._picture.uploadPicture('education', this.inputFile, idEntity).subscribe({
      next: (res)=>{
        this._education.getSingleEducation(idEntity).subscribe(education =>{
          let index = this.userEducation.findIndex(obj => obj.id === education.id)
          if(index!=-1){
            this.userEducation[index].idPicture = education.idPicture
            this._education.updateAllUserEducation(this.userEducation)
            this.toastr.success('Se actualizo la imagen de educacion exitosamente!', '', configForToastr)
          }
        })
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
  }

  deleteEducationImage(idEntity: string){
    this._picture.deletePicture('education', idEntity).subscribe({
      next: (res)=>{
        this._education.getSingleEducation(idEntity).subscribe(education =>{
          let index = this.userEducation.findIndex(obj => obj.id === education.id)
          if(index!=-1){
            this.userEducation[index].idPicture = education.idPicture
            this._education.updateAllUserEducation(this.userEducation)
            this.toastr.warning('Se elimino la imagen de educacion exitosamente!', '', configForToastr);
          }
        })
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
  }

}
