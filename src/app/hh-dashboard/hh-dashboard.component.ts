
import { Component, OnInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';


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
  selector: 'app-hh-dashboard',
  templateUrl: './hh-dashboard.component.html',
  styleUrls: ['./hh-dashboard.component.css']
})
export class HhDashboardComponent implements OnInit {
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
  selectedStructure = null;

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
    this.getDzongkhagList()
    this.getZoneList(Number(sessionStorage.getItem('dzongkhagID')));
    this.getSubzoneList(sessionStorage.getItem("zoneID"));
    this.renderMap();
    this.renderBuildings(Number(sessionStorage.getItem('subzoneID')))

    this.zoneForm.patchValue({
      dzongkhagControl: Number(sessionStorage.getItem('dzongkhagID')),
      zoneControl: Number(sessionStorage.getItem("zoneID")),
      subZoneControl: Number(sessionStorage.getItem('subzoneID'))
    })
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
          // this.renderBuildings(this.building.sub_zone_id);
        });
      } else {
        this.isAddAllowed = false;
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

    // this.getPositiveCases();
  }

  markerColor(status) {
    if (status === "ACTIVE") {
      return '#EB3637'
    } else {
      return '#F3C13A'
    }
  }

  zoneSearch() {
    this.selectedDzongkhagId = this.zoneForm.get('dzongkhagControl').value.id;
    const zoneId = this.zoneForm.get('subZoneControl').value;
    this.renderBuildings(zoneId)
  }

  renderBuildings(zoneId) {
    const geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${zoneId}`).subscribe((json: any) => {
      if (this.bound !== undefined) {
        this.map.removeLayer(this.bound);
      }
      this.bound = L.geoJSON(json.data, {
        style: (feature) => {
          return {
            color: "#f8fafc",
                    fillOpacity: 0,
                    weight: 1
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
          layer.on('click', (e) => {
            this.residentTableShow = false;
            this.selectedStructure = feature;
            this.selectedStructure.properties.dzongkhag_id = this.zoneForm.get('dzongkhagControl').value;
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
          return L.marker(latLng, { icon: this.myMarker });
        }
      });
      this.map.addLayer(this.buildingGeojson)
      this.map.fitBounds(this.buildingGeojson.getBounds());
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

  toggleClearData() {
    if (this.clearData === false) {
      this.clearData = true
    } else {
      this.clearData = false
    }
  }



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

  parseDate(date){
    return new Date(date).toLocaleDateString()
  }

}

