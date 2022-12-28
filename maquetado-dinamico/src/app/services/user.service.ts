import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../others/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user : User = {
    _id: "",
    username: "",
    password: "",
    avatar: "",
    isLogged: false
  }

  userIsLoggedChange : Subject<boolean> = new Subject<boolean>();

  constructor() { 
    this.userIsLoggedChange.subscribe((value)=>{
      this.user.isLogged = value
    })
  }

  changeLoggedUser(){
    this.userIsLoggedChange.next(!this.user.isLogged)
    console.log(this.user)
  }
  
}
