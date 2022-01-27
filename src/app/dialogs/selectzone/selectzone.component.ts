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
  dzongkhags = [];
  zones = [];
  subzones = [];
  selectDzongkhagForm: FormGroup;
  dzongkhagId: number = Number(sessionStorage.getItem("selectedDzongkhagId")) ? Number(sessionStorage.getItem("selectedDzongkhagId")) : null;
  zoneId: number;
  subzoneId: number;



  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectzoneComponent>,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data;
    });
    if (this.dzongkhagId) {
      this.dataService.getZones(this.dzongkhagId).subscribe(res => {
        this.zones = res.data
        this.zoneId = res.data[0].id
      })
    }
    this.reactiveForm()
  }

  reactiveForm() {
    this.selectDzongkhagForm = this.fb.group({
      dzongkhag: ['', Validators.compose([Validators.required])]
    });
  }
  submit() {
    sessionStorage.setItem("dzongkhagID", String(this.dzongkhagId));
    sessionStorage.setItem("zoneID", String(this.zoneId));
    sessionStorage.setItem("subzoneID", String(this.subzoneId))
    this.dialogRef.close();
    this.router.navigate(['hh-map'])
  }

  getZoneList(dzo_id) {
    this.dataService.getZones(dzo_id).subscribe(res => {
      this.zones = res.data
    })
  }

  getSubZoneList(zoneId) {

    this.dataService.getSubZones(zoneId).subscribe(res => {
      this.subzones = res.data
      this.subzones.sort(function (a, b) {
        if (a.name < b.name) { return -1; }
        return 0;
      })
    })
  }

}
