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
  selector: 'app-edit-positive-dialog',
  templateUrl: './edit-positive-dialog.component.html',
  styleUrls: ['./edit-positive-dialog.component.css']
})
export class EditPositiveDialogComponent implements OnInit {

  registerRedBuildingForm:FormGroup;
  redBuilding = new RedBuilding;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<EditPositiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();

    this.registerRedBuildingForm.patchValue({
      cases:this.data.numCases,
      date:this.data.date,
      remarks:this.data.remarks
    })
  }

  reactiveForm(){
    this.registerRedBuildingForm = this.fb.group({
      cases:[],
      date:[new Date()],
      remarks:[]
    });   
  }

  submit(){
    this.redBuilding.structure_id = this.data.structure_id;
    this.redBuilding.numCases = this.registerRedBuildingForm.get('cases').value;
    this.redBuilding.date = this.registerRedBuildingForm.get('date').value;
    this.redBuilding.remarks = this.registerRedBuildingForm.get('remarks').value;

    this.dataservice.updatePositiveCase(this.redBuilding).subscribe(res => {
      if(res.success === 'true'){
        this.dialogRef.close()
      }else{
        alert("error updating try again la")
      }
    })
  }

}
