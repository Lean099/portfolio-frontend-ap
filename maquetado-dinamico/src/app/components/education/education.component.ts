import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Education } from 'src/app/others/interfaces';
import { EducationApiService } from 'src/app/services/education-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

interface Data{
  id: string|null
  idUser: string|null
  institution: string|null
  degree: string|null
  //startDate: Date|null
  endDate: any
  idPicture: string|null|any
  edit: boolean
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  image : any = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"
  data : Array<Data> = [
    { id: "a", idUser: "1", institution: "Universidad", degree: "Titulo...", endDate: null, idPicture: null, edit: false },
    { id: "b", idUser: "1", institution: "Universidad", degree: "Titulo...", endDate: null, idPicture: null, edit: false },
    { id: "c", idUser: "1", institution: "Universidad", degree: "Titulo...", endDate: null, idPicture: null, edit: false }
    //{ id: 2, college: "Universidad", degree: "Titulo...", edit: false },
    //{ id: 3, college: "Universidad", degree: "Titulo...", edit: false },
  ]

  userEducation : Array<any> = [];

  constructor(
    private _user : UserApiService,
    private _education : EducationApiService
  )
  {
    /*this._user.defaultDataUser$.subscribe(defaultData => {
      if(this.userEducation.length>0){
        return;
      }else{
        this.userEducation = defaultData?.education as Array<Education>
      }
    })
    this._education.allUserEducation$.subscribe(allEducation => {
      let studies = allEducation as any
      if(allEducation!=null && allEducation.length>0){
        for (let index = 0; index < studies.length; index++) {
          studies[index].edit = false;
        } 
      }
    })*/
  }
  
  ngOnInit(){}

  toggleEdit(id: string|null) : void {
    let value = this.data.find(el => el.id===id)!.edit
    this.data.find(el => el.id===id)!.edit = !value
  }

}
