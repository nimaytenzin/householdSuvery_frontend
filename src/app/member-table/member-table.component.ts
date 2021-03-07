import { Component,  Input,  OnInit,  ViewChild , OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/DataTable/dialog-box/dialog-box.component';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  idNumber: string;
  age: number;
  gender:string;
  incomeEarner:string;
  type:string;
}

const ELEMENT_DATA = [];

@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.css']
})
export class MemberTableComponent implements OnInit {

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  i=1;

  displayedColumns: string[] = ['sid','cid', 'age', 'gender', 'IncomeEarner','action'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog, private dataservice:DataService) {}

  @Input() members;
  @Input() householdId;

  ngOnInit(){
    this.dataservice.familyMember = null
    this.dataSource = [];
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['members']){
      this.dataSource = this.members
    }
  }

  openDialog(action,obj){
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    let obj = {
      hhId: this.householdId,
      idNumber:row_obj.idNumber,
      age:row_obj.age,
      gender:row_obj.gender,
      incomeEarner: row_obj.incomeEarner,
      type: row_obj.type
    }
    this.dataservice.createMember(obj).subscribe(res=>{
      if(res.success === "true"){
        this.dataSource.push({
          idNumber:row_obj.idNumber,
          age:row_obj.age,
          gender:row_obj.gender,
          incomeEarner: row_obj.incomeEarner,
          type: row_obj.type
        });
        this.table.renderRows();
        this.dataservice.familyMember = this.dataSource
      }
    })
  }

  updateRowData(row_obj){
    let obj = {
      hhId: this.householdId,
      id: row_obj.id,
      idNumber:row_obj.idNumber,
      age:row_obj.age,
      gender:row_obj.gender,
      incomeEarner: row_obj.incomeEarner,
      type: row_obj.type
    }
    console.log(obj)

    this.dataservice.updateMember(obj).subscribe(res=>{
      if(res.success === "true"){
        this.dataSource = this.dataSource.filter((value,key)=>{
          if(value.id === row_obj.id){
            value.id = row_obj.id;
            value.idNumber= row_obj.idNumber;
            value.age = row_obj.age;
            value.gender = row_obj.gender;
            value.type = row_obj.type;
            value.incomeEarner = row_obj.incomeEarner;
          }
          return true;
        });
        this.dataservice.familyMember = this.dataSource
      }
    })
  }
  deleteRowData(row_obj){
    this.dataservice.deleteMember(row_obj.id).subscribe(res=>{
      if(res.success === "true"){
        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.id != row_obj.id;
        });
        this.dataservice.familyMember = this.dataSource
      }
    })
  }

  logData(){
    console.log(this.dataSource)
  }
}
