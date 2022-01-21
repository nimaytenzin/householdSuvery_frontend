import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-selectdzongkhag',
  templateUrl: './selectdzongkhag.component.html',
  styleUrls: ['./selectdzongkhag.component.css']
})
export class SelectdzongkhagComponent implements OnInit {
  dzongkhags= [];
  selectDzongkhagForm:FormGroup;
  dzongkhagId:number=Number(sessionStorage.getItem("selectedDzongkhagId"))

  constructor( 
            private dataService: DataService,
            private fb: FormBuilder,
            public dialogRef: MatDialogRef<SelectdzongkhagComponent>,
            private router: Router,
            ) { }

  ngOnInit() {
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data;
    });
    this.reactiveForm()
  }

  reactiveForm() {
    this.selectDzongkhagForm = this.fb.group({
      dzongkhag: ['', Validators.compose([Validators.required])]
    });
  }
  submit(){
    sessionStorage.setItem("dzongkhagId", String(this.dzongkhagId));
    this.dialogRef.close();
    this.router.navigate(['cov-map'])
  }

}
