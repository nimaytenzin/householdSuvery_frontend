import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

class RedBuilding{
  id:number;
  type:string;
}

@Component({
  selector: 'app-select-redtype',
  templateUrl: './select-redtype.component.html',
  styleUrls: ['./select-redtype.component.css']
})
export class SelectRedtypeComponent implements OnInit {
  redbuilding;

  constructor(
    public dialogRef: MatDialogRef<SelectRedtypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dataService:DataService
  ) { 
    this.redbuilding = new RedBuilding()
  }

  ngOnInit() {
    this.redbuilding.id = Number(this.data)
  }

  addRedbuildingType(){
    console.log(this.redbuilding)
    this.dataService.updateRedBuilding(this.redbuilding).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })

  }
}
