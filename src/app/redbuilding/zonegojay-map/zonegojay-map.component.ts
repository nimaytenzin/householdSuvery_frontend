import { Component, OnInit } from '@angular/core';
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
    lng:0
  }

  constructor(
    private dataservice:DataService
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
          console.log("CLICKED outside");
          this.clickedOnBtn = false;
          if(!this.clickedOnBtn){
            document.getElementById("overlay-widget").style.zIndex = '-1'
          }
        }
    })

    this.dataservice.getRedBuildingGeojsonByZoneId(this.subzoneId).subscribe(res=>{
      this.redBuildingGeojson = L.geoJSON(res, {
        onEachFeature: (feature:any, layer) => {
          layer.on('click', (e) => {
            console.log(feature)
            this.selectedRedBuilding = feature.properties;
            this.selectedRedBuilding.lat = feature.coordinates[1];
            this.selectedRedBuilding.lng = feature.coordinates[0];
            this.circleClick(feature)
            document.getElementById("overlay-widget").style.zIndex = '999'
          });

        },
        pointToLayer: (feature, latLng) => {
          let bldgMarker: L.CircleMarker = L.circleMarker(latLng, {
            radius:5,
            color:'red',
            fillColor:'red'
          })
          return bldgMarker;
        }
      }).addTo(this.map);
      this.map.fitBounds(this.redBuildingGeojson.getBounds())
    })
  }

  circleClick(feature){
    console.log(feature);
    
  }
  viewDetails(){
    this.clickedOnBtn = true;
    
    document.getElementById("overlay-widget").style.zIndex = '999' 
    console.log("CliCk on btn")
  }

}
