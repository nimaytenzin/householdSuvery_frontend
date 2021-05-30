import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  idNumber: string;
  age: number;
  name:string;
  gender:string;
  contact:number;
  occupation:string;
  workplace:string;
  workzone:string;
  incomeEarner:string;
  most_active:boolean;
  covid_test_status:boolean;
  vaccine_status:boolean;
  type:string;
}

export interface DropDownOptions{
  id:number,
  name:string
}

export interface BoolDropDownOptions{
  value:boolean,
  name:string
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit{
  showDetails:boolean=false;
  action:string;
  local_data:any;
  selectionType: any;


  genders:DropDownOptions[]=[
    {id:1, name: "Male"},
    {id:2, name: "Female"}
  ]

  employmentOptions:DropDownOptions[]=[
    {id:1, name: "RBP"},
    {id:2, name: "RBA"},
    {id:3, name: "Farmer"},
    {id:4, name: "Housewife/Househusband"},
    {id:5, name: "Civil Servant"},
    {id:6, name: "Corporate Worker"},
    {id:7, name: "Student"},
    {id:8, name: "Construction Worker"},
    {id:9, name: "Private Business"},
    {id:10, name: "Unemployed"},
    {id:11, name: "Others"}
  ]

  workzones:DropDownOptions[]=[
    { id: 1, name: "Amochhu Chamkuna" },
    { id: 2, name: "Dhamdara Kabraytar" },
    { id: 3, name: "Rinchending" },
    { id: 4, name: "Ahlay Pekarshing" },
    { id: 5, name: "Pasakha" },
    { id: 6, name: "Core Area I" },
    { id: 7, name: "Core Area II" },
    { id: 8, name: "Core Area III" },
    { id: 9, name: "Core Area IV" },
    { id: 10, name: "Others" }
  ]


  bools:BoolDropDownOptions[]=[
    {value:true, name: "Yes"},
    {value:false, name: "No"}
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
  ngOnInit(): void {
    console.log("Data passed from the table", this.data)
    if(this.local_data.type !== "Minor"){
      this.selectionType =this.local_data.type
      this.showDetails = true
    }else{
      this.selectionType = this.local_data.type
      this.local_data.idNumber = 0
      this.showDetails = false
    }
    this.pingApi()
  }

  doAction(){
    this.local_data.type = this.selectionType;
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
      if(this.local_data.idNumber.length > 10){
        this.dataService.getCid(this.local_data.idNumber).subscribe(res=>{
          console.log("pinging," ,res)
          if(res.success === "true"){
            console.log(res.data);
            let data = res.data.citizendetails.citizendetail[0];
            let name = this.processName(data.firstName, data.middleName, data.lastName);
            let age = this.getAge(data.dob);
            let gender = data.gender === "F" ? "Female" : "Male";
            this.local_data.age = age;
            this.local_data.name = name;
            this.local_data.gender = gender;
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
      this.selectionType = e.value
      this.local_data.idNumber = 0
      this.showDetails = false
    }
  }

  processName(first,middle,last){
    let fullName = "";
    if(first !==null){
      fullName += first;
    }
    if(middle !==null){
      fullName += " ";
      fullName += middle
    }
    if(last !==null){
      fullName += " ";
      fullName += last
    }
    return  fullName
  }

  

}