import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DataService } from 'src/app/service/data.service';
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

  clickedOnBtn = false;
  
  subzoneId = Number(sessionStorage.getItem("subZoneId"));
  redBuildingGeojson:L.GeoJSON;
  selectedRedBuilding:any = {
    structure_id:"...fetching",
    remarks:"...fetching",
    status:"...fetching",
    lat:0,
    lng:0,
    id:"..fetching"
  }

  constructor(
    private dataservice:DataService,
    private router:Router
  ) { }

  ngOnInit() {
    this.map = L.map('map', {
      center: [27.4774143, 89.6265286],
      zoom: 15,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    })
    this.map.on("click", (e:any)=>{
      if(e.latlng.lat !== this.selectedRedBuilding.lat &&
        e.latlng.lng !== this.selectedRedBuilding.lng
        ){
          this.clickedOnBtn = false;
          if(!this.clickedOnBtn){
            document.getElementById("overlay-widget").style.zIndex = '-1'
          }
        }
    })

    function getColor(status){
      switch (status){
        case "ACTIVE":
          return "red"
          break;
        case "INACTIVE":
          return "green"
          break;
        case "PROGRESS":
          return "blue"
          break
      }
    }

    this.dataservice.getRedBuildingGeojsonByZoneId(this.subzoneId).subscribe(res=>{
      this.redBuildingGeojson = L.geoJSON(res, {
        onEachFeature: (feature:any, layer) => {
          layer.on('click', (e) => {
            this.selectedRedBuilding = feature.properties;
            this.selectedRedBuilding.lat = feature.coordinates[1];
            this.selectedRedBuilding.lng = feature.coordinates[0];
            document.getElementById("overlay-widget").style.zIndex = '999'
          });

        },
        pointToLayer: (feature, latLng) => {
          let bldgMarker: L.CircleMarker = L.circleMarker(latLng, {
            radius:6,
            fillOpacity:1,
            weight:0.1,
            fillColor:getColor(feature.properties.status)
          })
          return bldgMarker;
        }
      }).addTo(this.map);
      this.map.fitBounds(this.redBuildingGeojson.getBounds())
    })
  }


  viewDetails(){
    this.clickedOnBtn = true;
    
    document.getElementById("overlay-widget").style.zIndex = '999' 
    this.router.navigate(['redbuilding/redflats/',this.selectedRedBuilding.structure_id,this.selectedRedBuilding.id])
  }

  openFlats(){
    this.router.navigate(['redbuilding/zonegojay'])
  }
}
