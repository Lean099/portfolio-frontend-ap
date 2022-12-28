import { Component, OnInit} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { UserService } from 'src/app/services/user.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } // Y esto, en html no se agrego nada
  ]
})
export class AppComponent implements OnInit{

  private isLogged : boolean;
  
  constructor(
    public _User : UserService
  ){
    this.isLogged = _User.user.isLogged
  }

  ngOnInit(){
    console.log(this.isLogged)
  }

}
