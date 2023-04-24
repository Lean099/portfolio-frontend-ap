import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/others/configs';
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
  aboutContent : string|null = null;

  aboutFormControl = new FormControl('', [Validators.required])

  matcher = new MyErrorStateMatcher()

  constructor(
    private _api : ApiService,
    private _user : UserApiService
  )
  {
    this._api.loginData$.subscribe(logData => this.isLogged=logData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      if(defaultData!=null){
        this.aboutContent = defaultData.userData?.about as string
      }
    })
    this._user.user$.subscribe(user => {
      this.aboutContent = user?.about as string
      if(this.edit){
        this.aboutFormControl.reset()
        this.toggleEdit()
      }
    })
  }
  
  ngOnInit(){}

  toggleEdit(){
    this.edit = !this.edit
    if(this.edit){
      this.aboutFormControl.setValue(this.aboutContent)
    }else{
      this.aboutFormControl.reset()
    }
  }

  updateAbout(){
    const newAbout = {
      firstname: null,
      lastname: null,
      dob: null,
      phone: null,
      about: this.aboutFormControl.dirty ? this.aboutFormControl.getRawValue() : null,
      //about: this.aboutContent as string,
      githubUrl: null,
      linkedinUrl: null
    }
    this._user.updatePersonalInformation(newAbout);
  }

}
