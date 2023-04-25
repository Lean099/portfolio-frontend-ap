import { Component, OnInit} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { UserApiService } from 'src/app/services/user-api.service';

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
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AppComponent implements OnInit{

  constructor(
    public _user : UserApiService
  ){ }

  ngOnInit(){
    this._user.getDefaultUserData()
  }

}
