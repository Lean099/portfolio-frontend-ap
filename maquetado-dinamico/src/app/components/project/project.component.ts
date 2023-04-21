import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/others/interfaces';
import { ProjectApiService } from 'src/app/services/project-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  // Los links tienen que tener el https:// sino en la tag <a> no funcionan, simplemente pongamos las url completas y no lo compliquemos tanto
  data : Array<any> = [
    { id: "a", idUser: "1", name: "Proyecto 1", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false },
    { id: "b", idUser: "1", name: "Proyecto 2", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false },
    { id: "c", idUser: "1", name: "Proyecto 1", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", linkGithub: "http://www.google.com", linkProject: "http://www.google.com", edit: false }
    //{ id: 2, nameProject: "Proyecto 2", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", edit: false }
  ]

  userProject : Array<any> = []

  constructor(
    private _user : UserApiService,
    private _project : ProjectApiService
  )
  {
    /*this._user.defaultDataUser$.subscribe(defaultData => {
      if(this.userProject.length>0){
        return;
      }else{
        this.userProject = defaultData?.project as Array<Project>
      }
    })
    this._project.allUserProject$.subscribe(allProject => {
      let project = allProject as any[]
      if(allProject!=null && allProject.length>0){
        for (let index = 0; index < project.length; index++) {
          project[index].edit = false
        }
      }
    })*/
  }
  
  ngOnInit(){}

  toggleEdit(id: string|null) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

}
