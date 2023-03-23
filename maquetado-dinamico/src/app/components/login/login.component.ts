import { Component, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : string = ''
  password : string = ''

  constructor(
    private _user : UserService,
    private _api : ApiService,
    @Inject(DOCUMENT) private document: Document
  ){}
  
  login(){
    this._api.login(this.email, this.password)
    this.email = '';
    this.password = '';
    this.document.body.classList.remove("modal-open")
    this.document.body.style.removeProperty("overflow")
    this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop")
    this.document.body.getElementsByClassName("modal-backdrop")[0].remove()
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
