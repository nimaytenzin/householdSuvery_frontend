import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../service/data.service';
import { AuthenticationService } from '../service/authentication.service';


interface Dzongkhag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-service-dashboard',
  templateUrl: './service-dashboard.component.html',
  styleUrls: ['./service-dashboard.component.css']
})

export class ServiceDashboardComponent implements OnInit {

  zoneForm: FormGroup;
  dzongkhags= [];
  isUserLoggedIn: boolean;
  dzo_id:number;

  dzongkhag: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.authState.subscribe(value => {
      this.isUserLoggedIn = value;
    });

    this.reactiveForm();
    this.getDzongkhagList();

    const dzongkhagId = sessionStorage.getItem('dzongkhagId');
    this.dzongkhag = dzongkhagId;
  }

  reactiveForm() {
    this.zoneForm = this.fb.group({
      dzongkhagControl: ['', Validators.compose([Validators.required])]
    });
  }

  getDzongkhagList() {
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data;
      console.log(this.dzongkhags)
    });
  }

  redirectToDashboard() {
    this.dzo_id = this.zoneForm.get('dzongkhagControl').value;
    if (this.zoneForm.valid) {
      sessionStorage.setItem('dzongkhagId', this.zoneForm.get('dzongkhagControl').value);
      if(sessionStorage.getItem('isadmin') === "COV_ADMIN"){
        this.router.navigate(['cov-admin',this.dzo_id]);
      }else if(sessionStorage.getItem('isadmin') === "COV_VIEW"){
        this.router.navigate(['cov-map',this.dzo_id]);
      }
    }
  }

}
