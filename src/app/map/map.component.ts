import { Component, OnInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';

export class Building {
  lat: number;
  lng: number;
  sub_zone_id: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  API_URL = environment.API_URL;
  BASE_URL = environment.BASE_URL; 

  geojson:any
  latitude: number;
  longitude: number;
  accuracy: number;
  json: any;
  buildingId: number;
  isAddAllowed = false;
  building: Building;
  watchId;
  mylocation: L.Marker;
  mycircle: L.Circle;
  newMarker: L.Marker;
  bound: any;

  map: L.Map;

  greenMarker = L.icon({
    iconUrl: 'assets/marker-green.png',
    iconSize: [15, 15]
  });

  redMarker = L.icon({
    iconUrl: 'assets/marker-red.png',
    iconSize: [15, 15]
  });

  yellowMarker = L.icon({
    iconUrl: 'assets/marker-yellow.png',
    iconSize: [15,15]
  });
  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [20, 20]
  });

  

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private zone: NgZone
  ) {
    this.building = new Building();
  }

  ngOnInit() {
    this.renderMap();
  }

  getMyLocation(){
    this.map.locate({watch:true,enableHighAccuracy:true});
  }

  

  renderMap() {
    var sat = L.tileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 9,
    });
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 9,
    });
    this.map = L.map('map',{
      center:[27.4712,89.64191],
      zoom: 13,
      maxZoom:20,
      minZoom:9,
      layers: [sat]
    });
    var baseMaps = {
      "Satellite Image": sat,
      "OSM base map": osm 
    };

    L.control.layers(baseMaps,null,{position:"bottomleft"}).addTo(this.map);
    this.onMapReady(this.map)

    this.map.on('locationerror',(err)=>{
          if (err.code === 0) {
            this.snackBar.open('Couldnot pull your location, please try again later', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 1) {
            this.snackBar.open('Location service is disabled, please enable it and try again', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 2) {
            this.snackBar.open('Your location couldnot be determined', '', {
              verticalPosition: 'top',
              duration: 3000
            });
          }
          if (err.code === 3) {
              this.snackBar.open('Couldnot get your location', '', {
                verticalPosition: 'top',
                duration: 3000
              });
            }
    });

    this.map.on('locationfound',(e)=>{
      var radius = e.accuracy;
      if(this.mylocation !== undefined){
        this.map.removeLayer(this.mylocation);
      }
      this.mylocation = L.marker(e.latlng,{icon: this.myMarker}).addTo(this.map);

      if(radius<100){
        if(this.mycircle !== undefined){
          this.map.removeLayer(this.mycircle);
        }
        this.mycircle = L.circle(e.latlng,radius).addTo(this.map);
      }
    });
    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (this.newMarker !== undefined) {
          this.map.removeLayer(this.newMarker);
        }
        this.newMarker = L.marker($e.latlng, {icon: this.myMarker}).addTo(this.map);
        this.presentAlert($e.latlng);
      }
    });


  }

  onMapReady(map: L.Map) {
    const zoneID = Number(sessionStorage.getItem('subZoneId'));
    let geojson;
    if(geojson !== undefined){
      this.map.removeLayer(geojson)
    }else{
      geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${zoneID}`).subscribe((json:any)=>{
      this.bound= L.geoJSON(json.data,{
        style: (feature)=>{
          return {
            color:"red",
            fillOpacity:0
          }
        }
      }).addTo(this.map);
      this.map.fitBounds(this.bound.getBounds());
    })
    }
    

    // this.http.get(`${this.API_URL}/str-json/${zoneId}`).subscribe((json: any) => {

    this.dataService.getStructure(zoneID).subscribe((json: any) => {
      this.json = json;
      console.log(json);
      const geoJson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.buildingId = feature.properties.structure_id;
              if(feature.properties.status === "COMPLETE"){
                this.snackBar.open(`Building with id ${this.buildingId} marked complete. Cannot edit`, '', {
                  duration: 5000,
                  verticalPosition: 'top',
                  panelClass: ['error-snackbar']
                });
              }else{
                this.router.navigate(['dashboard', this.buildingId]);
                this.snackBar.open('Building number ' + this.buildingId + ' was successfully selected', '', {
                  duration: 5000,
                  verticalPosition: 'top',
                  panelClass: ['success-snackbar']
                });
              }
            });
          }, pointToLayer: (feature, latLng) => {
            if(feature.properties.status == 'INCOMPLETE'){
              return L.marker(latLng, {icon: this.redMarker});
            }else if(feature.properties.status == "PROGRESS"){
              return L.marker(latLng, {icon: this.yellowMarker});
            } else{
              return L.marker(latLng, {icon: this.greenMarker});
            }
          }
        }).addTo(map);
        // this.map.fitBounds(geoJson.getBounds());
    });
    
  }

  toggleAdd() {
    this.snackBar.open('Tap on the structure/building you want to add', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
    this.isAddAllowed = true;
  }



  presentAlert(latlng) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to add the selected building?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.building.lat = latlng.lat;
        this.building.lng = latlng.lng;
        this.building.sub_zone_id = Number(sessionStorage.getItem('subZoneId'));
        this.dataService.postStructure(this.building).subscribe(response => {
          this.buildingId = response.data.id;
          this.snackBar.open('Building number ' + this.buildingId + ' has been successfully identified', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.isAddAllowed = false;
          if(this.geojson!== undefined){
            this.map.removeLayer(this.geojson)
            this.geojson= undefined
          }
          if(this.newMarker !== undefined){
            this.map.removeLayer(this.newMarker)
            this.newMarker = undefined
          }
          this.getBuilding(this.map)
        });
      }else{
        this.map.removeLayer(this.newMarker)
        this.isAddAllowed = false;
      }
    });
  }

  getBuilding(map: L.Map){
    // Added buildings here
    const zoneID = Number(sessionStorage.getItem('subZoneId'));
    this.dataService.getStructure(zoneID).subscribe(res => {
     this.json = res
      this.geojson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.buildingId = feature.properties.structure_id;
              if(feature.properties.status === "COMPLETE"){
                this.snackBar.open(`Building with id ${this.buildingId} marked complete. Cannot edit`, '', {
                  duration: 5000,
                  verticalPosition: 'top',
                  panelClass: ['error-snackbar']
                });
              }else{
                this.router.navigate(['dashboard', this.buildingId]);
                this.snackBar.open('Building number ' + this.buildingId + ' was successfully selected', '', {
                  duration: 5000,
                  verticalPosition: 'top',
                  panelClass: ['success-snackbar']
                });
              }
            });
              if(this.geojson!== undefined){
                this.map.removeLayer(this.geojson)
                this.geojson= undefined
              }    
          }, pointToLayer: (feature, latLng) => {
            if(feature.properties.status == 'INCOMPLETE'){
              return L.marker(latLng, {icon: this.redMarker});
            }else if(feature.properties.status == "PROGRESS"){
              return L.marker(latLng, {icon: this.yellowMarker});
            } else{
              return L.marker(latLng, {icon: this.greenMarker});
            }
          }
        }).addTo(map);
      this.getBuilding(this.map)
    });
  }

}
