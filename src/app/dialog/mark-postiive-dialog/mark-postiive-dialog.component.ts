import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


export class RedBuilding{
  structure_id:number;
  numCases:number;
  lat:number;
  lng:number;
  date: Date;
  remarks: string;
  status:string;
}

@Component({
  selector: 'app-mark-postiive-dialog',
  templateUrl: './mark-postiive-dialog.component.html',
  styleUrls: ['./mark-postiive-dialog.component.css']
})


export class MarkPostiiveDialogComponent implements OnInit {
  registerRedBuildingForm:FormGroup;
  redBuilding = new RedBuilding;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<MarkPostiiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
  }

  reactiveForm(){
    this.registerRedBuildingForm = this.fb.group({
      cases:[],
      date:[new Date()],
      remarks:[]
    });   
  }

  submit(){
    var structure_id = this.data.object.properties.structure_id;
    var lng =this.data.object.coordinates[0];
    var lat =this.data.object.coordinates[1];

    console.log('adsd', this.data)
    this.redBuilding.structure_id = structure_id;

    console.log(this.registerRedBuildingForm.get('cases').value);
    this.redBuilding.numCases = this.registerRedBuildingForm.get('cases').value;
    this.redBuilding.date = this.registerRedBuildingForm.get('date').value;
    this.redBuilding.remarks = this.registerRedBuildingForm.get('remarks').value;
    this.redBuilding.lat = lat;
    this.redBuilding.lng = lng;
    this.dataservice.addRedBuilding(this.redBuilding).subscribe(res => {
      this.dialogRef.close()
    })

  }



}
