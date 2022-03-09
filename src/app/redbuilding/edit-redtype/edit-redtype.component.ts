import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-edit-redtype',
  templateUrl: './edit-redtype.component.html',
  styleUrls: ['./edit-redtype.component.css']
})
export class EditRedtypeComponent implements OnInit {
  redbuilding;

  constructor(
    public dialogRef: MatDialogRef<EditRedtypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.redbuilding = this.data;
    this.redbuilding.id = Number(this.data.id)
  }

  editRedBuildingType(){
    this.dataService.updateBuilding(this.redbuilding).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }

}
