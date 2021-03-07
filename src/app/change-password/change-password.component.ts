import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.reactiveForm();
  }

  reactiveForm() {
    this.changePasswordForm = this.fb.group({
      oldPass: ['', Validators.compose([Validators.required])],
      newPass: ['', Validators.compose([Validators.required])]
    });
  }

  changePassword(){}
}
