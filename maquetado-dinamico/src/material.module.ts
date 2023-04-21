import { NgModule } from '@angular/core';
import { MatSliderModule } from "@angular/material/slider"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

const modules = [
    MatSliderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule
]

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule {}