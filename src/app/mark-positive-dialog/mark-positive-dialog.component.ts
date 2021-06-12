import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


export class RedBuilding{
  structure_id:number;
  numCases:number;
  case_id:string;
  lat:number;
  lng:number;
  date: Date;
  day:number;
  dzo_id:number;
  remarks: string;
  status:string;
}

@Component({
  selector: 'app-mark-positive-dialog',
  templateUrl: './mark-positive-dialog.component.html',
  styleUrls: ['./mark-positive-dialog.component.css']
})


export class MarkPositiveDialogComponent implements OnInit {
  registerRedBuildingForm:FormGroup;
  redBuilding = new RedBuilding;
  today:Date;

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
  }

  reactiveForm(){
    this.registerRedBuildingForm = this.fb.group({
      cases:[],
      case_id:[],
      date:[new Date()],
      day:[],
      remarks:[]
    });   
  }

  submit(){
    var structure_id = this.data.object.properties.structure_id;
    var dzo_id = Number(sessionStorage.getItem('dzo_id'));
    var lng =this.data.object.coordinates[0];
    var lat =this.data.object.coordinates[1];

    console.log('adsd', this.data)
    this.redBuilding.structure_id = structure_id;
    this.redBuilding.dzo_id = dzo_id; 

    console.log(this.registerRedBuildingForm.get('cases').value);
    this.redBuilding.numCases = this.registerRedBuildingForm.get('cases').value;
    this.redBuilding.case_id = this.registerRedBuildingForm.get('case_id').value;
    this.redBuilding.date = this.registerRedBuildingForm.get('date').value;
    this.redBuilding.remarks = this.registerRedBuildingForm.get('remarks').value;
    this.redBuilding.day = this.registerRedBuildingForm.get('day').value;
    this.redBuilding.lat = lat;
    this.redBuilding.lng = lng;
    console.log(this.redBuilding)
    this.dataservice.addRedBuilding(this.redBuilding).subscribe(res => {
      this.dialogRef.close()
    })

  }



}