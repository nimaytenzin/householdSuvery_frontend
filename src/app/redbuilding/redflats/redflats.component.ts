import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';
import * as L from 'leaflet';
import { AddFlatmembersComponent } from '../add-flatmembers/add-flatmembers.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redflats',
  templateUrl: './redflats.component.html',
  styleUrls: ['./redflats.component.css']
})
export class RedflatsComponent implements OnInit {
  map:L.Map;
  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });
  redbuildingMarker:L.Circle;

  constructor(
    private dialog: MatDialog,
    private router:Router
  ) { }

  ngOnInit() {
    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 16,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    });

    let coords =  L.latLng( 26.864894,89.38203)

    this.redbuildingMarker = new L.Circle(coords,{
      radius: 18,
          color: 'rgb(235, 58, 58)'
    }).addTo(this.map)
    
  }

  openRedFlatAddDialog(){
    this.dialog.open(AddRedflatDialogComponent)
  }

  addFamilyMember(){
    this.dialog.open(AddFlatmembersComponent)
  }

  backToDashboard(){
    this.router.navigate(['redbuilding/zonegojay'])
  }
}
