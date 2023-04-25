import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/others/configs';
import { Skill } from 'src/app/others/interfaces';
import { ApiService } from 'src/app/services/api.service';
import { SkillApiService } from 'src/app/services/skill-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {

  isLogged : boolean = false;
  userSkill : Array<any> = [];

  forms = new FormGroup({
    nameSkillFormControl: new FormControl('', [Validators.required]),
    percentageFormControl: new FormControl(0, [Validators.required])
  })

  matcher = new MyErrorStateMatcher()

  constructor(
    private _api : ApiService,
    private _user : UserApiService,
    private _skill : SkillApiService
  )
  {
    this._api.loginData$.subscribe(loginData => this.isLogged = loginData.isLogged)
    this._user.defaultDataUser$.subscribe(defaultData => {
      if(defaultData!=null){
        this.userSkill = defaultData?.skill as Array<any>
      }
    })
    this._skill.allUserSkill$.subscribe(allSkill => {
      let skills = allSkill as any[]
      if(skills!=null){
        for (let index = 0; index < skills.length; index++) {
          skills[index].edit = false;
        }
        this.userSkill = skills;
        this.clearInputs()
      }
      return;
    })
  }

  toggleEdit(id : string|null) : void {
    let value = this.userSkill.find(el => el.id===id)!.edit
    this.userSkill.find(el => el.id===id)!.edit = !value
    if(!value){
      let obj = this.userSkill.find(el => el.id===id)
      this.forms.controls.nameSkillFormControl.setValue(obj.skillName as string)
      this.forms.controls.percentageFormControl.setValue(obj.percentage as number)
    }else{
      this.clearInputs()
    }
  }

  clearInputs(){
    this.forms.reset()
  }

  formatLabel(value: number): any {
    return `${value}`;
  }

  addNewSkill(){
    let newSkill : Skill = {
      id: null,
      idUser: null,
      skillName: this.forms.controls.nameSkillFormControl.getRawValue(),
      percentage: this.forms.controls.percentageFormControl.getRawValue()
    }
    this._skill.createSkill(newSkill)
    this.clearInputs()
  }

  editSkill(idSkill: string){
    const newDataSkill : Skill = {
      id: null,
      idUser: null,
      skillName: this.forms.controls.nameSkillFormControl.dirty ? this.forms.controls.nameSkillFormControl.getRawValue() : null,
      percentage: this.forms.controls.percentageFormControl.dirty ? this.forms.controls.percentageFormControl.getRawValue() : null
    }
    this._skill.updateSkill(idSkill, newDataSkill)
  }

  deleteSkill(idSkill: string){
    this._skill.deleteSkill(idSkill)
  }

}
