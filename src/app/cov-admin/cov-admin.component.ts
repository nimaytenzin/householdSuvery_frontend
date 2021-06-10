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

export class RedBuilding {
  structure_id: number;
  numCases: number;
  lat: number;
  lng: number;
  date: Date;
  day: number;
  remarks: string;
  status: string;
}

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
  housholdsData:{
    unitId:number,
    enumeratedBy:string,
    unitOwnership:string,
    name:string,
    cid:number,
    age:number,
    gender:string,
    employment:string,
    employmentOrg:string,
    workzone:string,
    numberHousehold:number,
    incomeEarner:number,
    householdIncome:number,
    shopOfficeName:string,
    covid_test_status:boolean,
    vaccine_status:boolean,
    most_active:boolean,
    shopOfficeContact:number,
    shopOfficeRent:number
  } = {
    unitId: 0,
    enumeratedBy: 'No info',
    unitOwnership:"Not added",
    name:"Not added",
    cid:0,
    age:0,
    gender:"",
    employment:"",
    employmentOrg:"",
    workzone:"",
    covid_test_status:false,
    vaccine_status:false,
    most_active:false,
    numberHousehold:0,
    incomeEarner:0,
    householdIncome:0,
    shopOfficeName :"NA",
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
  dzongkhag: string;
  zoned: string;
  subZone: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  json: any;
  bound: any;
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
    iconSize: [12, 12]
  });

  setViewValue: boolean;

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
    const zoneId = sessionStorage.getItem('zoneId');
    const subZoneId = sessionStorage.getItem('subZoneId');
    const dzongkhagId = sessionStorage.getItem('dzongkhagId')

    this.getZoneList(dzongkhagId);
    this.getSubzoneList(zoneId);
    this.renderMap(this.dataService);

    if (sessionStorage.getItem("subzoneID") !== null) {
      this.renderBuildings(sessionStorage.getItem("subzoneID"))
    } else {

    }

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
            if (response.data.status == 'INCOMPLETE') {
              // this.buildingData= null
              // this.familyMembers = null;
              // this.unitsData =null
              // this.housholdsData =null
              this.residentTableShow = false;
              this.deleteButton = true
              this.deleteID = feature.properties.structure_id
              this.showBuildingInfo = false;
              this.residentTableShow = false;
              this.unitDetailShow = false
              this.snackBar.open(`buildingID: ${this.buildingId} No Data`, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
            } else {
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
            }
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
          this.renderBuildings(this.building.sub_zone_id);
        });
      } else {
        this.isAddAllowed = false;
      }
    });
  }



  renderMap(dataservice: DataService) {
    var sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 9,
    });
    var osm = L.tileLayer('https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png', {
      maxZoom: 20,
      minZoom: 9,
    });
    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 13,
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
    let newMarker: any;
    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (newMarker !== undefined) {
          this.map.removeLayer(newMarker);
        }
        newMarker = L.marker($e.latlng, { icon: this.myMarker }).addTo(this.map);
        this.presentAlert($e.latlng)
      }
    });

    this.getPositiveCases();
  }

  markerColor(status) {
    if (status === "ACTIVE") {
      return '#EB3637'
    } else {
      return '#F3C13A'
    }
  }

  getPositiveCases(){
    this.dataService.getpositivecases().subscribe(res => {
      this.addPositiveCase(res);
    })
  }

  addPositiveCase(data){
    if(this.NationalCase !== undefined){
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
        layer.bindPopup(
          '<p style:"color:tomtato">Status: ' + feature.properties.status + '</p>' +
          '<p style:"color:tomtato">Number of Cases: ' + feature.properties.numCases + '</p>' +
          '<p style:"color:tomtato">Date Detected: ' + new Date(feature.properties.date).toLocaleDateString() + '</p>' +
          '<button class="edit">View/Edit </button>' +
          '<button class="normalize">Normalize Building</button>'
        ).on("popupopen", (a) => {
          var popUp = a.target.getPopup()
          popUp.getElement()
            .querySelector(".edit")
            .addEventListener("click", e => {
              this.editRedBuilding(feature)
            });
        }).on("popupopen", (a) => {
          var popUp = a.target.getPopup()
          popUp.getElement()
            .querySelector(".normalize")
            .addEventListener("click", e => {
              this.normalizeBuilding(feature)
            });
        },
        )
      },
    }).addTo(this.map);
  }



  zoneSearch() {
    const zoneId = this.zoneForm.get('subZoneControl').value;
    this.renderBuildings(zoneId)
    sessionStorage.setItem('subzoneID', zoneId)
  }

  //zone Search End

  renderBuildings(zoneId) {
    const geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${zoneId}`).subscribe((json: any) => {
      if(this.bound !== undefined){
        this.map.removeLayer(this.bound);
      }
      this.bound = L.geoJSON(json.data, {
        style: (feature) => {
          return {
            color: "red",
            fillOpacity: 0
          }
        }
      }).addTo(this.map);
    })
    this.addStructures(zoneId);
  }

  addStructures(zoneId) {
    this.dataService.getStructure(zoneId).subscribe((json: any) => {
      this.json = json;
      if (this.buildingGeojson !== undefined) {
        this.map.removeLayer(this.buildingGeojson)
        this.buildingGeojson = null
      }
      this.totalBuilding = this.json.length
      this.totalCompleted = 0

      this.buildingGeojson = L.geoJSON(this.json, {
        onEachFeature: (feature, layer) => {
          if (feature.properties.status == "COMPLETE") {
            this.totalCompleted++
          }
          layer.on('click', (e) => {
            this.residentTableShow = false;
            this.addPositiveDialog(feature);
            if (feature.properties.status == 'INCOMPLETE') {
              this.deleteButton = true
              this.deleteID = feature.properties.structure_id
              this.showBuildingInfo = false;
              this.residentTableShow = false
              this.unitDetailShow = false
              this.snackBar.open(`buildingID: ${this.deleteID} No Data`, '', {
                duration: 4000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
            } else {
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
            }

          });
        },
        pointToLayer: (feature, latLng) => {
          if (feature.properties.status == 'INCOMPLETE') {
            return L.marker(latLng, { icon: this.redMarker });
          } else if (feature.properties.status == "PROGRESS") {
            return L.marker(latLng, { icon: this.yellowMarker });
          } else if (this.showattic) {
            return L.marker(latLng, { icon: this.myMarker });
          } else {
            this.precentCompleted++
            return L.marker(latLng, { icon: this.greenMarker });
          }
        }
      });
      this.map.addLayer(this.buildingGeojson)
      this.map.fitBounds(this.buildingGeojson.getBounds());
      this.precentCompleted = (this.totalCompleted / this.totalBuilding) * 100;
      this.progressShow = true;
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
    console.log("sdfs")
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
        title: "Mark structure with ID: "+e.properties.structure_id+" as Red Building?",
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

}