import { Component, OnInit} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ApiService } from 'src/app/services/api.service';
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
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } // Y esto, en html no se agrego nada
  ]
})
export class AppComponent implements OnInit{

  private data : any;
  
  constructor(
    public _api : ApiService,
    public _user : UserApiService
  ){
    this._user.defaultDataUser$.subscribe(defaultData => {
      console.log(defaultData)
    })
  }

  ngOnInit(){
    this._api.loginData$.subscribe(data => this.data = data)
    console.log(this.data)
    this._user.getDefaultUserData() //Lo comentaremos por ahora
  }

}
