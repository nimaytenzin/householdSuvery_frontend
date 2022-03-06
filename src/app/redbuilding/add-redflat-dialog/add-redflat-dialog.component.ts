import { Component, OnInit } from '@angular/core';


class RedFlat {
  red_building_id:number;
  status:string;
  unit_name:string;
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

  constructor() { 
    this.redflat = new RedFlat()

  }
  ngOnInit() {
      this.redflat.red_building_id = 1;
      this.redflat.sealer_id = 2;
      this.redflat.status = "ACTIVE"
  }

  addNewRedFlat(){
    if(
      this.redflat.hh_name &&
      this.redflat.contact &&
      this.redflat.unit_name &&
      this.redflat.cid &&
      this.redflat.first_seal_date &&
      this.redflat.first_seal_time &&
      this.redflat.status
    ){
      console.log("RED BUILDING", this.redflat)
    }else{
      alert("please fill in all required details la")
    }
    
  }

}
