import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


export class Case{
  structure_id:number;
  numCases:number;
  lat:number;
  lng:number;
  date: Date;
  remarks: string;
  status:string;
  dzongkhag_id:number;
}

@Component({
  selector: 'app-mark-positive-dialog',
  templateUrl: './mark-positive-dialog.component.html',
  styleUrls: ['./mark-positive-dialog.component.css']
})


export class MarkPositiveDialogComponent implements OnInit {
  registerRedBuildingForm:FormGroup;
  newCase = new Case;
  today:Date;

  ok;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<MarkPositiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.today = new Date();
    this.reactiveForm();
    this.ok = this.data
  }

  reactiveForm(){
    this.registerRedBuildingForm = this.fb.group({
      cases:[],
      case_id:[],
      date:[new Date()],
      status:[],
      remarks:[]
    });   
  }

  submit(){
    
    this.newCase.lat = this.data.object.coordinates[1];
    this.newCase.lng = this.data.object.coordinates[0];
    this.newCase.structure_id = this.data.object.properties.structure_id;
    this.newCase.numCases = this.registerRedBuildingForm.get('cases').value;
    this.newCase.date = this.registerRedBuildingForm.get('date').value;
    this.newCase.remarks = this.registerRedBuildingForm.get('remarks').value;
    this.newCase.dzongkhag_id = Number(sessionStorage.getItem('dzongkhag_id'));
    
    console.log(this.newCase)
    this.dataservice.addRedBuilding(this.newCase).subscribe(res => {
      // this.dialogRef.close()
      console.log(res)
    })

  }



}