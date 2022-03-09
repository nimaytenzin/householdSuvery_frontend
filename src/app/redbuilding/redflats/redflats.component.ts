import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';
import * as L from 'leaflet';
import { AddFlatmembersComponent } from '../add-flatmembers/add-flatmembers.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { EditRedmemberComponent } from '../edit-redmember/edit-redmember.component';
import { DeleteRedmemberComponent } from '../delete-redmember/delete-redmember.component';
import { EditRedflatComponent } from '../edit-redflat/edit-redflat.component';
import { UnsealRedflatComponent } from '../unseal-redflat/unseal-redflat.component';
import { AddSealhistoryComponent } from '../add-sealhistory/add-sealhistory.component';
import { EditSealhistoryComponent } from '../edit-sealhistory/edit-sealhistory.component';
import { DeleteSealhistoryComponent } from '../delete-sealhistory/delete-sealhistory.component';
import { SelectRedtypeComponent } from '../select-redtype/select-redtype.component';
import { EditRedtypeComponent } from '../edit-redtype/edit-redtype.component';

@Component({
  selector: 'app-redflats',
  templateUrl: './redflats.component.html',
  styleUrls: ['./redflats.component.css']
})
export class RedflatsComponent implements OnInit {
  map: L.Map;
  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });
  redbuildingMarker: L.Circle;
  structureId: number;
  redBuildingId: number;


  buildingData: any = {
    contactOwner: "..fetching",
    nameOfBuildingOwner: "..fetching",
    status: "..fetching",
    cordonDate: "..fetching",
    remarks: "..fetching",
    type:"FLAT"
  }
  googleMapLink: string;
  redFlats = [];
  today = new Date();
  dataLoaded = false;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.structureId = this.route.snapshot.params['structure_id'];
    this.redBuildingId = this.route.snapshot.params['redbuildingId'];
    this.map = L.map('map', {
      center: [27.4774143, 89.6265286],
      zoom: 15,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    });



    this.dataService.getBuildingInfo(this.structureId).subscribe(res => {
      this.buildingData.contactOwner = res.data.contactOwner;
      this.buildingData.nameOfBuildingOwner = res.data.nameOfBuildingOwner
      this.dataService.getRedbuildingsDetailsById(this.redBuildingId).subscribe(res => {
        this.buildingData.status = res.data.status;
        this.buildingData.cordonDate = this.getReadableDate(res.data.createdAt);
        this.buildingData.remarks = res.data.remarks
        this.buildingData.type = res.data.type? res.data.type:null
      
      })
      this.dataService.getStructureDetailsByStructureId(this.structureId).subscribe(resp => {
        let coords = L.latLng(resp.data.lat, resp.data.lng)
        this.googleMapLink = `http://www.google.com/maps/place/${resp.data.lat},${resp.data.lng}`
        this.redbuildingMarker = new L.Circle(coords, {
          radius: 18,
          color: 'rgb(235, 58, 58)'
        }).addTo(this.map)
        this.map.flyTo(coords, 16);
        this.dataService.getRedflatsByRedbuildingId(this.redBuildingId).subscribe(response => {
          response.data.forEach(dat => {
            let data = dat
            data.daysElapsed = this.getDaysElapsed(dat.first_seal_date);
            data.first_seal_date = this.getReadableDate(dat.first_seal_date);
            data.first_seal_time = this.convert24Hrsto12hrs(dat.first_seal_time);
            data.final_unseal_date = this.getReadableDate(data.final_unseal_date);
            this.dataService.getRedFamilyMembersByFlatId(dat.id).subscribe(respo => {
              data.familyMembers = respo.data;
            })
            this.dataService.getSealHistoryByFlatId(dat.id).subscribe(e => {
              data.sealHistory = e.data;
              data.sealHistory.forEach(hist => {
                hist.date = this.getReadableDate(hist.date);
                hist.open_time = this.convert24Hrsto12hrs(hist.open_time);
                hist.close_time = this.convert24Hrsto12hrs(hist.close_time);
              })

              console.log(data.sealHistory)

            })

            this.redFlats.push(data)
          })
        })
        this.dataLoaded = true

      })
    });


  }



  openRedFlatAddDialog() {
    this.dialog.open(AddRedflatDialogComponent, {
      data: Number(this.redBuildingId)
    }).afterClosed().subscribe(res => {
      if (res.success === true) {
        this.refreshFlatsData()
      } else {
        console.log("Update Failed")
      }
    })
  }

  refreshFlatsData() {
    this.redFlats = [];
    this.dataService.getRedflatsByRedbuildingId(this.redBuildingId).subscribe(response => {
      response.data.forEach(dat => {
        let data = dat
        data.daysElapsed = this.getDaysElapsed(dat.first_seal_date);
        data.first_seal_date = this.getReadableDate(dat.first_seal_date);
        data.first_seal_time = this.convert24Hrsto12hrs(dat.first_seal_time);
        data.final_unseal_date = this.getReadableDate(data.final_unseal_date);
        this.dataService.getRedFamilyMembersByFlatId(dat.id).subscribe(respo => {
          data.familyMembers = respo.data;
        })
        this.dataService.getSealHistoryByFlatId(dat.id).subscribe(e => {
          data.sealHistory = e.data;
          data.sealHistory.forEach(hist => {
            hist.date = this.getReadableDate(hist.date);
            hist.open_time = this.convert24Hrsto12hrs(hist.open_time);
            hist.close_time = this.convert24Hrsto12hrs(hist.close_time);
          })
        })
        this.redFlats.push(data)
      })
    })
  }

  addFamilyMember(flat_id) {
    this.dialog.open(AddFlatmembersComponent, {
      data: Number(flat_id)
    }).afterClosed().subscribe(res => {
      if (res.success === true) {
        this.refreshFlatsData()
      } else {
        console.log("Update Failed")
      }
    })
  }

  backToDashboard() {
    this.router.navigate(['redbuilding/zonegojay'])
  }

  getDaysElapsed(dateString) {
    var dateSealed = new Date(dateString);
    var Difference_In_Time = this.today.getTime() - dateSealed.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.floor(Difference_In_Days);
  }

  editRedMember(member) {
    this.dialog.open(EditRedmemberComponent, {
      data: member
    }).afterClosed().subscribe(
      res => {
        if (res) {
          if (res.success === true) {
            this.refreshFlatsData()
          } else {
            console.log("Update Failed")
          }
        }
      }
    )
  }

  deleteRedMember(member) {
    this.dialog.open(DeleteRedmemberComponent, {
      data: member
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }

  editRedFlat(redFlat) {
    this.dialog.open(EditRedflatComponent, {
      data: redFlat
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }
  unsealRedFlat(redFlat) {
    this.dialog.open(UnsealRedflatComponent, {
      data: redFlat
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )

  }

  getReadableDate(date) {
    return new Date(date).toDateString()
  }

  convert24Hrsto12hrs(time24) {
    let ts = time24;
    let H = +ts.substr(0, 2);
    let h = String((H % 12)) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  addNewSealHistory(flat_id: number) {
    this.dialog.open(AddSealhistoryComponent, {
      data: flat_id
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }

  editSealHistory(sealhistory) {
    this.dialog.open(EditSealhistoryComponent, {
      data: sealhistory
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }
  deleteSealHistory(sealHistory) {
    this.dialog.open(DeleteSealhistoryComponent, {
      data: sealHistory
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }
  selectCaseType(){
    this.dialog.open(SelectRedtypeComponent,{
      data:this.redBuildingId
    }).afterClosed().subscribe(
      res => {
        if (res.success === true) {
          this.refreshFlatsData()
        } else {
          console.log("Update Failed")
        }
      }
    )
  }

  editCaseType(){
    this.dialog.open(EditRedtypeComponent,{
      data:{
        id:this.redBuildingId,
        type:this.buildingData.type
      }
    })
  }

}
