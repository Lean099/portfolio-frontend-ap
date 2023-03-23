import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ApiService } from 'src/app/services/api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-header-social-media-bar',
  templateUrl: './header-social-media-bar.component.html',
  styleUrls: ['./header-social-media-bar.component.css']
})
export class HeaderSocialMediaBarComponent implements OnInit{

  data : any;
  user : any;

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

  testGetUser(){  // Funciona
    this._user.getUser()//.subscribe(data => this.user = data)
    console.log(this.user)
  }

  logout(){
    this._api.logout()
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
