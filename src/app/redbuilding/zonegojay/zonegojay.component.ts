import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';

interface RedBuilding{
  id:number,
  ownerName:string;
  structure_id:number;
  status:string;
  cordonDate:string;
  remarks:string;
  ownerContact:string
}
@Component({
  selector: 'app-zonegojay',
  templateUrl: './zonegojay.component.html',
  styleUrls: ['./zonegojay.component.css']
})
export class ZonegojayComponent implements OnInit {
  subZoneId = Number(sessionStorage.getItem("subZoneId"));
  totalActiveRedBuildings:Number;
  totalActiveRedFlats:Number;
  redBuildings =[];
  inProgressRedbuildings=[];
  redClusters=[];
  subZoneName="Taba Lam Wog"


  constructor(
    private router:Router,
    private dataservice:DataService
    ) { }

  ngOnInit() {
    if(!this.subZoneId){
      this.router.navigate(['login'])
    }

    this.dataservice.getRedBuildingStatsByZone(this.subZoneId).subscribe(res=>{
      this.totalActiveRedBuildings = res.data.activeBuildings
    })
    this.dataservice.getRedFlatStatsByZone(this.subZoneId).subscribe(res=>{
      this.totalActiveRedFlats = res.data.activeFlats
    })
 
    this.dataservice.getRedbuildingsInSubZone(this.subZoneId).subscribe(res =>{
      console.log(res)
      res.data.forEach(building=>{
        this.dataservice.getBuildingInfo(building.structure_id).subscribe(res=>{

          let data:RedBuilding = {
            id:building.id,
            structure_id : building.structure_id,
            remarks:building.remarks,
            status:building.status,
            cordonDate:this.getReadableDate(building.createdAt),
            ownerName:res.data.nameOfBuildingOwner,
            ownerContact:res.data.contactOwner
          }
          this.redBuildings.push(data)
        })
        
      })

      
      
    })

    console.log("RED BUILDINGS", this.redBuildings)


  }



  viewRedBuildingDetails(structureId, redbuildingId){
    this.router.navigate(['redbuilding/redflats/',structureId,redbuildingId ])
  }

  getReadableDate(date){
    return new Date(date).toDateString()
  }
  viewMap(){
    this.router.navigate(['redbuilding/map'])
  }
}
