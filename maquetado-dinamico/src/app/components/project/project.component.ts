import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher, configForToastr } from 'src/app/others/configs';
import { Project } from 'src/app/others/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { ProjectApiService } from 'src/app/services/project-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {

  isLogged : boolean = false;
  userProject : Array<any> = []

  forms = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    descriptionFormControl: new FormControl('', [Validators.required]),
    enddateFormControl: new FormControl('', [Validators.required]),
    linkGithubFormControl: new FormControl(''),
    linkProjectFormControl: new FormControl('')
  })

  matcher = new MyErrorStateMatcher()

  constructor(
    private _api : ApiService,
    private _user : UserApiService,
    private _project : ProjectApiService,
    private toastr : ToastrService
  )
  {
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      if(defaultData!=null){
        this.userProject = defaultData?.project as Array<any>
      }
    })
    this._project.allUserProject$.subscribe(allProject => {
      let projects = allProject as any[]
      if(projects!=null){
        for (let index = 0; index < projects.length; index++) {
          projects[index].edit = false
        }
        this.userProject = projects
        this.clearInputs()
      }
      return;
    })
  }
  
  toggleEdit(id: string|null) : void {
    let value = this.userProject.find(el => el.id===id)!.edit
    this.userProject.find(el => el.id===id)!.edit = !value
    if(!value){
      let obj = this.userProject.find(el => el.id===id)
      this.forms.controls.nameFormControl.setValue(obj.name as string)
      this.forms.controls.descriptionFormControl.setValue(obj.description as string)
      this.forms.controls.enddateFormControl.setValue(obj.enddate)
      this.forms.controls.linkGithubFormControl.setValue(obj.linkGithub as string)
      this.forms.controls.linkProjectFormControl.setValue(obj.linkProject as string)
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

  addNewProject(){
    let newProject : Project = {
      id: null,
      idUser: null,
      name: this.forms.controls.nameFormControl.getRawValue(),
      description: this.forms.controls.descriptionFormControl.getRawValue(),
      enddate: moment(this.forms.get('enddateFormControl')?.value).toDate(),
      linkGithub: this.forms.controls.linkGithubFormControl.getRawValue(),
      linkProject: this.forms.controls.linkProjectFormControl.getRawValue()
    }
    this._project.createProject(newProject).subscribe({
      next: (newProjectSaved) =>{
        this.userProject?.push(newProjectSaved as Project)
        this._project.updateAllUserProject(this.userProject as Array<Project>)
        this.toastr.success('Se agrego nuevo proyecto exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    })
    this.clearInputs()
  }

  editProject(idProject: string){
    const newDataProject : Project = {
      id: null,
      idUser: null,
      name: this.forms.controls.nameFormControl.dirty ? this.forms.controls.nameFormControl.getRawValue() : null,
      description: this.forms.controls.descriptionFormControl.dirty ? this.forms.controls.descriptionFormControl.getRawValue() : null,
      enddate: this.forms.controls.enddateFormControl.dirty ? moment(this.forms.get('enddateFormControl')?.value).toDate() : null,
      linkGithub: this.forms.controls.linkGithubFormControl.dirty ? this.forms.controls.linkGithubFormControl.getRawValue() : null,
      linkProject: this.forms.controls.linkProjectFormControl.dirty ? this.forms.controls.linkProjectFormControl.getRawValue() : null
    }
    this._project.updateProject(idProject, newDataProject).subscribe({
      next: (updatedProject) =>{
        let p = updatedProject as Project
        if(this.userProject){
          for (let index = 0; index < this.userProject?.length; index++) {
            if(this.userProject[index].id === p.id){
              this.userProject[index].name = p.name
              this.userProject[index].description = p.description
              this.userProject[index].enddate = p.enddate
              this.userProject[index].linkGithub = p.linkGithub
              this.userProject[index].linkProject = p.linkProject
              break;
            }
          }
        }
        this._project.updateAllUserProject(this.userProject as Array<Project>)
        this.toastr.success('Se edito el proyecto exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  deleteProject(idProject: string){
    this._project.deleteProject(idProject).subscribe({
      next: (res) =>{
        let index = this.userProject?.findIndex(obj => obj.id===idProject)
        if(index!==-1){
          this._project.updateAllUserProject(this.userProject?.filter(obj => obj.id!==idProject) as Array<Project>)
          this.toastr.warning('Se elimino el proyecto exitosamente!', '', configForToastr);
        }
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

}
