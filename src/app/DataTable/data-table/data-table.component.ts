import { Component,  ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/DataTable/dialog-box/dialog-box.component';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  household_id:number;
  id:number;
  cid: string;
  age: number;
  gender:string;
  incomeEarner:string;

}

const ELEMENT_DATA: UsersData[] = [
];

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent  {
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  i=1;

  displayedColumns: string[] = ['id','cid', 'age', 'gender', 'IncomeEarner','action'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog, private dataservice:DataService) {}

  openDialog(action,obj) {
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
    this.dataSource.push({
      id: this.i++,
      cid:row_obj.cid,
      age:row_obj.age,
      gender:row_obj.gender,
      incomeEarner:row_obj.incomeEarner,
      household_id:123
    });
    this.table.renderRows();
    this.dataservice.familyMember = this.dataSource

  }
  updateRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.id === row_obj.id){
        value.cid = row_obj.cid;
        value.age = row_obj.age;
        value.gender = row_obj.gender;
      }
      return true;
    });
    this.dataservice.familyMember = this.dataSource

  }
  deleteRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.cid != row_obj.cid;
    });
    this.dataservice.familyMember = this.dataSource

  }

  logData(){
    console.log(this.dataSource)
  }
}
