import { Component,  Input,  OnInit,  ViewChild , OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/DataTable/dialog-box/dialog-box.component';
import { DataService } from 'src/app/service/data.service';

export interface UsersData {
  id:number;
  idNumber: string;
  name:string;
  age: number;
  gender:string;
  contact:number;
  occupation:string;
  workplace:string;
  workzone:string;
  covid_test_status:boolean;
  vaccine_status:boolean;
  most_active:boolean;
  type:string;
}

const ELEMENT_DATA: UsersData[] = [
];

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent  implements OnInit{
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  i=1;

  displayedColumns: string[] = ['id','action','cid', 'age', 'gender','contact','occupation','workplace','workzone','covid_test_status','vaccine_status','most_active'];
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

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '90vw',
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
      idNumber:row_obj.idNumber,
      name:row_obj.name,
      age:row_obj.age,
      contact:row_obj.contact,
      occupation:row_obj.occupation,
      workplace:row_obj.workplace,
      workzone:row_obj.workzone,
      gender:row_obj.gender,
      covid_test_status:row_obj.covid_test_status,
      vaccine_status:row_obj.vaccine_status,
      most_active:row_obj.most_active,
      type:row_obj.type
    });
    this.table.renderRows();
    this.dataservice.familyMember = this.dataSource

  }
  updateRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.id === row_obj.id){
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
  deleteRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.idNumber!= row_obj.idNumber;
    });
    this.dataservice.familyMember = this.dataSource

  }

  logData(){
    console.log(this.dataSource)
  }
}
