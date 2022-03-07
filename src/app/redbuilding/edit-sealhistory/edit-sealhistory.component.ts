import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-edit-sealhistory',
  templateUrl: './edit-sealhistory.component.html',
  styleUrls: ['./edit-sealhistory.component.css']
})
export class EditSealhistoryComponent implements OnInit {
  sealHistory;

  constructor(
    public dialogRef: MatDialogRef<EditSealhistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public passedSealHistory,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.sealHistory = this.passedSealHistory
  }

  editSealHistory(){
 
    console.log( "Updating",this.sealHistory);

    this.dataService.editSealHistory(this.sealHistory).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
   
  }

}
