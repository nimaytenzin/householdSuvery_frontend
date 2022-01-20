import { Component, OnInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MarkPositiveDialogComponent } from '../mark-positive-dialog/mark-positive-dialog.component';
import { Options } from "@angular-slider/ngx-slider";
// import '../libs/SliderControl';
import jwt_decode from 'jwt-decode';


// let $: any = jquery;

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
interface UNITSDATA {
  id: number,
  unitId: string,
  unitOwnership: string,
  unitUse: string,
  familiesSharing: number
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



  displayedColumns: string[] = ['position', 'name', 'view'];
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

  buildingUse: string = "NA";
  cidOwner: string = "NA";
  nameOfBuildingOwner: string = "NA";
  contactOwner: string = "NA";
  length: number = 0;
  enumeratedBy: string = "No Info."
  value: number = 2;
  options: Options = {
    showTicksValues: true
  };

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

  zoneForm: FormGroup;
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
  isAddAllowed = false;
  buildings: any;
  building: any;
  buildingInfo: BuildingInfo;
  watchId;
  mylocation: L.Marker;
  mycircle: L.Circle;
  resident: any;
  showattic = false;
  showCaseDetails = false;
  stepvalue = []
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  //logic
  officeShopDetailShow: boolean
  residentialUnitDetailShow: boolean
  sliderControl: any;
  NationalCase: any;

  total_cases: Number = 0;
  red_buildings: any = 0;

  map: L.Map;

  cases: [
    {
      date: "22/01/2022",
      cases: 12,
      remarks: "Workers from PHAPA",
      status: "ACTIVE"
    },
    {
      date: "23/01/2022",
      cases: 2,
      remarks: "Marked Red Building and cordend ",
      status: "ACTIVE"
    }
  ]

  greenMarker = L.icon({
    iconUrl: 'assets/marker-green.png',
    iconSize: [12, 12]
  });
  redMarker = L.icon({
    iconUrl: 'assets/marker-red.png',
    iconSize: [12, 12]
  });
  yellowMarker = L.icon({
    iconUrl: 'assets/marker-yellow.png',
    iconSize: [12, 12]
  })
  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [12, 12]
  });

  setViewValue: boolean;


  //New
  dzongkhagId: number
  redBuildingGeojson:any;
  selectedRedBuilding:any;
  redBuildingCases:any;
  dzongkhag:any;
  totalCases:number;
  totalRedBuildings:number;
  selectedDzongkhagId:number;
  searchDzongkhagId:number;


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
    this.totalCases= 2;
    this.totalRedBuildings=0
  }

  ngOnInit() {
    this.selectedDzongkhagId = Number(sessionStorage.getItem("selectedDzongkhagId"));
    this.searchDzongkhagId = this.selectedDzongkhagId;

    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data
      response.data.forEach(element => {
        if(this.selectedDzongkhagId === element.id){
          this.dzongkhag = element
        }
      });
      this.renderMap();
      this.renderRedBuildings(this.selectedDzongkhagId)
    }); 
    
  }


  renderCasebyDzongkhag(){
    console.log(this.searchDzongkhagId)
    this.totalCases=0;
    this.totalRedBuildings =0;
    this.renderRedBuildings(this.searchDzongkhagId)
  }

 

  renderMap() {
    var sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 9,
    });
    this.map = L.map('map', {
      //Set(Lat and Long center based on the dzongkhag of the user)
      center: [26.864894, 89.38203],
      zoom: 13,
      maxZoom: 20,
      minZoom: 9,
      layers: [sat],
      zoomControl: false
    });
    this.map.on('locationerror', (err) => {
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
    this.map.on('locationfound', (e) => {
      var radius = e.accuracy;
      if (this.mylocation !== undefined) {
        this.map.removeLayer(this.mylocation);
      }
      this.mylocation = L.marker(e.latlng, { icon: this.myMarker }).addTo(this.map);

      if (radius < 100) {
        if (this.mycircle !== undefined) {
          this.map.removeLayer(this.mycircle);
        }
        this.mycircle = L.circle(e.latlng, radius).addTo(this.map);
      }
    });
    let newMarker: any;
    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (newMarker !== undefined) {
          this.map.removeLayer(newMarker);
        }
        newMarker = L.marker($e.latlng, { icon: this.myMarker }).addTo(this.map);
      }
    });
  }

  getMatchedDzongkhag(id) {
    
  }

  renderRedBuildings(dzongkhagId: number) {
    this.dataService.getRedBuildingsByDzongkhag(dzongkhagId).subscribe(res => {
      this.redBuildingGeojson = L.geoJSON(res, {
        onEachFeature: (feature, layer) => {
          this.totalRedBuildings ++;
          layer.on('click', (e) => {
            this.selectedRedBuilding = feature
            this.map.setView([e.target.feature.geometry.coordinates[1],e.target.feature.geometry.coordinates[0]], 18);
            this.dataService.getCasesByRedbuilingId(feature.properties.id).subscribe(res => {
              this.redBuildingCases = res.data;
              let totalCases=0;
              res.data.forEach(element => {
                totalCases+= element.numCases;
              });
              layer.bindPopup(
                '<p style:"color:tomtato">Status: ' + feature.properties.status + '</p>' +
                '<p style:"color:tomtato">Number of Cases: ' + totalCases + '</p>' +
                '<p style:"color:tomtato">First Detection: ' + new Date(res.data[0].date).toLocaleDateString() + '</p>'
              )
              this.buildingId = feature.properties.structure_id;
              this.showBuildingInfo = true;
              this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                if(res.success === "true"){
                  this.bid = res.data.id
                  this.buildingUse = res.data.buildingUse;
                  this.cidOwner = res.data.cidOwner;
                  this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
                  this.contactOwner = res.data.contactOwner;
                }
              })
              this.showBuildingInfo = true;
            })
          });
        },
        pointToLayer: (feature, latLng) => {
          return L.marker(latLng, { icon: this.redMarker });
        }
      });
      this.map.addLayer(this.redBuildingGeojson)
      this.map.fitBounds(this.redBuildingGeojson.getBounds());
    })
  }

  parseDate(date){
    return new Date(date).toLocaleDateString()
  }
}