import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

export class RedFlat{
  red_building_id:number;
  hh_name:number;
  unitName:string;
  cid:number;
  contact:number;
  first_seal_date: Date;
}


@Component({
  selector: 'app-covadmin-add-redflat',
  templateUrl: './covadmin-add-redflat.component.html',
  styleUrls: ['./covadmin-add-redflat.component.css']
})
export class CovadminAddRedflatComponent implements OnInit {
  addNewRedFlat;
  newRedFlat = new RedFlat;
  red_building_id;

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<CovadminAddRedflatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm()
  }
  reactiveForm(){
    this.addNewRedFlat = this.fb.group({
      first_seal_date:[new Date()],
      unitName:[],
      hh_name:[],
      cid:[],
      contact:[]
    });   
  }
  submit(){
    this.newRedFlat.cid = this.addNewRedFlat.get("cid").value;
    this.newRedFlat.contact = this.addNewRedFlat.get("contact").value;
    this.newRedFlat.unitName = this.addNewRedFlat.get("unitName").value;
    this.newRedFlat.first_seal_date = this.addNewRedFlat.get("first_seal_date").value;
    this.newRedFlat.hh_name = this.addNewRedFlat.get("hh_name").value;
    this.newRedFlat.red_building_id = this.data.red_building_id

    this.dataservice.createNewRedFlat(this.newRedFlat).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })

  }
}
