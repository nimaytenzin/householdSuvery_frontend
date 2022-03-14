import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

class RedCase{
  red_building_id:number;
  case_id:string;
  numCases:number;
  date:Date;
  status:string;
  remarks:string
}

@Component({
  selector: 'app-covadmin-add-redbuilding-details',
  templateUrl: './covadmin-add-redbuilding-details.component.html',
  styleUrls: ['./covadmin-add-redbuilding-details.component.css']
})
export class CovadminAddRedbuildingDetailsComponent implements OnInit {
  addNewRedCase;
  newRedCase = new RedCase;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminAddRedbuildingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
    console.log(this.data)
  }
  reactiveForm(){
    this.addNewRedCase = this.fb.group({
      date:[new Date()],
      case_id:[],
      numCases:[],
      remarks:[]
    });   
  }
  submit(){
    this.newRedCase.case_id = this.addNewRedCase.get("case_id").value;
    this.newRedCase.date = this.addNewRedCase.get("date").value;
    this.newRedCase.status = "ACTIVE";
    this.newRedCase.remarks = this.addNewRedCase.get("remarks").value;
    this.newRedCase.numCases = this.addNewRedCase.get("numCases").value;
    this.newRedCase.red_building_id = this.data.red_building_id;

    this.dataservice.createNewCase(this.newRedCase).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })


    
  }

}
