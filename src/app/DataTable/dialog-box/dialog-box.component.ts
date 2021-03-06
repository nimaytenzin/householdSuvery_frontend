import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  idNumber: string;
  age: number;
  gender:string;
  incomeEarner:string;
  type:string;
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
  selectionType: any;

  genders:DropDownOptions[]=[
    {id:1, name: "Male"},
    {id:2, name: "Female"}
  ]

  bools:DropDownOptions[]=[
    {id:1, name: "Yes"},
    {id:2, name: "No"}
  ]
  identifications:DropDownOptions[]=[
    {id:1, name: "CID"},
    {id:2, name: "Work Permit"},
    {id:3, name: "Minor"}
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    public dataService: DataService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.local_data.type = this.selectionType
    console.log(this.local_data)
    this.dialogRef.close({event:this.action,data:this.local_data});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  getAge(age2){
    var from = age2.split("/");
    var birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
    var cur = new Date().getTime();
    var diff = cur - birthdateTimeStamp.getTime();
    var currentAge = Math.floor(diff/31557600000);
    return currentAge
  }

  pingApi(){
    if(this.selectionType === "CID"){
      if(this.local_data.cid.length > 10){
        this.dataService.getCid(this.local_data.cid).subscribe(res=>{
          if(res.success === "true"){
            let data = res.data.citizendetails.citizendetail[0]
            let name = data.firstName+" "+data.lastName
            let age = this.getAge(data.dob)
            let gender = data.gender === "F" ? "Female" : "Male"
            this.local_data.age = age
            this.local_data.gender = gender
          }
        })
      }
    }
    if(this.selectionType === "Work Permit"){

    }
  }

  showDetail(e){
    if(e.value !== "Minor"){
      this.selectionType = e.value
      this.showDetails = true
    }else{
      this.showDetails = false
    }
  }

  

}