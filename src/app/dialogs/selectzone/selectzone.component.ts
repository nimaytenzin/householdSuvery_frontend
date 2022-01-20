import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-selectzone',
  templateUrl: './selectzone.component.html',
  styleUrls: ['./selectzone.component.css']
})
export class SelectzoneComponent implements OnInit {
  dzongkhags= [];
  zones=[];
  selectDzongkhagForm:FormGroup;
  dzongkhagId:number=Number(sessionStorage.getItem("selectedDzongkhagId"))
  zoneId:any;

  constructor( 
            private dataService: DataService,
            private fb: FormBuilder,
            public dialogRef: MatDialogRef<SelectzoneComponent>,
            private router: Router,
            ) { }

  ngOnInit() {
    // this.dataService.getDzongkhags().subscribe(response => {
    //   this.dzongkhags = response.data;
    // });
    // this.reactiveForm()
  }

  reactiveForm() {
  //   this.selectDzongkhagForm = this.fb.group({
  //     dzongkhag: ['', Validators.compose([Validators.required])]
  //   });
  // }
  // submit(){
  //   sessionStorage.setItem("selectedDzongkhagId", String(this.dzongkhagId));
  //   this.dialogRef.close();
  //   this.router.navigate(['cov-map'])
  // }

  // getZoneList(ok){
  //   console.log(ok)
  // }
  }

}
