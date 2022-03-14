import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


 class RedFlat{
  id:number;
  hh_name:number;
  unitName:string;
  cid:number;
  contact:number;
  first_seal_date: Date;
  status:string;
}

@Component({
  selector: 'app-covadmin-edit-redflat-details',
  templateUrl: './covadmin-edit-redflat-details.component.html',
  styleUrls: ['./covadmin-edit-redflat-details.component.css']
})
export class CovadminEditRedflatDetailsComponent implements OnInit {
  editRedFlat;
  selectedRedFlat = new RedFlat;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminEditRedflatDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    console.log("SELECTED RED FLAT", this.data)
    this.reactiveForm()

    this.editRedFlat.patchValue({
      first_seal_date: this.data.first_seal_date,
      unitName: this.data.unitName,
      hh_name:this.data.hh_name,
      cid:this.data.cid,
      contact:this.data.contact,
      status:this.data.status
    })
  }

  reactiveForm(){
    this.editRedFlat = this.fb.group({
      first_seal_date:[],
      unitName:[],
      hh_name:[],
      cid:[],
      contact:[],
      status:[]
    });   
  }
  submit(){
    this.selectedRedFlat.first_seal_date = this.editRedFlat.get("first_seal_date").value;
    this.selectedRedFlat.cid = this.editRedFlat.get("cid").value;
    this.selectedRedFlat.contact = this.editRedFlat.get("contact").value;
    this.selectedRedFlat.hh_name = this.editRedFlat.get("hh_name").value;
    this.selectedRedFlat.unitName = this.editRedFlat.get("unitName").value;
    this.selectedRedFlat.id  = this.data.id;
    this.selectedRedFlat.status = this.editRedFlat.get("status").value;

    console.log("UPDAINTG RED FLAT", this.selectedRedFlat)
    this.dataservice.editRedFlat(this.selectedRedFlat).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }


}
