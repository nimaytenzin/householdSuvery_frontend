import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';



class SealHistory {
  flat_id:number;
  open_time:string;
  close_time:string;
  date:string;
  reason:string;
  operator_id:number
}

@Component({
  selector: 'app-add-sealhistory',
  templateUrl: './add-sealhistory.component.html',
  styleUrls: ['./add-sealhistory.component.css']
})
export class AddSealhistoryComponent implements OnInit {
  newSealHistory;

  constructor(
    public dialogRef: MatDialogRef<AddSealhistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public flat_id:number,
    private dataService:DataService
  ) {
    this.newSealHistory = new SealHistory();
   }

  ngOnInit() {
    this.newSealHistory.operator_id = Number(sessionStorage.getItem("userId"));
    this.newSealHistory.flat_id = this.flat_id;
    console.log(this.newSealHistory)
  }

  addNewSealHistory(){
    if(
      this.newSealHistory.date &&
      this.newSealHistory.open_time &&
      this.newSealHistory.close_time &&
      this.newSealHistory.reason 
    ){
      this.dataService.createNewSealHistory(this.newSealHistory).subscribe(res=>{
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
