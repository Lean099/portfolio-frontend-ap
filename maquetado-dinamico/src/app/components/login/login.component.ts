import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { configForToastr } from 'src/app/others/configs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : string = ''
  password : string = ''

  forms = new FormGroup({
    emailFormControl: new FormControl(''),
    passwordFormControl: new FormControl('')
  })

  constructor(
    private _api : ApiService,
    @Inject(DOCUMENT) private document: Document,
    private toastr : ToastrService
  ){}

  showSuccess() {
    this.toastr.success('Login exitoso!', '', configForToastr);
  }

  showError(message: string){
    this.toastr.error(message, '', configForToastr)
  }
  
  login(){
    this._api.login(this.forms.controls.emailFormControl.getRawValue() as string, this.forms.controls.passwordFormControl.getRawValue() as string)
      .subscribe({
        next: (response)=> {
          this._api.updateLoginData({ accessToken: response.access_token, idUser: response.id_user, isLogged: true})
          this.forms.reset()
          this.document.body.classList.remove("modal-open")
          this.document.body.style.removeProperty("overflow")
          this.document.body.style.removeProperty("padding-right")
          //this.document.getElementsByClassName("modal-backdrop")
          this.document.body.getElementsByClassName("modal-backdrop")[0].remove()
          this.showSuccess()
        },
        error: (e)=> {
          this.forms.reset()
          this.showError(e.message)
        }
       })
  }
}
