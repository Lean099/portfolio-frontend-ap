import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/others/configs';
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

  // Los links tienen que tener el https:// sino en la tag <a> no funcionan, simplemente pongamos las url completas y no lo compliquemos tanto
  data : Array<any> = [
    { id: "a", idUser: "1", name: "Proyecto 1", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false },
    { id: "b", idUser: "1", name: "Proyecto 2", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false },
    { id: "c", idUser: "1", name: "Proyecto 1", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false }
    //{ id: 2, nameProject: "Proyecto 2", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", edit: false }
  ]

  isLogged : boolean = false;
  userProject : Array<any> = []

  forms = new FormGroup({
    nameFormControl: new FormControl('', [Validators.required]),
    descriptionFormControl: new FormControl('', [Validators.required]),
    linkGithubFormControl: new FormControl(''),
    linkProjectFormControl: new FormControl('')
  })

  matcher = new MyErrorStateMatcher()

  constructor(
    private _api : ApiService,
    private _user : UserApiService,
    private _project : ProjectApiService
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
      this.forms.controls.linkGithubFormControl.setValue(obj.linkGithub as string)
      this.forms.controls.linkProjectFormControl.setValue(obj.linkProject as string)
    }else{
      this.clearInputs()
    }
  }

  clearInputs(){
    this.forms.reset()
  }

  addNewProject(){
    let newProject : Project = {
      id: null,
      idUser: null,
      name: this.forms.controls.nameFormControl.getRawValue(),
      description: this.forms.controls.descriptionFormControl.getRawValue(),
      linkGithub: this.forms.controls.linkGithubFormControl.getRawValue(),
      linkProject: this.forms.controls.linkProjectFormControl.getRawValue()
    }
    this._project.createProject(newProject)
    this.clearInputs()
  }

  editProject(idProject: string){
    const newDataProject : Project = {
      id: null,
      idUser: null,
      name: this.forms.controls.nameFormControl.dirty ? this.forms.controls.nameFormControl.getRawValue() : null,
      description: this.forms.controls.descriptionFormControl.dirty ? this.forms.controls.descriptionFormControl.getRawValue() : null,
      linkGithub: this.forms.controls.linkGithubFormControl.dirty ? this.forms.controls.linkGithubFormControl.getRawValue() : null,
      linkProject: this.forms.controls.linkProjectFormControl.dirty ? this.forms.controls.linkProjectFormControl.getRawValue() : null
    }
    this._project.updateProject(idProject, newDataProject)
  }

  deleteProject(idProject: string){
    this._project.deleteProject(idProject)
  }

}
