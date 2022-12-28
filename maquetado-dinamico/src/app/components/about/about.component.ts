import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{

  edit : boolean = false;
  aboutContent : string = "Actualmente aprendiendo programacion...";

  constructor(){}
  
  ngOnInit(){}

  toggleEdit() : boolean {
    this.edit = !this.edit
    return this.edit;
  }

}
