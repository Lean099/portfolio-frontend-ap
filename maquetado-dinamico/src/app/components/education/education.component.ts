import { Component, OnInit } from '@angular/core';

interface Data{
  id: number
  college: string
  degree: string
  edit: boolean
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  edit : boolean = false;
  uni : string = "Universidad";
  titulo : string = "Titulo";
  data : Array<Data> = [
    { id: 1, college: "Universidad", degree: "Titulo...", edit: false },
    { id: 2, college: "Universidad", degree: "Titulo...", edit: false },
    { id: 3, college: "Universidad", degree: "Titulo...", edit: false },
  ]

  constructor(){}
  
  ngOnInit(){}

  toggleEdit(id: number) : void {
    let value = this.data.find(el => el.id===id).edit
    this.data.find(el => el.id===id).edit = !value
  }

}
