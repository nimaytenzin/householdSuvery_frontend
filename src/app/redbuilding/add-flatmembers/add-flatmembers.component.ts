import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';

class FamilyMember {
  name:number;
  gender:string;
  age:string;
  isComorbid:number;
  flat_id:number;
}

@Component({
  selector: 'app-add-flatmembers',
  templateUrl: './add-flatmembers.component.html',
  styleUrls: ['./add-flatmembers.component.css']
})
export class AddFlatmembersComponent implements OnInit {
  householdmember;

  constructor(
    public dialogRef: MatDialogRef<AddRedflatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public flat_id:number,
    private dataService:DataService
  ) {
    this.householdmember = new FamilyMember();
   }

  ngOnInit() {
    this.householdmember.isComorbid = 0;
    this.householdmember.gender = 'M'
    this.householdmember.flat_id = this.flat_id
  }

  addFamilyMember(){
    console.log("click")
    this.dataService.createRedFlatMember(this.householdmember).subscribe(res=>{
      if(res.success === 'true'){
        this.dialogRef.close({success:true})
      }else{
        this.dialogRef.close({success:false}) 
      }
    })
  }

}
