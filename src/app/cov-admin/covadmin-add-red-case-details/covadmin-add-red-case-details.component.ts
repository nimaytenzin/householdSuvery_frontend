import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


export class Case{
  red_building_id:number
  dzo_id:number;
  date: Date;
  numCases:number;
  remarks: string;
  status:string;
  case_id:string;
}

@Component({
  selector: 'app-covadmin-add-red-case-details',
  templateUrl: './covadmin-add-red-case-details.component.html',
  styleUrls: ['./covadmin-add-red-case-details.component.css']
})
export class CovadminAddRedCaseDetailsComponent implements OnInit {

  addCaseForm;
  newCase = new Case;


  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminAddRedCaseDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
  }

 

  reactiveForm(){
    this.addCaseForm = this.fb.group({
      date:[new Date()],
      numCases:[],
      case_id:[],
      remarks:[],
      status:[]
    });   
  }



  submit(){

      this.newCase.case_id = this.addCaseForm.get('case_id').value;
      this.newCase.date = this.addCaseForm.get('date').value;
      this.newCase.numCases = this.addCaseForm.get('numCases').value;
      this.newCase.dzo_id = this.data.dzo_id;
      this.newCase.red_building_id = this.data.red_building_id;
      this.newCase.remarks =this.addCaseForm.get('remarks').value;
      this.newCase.status = this.addCaseForm.get("status").value;

      this.dataservice.createNewCase(this.newCase).subscribe(res=>{
        if(res.success === 'true'){
          this.dialogRef.close({success:true})
        }else{
          this.dialogRef.close({success:false}) 
        }
      })      
  }


}
