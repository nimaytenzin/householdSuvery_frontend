import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-edit-redflat',
  templateUrl: './edit-redflat.component.html',
  styleUrls: ['./edit-redflat.component.css']
})
export class EditRedflatComponent implements OnInit {
  redflat;
  constructor(
    public dialogRef: MatDialogRef<EditRedflatComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService:DataService
  ) { 

  }

  ngOnInit() {
    this.redflat = this.data;
    console.log("Edit red flat",this.data)
  }

  editRedFlat(){
    
    this.dataService.editRedFlat(this.redflat).subscribe(res =>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }

}
