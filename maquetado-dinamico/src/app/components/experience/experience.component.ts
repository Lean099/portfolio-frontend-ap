import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Work } from 'src/app/others/interfaces';
import { UserApiService } from 'src/app/services/user-api.service';
import { WorkApiService } from 'src/app/services/work-api.service';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { PictureApiService } from 'src/app/services/picture-api.service';
import { MyErrorStateMatcher, configForToastr } from 'src/app/others/configs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {

  image = environment.defaultElementImage
  
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
    private _api : ApiService,
    private toastr : ToastrService
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

  showError(message: string){
    this.toastr.error(message, '', configForToastr)
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
    this._work.createWork(newWork).subscribe({
      next: (newWorkSaved)=> {
        this.userWork?.push(newWorkSaved as Work);
        this._work.updateAllUserWork(this.userWork as Array<Work>)
        this.toastr.success('Se agrego nueva experiencia exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
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
    this._work.updateWork(idWork, newDataWork).subscribe({
      next: (updatedWork)=>{
        let w = updatedWork as Work
        if(this.userWork){
          for (let index = 0; index < this.userWork?.length; index++) {
            if(this.userWork[index].id === w.id){
              this.userWork[index].company = w.company
              this.userWork[index].job = w.job
              this.userWork[index].startdate = w.startdate
              this.userWork[index].enddate = w.enddate
              break;
            }
          }
        }
        this._work.updateAllUserWork(this.userWork as Array<Work>);
        this.toastr.success('Se edito la experiencia exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  deleteWork(idWork : string){
    this._work.deleteWork(idWork).subscribe({
      next: (message)=>{
        let index = this.userWork?.findIndex(obj => obj.id === idWork)
        if(index !== -1){
          this._work.updateAllUserWork(this.userWork?.filter(obj => obj.id !== idWork) as Work[])
          this.toastr.warning('Se elimino la experiencia exitosamente!', '', configForToastr);
        }
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  onFileSelected(event: any): void {
    this.inputFile = event.target.files[0];
  }

  resetInputFile(inputName: string){
    const fileInput = document.getElementById(inputName) as HTMLInputElement;
    fileInput.value = '';
    this.inputFile = null
  }

  updateWorkImage(idEntity: string){
    this._picture.uploadPicture('work', this.inputFile, idEntity).subscribe({
      next: (res)=>{
        this._work.getSingleWork(idEntity).subscribe(work =>{
          let index = this.userWork?.findIndex(obj => obj.id === work.id)
          if(index!=-1){
            this.userWork[index].idPicture = work.idPicture
            this._work.updateAllUserWork(this.userWork)
            this.toastr.success('Se actualizo la imagen de experiencia exitosamente!', '', configForToastr)
          }
        })
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
  }

  deleteWorkImage(idEntity: string){
    this._picture.deletePicture('work', idEntity).subscribe({
      next: (res)=>{
        this._work.getSingleWork(idEntity).subscribe(work =>{
          let index = this.userWork.findIndex(obj => obj.id === work.id)
          if(index!=-1){
            this.userWork[index].idPicture = work.idPicture;
            this._work.updateAllUserWork(this.userWork)
            this.toastr.warning('Se elimino la imagen de experiencia exitosamente!', '', configForToastr);
          }
        })
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
  }

}
