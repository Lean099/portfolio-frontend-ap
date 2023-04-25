import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/others/interfaces';
import { AddressApiService } from 'src/app/services/address-api.service';
import { ApiService } from 'src/app/services/api.service';
import { PictureApiService } from 'src/app/services/picture-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-header-banner',
  templateUrl: './header-banner.component.html',
  styleUrls: ['./header-banner.component.css']
})
export class HeaderBannerComponent {

  defaultBannerImage = "https://res.cloudinary.com/lean99/image/upload/v1681894210/Ap/no-image-banner_hhzvtu.png"
  defaultProfileImage = "https://res.cloudinary.com/lean99/image/upload/v1681894210/Ap/no-image-profile_djkgad.png"
  isLogged : boolean = false;
  editBanner : boolean = false
  editProfile : boolean = false
  inputFile : any
  editInfo : boolean = false
  user : User|null = null

  forms = new FormGroup({
    firstnameFormControl: new FormControl(''),
    lastnameFormControl: new FormControl(''),
    phoneFormControl: new FormControl(''),
    dobFormControl: new FormControl(new Date()),
    githubFormControl: new FormControl(''),
    linkedinFormControl: new FormControl('')
  })

  formsAddress = new FormGroup({
    countryFormControl: new FormControl(''),
    provinceFormControl: new FormControl(''),
    cityFormControl: new FormControl(''),
  })

  constructor(
    private _api : ApiService,
    private _user : UserApiService,
    private _address : AddressApiService,
    private _picture : PictureApiService
  )
  {
    this._api.loginData$.subscribe(logData => this.isLogged = logData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData =>{
      if(defaultData!=null){
        this.user = defaultData?.userData
      }
    })
    this._user.user$.subscribe(user => {
      this.user = user
    })
  }
  
  toggleEdit() : void {
    this.editInfo = !this.editInfo
    if(this.editInfo){
      this.forms.controls.firstnameFormControl.setValue(this.user?.firstname as string)
      this.forms.controls.lastnameFormControl.setValue(this.user?.lastname as string)
      this.forms.controls.phoneFormControl.setValue(this.user?.phone as string)
      this.forms.controls.dobFormControl.setValue(this.user?.dob as Date)
      this.formsAddress.controls.countryFormControl.setValue(this.user?.address?.country?.name as string)
      this.formsAddress.controls.provinceFormControl.setValue(this.user?.address?.province?.name as string)
      this.formsAddress.controls.cityFormControl.setValue(this.user?.address?.city?.name as string)
      this.forms.controls.githubFormControl.setValue(this.user?.githubUrl as string)
      this.forms.controls.linkedinFormControl.setValue(this.user?.linkedinUrl as string)
    }else{
      this.forms.reset()
    }
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

  disableFormControl(e : any){
    if(this.forms.get(e.target.name as string)?.disabled){
      this.forms.get(e.target.name as string)?.enable()
    }else{
      this.forms.get(e.target.name as string)?.disable()
    }
  }

  disableFormControlAddress(e : any){
    if(this.formsAddress.get(e.target.name as string)?.disabled){
      this.formsAddress.get(e.target.name as string)?.enable()
    }else{
      this.formsAddress.get(e.target.name as string)?.disable()
    }
  }

  updateInfo(){
    const newInfo = {
      firstname: this.forms.controls.firstnameFormControl.enabled&&this.forms.controls.firstnameFormControl.dirty ? this.forms.controls.firstnameFormControl.getRawValue() : null,
      lastname: this.forms.controls.lastnameFormControl.enabled&&this.forms.controls.lastnameFormControl.dirty ? this.forms.controls.lastnameFormControl.getRawValue() : null,
      dob: this.forms.controls.dobFormControl.enabled&&this.forms.controls.dobFormControl.dirty ? this.forms.controls.dobFormControl.getRawValue() : null,
      phone: this.forms.controls.phoneFormControl.enabled&&this.forms.controls.phoneFormControl.dirty ? this.forms.controls.phoneFormControl.getRawValue() : null,
      githubUrl: this.forms.controls.githubFormControl.enabled&&this.forms.controls.githubFormControl.dirty ? this.forms.controls.githubFormControl.getRawValue() : null,
      linkedinUrl: this.forms.controls.linkedinFormControl.enabled&&this.forms.controls.linkedinFormControl.dirty ? this.forms.controls.linkedinFormControl.getRawValue() : null,
      about: null
    }
    this._user.updatePersonalInformation(newInfo);
  }

  updateAddress(){
    const newAddress = {
      id: this.user?.address?.id as string,
      idUser: this.user?.id as string,
      country: this.formsAddress.controls.countryFormControl.enabled&&this.formsAddress.controls.countryFormControl.dirty ? { id: null, name: this.formsAddress.controls.countryFormControl.getRawValue() } : null,
      city: this.formsAddress.controls.cityFormControl.enabled&&this.formsAddress.controls.cityFormControl.dirty ? { id: null, name: this.formsAddress.controls.cityFormControl.getRawValue() } : null,
      province: this.formsAddress.controls.provinceFormControl.enabled&&this.formsAddress.controls.provinceFormControl.dirty ? { id: null, name: this.formsAddress.controls.provinceFormControl.getRawValue() } : null
    }
    this._address.updateAddress(newAddress);
  }

  sendNewUpdatedData(){
    if(this.forms.dirty){
      this.updateInfo()
    }
    if(this.formsAddress.dirty){
      this.updateAddress()
    }
    this.toggleEdit()
  }

  onFileSelected(event: any): void {
    this.inputFile = event.target.files[0];
  }

  resetInputFile(){
    this.inputFile = null
  }

  updateBannerOrProfilePicture(type: string){
    this._picture.uploadPicture(type, this.inputFile, null)
  }

  deleteBannerOrProfilePicture(type: string){
    this._picture.deletePicture(type, null)
  }

}
