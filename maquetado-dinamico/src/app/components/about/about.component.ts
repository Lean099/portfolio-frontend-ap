import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit{

  isLogged : boolean = false;
  edit : boolean = false;
  aboutContent : string|null|undefined;

  constructor(
    private _api : ApiService,
    private _user : UserApiService
  )
  {
    this._api.loginData$.subscribe(logData => this.isLogged=logData.isLogged)
    this._user.user$.subscribe(user => this.aboutContent = user?.about)
  }
  
  ngOnInit(){}

  toggleEdit() : boolean {
    this.edit = !this.edit
    return this.edit;
  }

  updateAbout(){
    const newAbout = {
      firstname: null,
      lastname: null,
      dob: null,
      phone: null,
      about: this.aboutContent as string,
      githubUrl: null,
      linkedinUrl: null
    }
    this._user.updatePersonalInformation(newAbout);
  }

}
