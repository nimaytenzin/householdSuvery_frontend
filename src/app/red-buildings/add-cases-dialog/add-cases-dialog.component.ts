import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data.service';



export class Case{
  red_building_id:number
  dzo_id:number;
  date: Date;
  numCases:number;
  remarks: string;
  status:string;
  case_id:string;
}


@Component({
  selector: 'app-add-cases-dialog',
  templateUrl: './add-cases-dialog.component.html',
  styleUrls: ['./add-cases-dialog.component.css']
})
export class AddCasesDialogComponent implements OnInit {

  addCaseForm:FormGroup;
  newCase = new Case;
  today:Date;
  covidCases:[];

  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<AddCasesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private dataservice:DataService
  ) { }

  ngOnInit() {
    this.reactiveForm();
    this.fetchCaseData();
  }

  fetchCaseData(){
    this.dataservice.getCasesByRedbuilingId(this.data.red_building_id).subscribe(res =>{
      this.covidCases = res.data;
      console.log(res.data)
    })
  }

  reactiveForm(){
    this.addCaseForm = this.fb.group({
      date:[new Date()],
      numCases:[],
      case_id:[],
      remarks:[],
      status:[]
    });   
  }

  submit(){

      this.newCase.case_id = this.addCaseForm.get('case_id').value;
      this.newCase.date = this.addCaseForm.get('date').value;
      this.newCase.numCases = this.addCaseForm.get('numCases').value;
      this.newCase.dzo_id = this.data.dzo_id;
      this.newCase.red_building_id = this.data.red_building_id;
      this.newCase.remarks =this.addCaseForm.get('remarks').value;
      this.newCase.status = this.addCaseForm.get("status").value;

      console.log(this.newCase)

      this.dataservice.createNewCase(this.newCase).subscribe(res =>{
        if(res.status=== "success"){
          this.fetchCaseData();
        }
      })


    // this.newCase.lat = this.data.object.coordinates[1];
    // this.newCase.lng = this.data.object.coordinates[0];
    // this.newCase.structure_id = this.data.object.properties.structure_id;
    // this.newCase.numCases = this.addCaseForm.get('cases').value;
    // this.newCase.date = this.addCaseForm.get('date').value;
    // this.newCase.remarks = this.addCaseForm.get('remarks').value;
    // this.newCase.dzongkhag_id = Number(sessionStorage.getItem('dzongkhag_id'));
    
    // console.log(this.newCase)
    // this.dataservice.addRedBuilding(this.newCase).subscribe(res => {
    //   // this.dialogRef.close()
    //   console.log(res)
    // })

  }

}
