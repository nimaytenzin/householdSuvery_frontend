import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UsersData {
  household_id:number
  id:number;
  cid: string;
  age: number;
  gender:string
}

export interface DropDownOptions{
  id:number,
  name:string
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  showDetails:boolean=false;
  action:string;
  local_data:any;

  genders:DropDownOptions[]=[
    {id:1, name: "Male"},
    {id:2, name: "Female"}
  ]

  identifications:DropDownOptions[]=[
    {id:1, name: "CID"},
    {id:2, name: "Work Permit"},
    {id:3, name: "Minor"}
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    console.log(this.local_data)
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  showDetail(e){
    if(e.value !== "Minor"){
      this.showDetails = true
    }else{
      this.local_data.cid = "Minor"
      this.showDetails = false
    }
  }

  

}