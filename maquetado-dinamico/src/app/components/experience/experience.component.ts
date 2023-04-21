import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { Work } from 'src/app/others/interfaces';
import { UserApiService } from 'src/app/services/user-api.service';
import { WorkApiService } from 'src/app/services/work-api.service';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { PictureApiService } from 'src/app/services/picture-api.service';

interface Data{
  id: string|null
  idUser: string|null
  company: string|null
  job: string|null
  //startDate: Date|null
  //endDate: Date|null
  range: FormGroup
  idPicture: string|null
  edit: boolean
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  image = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
  data : Array<any> = [
    { id: "a", idUser: "1", company: "Empresa", job: "Puesto...", range: new FormGroup({ start: new FormControl<Date | null>(null), end: new FormControl<Date | null>(null)}) , idPicture: null, edit: false },
    { id: "b", idUser: "1", company: "Empresa", job: "Puesto...", range: new FormGroup({ start: new FormControl<Date | null>(null), end: new FormControl<Date | null>(null)}) , idPicture: null, edit: false },
    { id: "c", idUser: "1", company: "Empresa", job: "Puesto...", range: new FormGroup({ start: new FormControl<Date | null>(null), end: new FormControl<Date | null>(null)}), idPicture: null, edit: false }
    //{ id: "b", empresa: "Empresa", puesto: "Puesto...", edit: false }
  ]

  isLogged : boolean = false;
  userWork : Array<any> = []; // Estos quizas termine como un tipo Array<any>

  // New Work
  companyFormControl = new FormControl('', [Validators.required]);
  jobFormControl = new FormControl('', [Validators.required]);
  // Este tampoco no hay que cambiarlo
  range = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  });

  inputFile : any

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private _user : UserApiService,
    private _work : WorkApiService,
    private _picture : PictureApiService,
    private _api : ApiService
  )
  {
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      console.log("Entro al default user data")
      if(defaultData!=null){
        this.userWork = defaultData?.work as Array<any>
        console.log(this.userWork)
      }
    })
    this._work.allUserWork$.subscribe(allWork => {
      console.log("Entro al api work")
      console.log("asdasd ",allWork)
      let works = allWork as any[]
      if(works!=null){
        for (let index = 0; index < works.length; index++) {
          /*if(!works[index].hasOwnProperty('range')){
            works[index].range = new FormGroup({ start: new FormControl<Date | null>(works[index].startdate), end: new FormControl<Date | null>(works[index].enddate)})
            works[index].edit = false;
            delete works[index].startdate
            delete works[index].enddate
          }*/
          works[index].edit = false;
        }
        this.userWork = works
        console.log(this.userWork)
      }
      return;  // Esto podria ser un simple return;
    })
  }
  
  ngOnInit(){}

  // Este metodo no hay que cambiarlo, lo unico que podriamos borrar seria el tipo number del id
  toggleEdit(id : string|null) : void {
    let value = this.userWork.find(el => el.id===id)!.edit
    this.userWork.find(el => el.id===id)!.edit = !value
    if(!value){
      let obj = this.userWork.find(el => el.id===id)
      console.log(obj)
      this.companyFormControl.setValue(obj.company as string)
      this.jobFormControl.setValue(obj.job as string)
      this.range.controls.start.setValue(obj.startdate)
      this.range.controls.end.setValue(obj.enddate)
      //this.range.controls.start.setValue(obj.range.controls.start?.getRawValue())
      //this.range.controls.end.setValue(obj.range.controls.end?.getRawValue())
    }else{
      this.companyFormControl.reset()
      this.jobFormControl.reset()
      this.range.reset()
    }
  }

  toggleEditForDataExample(id : string|null) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

  // Metodo para que despues de cerrar el modal o terminar de crear un work este limpie los inputs
  clearInputs(){
    this.companyFormControl.reset()
    this.jobFormControl.reset()
    this.range.get('start')?.reset()
    this.range.get('end')?.reset()
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
    console.log(newWork)
    this.clearInputs()
  }

  // No olvidar cambiar la referencia al array userWork en this.data.find
  editWork(idWork : string){
    let work = this.userWork.find(el => el.id === idWork)
    console.log(work)
    const newDataWork : Work  = {
      company: this.companyFormControl.dirty ? this.companyFormControl.getRawValue() : null,
      job: this.jobFormControl.dirty ? this.jobFormControl.getRawValue() : null,
      startdate: this.range.controls.start.dirty ? moment(this.range.get('start')?.value).toDate() : null,
      enddate: this.range.controls.end.dirty ? moment(this.range.get('end')?.value).toDate() : null,
      //company: work.company,
      //job: work.job,
      //startdate: moment(work.range.get('start')?.value).toDate(),
      //enddate: moment(work.range.get('end')?.value).toDate(),
      id: null,
      idUser: null,
      idPicture: null
    }
    console.log(newDataWork)
    this._work.updateWork(idWork, newDataWork)
  }

  deleteWork(idWork : string){
    this._work.deleteWork(idWork)
  }

  onFileSelected(event: any): void {
    this.inputFile = event.target.files[0];
  }

  resetInputFile(){
    this.inputFile = null
  }

  updateWorkImage(idEntity: string){
    this._picture.uploadPicture('work', this.inputFile, idEntity);
  }

  deleteWorkImage(idEntity: string){
    this._picture.deletePicture('work', idEntity)
  }

}
