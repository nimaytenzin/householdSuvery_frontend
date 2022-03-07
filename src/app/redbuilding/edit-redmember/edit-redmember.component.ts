import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';

@Component({
  selector: 'app-edit-redmember',
  templateUrl: './edit-redmember.component.html',
  styleUrls: ['./edit-redmember.component.css']
})
export class EditRedmemberComponent implements OnInit {
  householdmember;

  constructor(
    public dialogRef: MatDialogRef<AddRedflatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.householdmember = this.data;
    console.log("Household Member",this.householdmember)
  }

  editFamilyMember(){
    this.dataService.editRedFlatMember(this.householdmember).subscribe(res =>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }



}
