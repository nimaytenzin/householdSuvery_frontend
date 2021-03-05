import { Component,  Input,  OnInit,  ViewChild , OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/DataTable/dialog-box/dialog-box.component';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  sid:number;
  idNumber: string;
  age: number;
  gender:string;
  incomeEarner:string;
  type:string;
}

const ELEMENT_DATA: UsersData[] = [];

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

  @Input() members:UsersData[];

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
        // console.log("test")
      }
    });
  }

  addRowData(row_obj){
    this.dataSource.push({
      sid: this.i++,
      idNumber:row_obj.cid,
      age:row_obj.age,
      gender:row_obj.gender,
      incomeEarner:row_obj.incomeEarner,
      type:row_obj.type
    });
    this.table.renderRows();
    this.dataservice.familyMember = this.dataSource

  }
  updateRowData(row_obj){
    let obj={}
    this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.sid === row_obj.sid){
        value.sid = row_obj.sid;
        value.idNumber= row_obj.cid;
        value.age = row_obj.age;
        value.gender = row_obj.gender;
        value.type = row_obj.type;
        value.incomeEarner = row_obj.incomeEarner;
      }
      obj = value
      console.log(obj)
      return true;
    });
    this.dataservice.familyMember = this.dataSource
  }
  deleteRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.idNumber != row_obj.cid;
    });
    this.dataservice.familyMember = this.dataSource
    this.dataservice.deleteMember(row_obj.id).subscribe(res=>{
      if(res.success === "true"){
        console.log(res)
      }
    })
  }

  logData(){
    console.log(this.dataSource)
  }
}
