import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher, configForToastr } from 'src/app/others/configs';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/others/interfaces';

@Component({
  selector: 'app-header-social-media-bar',
  templateUrl: './header-social-media-bar.component.html',
  styleUrls: ['./header-social-media-bar.component.css']
})
export class HeaderSocialMediaBarComponent {

  isLogged : boolean = false;
  user : User|null = null
  
  forms = new FormGroup({
    emailFormControl : new FormControl('', [Validators.required]),
    passwordFormControl : new FormControl('', [Validators.required])
  })

  matcher = new MyErrorStateMatcher();

  constructor(
    public _api : ApiService,
    private _user : UserApiService,
    private toastr : ToastrService
  ){
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData =>{
      if(defaultData!=null){
        this.user = defaultData?.userData
      }
    })
    this._user.user$.subscribe(user => {
      this.user = user
    })
  }

  disableFormControl(e : any){
    if(this.forms.get(e.target.name as string)?.disabled){
      this.forms.get(e.target.name as string)?.enable()
    }else{
      this.forms.get(e.target.name as string)?.disable()
    }
  }

  clearInputs(){
    this.forms.reset()
  }

  showError(message: string){
    this.toastr.error(message, '', configForToastr)
  }

  updateEmailAndPassword(){
    let credentials = {
      email: this.forms.controls.emailFormControl.enabled&&this.forms.controls.emailFormControl.dirty ? this.forms.controls.emailFormControl.getRawValue() : null,
      password: this.forms.controls.passwordFormControl.enabled&&this.forms.controls.passwordFormControl.dirty ? this.forms.controls.passwordFormControl.getRawValue() : null
    }
    this._user.updateEmailAndPassword(credentials).subscribe({
      next: (updatedUser)=>{
        this._user.updateUser(updatedUser)
        this.toastr.success('Se edito credenciales del usuario exitosamente!', '', configForToastr);
      },
      error: (err)=>{
        this.showError(err.message)
      }
    });
  }

  logout(){
    this._api.logout()
    this._user.getDefaultUserData();
    this.toastr.info('Se ha cerrado la sesion', '', configForToastr)
  }

}
