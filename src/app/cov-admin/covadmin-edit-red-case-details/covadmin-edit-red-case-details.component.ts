import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

class RedCase{
  case_id:string;
  numCases:number;
  date:Date;
  status:string;
  remarks:string;
  id:number
}

@Component({
  selector: 'app-covadmin-edit-red-case-details',
  templateUrl: './covadmin-edit-red-case-details.component.html',
  styleUrls: ['./covadmin-edit-red-case-details.component.css']
})
export class CovadminEditRedCaseDetailsComponent implements OnInit {

  editCase;
  selectedCase = new RedCase;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminEditRedCaseDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
    console.log("Passed data",this.data)
    this.editCase.patchValue({
      date:this.data.date,
      case_id:this.data.case_id,
      numCases:this.data.numCases,
      remarks:this.data.remarks,
      status:this.data.status
    })
  }
  reactiveForm(){
    this.editCase = this.fb.group({
      date:[],
      case_id:[],
      numCases:[],
      remarks:[],
      status:[]
    });   
  }
  submit(){
    this.selectedCase.case_id = this.editCase.get("case_id").value;
    this.selectedCase.date = this.editCase.get("date").value;
    this.selectedCase.status = this.editCase.get("status").value; 
    this.selectedCase.remarks = this.editCase.get("remarks").value;
    this.selectedCase.numCases = this.editCase.get("numCases").value;
    this.selectedCase.id = this.data.id;


    console.log("UPDATE", this.selectedCase)

    this.dataservice.editCase(this.selectedCase).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
    
  }

}
