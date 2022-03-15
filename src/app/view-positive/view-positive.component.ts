import { Component, OnInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Options } from "@angular-slider/ngx-slider";


export class Building {
  lat: number;
  lng: number;
  sub_zone_id: number;
}


interface Zone {
  id: string;
  name: string;
  map_image: string;
  dzongkhag_id: number;
  color_code: string;
  lat: number;
  lng: number;
  created_at: string;
  updated_date: string;
}


interface Subzone {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  zone_id: number;
}
interface Dzongkhag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export class BuildingInfo {
  BuildingName: string;
  BuildingOwner: string;
  Contact: string;
  BuildingUse: string;
  Sewer: string;
  Water: string;
  Waste: string;
  Remarks: string;
}

interface IdName {
  id: string;
  name: string;
}


@Component({
  selector: 'app-view-positive',
  templateUrl: './view-positive.component.html',
  styleUrls: ['./view-positive.component.scss']
})
export class ViewPositiveComponent implements OnInit {



  displayedColumns: string[] = ['position', 'view'];
  totalBuilding: number;
  totalCompleted: number;
  showBuildingInfo: boolean = false;
  slide = false;
  precentCompleted: number;
  progressShow: boolean = false;
  showFamilyMembers: boolean = false;
  addDeleteButtons: boolean = false;
  deleteButton: boolean = false;
  deleteID: number;
  unitDetailShow: boolean;
  responseData: any;

  //delete building info
  bid: number;

  buildingUse: string = "Not in database";
  cidOwner: string = "Not in database";
  nameOfBuildingOwner: string = "Not in database";
  contactOwner: string = "Not in database";
  length: number = 0;
  enumeratedBy: string = "No Info."
  value: number = 2;
  options: Options = {
    showTicksValues: true
  };


  redFlats: any;
  redHouseholdData: {
    "red_building_id": number,
    "unitName": string,
    "status": string,
    "hh_name": string
    "cid": string
    "contact": string,
    "first_seal_date": string,
    "first_seal_time": string,
    "final_unseal_date": string,
    "remarks": string,
    "sealer_id": number,
    "createdAt": string,
    "updatedAt": string,
    "seals":{
      "date": string,
      "open_time": string,
      "close_time": string,
      "reason": string,
      "operator": {
          "username": string,
          "cid": number
      }
    },
    "members": {
      "id": number,
      "flat_id": number,
      "name": string,
      "age": string,
      "gender": string,
      "isComorbid": boolean,
      "createdAt": string,
      "updatedAt": string
    },
    "sealer":{
      "id": number,
      "username": string,
      "cid": number
    }
  }


  
  unitsData: any;
  housholdsData: {
    unitId: number,
    enumeratedBy: string,
    unitOwnership: string,
    name: string,
    cid: number,
    age: number,
    gender: string,
    employment: string,
    employmentOrg: string,
    workzone: string,
    numberHousehold: number,
    incomeEarner: number,
    householdIncome: number,
    shopOfficeName: string,
    covid_test_status: boolean,
    vaccine_status: boolean,
    most_active: boolean,
    shopOfficeContact: number,
    shopOfficeRent: number
  } = {
      unitId: 0,
      enumeratedBy: 'No info',
      unitOwnership: "Not added",
      name: "Not added",
      cid: 0,
      age: 0,
      gender: "",
      employment: "",
      employmentOrg: "",
      workzone: "",
      covid_test_status: false,
      vaccine_status: false,
      most_active: false,
      numberHousehold: 0,
      incomeEarner: 0,
      householdIncome: 0,
      shopOfficeName: "NA",
      shopOfficeContact: 0,
      shopOfficeRent: 0
    };
  familyMembers: any;

