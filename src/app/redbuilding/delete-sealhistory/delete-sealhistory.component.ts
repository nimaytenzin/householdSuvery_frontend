import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-delete-sealhistory',
  templateUrl: './delete-sealhistory.component.html',
  styleUrls: ['./delete-sealhistory.component.css']
})
export class DeleteSealhistoryComponent implements OnInit {

  sealHistory;

  constructor(
    public dialogRef: MatDialogRef<DeleteSealhistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public passedSealHistory,
    private dataService:DataService
  ) { 
    
  }

  ngOnInit() {
    this.sealHistory = this.passedSealHistory
    this.sealHistory.date = this.getReadableDate(this.passedSealHistory.date)
    this.sealHistory.open_time = this.convert24Hrsto12hrs(this.passedSealHistory.open_time);
    this.sealHistory.close_time = this.convert24Hrsto12hrs(this.passedSealHistory.close_time);
  }

  getReadableDate(date){
    console.log("CLLED")
    return new Date(date).toDateString()
  }

  convert24Hrsto12hrs(time24) {
    let ts = time24;
    let H = +ts.substr(0, 2);
    let h = String((H % 12)) || 12;
    h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  deleteSealHistory(){
    console.log(this.sealHistory)
    this.dataService.deleteSealHistory({
      id:this.sealHistory.id
    }).subscribe(res =>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }
}
