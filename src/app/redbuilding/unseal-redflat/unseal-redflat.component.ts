import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-unseal-redflat',
  templateUrl: './unseal-redflat.component.html',
  styleUrls: ['./unseal-redflat.component.css']
})
export class UnsealRedflatComponent implements OnInit {
  redflat;
  constructor(
    public dialogRef: MatDialogRef<UnsealRedflatComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.redflat = this.data;
    this.redflat.final_seal_date = new Date().toISOString().substring(0, 10);
  }

  editRedFlat(){
    this.redflat.status = "INACTIVE";
    this.dataService.editRedFlat(this.redflat).subscribe(res =>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }

  getReadableDate(date){
    return new Date(date).toDateString()
  }
}
