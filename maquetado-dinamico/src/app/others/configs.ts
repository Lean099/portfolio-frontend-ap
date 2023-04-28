import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { IndividualConfig, ToastrService } from "ngx-toastr";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export const configForToastr : IndividualConfig = {
  disableTimeOut: false,
  timeOut: 5000,
  closeButton: false,
  extendedTimeOut: 1000,
  progressBar: false,
  progressAnimation: 'decreasing',
  enableHtml: false,
  toastClass: 'ngx-toastr',
  positionClass: 'toast-top-right',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  newestOnTop: false
}