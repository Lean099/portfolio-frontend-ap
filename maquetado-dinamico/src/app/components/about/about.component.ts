import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MyErrorStateMatcher, configForToastr } from 'src/app/others/configs';
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
    private _user : UserApiService,
    private toastr : ToastrService
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

  showError(message: string){
    this.toastr.error(message, '', configForToastr)
  }

  updateAbout(){
    const newAbout = {
      firstname: null,
      lastname: null,
      dob: null,
      phone: null,
      about: this.aboutFormControl.dirty ? this.aboutFormControl.getRawValue() : null,
      githubUrl: null,
      linkedinUrl: null
    }
    this._user.updatePersonalInformation(newAbout).subscribe({
      next: (updatedUser) =>{
        this._user.updateUser(updatedUser)
        this.toastr.success('Se edito acerca del usuario exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

}
