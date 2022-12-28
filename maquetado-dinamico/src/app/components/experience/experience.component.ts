import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

interface Data{
  id: number
  empresa: string
  puesto: string
  edit: boolean
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent implements OnInit {

  edit : boolean = false;
  imageUrl : string = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
  data : Array<Data> = [
    { id: 1, empresa: "Empresa", puesto: "Puesto...", edit: false },
    { id: 2, empresa: "Empresa", puesto: "Puesto...", edit: false }
  ]
  date : any = null
  
  constructor(){}
  
  ngOnInit(){}

  toggleEdit(id : number) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

}
