import { Component, OnInit } from '@angular/core';
import {WebcamImage} from 'ngx-webcam';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
  buildingId: number;

  constructor(
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.buildingId = Number(sessionStorage.getItem('buildingId'));
  }

  public webcamImage: WebcamImage = null;

  clearImg(){
    this.webcamImage = null;
  }
  
  goback(){
    this.router.navigate(['dashboard',this.buildingId]);
  }

  uploadImg(){

    // this.router.navigate(['dashboard',this.buildingId]);
    if(this.webcamImage){
      let jsonObject = {
        "building_id":this.buildingId,
        "imageDataUrl":this.webcamImage.imageAsDataUrl
      }
      this.dataService.uploadImg(jsonObject).subscribe(response=>{
        if(response.success === "true"){
          this.router.navigate(['dashboard',this.buildingId]);
          this.snackBar.open('Uploaded Image', '', {
            duration: 5000,
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        }else if(response.success === "false"){
          this.snackBar.open('Could not upload image'+response.msg, '', {
            duration: 5000,
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }else if(response.success === "error"){
          this.snackBar.open('Error Uploading Image', '', {
            duration: 5000,
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }
    })
  }
}

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

}