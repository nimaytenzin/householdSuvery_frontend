import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../service/data.service';
import { Class } from 'leaflet';

interface AtmType{
  id: string;
  name: string;
  checked: boolean;
}

export class AtmData{
  building_id:number;
  data : any;
}

@Component({
  selector: 'app-register-atm',
  templateUrl: './register-atm.component.html',
  styleUrls: ['./register-atm.component.scss']
})

export class RegisterAtmComponent implements OnInit {
  atmForm : FormGroup;
  buildingId: number;
  displayForm: true;
  atmData : AtmData;

  atms: AtmType[]=[
    {id:'1', name:"Bhutan Development Bank(BDB)", checked:false},
    {id:'1', name:"Bank of Bhutan(BOB)",checked:false},
    {id:'2', name:"Bhutan National Bank(BNB)",checked:false},
    {id:'2', name:"Punjab National Bank(PNB)",checked:false},
    {id:'2', name:"Tashi Bank(T Bank",checked:false},
  ]

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.buildingId = Number(sessionStorage.getItem('buildingId'));
    this.reactiveForms();
  }

  reactiveForms(){
    this.atmForm = this.fb.group({
      atmBankControl:[],
    });
  }
  atmSelect(atm,$event){
    this.atms[atm.id].checked = $event.checked;
  }

  submit(){
    this.registerAtm();
  }

  registerAtm(){
    this.atmData.building_id = this.buildingId;
    let atm_data =[];
    this.atms.forEach((item,index)=>{
      if(item['checked'] === true){
        atm_data.push({"building_id":this.buildingId, "type":item['name']});
      }
    });
    this.atmData.data = atm_data;

   
  //   this.dataService.postAtm(this.atmData).subscribe(response=>{
  //     console.log(response.status);
  //     if(response.success === "true"){
  //       this.router.navigate(['dashboard',this.buildingId]);
  //       this.snackBar.open('ATM Registration Complete', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['success-snackbar']
  //       });

  //     }else if(response.success === "false"){
  //       this.snackBar.open('Could not register ATM'+response.msg, '', {

  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }else{
  //       this.snackBar.open('Error registering ATM', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   })
  // }

}
}
