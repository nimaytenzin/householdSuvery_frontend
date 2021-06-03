import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/DataTable/dialog-box/dialog-box.component';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  id: number;
  idNumber: string;
  name: string;
  age: number;
  gender: string;
  contact: number;
  occupation: string;
  workplace: string;
  covid_test_status: boolean;
  vaccine_status: boolean;
  most_active: boolean;
  type: string;
}

const ELEMENT_DATA = [];

@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.css']
})
export class MemberTableComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  i = 1;

  displayedColumns: string[] = ['sid', 'action', 'cid','name', 'age', 'gender', 'contact', 'occupation', 'workplace', 'covid_test_status', 'vaccine_status', 'most_active'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog, private dataservice: DataService) { }

  @Input() members;
  @Input() householdId;

  ngOnInit() {
    this.dataservice.familyMember = null
    this.dataSource = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['members']) {
      this.dataSource = this.members
    }
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '90vw',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj) {
    let obj = {
      hhId: this.householdId,
      idNumber: row_obj.idNumber,
      name: row_obj.name,
      age: row_obj.age,
      gender: row_obj.gender,
      contact: row_obj.contact,

      occupation: row_obj.occupation,
      workplace: row_obj.workplace,
      workzone:row_obj.workzone,
      
      covid_test_status: row_obj.covid_test_status,
      vaccine_status: row_obj.vaccine_status,
      most_active: row_obj.most_active,
      type: row_obj.type
    }
    this.dataservice.createMember(obj).subscribe(res => {
      if (res.success === "true") {
        this.dataSource.push({
          idNumber: row_obj.idNumber,
          name: row_obj.name,
          age: row_obj.age,
          gender: row_obj.gender,
          contact: row_obj.contact,

          occupation: row_obj.occupation,
          workplace: row_obj.workplace,
          workzone:row_obj.workzone,
          covid_test_status: row_obj.covid_test_status,
          vaccine_status: row_obj.vaccine_status,
          most_active: row_obj.most_active,
          type: row_obj.type
        });
        this.table.renderRows();
        this.dataservice.familyMember = this.dataSource
      }
    })
  }

  updateRowData(row_obj) {
    let obj = {
      hhId: this.householdId,
      id: row_obj.id,
      
      idNumber: row_obj.idNumber,
      name:row_obj.name,
      age: row_obj.age,
      gender: row_obj.gender,
      contact:row_obj.contact,
      
      occupation: row_obj.occupation,
      workplace: row_obj.workplace,
      workzone:row_obj.workzone,
      covid_test_status: row_obj.covid_test_status,
      vaccine_status: row_obj.vaccine_status,
      most_active: row_obj.most_active,
      type: row_obj.type
    }
    this.dataservice.updateMember(obj).subscribe(res => {
      if (res.success === "true") {
        this.dataservice.postProgress(Number(sessionStorage.getItem('buildingId'))).subscribe(res=>{
          console.log("in progress");
        });
        this.dataSource = this.dataSource.filter((value, key) => {
          if (value.id === row_obj.id) {
            value.idNumber= row_obj.idNumber;
            value.age = row_obj.age;
            value.gender = row_obj.gender;
            value.name =row_obj.name;
            value.contact =row_obj.contact;

            value.occupation=row_obj.occupation;
            value.workplace = row_obj.workplace;
            value.workzone =row_obj.workzone;

            value.covid_test_status =row_obj.covid_test_status;
            value.vaccine_status =row_obj.vaccine_status;
            value.most_active = row_obj.most_active;

            value.type= row_obj.type;
          }
          return true;
        });
        this.dataservice.familyMember = this.dataSource
      }
    })
  }
  deleteRowData(row_obj) {
    this.dataservice.deleteMember(row_obj.id).subscribe(res => {
      if (res.success === "true") {
        this.dataSource = this.dataSource.filter((value, key) => {
          return value.id != row_obj.id;
        });
        this.dataservice.familyMember = this.dataSource
      }
    })
  }

  logData() {
    console.log(this.dataSource)
  }
}
