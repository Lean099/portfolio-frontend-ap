import { Component, OnInit } from '@angular/core';
import { Skill } from 'src/app/others/interfaces';
import { SkillApiService } from 'src/app/services/skill-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

interface Data{
  id: string|null
  idUser: string|null
  skillName: string
  percentage: any
  edit: boolean
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  edit : boolean = false
  skill : string = "Skill 0"
  value : any = 50
  //width = this.value + "%" se puede borrar
  min : number = 0
  max : number = 100

  data : Array<Data> = [
    { id: "a", idUser: "1", skillName: "Java", percentage: 70, edit: false },
    { id: "b", idUser: "1", skillName: "Golang", percentage: 40, edit: false },
    { id: "c", idUser: "1", skillName: "Typescript", percentage: 90, edit: false }
    //{ id: "", value: 40, skillName: "Golang", edit: false },
    //{ id: 3, value: 90, skillName: "JavaScript", edit: false }
  ]

  userSkill : Array<any> = [];

  constructor(
    private _user : UserApiService,
    private _skill : SkillApiService
  )
  {
    /*this._user.defaultDataUser$.subscribe(defaultData => {
      if(this.userSkill.length>0){
        return;
      }else{
        this.userSkill = defaultData?.skill as Array<Skill>
      }
    })
    this._skill.allUserSkill$.subscribe(allSkill => {
      let skills = allSkill as any[]
      if(allSkill!=null && allSkill.length>0){
        for (let index = 0; index < skills.length; index++) {
          skills[index].edit = false;
        }
        this.userSkill = skills;
      }
      this.userSkill = skills;
    })*/
  }
  
  ngOnInit(){}

  toggleEdit(id : string|null) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

}
