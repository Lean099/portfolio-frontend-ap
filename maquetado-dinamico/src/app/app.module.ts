import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './components/about/about.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { HeaderBannerComponent } from './components/header-banner/header-banner.component';
import { HeaderSocialMediaBarComponent } from './components/header-social-media-bar/header-social-media-bar.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { SkillsComponent } from './components/skills/skills.component';

// Material Angular
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MomentDateModule } from '@angular/material-moment-adapter';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Others
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    MaterialModule, 
    BrowserAnimationsModule,
    MomentDateModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    EducationComponent,
    ExperienceComponent,
    HeaderBannerComponent,
    HeaderSocialMediaBarComponent,
    LoginComponent,
    ProjectComponent,
    SkillsComponent
  ], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
