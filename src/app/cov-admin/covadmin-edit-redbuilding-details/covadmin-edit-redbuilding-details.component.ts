import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

class RedBuilding{
  id:number;
  status:string;
  remarks:string;
  dateDetection:Date;
  type:string
}

@Component({
  selector: 'app-covadmin-edit-redbuilding-details',
  templateUrl: './covadmin-edit-redbuilding-details.component.html',
  styleUrls: ['./covadmin-edit-redbuilding-details.component.css']
})
export class CovadminEditRedbuildingDetailsComponent implements OnInit {
  editRedBuilding;
  selectedRedBuilding = new RedBuilding;
  
  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminEditRedbuildingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
    console.log("SELECTED REDBUILDING ID", this.data)
    this.dataservice.getRedbuildingsDetailsById(this.data).subscribe(res=>{
      console.log("RED BUILDING DATA", res.data)
      this.editRedBuilding.patchValue({
        status:res.data.status,
        remarks:res.data.remarks,
        type:res.data.type,
        dateDetection:res.data.dateDetection
      })
    })
   
  }
  reactiveForm(){
    this.editRedBuilding = this.fb.group({
      status:[],
       remarks:[],
       type:[],
       dateDetection:[]
    });   
  }
  submit(){
    this.selectedRedBuilding.id = Number(this.data);
    this.selectedRedBuilding.dateDetection = this.editRedBuilding.get("dateDetection").value;
    this.selectedRedBuilding.remarks= this.editRedBuilding.get("remarks").value;
    this.selectedRedBuilding.type = this.editRedBuilding.get("type").value;
    this.selectedRedBuilding.status = this.editRedBuilding.get("status").value;

   console.log(this.selectedRedBuilding)
   this.dataservice.updateRedBuilding(this.selectedRedBuilding).subscribe(res =>{
    if(res.success === 'true'){
      this.dialogRef.close({success:true})
    }else{
      this.dialogRef.close({success:false}) 
    }
   })
  }
}
