import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-zonegojay-map',
  templateUrl: './zonegojay-map.component.html',
  styleUrls: ['./zonegojay-map.component.css']
})
export class ZonegojayMapComponent implements OnInit {
  map: L.Map;
  redbuildingMarker;
  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });
  constructor() { }

  ngOnInit() {
    this.map = L.map('map', {
      center: [27.4774143, 89.6265286],
      zoom: 15,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    });

    let coords = L.latLng(27.4774143, 89.6265286)
    this.redbuildingMarker = new L.Circle(coords, {
      radius: 18,
      color: 'rgb(235, 58, 58)'
    }).addTo(this.map).on("click", this.circleClick)

  }

  circleClick(){
    console.log("hello");
    document.getElementById("map-button").style.transform = 'translateX(10px)	'
  }

}