  //chart js
  API_URL = environment.API_URL;
  BASE_URL = environment.BASE_URL;
  searchForm: FormGroup;
  searchmarker: L.GeoJSON;
  searchedId: any;
  selectZone: boolean;
  clearData: boolean;
  showSuperZone = false;
  showSubZone = false;
  residentialUnits = [];

 
  dzongkhags: Dzongkhag[] = [];
  zones: Zone[] = [];
  subZones: Subzone[] = [];
  isUserLoggedIn: boolean;
  zoned: string;
  subZone: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  json: any;
  bound: any;
  zonebound: any;
  buildingGeojson: any;
  buildingId: number;
  imgs: any;
  residentTableShow: boolean = false;
  redFlatDetailShow: boolean = false;
  redFlatTableShow: boolean = false;

  isAddAllowed = false;
  buildings: any;
  building: any;
  buildingInfo: BuildingInfo;
  watchId;
  mylocation: L.Circle;
  mycircle: L.Circle;
  resident: any;
  showattic = false;
  showCaseDetails = false;
  stepvalue = []
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //logic

  total_cases: Number = 0;
  red_buildings: any = 0;


  cases: [

  ]

  

  redBuildingInactiveMarkerOptions = {
    radius: 5,
    fillColor: "#33A733",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1  
  }

  redBuildingMarkerActiveOptions = {
    radius: 8,
    fillColor: "#FF0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  redFlatMarkerActiveOptions = {
    radius: 8,
    fillColor: "#FF1BBB",
    color: "#4B4B44",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }


  setViewValue: boolean;



  //New
  dzongkhagId: number
  redBuildingGeojson: any;
  selectedRedBuilding: any;
  redBuildingCases: any;
  dzongkhag: any;
  totalCases: number;
  totalRedBuildings: number;
  totalRedFlats: number;
  selectedDzongkhagId: number;
  searchDzongkhagId: number;

  quarantineFacilityGeojsonUrl = "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/quarantine.geojson";
  isolationFacilityGeojsonUrl = "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/isolation.geojson"
  zoneMapUrl;
  quarantineFacilities: L.GeoJSON;
  isolationFacilities: L.GeoJSON;
  zoneMap: L.GeoJSON;
  mapLayerControl: L.Control;

