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

  username : string = ''
  password : string = ''

  constructor(
    private _user : UserService,
    private _api : ApiService,
    @Inject(DOCUMENT) private document: Document,
    private el : ElementRef
  ){}
  

  login(){
    console.log(this.username +" "+ this.password)
    this._user.user = this._api.login(this.username, this.password).user
    console.log(this._user.user)
    this.username = '';
    this.password = '';
    this.document.body.classList.remove("modal-open")
    this.document.body.style.removeProperty("overflow")
    this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop")
    this.document.body.getElementsByClassName("modal-backdrop")[0].remove()
  }

}
