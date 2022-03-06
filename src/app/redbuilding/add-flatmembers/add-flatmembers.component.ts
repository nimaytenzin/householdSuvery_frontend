import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.householdmember = new FamilyMember();
   }

  ngOnInit() {
    this.householdmember.isComorbid = 0;
    this.householdmember.gender = 'M'
  }

  addFamilyMember(){
    console.log(this.householdmember)
  }

}
