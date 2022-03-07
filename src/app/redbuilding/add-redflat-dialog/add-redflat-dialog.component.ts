import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';


class RedFlat {
  red_building_id:number;
  status:string;
  unitName:string;
  hh_name:string;
  cid:string;
  contact:string;
  sealer_id:number;
  first_seal_time:string;
  first_seal_date:Date;
  final_seal_date:Date;
  remarks:string;
}
@Component({
  selector: 'app-add-redflat-dialog',
  templateUrl: './add-redflat-dialog.component.html',
  styleUrls: ['./add-redflat-dialog.component.css']
})

export class AddRedflatDialogComponent implements OnInit {
  redflat;
  authenticatedUserId:number = Number(sessionStorage.getItem("userId"));
  passedData:any;

  constructor(
    public dialogRef: MatDialogRef<AddRedflatDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public redBuildingId:number,
     private dataService:DataService
  ) { 
    this.redflat = new RedFlat()
  
    console.log(this.redBuildingId)
  }
  ngOnInit() {
      this.redflat.sealer_id = 2;
      this.redflat.status = "ACTIVE"
      this.redflat.sealer_id = this.authenticatedUserId;
      this.redflat.red_building_id = this.redBuildingId

  }

  addNewRedFlat(){
    if(
      this.redflat.hh_name &&
      this.redflat.contact &&
      this.redflat.unitName &&
      this.redflat.cid &&
      this.redflat.first_seal_date &&
      this.redflat.first_seal_time &&
      this.redflat.status
    ){
      this.dataService.createNewRedFlat(this.redflat).subscribe(res=>{
        if(res.success === 'true'){
          this.dialogRef.close({success:true})
        }else{
          this.dialogRef.close({success:false}) 
        }
      })
    }else{
      alert("please fill in all required details la")
    }
    
  }

}
