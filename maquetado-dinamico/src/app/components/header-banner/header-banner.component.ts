import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent implements OnInit{

  editBanner : boolean = false
  editProfile : boolean = false
  inputValue : any
  editInfo : boolean = false

  constructor(
  
  ){}
  
  ngOnInit(){}

  toggleEdit() : boolean {
    this.editInfo = !this.editInfo
    return this.editInfo;
  }

  changeModal(s?: string){
    if(s=="banner"){
      this.editBanner = true
      this.editProfile = false
    }else{
      this.editProfile = true
      this.editBanner = false
    }
  }

  resetInputFile(){
    this.inputValue = null
  }

}