  map: L.Map;
  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });
  carto = L.tileLayer("https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png");
  overlayMaps = {}
  baseMaps = {
    "Satellite": this.sat,
    "Carto": this.carto
  }

  yellowChiwogs;
  redChiwogs;

  searchBuildingId: number;
  redbuildings;
  serachCircleMarker: L.Circle;

  zonesUrl: "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/thimphuZones.geojson";
  MegaZonesUrl: "";

  thimphuZones: L.GeoJSON;
  thimphuMegaZones: L.GeoJSON;
  thimphuPoe: L.GeoJSON;
  thimphuRedClusters: L.GeoJSON;
  redflats:[];




  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private zone: NgZone,
    private fb: FormBuilder
  ) {
    this.building = new Building();
    this.buildingInfo = null;
    this.selectZone = false;
    this.clearData = false;
    this.setViewValue = true;
    this.totalCases = 0;
    this.totalRedBuildings = 0
    this.totalRedFlats= 0
  }

  ngOnInit() {
    this.dzongkhagId = Number(sessionStorage.getItem("dzongkhagId"));
    this.searchDzongkhagId = Number(sessionStorage.getItem("dzongkhagId"))


    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 13,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    });


    if (this.dzongkhagId === 1) {
      fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/thimphuZones.geojson")
        .then(res => res.json())
        .then(data => {
          console.log(data)
          this.thimphuZones = L.geoJSON(data, {
            onEachFeature: function (feature, featureLayer) {
              featureLayer.bindPopup(
                '<p style:"color:tomtato">Zone Name: ' + feature.properties.Zone + '</p>'
              )

            },
            style: {
              color: "#29DCFB", weight: 1.5, fillOpacity: 0.1
            }
          })
          fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/megaZoneThimphu.geojson")
            .then(res => res.json())
            .then(dat => {
              this.thimphuMegaZones = L.geoJSON(dat, {
                onEachFeature: function (feature, featureLayer) {
                  featureLayer.bindPopup(
                    '<p style:"color:tomtato">MegaZone: ' + feature.properties.Name + '</p>'
                  )
                  if (!featureLayer.isPopupOpen()) {
                    featureLayer.openPopup()
                  }
                  featureLayer.openPopup()
                },
                style: {
                  color: "#FFF67FCE", weight: 1.5, fillOpacity: 0,fillColor:"black"
                }
              })
              this.overlayMaps['Megazones'] = this.thimphuMegaZones
              if(this.mapLayerControl !== undefined){
                this.mapLayerControl.remove()
              }
              this.mapLayerControl = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);
              fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/redclusterThimphu.geojson")
                .then(res => res.json())
                .then(ok => {
                  this.thimphuRedClusters = L.geoJSON(ok, {
                    onEachFeature: function (feature, featureLayer) {
                      featureLayer.bindPopup(
                        '<p style:"color:tomtato">Cluster: ' + feature.properties.Name + '</p>'
                      )
                    },
                    style: {
                      color: "#E72424CE", weight: 3, fillOpacity: 0.2
                    }
                  })
                  this.overlayMaps['RedClusters'] = this.thimphuRedClusters
                  if(this.mapLayerControl !== undefined){
                    this.mapLayerControl.remove()
                  }
                  this.mapLayerControl = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);
                  this.reOrderLayer()
                })
            })

            this.overlayMaps['Thimphu Zones'] = this.thimphuZones
            
            if(this.mapLayerControl !== undefined){
              this.mapLayerControl.remove()
            }
            this.mapLayerControl = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);
            this.reOrderLayer();
            this.fetchAndSetCovidStats(this.dzongkhagId)
            this.renderRedBuildings(this.dzongkhagId)
        })
    }

  
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data
      response.data.forEach(element => {
        if (this.dzongkhagId === element.id) {
          this.dzongkhag = element.name
        }
      });
    });
  }

  fetchAndSetCovidStats(dzoId) {
    this.dataService.getCovidStatsByDzongkhag(dzoId).subscribe(res => {
      console.log(res)
      this.totalCases = res.data.numCases;
      this.totalRedBuildings = res.data.activeBuilding
    })
    this.dataService.getRedflatStats().subscribe(res=>{
      this.totalRedFlats = res.data.activeFlats
    })
  }
  getMyLocation() {
    this.map.locate({ watch: true, enableHighAccuracy: true });
    this.map.on('locationfound', (e) => {
      var radius = e.accuracy;
      if (this.mylocation !== undefined) {
        this.map.removeLayer(this.mylocation);
      }
      this.mylocation = new L.Circle(e.latlng, { radius: 5, color: "green", fillColor: "green", weight: 0, fillOpacity: 1 }).addTo(this.map);
      this.mylocation.bindPopup("You are here").openPopup()
      if (radius < 100) {
        if (this.mycircle !== undefined) {
          this.map.removeLayer(this.mycircle);
        }
        this.mycircle = L.circle(e.latlng, radius).addTo(this.map);
      }
    });
  }


  renderCasebyDzongkhag() {
    this.showBuildingInfo = false;
    this.totalCases = 0;
    this.resident = null;
    this.totalRedBuildings = 0;
    sessionStorage.removeItem("dzongkhagId")
    sessionStorage.setItem("dzongkhagId", String(this.searchDzongkhagId));
    window.location.reload();
  }


  downloadKml() {
    this.dataService.getRedBuildingKmlByDzongkhag(Number(sessionStorage.getItem("dzongkhagId"))).subscribe(res => {
      let filename: string = `${this.dzongkhag}_redbuilding.kml`
      let binaryData = [];
      binaryData.push(res);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }

  searchBuildingByBuildingNumber() {
    if (this.searchBuildingId) {
      for (let i = 0; i < this.redbuildings.length; i++) {
        if (this.searchBuildingId === this.redbuildings[i].properties.structure_id) {
          let lat = this.redbuildings[i].coordinates[1];
          let lng = this.redbuildings[i].coordinates[0];
          this.map.flyTo([lat, lng], 18);
          if (this.serachCircleMarker !== undefined) {
            this.map.removeLayer(this.serachCircleMarker)
          }
          this.serachCircleMarker = new L.Circle([lat, lng], {
            radius: 20,
            fillColor: "white"
          }).addTo(this.map)
        } else {
          this.snackBar.open('No Matching Red Building', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      }
    } else {
      this.snackBar.open('Enter a Building Number', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }


  downloadZoneKml() {
    this.dataService.DownloadChiwogGeojsonByDzongkhag(Number(sessionStorage.getItem("dzongkhagId"))).subscribe(res => {
      let filename: string = `${this.dzongkhag}_zone.geojson`
      let binaryData = [];
      binaryData.push(res);
      console.log(binaryData)
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'text' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }

  reOrderLayer() {
    if (this.buildingGeojson != undefined && this.redBuildingGeojson != undefined && this.thimphuMegaZones != undefined ) {
      this.map.removeLayer(this.buildingGeojson)
      this.map.removeLayer(this.redBuildingGeojson)
      this.map.removeLayer(this.thimphuMegaZones)
      this.map.addLayer(this.thimphuMegaZones)
      this.map.addLayer(this.buildingGeojson)
      this.map.addLayer(this.redBuildingGeojson)
    }
  }

  renderRedBuildings(dzongkhagId: number) {
    this.dataService.getRedBuildingsByDzongkhag(dzongkhagId).subscribe(res => {
      if (res.length !== 0) {
        this.redbuildings = res;
        this.redBuildingGeojson = L.geoJSON(res, {
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
             
              this.selectedRedBuilding = feature.properties
              this.dataService.getRedflatsByRedbuildingId(feature.properties.id).subscribe(res=>{
                this.redflats= res.data
              })
              this.dataService.getCasesByRedbuilingId(feature.properties.id).subscribe(res => {
                this.redBuildingCases = res.data;
                this.buildingId = feature.properties.structure_id;
                this.showBuildingInfo = true;
                this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                  if (res.success === "true") {
                    this.bid = res.data.id
                    this.cidOwner = res.data.cidOwner;
                    this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
                    this.contactOwner = res.data.contactOwner;
                  } else {
                    this.cidOwner = "No Record";
                    this.nameOfBuildingOwner = "No Record";
                    this.contactOwner = "No Record";
                  }
                })
                this.showBuildingInfo = true;

                this.dataService.getImg(this.buildingId).subscribe(res => {
                  if (res.success) {
                    this.imgs = res.data
                  }
                })
              })
            });

          },
          pointToLayer: (feature, latLng) => {
            let bldgMarker: L.CircleMarker;
            switch (feature.properties.type) {
              case "BUILDING":
                if(feature.properties.status == "INACTIVE"){
                  bldgMarker = L.circleMarker(latLng, this.redBuildingInactiveMarkerOptions)
                }else{
                  bldgMarker = L.circleMarker(latLng, this.redBuildingMarkerActiveOptions)
                }
                break;
              case "FLAT":
                if(feature.properties.status == "INACTIVE"){
                  bldgMarker = L.circleMarker(latLng, this.redBuildingInactiveMarkerOptions)
                }else{
                  bldgMarker = L.circleMarker(latLng, this.redFlatMarkerActiveOptions)
                }
                break;
            }
            return bldgMarker;
          }
        }).addTo(this.map);
        this.map.fitBounds(this.redBuildingGeojson.getBounds());
      }
    })
  }

  renderBoundary(dzoId, isZoom: boolean) {
    this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getDzo/${dzoId}`).subscribe((json: any) => {
      if (this.bound !== undefined) {
        this.map.removeLayer(this.bound);
      }
      this.bound = L.geoJSON(json.data, {
        interactive: false,
        style: (feature) => {
          return {
            color: "#FFFF00",
            fillColor: "#f03",
            fillOpacity: 0
          }
        }
      }).addTo(this.map);
    })
  }

  parseDate(date) {
    return new Date(date).toLocaleDateString()
  }






}