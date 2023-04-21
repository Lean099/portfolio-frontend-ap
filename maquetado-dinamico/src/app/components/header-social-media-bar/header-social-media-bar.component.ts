import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ApiService } from 'src/app/services/api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-header-social-media-bar',
  templateUrl: './header-social-media-bar.component.html',
  styleUrls: ['./header-social-media-bar.component.css']
})
export class HeaderSocialMediaBarComponent implements OnInit{

  data : any;
  user : any;

  forms = new FormGroup({
    emailFormControl : new FormControl('', [Validators.required]),
    passwordFormControl : new FormControl('', [Validators.required])
  })

  matcher = new MyErrorStateMatcher();

  constructor(
    public _api : ApiService,
    private _user : UserApiService
    //@Inject(DOCUMENT) private document: Document,
    //private el : ElementRef
  ){}

  ngOnInit(){
    this._api.loginData$.subscribe(data => this.data = data)
    console.log(this.data)
  }

  disableFormControl(e : any){
    if(this.forms.get(e.target.name as string)?.disabled){
      this.forms.get(e.target.name as string)?.enable()
    }else{
      this.forms.get(e.target.name as string)?.disable()
    }
  }

  clearInputs(){
    this.forms.controls.emailFormControl.reset()
    this.forms.controls.passwordFormControl.reset()
  }

  updateEmailAndPassword(){
    let credentials = {
      email: this.forms.controls.emailFormControl.enabled&&this.forms.controls.emailFormControl.dirty ? this.forms.controls.emailFormControl.getRawValue() : null,
      password: this.forms.controls.passwordFormControl.enabled&&this.forms.controls.passwordFormControl.dirty ? this.forms.controls.passwordFormControl.getRawValue() : null
    }
    this._user.updateEmailAndPassword(credentials)
  }

  logout(){
    this._api.logout()
    this._user.getDefaultUserData();
    /* Al hacer el logout hay que quitar la clase modal-open del body y los estilos, tambien hay que remover un div */
    /* ME EQUIVOQUE ES CUANDO HACEMOS EL LOGIN HAY QUE REMOVER ESAS COSAS */
    /*this._User.user = {
      ...this._User.user,
      _id: "",
      username: "",
      password: "",
      avatar: "",
    }*/
    //this._User.changeLoggedUser()
    //this.document.body.classList.remove("modal-open")
    //this.document.body.style.removeProperty("overflow")
    //this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop") No funciona
    //let mytag = this.el.nativeElement.getElementsByClassName("modal-backdrop")
  }

}
