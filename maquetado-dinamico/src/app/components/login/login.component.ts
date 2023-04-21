import { Component, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

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

  configForToastr : IndividualConfig = {
    disableTimeOut: false,
    timeOut: 5000,
    closeButton: false,
    extendedTimeOut: 1000,
    progressBar: false,
    progressAnimation: 'decreasing',
    enableHtml: false,
    toastClass: 'ngx-toastr',
    positionClass: 'toast-top-right',
    titleClass: 'toast-title',
    messageClass: 'toast-message',
    easing: 'ease-in',
    easeTime: 300,
    tapToDismiss: true,
    onActivateTick: false,
    newestOnTop: false
  }

  constructor(
    private _user : UserService,
    private _api : ApiService,
    @Inject(DOCUMENT) private document: Document,
    private toastr : ToastrService
  ){}

  showSuccess() {
    this.toastr.success('Login exitoso!', '', this.configForToastr);
  }

  showError(message: string){
    this.toastr.error(message, '', this.configForToastr)
  }
  
  login(){
    this._api.login(this.forms.controls.emailFormControl.getRawValue() as string, this.forms.controls.passwordFormControl.getRawValue() as string)
      .subscribe({
        next: (response)=> {
          console.log("Entro al next osea login correcto")
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
          console.log("Entro al error")
          this.forms.reset()
          console.log(e)
          this.showError(e.message)
        }
       })
    //this.email = '';
    //this.password = '';
    /*this.forms.reset()
    this.document.body.classList.remove("modal-open")
    this.document.body.style.removeProperty("overflow")
    this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop")
    this.document.body.getElementsByClassName("modal-backdrop")[0].remove()*/
  }

  /*login2(){
    console.log(this.email +" "+ this.password)
    //this._user.user = this._api.login(this.email, this.password).user
    console.log(this._user.user)
    this.email = '';
    this.password = '';
    this.document.body.classList.remove("modal-open")
    this.document.body.style.removeProperty("overflow")
    this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop")
    this.document.body.getElementsByClassName("modal-backdrop")[0].remove()
  }*/

}
