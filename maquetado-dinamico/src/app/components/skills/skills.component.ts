import { Component, OnInit } from '@angular/core';

interface Data{
  id: number
  value: any
  skillName: string
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
    { id: 1, value: 70, skillName: "Java", edit: false },
    { id: 2, value: 40, skillName: "Golang", edit: false },
    { id: 3, value: 90, skillName: "JavaScript", edit: false }
  ]

  constructor(){}
  
  ngOnInit(){}

  toggleEdit(id : number) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

}
