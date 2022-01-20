import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { MatSnackBar } from '@angular/material';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.reactiveForm();
  }

  get f() { return this.loginForm.controls; }

  reactiveForm() {
    this.loginForm = this.fb.group({
      cid: [''],
      password: ['']
    });

    this.loginForm.controls.cid.setValue(localStorage.getItem('loginId'));
  }

  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const loginId = this.loginForm.get('cid').value;
      const password = this.loginForm.get('password').value;
      this.authService.validateLogin(loginId, password).subscribe(response => {
        let token = response.data.token
        // let token = jwt_decode(response.data.token)
        token = token.slice(7, token.length);

        

        let user:any = jwt_decode(token);
        console.log("DECODED", user)
  
        sessionStorage.setItem('userId', response.data.id);
        sessionStorage.setItem('isadmin',user.isadmin);
        localStorage.setItem('loginId', loginId);

        console.log(response)
        
        // if(user.isadmin === "TRUE"){
        //   this.router.navigate(['admin']);
        // }else if(user.isadmin === "COV_ADMIN"){
        //   this.router.navigate(['cov-admin'])
        // }else if(user.isadmin === "COV_VIEW"){
        //   this.router.navigate(['cov-map'])
        // }else{
        //   this.router.navigate(['selectzone']);
        // }
        this.router.navigate(['app-drawer']);
        
        this.snackBar.open('Welcome ' + response.data.username, '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
      },
      error => {
        this.submitted = false;
        this.snackBar.open('Invalid login credentials, please try again', '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        console.log(error);
      });
    }
  }
}
