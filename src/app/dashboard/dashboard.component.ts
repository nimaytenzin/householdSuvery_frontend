import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../service/data.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SoundService } from '../service/sound.service';


export class Qrcode {
  qr_code_id: number;
  sub_zone_id: number;
  user_id: number;
  household_detail_id: number;
  lat: number;
  lng: number;
  accuracy: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  qrcode: Qrcode;
  longitude: number;
  latitude: number;
  accuracy: number;
  units = [];
  buildingId:number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private soundService: SoundService
  ) {
    this.qrcode = new Qrcode();
  }

  ngOnInit() {
    this.buildingId = this.route.snapshot.params['id'];
    sessionStorage.setItem('buildingId',this.buildingId.toString());
    this.getUnits(this.buildingId);
  }

  redirect(path) {
    sessionStorage.setItem('transactionType', 'registration');
    this.router.navigate([path]);
  }
  getUnits(bid){
    this.dataService.getUnits(bid).subscribe(response=>{
      if(response['success']=="true"){
        this.units=response['data'];
      }else if(response['success']=="false"){
        console.log("no units for this building")
      }else{
          this.snackBar.open('error retrieving units' , '', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
      }
    }) 
  } 

  gotocamera(){
    this.router.navigate(['camera']);
  }

  goback(){
    this.router.navigate(['map']);
  }

  gotoatm(){
    this.router.navigate(['atm'])
  }

  update() {
    sessionStorage.setItem('transactionType', 'update');
    this.router.navigate(['map']);
  }
  // unit(){
  //   this.router.navigate([])
  // }
  markcomplete(){
    const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: "Confirm Mark Complete",
        message: "Are you sure you want to mark building as complete?"
      }
    });
    confirmDialog.afterClosed().subscribe(result=>{
      if(result == true){
        this.dataService.postCompletion(sessionStorage.getItem('buildingId')).subscribe(response=>{
          if(response['success'] === "true"){
              this.router.navigate(['map']);
              this.snackBar.open('building Marked Complete' , '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
          }else{
              this.snackBar.open('Could not mark Complete' , '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
          }
        })   
      }
    });
  }

  regHouse(){
    this.router.navigate(['building']);
  }
  unit(){
    this.router.navigate(['unit']);
  }

  getLocation(): void {
    if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition((position) => {
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          this.accuracy = position.coords.accuracy;
        }, error => {
          console.error('No support for geolocation');
        }, options);
    } else {
       console.error('No support for geolocation');
    }
  }
}
