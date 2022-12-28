import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  data : Array<any> = [
    { id: 1, nameProject: "Proyecto 1", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", edit: false },
    { id: 2, nameProject: "Proyecto 2", description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.", edit: false }
  ]

  constructor(){}
  
  ngOnInit(){}

  toggleEdit(id: number) : void {
    let value = this.data.find(el => el.id===id).edit
    this.data.find(el => el.id===id).edit = !value
  }

}
