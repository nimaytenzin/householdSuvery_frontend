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
import { EditPositiveDialogComponent } from '../edit-positive-dialog/edit-positive-dialog.component';
import { CreateRedBuildingDialogComponent } from '../red-buildings/create-red-building-dialog/create-red-building-dialog.component';
import { AddCasesDialogComponent } from '../red-buildings/add-cases-dialog/add-cases-dialog.component';

export class Case{
  red_building_id:number
  dzo_id:number;
  date: Date;
  numCases:number;
  remarks: string;
  status:string;
  case_id:string;
}
export class RedBuilding {
  structure_id: number;
  lat: number;
  lng: number;
  remarks: string;
  status: string;
  dzo_id: number;
}


export class Building {
  lat: number;
  lng: number;
  sub_zone_id: number;
}

interface caseInterface{
  red_building_id:number;
  dzo_id:number
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
  selector: 'app-cov-admin',
  templateUrl: './cov-admin.component.html',
  styleUrls: ['./cov-admin.component.scss']
})
export class CovAdminComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'view'];
  totalBuilding: number;
  totalCompleted: number;
  showBuildingInfo: boolean = false;
  precentCompleted: number;
  progressShow: boolean = false;
  showFamilyMembers: boolean = false;
  addDeleteButtons: boolean = false;
  deleteButton: boolean = false;
  deleteID: number;
  unitDetailShow: boolean;

  //delete building info
  bid: number;

  buildingUse: string = "Not Added";
  cidOwner: string = "Not Added";
  nameOfBuildingOwner: string = "Not Added";
  contactOwner: string = "Not Added";
  length: number = 0;
  enumeratedBy: string = "No Info."

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
  xyForm: FormGroup;
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
  dzongkhag: string;
  zoned: string;
  subZone: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  json: any;
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
  selectedStructure = null;

  newBuildingPoint: any;

  //markers
  xyCircle: L.Circle;

  redBuildingInactiveMarkerOptions = {
    radius: 8,
    fillColor: "#008000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  redBuildingMarkerActiveOptions = {
    radius: 8,
    fillColor: "#FF0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  buildingMarkerOptions = {
    radius: 6,
    fillColor: "#3248a8",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  }

  newBuildingMarkerOptions = {
    radius: 6,
    fillColor: "#008000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  }

  //geojsons
  buildingGeojson: any;
  bound: any;

  //logic
  officeShopDetailShow: boolean
  residentialUnitDetailShow: boolean

  redbuilding: RedBuilding;
  NationalCase: any;

  map: L.Map;

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
    iconSize: [8, 8]
  });

  setViewValue: boolean;

  //redBuildings
  redBuildingGeojson: any;
  redBuildingCases: any;
  selectedRedBuilding:any;
  selectedDzongkhagId:number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private zone: NgZone,
    private fb: FormBuilder,
  ) {
    this.building = new Building();
    this.buildingInfo = null;
    this.selectZone = false;
    this.clearData = false;
    this.setViewValue = true;

  }

  ngOnInit() {
    this.getDzongkhagList();
    this.reactiveForm();
    // const zoneId = sessionStorage.getItem('zoneId');
    // const subZoneId = sessionStorage.getItem('subZoneId');
    // const dzongkhagId = sessionStorage.getItem('dzongkhagId')

    // this.getZoneList(dzongkhagId);
    // this.getSubzoneList(zoneId);
    this.renderMap();

    // if (sessionStorage.getItem("subzoneID") !== null) {
    //   this.renderBuildings(sessionStorage.getItem("subzoneID"))
    // } else {

    // }

  }

  submit() {
    let result = this.searchForm.get("searchBuilding").value;
    this.dataService.getAStructure(result).subscribe(res => {
      this.zoomToSearched(res)
    })
  }

  zoomToSearched(response: any) {
    let lat, lng, id = 0
    if (response.success === "false") {
      this.snackBar.open('Building Not Found', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    } else {
      if (this.searchmarker !== undefined) {
        this.map.removeLayer(this.searchmarker);
        this.searchmarker = null;
      }
      lat = response.data.lat
      lng = response.data.lng

      this.map.flyTo([lat, lng], 18)
      var responseJson = {
        "type": "Point",
        "coordinates": [lng, lat],
        "properties": {
          "structure_id": response.data.id
        }
      };
      this.searchmarker = L.geoJSON(<GeoJSON.Point>responseJson, {
        onEachFeature: (feature, layer) => {
          layer.on('click', (e) => {
            this.residentTableShow = false;
            this.clearData = true;
            this.buildingId = feature.properties.structure_id;
            this.showBuilding(this.buildingId);
            this.addPositiveDialog(feature);
            // this.resident = null;
            // this.buildingData= null
              // this.familyMembers = null;
              // this.housholdsData =null
              // this.unitsData =null
              this.residentTableShow = false;
              this.buildingId = feature.properties.structure_id;
              this.deleteButton = true
              this.unitDetailShow = true
              this.showBuildingInfo = true;
              this.deleteID = feature.properties.structure_id
              this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                this.bid = res.data.id
                this.buildingUse = res.data.buildingUse;
                this.cidOwner = res.data.cidOwner;
                this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
                this.contactOwner = res.data.contactOwner;
              })
              this.dataService.getHouseholds(this.buildingId).subscribe(res => {
                this.unitsData = res.data
                this.length = res.data.length

              })
              this.dataService.getImg(this.buildingId).subscribe(res => {
                if (res.success) {
                  this.imgs = res.data
                }
              })
              this.addDeleteButtons = true;
              this.showBuildingInfo = true;
              this.showBuilding(this.buildingId);
              this.clearData = true;
              this.resident = null;
              // this.http.get(`${this.API_URL}/getunits/${this.buildingId}`).subscribe((json: any) => {
              //   this.unitsData = json.data;
              // });
              // this.http.get(`${this.API_URL}/get-img/${this.buildingId}`).subscribe((json: any) => {
              //   this.imgs= json.data;
              // });
          });
        }, pointToLayer: (feature, latLng) => {
          return L.marker(latLng, { icon: this.myMarker });
        }
      }).addTo(this.map);
    }
  }


  reactiveForm() {
    this.zoneForm = this.fb.group({
      dzongkhagControl: [],
      zoneControl: [],
      subZoneControl: []
    });
    this.searchForm = this.fb.group({
      searchBuilding: []
    });
    this.xyForm = this.fb.group({
      lat: [''],
      lng: ['']
    });
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
        this.building.sub_zone_id = Number(sessionStorage.getItem('subzoneID'));

        this.dataService.postStructure(this.building).subscribe(response => {
          this.snackBar.open('Structure number ' + this.buildingId + ' has been successfully added', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.isAddAllowed = false;
          this.addStructures(this.building.sub_zone_id,true);
          if(this.newBuildingPoint != undefined){
            this.map.removeLayer(this.newBuildingPoint)
          }
        });
      } else {
        this.isAddAllowed = false;
        if(this.newBuildingPoint != undefined){
          this.map.removeLayer(this.newBuildingPoint)
        }
      }
    });
  }



  renderMap() {
    var sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 9,
    });
    var osm = L.tileLayer('https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png', {
      maxZoom: 20,
      minZoom: 9,
    });
    this.map = L.map('map', {
      center: [27.574368, 90.206081],
      zoom: 10,
      maxZoom: 20,
      minZoom: 9,
      layers: [sat]
    });

    var baseMaps = {
      "Satellite Image": sat,
      "OSM base map": osm
    };
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
    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (this.newBuildingPoint!== undefined) {
          this.map.removeLayer(this.newBuildingPoint);
        }
        this.newBuildingPoint= L.circleMarker($e.latlng,this.newBuildingMarkerOptions).addTo(this.map);
        this.presentAlert($e.latlng)
      }
    });

    // this.getPositiveCases();
  }

  markerColor(status) {
    if (status === "ACTIVE") {
      return '#EB3637'
    } else {
      return '#F3C13A'
    }
  }

  //Get Positive Cases by Dzongkhag Selected

  getPositiveCases() {
    this.dataService.getpositivecases().subscribe(res => {
      this.addPositiveCase(res);
      console.log(res)
    })
  }

  addPositiveCase(data) {
    if (this.NationalCase !== undefined) {
      console.log("removing old layer");
      this.map.removeLayer(this.NationalCase);
    }
    this.NationalCase = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: this.markerColor(feature.properties.status),
          color: this.markerColor(feature.properties.status),
          weight: 0.1,
          opacity: 0.6,
          fillOpacity: 1
        });
      }, onEachFeature: (feature, layer) => {
        layer.on('click', e => {
          this.buildingId = e.sourceTarget.feature.geometry.properties.structure_id;
          this.deleteButton = true
          this.unitDetailShow = true
          this.showBuildingInfo = true;
          this.residentialUnitDetailShow = false;
          this.residentTableShow = false;

          this.deleteID = feature.properties.structure_id
          this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
            this.bid = res.data.id
            this.buildingUse = res.data.buildingUse;
            this.cidOwner = res.data.cidOwner;
            this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
            this.contactOwner = res.data.contactOwner;
          })
          this.dataService.getHouseholds(this.buildingId).subscribe(res => {
            this.unitsData = res.data
            this.length = res.data.length
          })
          this.dataService.getImg(this.buildingId).subscribe(res => {
            if (res.success) {
              this.imgs = res.data
            }
          })
        })
      },
    }).addTo(this.map);
  }


  goToXY(){
    const lat = this.xyForm.get('lat').value;
    const lng = this.xyForm.get('lng').value;
    if(lat != 0 && lng != 0){
      if (this.xyCircle !== undefined) {
        this.map.removeLayer(this.xyCircle);
      }
      this.xyCircle = L.circle([lat,lng],{
        color:'red',
        fillColor:'#f03',
        fillOpacity:0,
        radius:10,
        interactive:false
      }).addTo(this.map);

      this.map.flyTo([lat, lng], 18)
    }
  }
  clearXY(){
      if (this.xyCircle !== undefined) {
        this.map.removeLayer(this.xyCircle);
        this.xyCircle = undefined;
      }

  }

  zoneSearch() {
    console.log()
    const zoneId = this.zoneForm.get('subZoneControl').value;
    sessionStorage.setItem('subzoneID', zoneId)
    this.selectedDzongkhagId = this.zoneForm.get('dzongkhagControl').value.id;
    // this.map.setView([this.zoneForm.get('dzongkhagControl').value.lat, this.zoneForm.get('dzongkhagControl').value.lng], 14);

    this.renderBoundary(zoneId,true)
    this.addStructures(zoneId,true);
    this.renderRedBuildings(this.selectedDzongkhagId,false);
  }

  //zone Search End

  //orders red buildings and ontop and strucutres below it
  reOrderLayer(){
    if(this.buildingGeojson != undefined && this.redBuildingGeojson != undefined){
      this.map.removeLayer(this.buildingGeojson)
      this.map.removeLayer(this.redBuildingGeojson)
      this.map.addLayer(this.buildingGeojson)
      this.map.addLayer(this.redBuildingGeojson)
    }
  }


  renderBoundary(zoneId,isZoom:boolean) {
    this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${zoneId}`).subscribe((json: any) => {
      if (this.bound !== undefined) {
        this.map.removeLayer(this.bound);
      }
      this.bound = L.geoJSON(json.data, {
        interactive:false,
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


  addNewCase(){
    console.log(this.selectedRedBuilding)
    let caseData:caseInterface = {
        red_building_id:this.selectedRedBuilding.properties.id,
        dzo_id:this.selectedDzongkhagId
    }
    this.addCaseDialog(caseData,true)
  }


  renderRedBuildings(dzongkhagId: number,isZoom:boolean) {
    this.dataService.getRedBuildingsByDzongkhag(dzongkhagId).subscribe(res => {
      if(this.redBuildingGeojson !== undefined){
        this.map.removeLayer(this.redBuildingGeojson)
      }
      this.redBuildingGeojson = L.geoJSON(res, {
        onEachFeature: (feature, layer) => {
          layer.on('click', (e) => {
            this.selectedRedBuilding = feature
            // this.map.setView([e.target.feature.geometry.coordinates[1],e.target.feature.geometry.coordinates[0]], 18);
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
              this.deleteButton = true
              this.unitDetailShow = true
              this.showBuildingInfo = true;
              this.deleteID = feature.properties.structure_id
              this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                this.bid = res.data.id
                this.buildingUse = res.data.buildingUse;
                this.cidOwner = res.data.cidOwner;
                this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
                this.contactOwner = res.data.contactOwner;
              })
              this.dataService.getHouseholds(this.buildingId).subscribe(res => {
                this.unitsData = res.data
                this.length = res.data.length
              })
              this.dataService.getImg(this.buildingId).subscribe(res => {
                if (res.success) {
                  this.imgs = res.data
                }
              })
              this.addDeleteButtons = true;
              this.showBuildingInfo = true;
              this.showBuilding(this.buildingId);
              this.clearData = true;
              this.resident = null;
            })
          });
        },
        pointToLayer: (feature, latLng) => {
          // return L.marker(latLng, { icon: this.redMarker });
          let bldgMarker:L.CircleMarker;
          switch(feature.properties.status){
            case "INACTIVE":
              bldgMarker = L.circleMarker(latLng,this.redBuildingInactiveMarkerOptions)
              break;
            case "ACTIVE":
              bldgMarker = L.circleMarker(latLng,this.redBuildingMarkerActiveOptions)
              break;
          }
          return bldgMarker;
        }
      });
      this.map.addLayer(this.redBuildingGeojson)

      if(isZoom){
        this.map.fitBounds(this.redBuildingGeojson.getBounds());
      }

      //reorder
      this.reOrderLayer()
    })
  }

  addStructures(zoneId,isZoom:boolean) {
    this.dataService.getStructure(zoneId).subscribe((json: any) => {
      console.log("SCTRUECURS", json)
      this.json = json;
      if (this.buildingGeojson !== undefined) {
        this.map.removeLayer(this.buildingGeojson)
        this.buildingGeojson = null
      }
      this.totalBuilding = this.json.length
      this.totalCompleted = 0

      this.buildingGeojson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
          layer.on('click', (e) => {
            this.residentTableShow = false;
            this.selectedStructure = feature;
            this.selectedStructure.properties.dzongkhag_id = this.zoneForm.get('dzongkhagControl').value;
            console.log(this.selectedStructure)
            this.buildingId = feature.properties.structure_id;
            this.deleteButton = true
            this.unitDetailShow = true
            this.showBuildingInfo = true;
            this.deleteID = feature.properties.structure_id
            this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
              this.bid = res.data.id
              this.buildingUse = res.data.buildingUse;
              this.cidOwner = res.data.cidOwner;
              this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
              this.contactOwner = res.data.contactOwner;
            })
            this.dataService.getHouseholds(this.buildingId).subscribe(res => {
              this.unitsData = res.data
              this.length = res.data.length
            })
            this.dataService.getImg(this.buildingId).subscribe(res => {
              if (res.success) {
                this.imgs = res.data
              }
            })
            this.addDeleteButtons = true;
            this.showBuildingInfo = true;
            this.showBuilding(this.buildingId);
            this.clearData = true;
            this.resident = null;
          });
        },
        pointToLayer: (feature, latLng) => {
          // return L.marker(latLng, { icon: this.myMarker });
          return L.circleMarker(latLng,this.buildingMarkerOptions)
        }
      });
      this.map.addLayer(this.buildingGeojson)
      
      if(isZoom){
        this.map.fitBounds(this.buildingGeojson.getBounds())
      }

      //reorder
      this.reOrderLayer()
    });

  }

  showResident(unitid) {
    this.resident = null;
    this.residentTableShow = true

    this.snackBar.open('Scroll down', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.dataService.getAHousehold(unitid).subscribe(resp => {


      if (resp.data.unitUse !== "Residential") {
        this.residentialUnitDetailShow = false
        this.officeShopDetailShow = true
      } else {
        this.residentialUnitDetailShow = true
        this.officeShopDetailShow = false
      }
      this.housholdsData = resp.data

      this.dataService.getFamilyMembers(unitid).subscribe(resp => {
        this.familyMembers = resp.data
      })
      this.dataService.getUserInfo(resp.data.userId).subscribe(res => {
        if (res.success === "error") {
          this.enumeratedBy = 'No Info.'
        } else {
          let userName = res.data.username + ',' + res.data.cid
          this.enumeratedBy = userName
        }

      })

    });
  }

  selectedRowIndex = -1;

  highlight(row) {
    this.selectedRowIndex = row.id;
  }
  toggleAdd() {
    if (sessionStorage.getItem('subzoneID') === null) {
      this.snackBar.open(`Please select a zone to add structure`, '', {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    } else {
      this.snackBar.open('Tap on the structure/building you want to add', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
      this.isAddAllowed = true;
    }
  }

  cancelAdd(){
    this.isAddAllowed = false;
  }


  toggleClearData() {
    if (this.clearData === false) {
      this.clearData = true
    } else {
      this.clearData = false
    }
  }

  // deleteBuilding(){
  //   const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
  //     data:{
  //       title: "Delete Building?",
  //       message: `Are you sure you want to delete ${this.deleteID}? You will be held accountable, User details will be recorded`
  //     }
  //   });
  //   confirmDialog.afterClosed().subscribe(result=>{
  //     if(result == true){
  //       this.dataService.deleteBuilding(this.deleteID).subscribe(res => {
  //         if(res.success === "true"){
  //           this.renderBuildings(sessionStorage.getItem('subzoneID'))
  //           this.snackBar.open('Deleted. You may want to refresh the browser to see the changes' , '', {
  //             duration: 3000,
  //             verticalPosition: 'top',
  //             panelClass: ['success-snackbar']
  //           });

  //         }
  //      })

  //         }else{
  //             this.snackBar.open('Oks' , '', {
  //               duration: 3000,
  //               verticalPosition: 'top',
  //               panelClass: ['success-snackbar']
  //             });
  //         }
  //   });
  // }

  showBuilding(unitid) {
    this.buildingInfo = null;
    this.buildingInfo = new BuildingInfo()
  }

  markStructureAsRedBuilding() {
    this.selectedStructure.properties.dzongkhag_id = 1;

    let data = {
      dzo_id: this.selectedDzongkhagId,
      lat: this.selectedStructure.coordinates[1],
      lng: this.selectedStructure.coordinates[0],
      structure_id: this.selectedStructure.properties.structure_id
    }

    const createRedBuilingDialog = this.dialog.open(CreateRedBuildingDialogComponent, {
      data: data
    }).afterClosed().subscribe(result=>{
      if(result.event === "success"){
        console.log("red building created")
        let newRedBuilding = new RedBuilding();
        newRedBuilding.dzo_id = result.data.dzo_id
        newRedBuilding.lat = result.data.lat
        newRedBuilding.lng = result.data.lng
        newRedBuilding.remarks = result.data.remarks
        newRedBuilding.status = result.data.status
        newRedBuilding.structure_id = result.data.structure_id

        //create red building
        this.dataService.createRedBuilding(newRedBuilding).subscribe(res =>{
          console.log("red create",res)
          if(res.success === 'true'){
            let caseData:caseInterface = {
              red_building_id:res.data.id,
              dzo_id:res.data.dzo_id
            }
            this.addCaseDialog(caseData,false)
            this.renderRedBuildings(this.selectedDzongkhagId,false);
          }
        })
      }
    });
  }

  addCaseDialog(data:caseInterface,canCancel:boolean){
    
    let cdData = {
      canCancel:canCancel,
      ...data
    }
    this.dialog.open(AddCasesDialogComponent,{disableClose:!canCancel, data:cdData }).afterClosed().subscribe(result=>{
      if(result.event === "success"){
        let newCase = new Case;
        newCase.case_id = result.data.case_id
        newCase.date = result.data.date
        newCase.dzo_id = result.data.dzo_id
        newCase.numCases = result.data.numCases
        newCase.red_building_id = result.data.red_building_id
        newCase.remarks = result.data.remarks
        newCase.status = result.data.status

        console.log(newCase)
        this.dataService.createNewCase(newCase).subscribe(res =>{
          if(res.status=== "success"){
            this.renderRedBuildings(this.selectedDzongkhagId,false);
            this.snackBar.open('Case Added', '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          }
        })
      }
    })
  }

  reset() {
    this.zoneForm.reset();
    sessionStorage.removeItem('subzoneID')
    this.selectZone = false;
    this.showFamilyMembers = false;
    this.progressShow = false
    this.buildingInfo = null;
    this.unitsData = null;
    this.imgs = null;
    this.resident = null;
    if (this.bound !== undefined) {
      this.map.removeLayer(this.bound)
    }
    if (this.buildingGeojson !== undefined) {
      this.map.removeLayer(this.buildingGeojson);
    }
    if (this.searchmarker !== undefined) {
      this.map.removeLayer(this.searchmarker);
    }

  }

  getDzongkhagList() {
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data;
    });
  }

  getZoneList(dzongkhagId) {
    this.dataService.getZones(dzongkhagId).subscribe(response => {
      this.zones = response.data;
    });
  }

  getSubzoneList(zoneId) {
    this.dataService.getSubZones(zoneId).subscribe(response => {
      this.subZones = response.data;
    });
  }

  showFamilyMemberDetail(unitId) {
    this.snackBar.open('Scroll down', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.showFamilyMembers = true
  }

  showSelectZone() {

    if (this.selectZone === false) {
      this.selectZone = true
    } else {
      this.selectZone = false
    }

    if (this.clearData === false) {
      this.clearData = true
    } else {
      this.clearData = false
    }
  }

  // unlockBuilding(){
  //   const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
  //     data:{
  //       title: "Unlock Building?",
  //       message: "Are you sure?"
  //     }
  //   });
  //   confirmDialog.afterClosed().subscribe(result=>{
  //     if(result == true){
  //       this.dataService.postProgress(this.buildingId).subscribe(res => {
  //         if(res.success === "true"){
  //           this.snackBar.open('Unlocked Successfully' , '', {
  //             duration: 3000,
  //             verticalPosition: 'top',
  //             panelClass: ['success-snackbar']
  //           });
  //         }
  //        })
  //     }
  //   });




  // }

  editBuilding() {
    this.router.navigate([`edit-building/${this.buildingId}`])
  }

  editFamilyMember() {
    this.snackBar.open('Redirect to update Family Member Component', '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  // deleteFamilyMember(){
  //   const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
  //     data:{
  //       title: "Delete Family Member?",
  //       message: "Are you sure?"
  //     }
  //   });
  //   confirmDialog.afterClosed().subscribe(result=>{
  //     if(result == true){
  //       this.snackBar.open('Deleted' , '', {
  //         duration: 3000,
  //         verticalPosition: 'top',
  //         panelClass: ['success-snackbar']
  //       });
  //     }else{
  //       this.snackBar.open('Ok' , '', {
  //         duration: 3000,
  //         verticalPosition: 'top',
  //         panelClass: ['success-snackbar']
  //       });
  //     }
  //   });
  // }

  // updateUnit(unitID){
  //   this.router.navigate([`edit-unit/${unitID}`])
  // }

  // deleteBuildingInfo(){
  //   this.dataService.deleteBuildingInfo(this.bid).subscribe(res =>{
  //     if(res.success === "true"){
  //         this.snackBar.open('Deleted Building Data' , '', {
  //           duration: 3000,
  //           verticalPosition: 'top',
  //           panelClass: ['success-snackbar']
  //         });

  //     }
  //   })
  // }

  markAsPositive(e) {
    const confirmDialog = this.dialog.open(MarkPositiveDialogComponent, {
      data: {
        object: e
      }
    });
    confirmDialog.afterClosed().subscribe(e => {
      this.getPositiveCases()
    })
  }

  addPositiveDialog(e) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Mark structure with ID: " + e.properties.structure_id + " as Red Building?",
        message: "Are you sure?"
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result == true) {
        this.markAsPositive(e)
      } else {

      }
    });
  }

  editRedBuilding(e) {
    const confirmDialog = this.dialog.open(EditPositiveDialogComponent, {
      data: e.properties
    });
  }

  normalizeBuilding(e) {
    var building = {
      structure_id: e.properties.structure_id
    }

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Normalize Building?",
        message: "Are you sure?"
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result == true) {
        this.dataService.normalizeBuilding(building).subscribe(res => {
          if (res.success == "true") {
            window.location.reload()
            this.snackBar.open('Notmalized Building', '', {
              duration: 5000,
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
          }
        })
      } else {

      }
    });
  }

  editCase() {
    console.log()
  }

  parseDate(date){
    return new Date(date).toLocaleDateString()
  }

}