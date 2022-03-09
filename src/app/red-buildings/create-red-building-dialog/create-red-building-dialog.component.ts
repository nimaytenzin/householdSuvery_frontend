import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';
import { AddCasesDialogComponent } from '../add-cases-dialog/add-cases-dialog.component';

export class RedBuilding{
  structure_id:number;
  lat:number;
  lng:number;
  remarks: string;
  status:string;
  dzo_id:number;
}

interface openCaseDialog{
  red_building_id:number;
  dzo_id:number
}

@Component({
  selector: 'app-create-red-building-dialog',
  templateUrl: './create-red-building-dialog.component.html',
  styleUrls: ['./create-red-building-dialog.component.css']
})
export class CreateRedBuildingDialogComponent implements OnInit {

  createRedBuildingForm:FormGroup;
  // newRedBuilding: new RedBuilding
  newRedBuilding = new RedBuilding;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CreateRedBuildingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService

  ) { }

  ngOnInit() {
    console.log(this.data)
    this.reactiveForm()
  }

  reactiveForm(){
    this.createRedBuildingForm = this.fb.group({
      remarks:[],
      status:[]
    });   
  }

  cancel(){
    this.dialogRef.close({event:"cancel"})
  }

  submit(){
    this.newRedBuilding.lat = this.data.lat;
    this.newRedBuilding.lng = this.data.lng;
    this.newRedBuilding.structure_id = this.data.structure_id;
    this.newRedBuilding.remarks = this.createRedBuildingForm.get('remarks').value;
    this.newRedBuilding.dzo_id = this.data.dzo_id;
    this.dialogRef.close({event:'success',data:this.newRedBuilding})
   
    // this.dataservice.createRedBuilding(this.newRedBuilding).subscribe(res =>{
    //   if(res.success === 'true'){
    //     let data:openCaseDialog = {
    //       red_building_id:res.data.id,
    //       dzo_id:res.data.dzo_id
    //     }
    //     this.dialog.open(AddCasesDialogComponent, {
    //       data:data
    //     })
    //   }
      
    // })
  }
}
