import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header-social-media-bar',
  templateUrl: './header-social-media-bar.component.html',
  styleUrls: ['./header-social-media-bar.component.css']
})
export class HeaderSocialMediaBarComponent implements OnInit{

  constructor(
    public _User : UserService,
    //@Inject(DOCUMENT) private document: Document,
    //private el : ElementRef
  ){}

  ngOnInit(){
    console.log(this._User.user)
  }

  logout(){
    /* Al hacer el logout hay que quitar la clase modal-open del body y los estilos, tambien hay que remover un div */
    /* ME EQUIVOQUE ES CUANDO HACEMOS EL LOGIN HAY QUE REMOVER ESAS COSAS */
    this._User.user = {
      ...this._User.user,
      _id: "",
      username: "",
      password: "",
      avatar: "",
    }
    this._User.changeLoggedUser()
    //this.document.body.classList.remove("modal-open")
    //this.document.body.style.removeProperty("overflow")
    //this.document.body.style.removeProperty("padding-right")
    //this.document.getElementsByClassName("modal-backdrop") No funciona
    //let mytag = this.el.nativeElement.getElementsByClassName("modal-backdrop")
  }

}
