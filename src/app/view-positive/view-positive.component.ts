import { Component, OnInit, NgZone} from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {  Router,ActivatedRoute } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MarkPositiveDialogComponent } from '../mark-positive-dialog/mark-positive-dialog.component';
import { Options } from "@angular-slider/ngx-slider";
import { filter, last } from 'rxjs/operators';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
// import '../libs/SliderControl';


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
interface UNITSDATA{
  id:number,
  unitId:string,
  unitOwnership:string,
  unitUse:string,
  familiesSharing:number
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
export class BuildingInfo{
  BuildingName: string;
  BuildingOwner: string;
  Contact:string;
  BuildingUse: string;
  Sewer: string;
  Water: string;
  Waste: string;
  Remarks: string;
}

interface IdName{
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
  totalBuilding:number;
  totalCompleted:number;
  showBuildingInfo:boolean=false;
  slide = false;
  precentCompleted:number;
  progressShow:boolean =false;
  showFamilyMembers:boolean = false;
  addDeleteButtons:boolean =false;
  deleteButton:boolean = false;
  deleteID:number;
  unitDetailShow:boolean;
  responseData:any;

  //delete building info
  bid:number;

  buildingUse:string = "Not Added";
  cidOwner:string = "Not Added";
  nameOfBuildingOwner:string = "Not Added";
  contactOwner:string = "Not Added";
  length:number = 0;
  enumeratedBy:string = "No Info."
  value:number = 2;
  options:Options = {
    showTicksValues: true
  };

  unitsData:any;
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
  familyMembers:any;

  //chart js
  API_URL =environment.API_URL;
  BASE_URL = environment.BASE_URL;
  searchForm: FormGroup;
  searchmarker: L.GeoJSON;
  searchedId: any;
  selectZone:boolean;
  clearData:boolean;
  showSuperZone= false;
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
  zonebound: any;
  buildingGeojson: any;
  buildingId: number;
  imgs:any;
  residentTableShow:boolean=false;
  isAddAllowed = false;
  buildings:any;
  building: any;
  buildingInfo: BuildingInfo;
  watchId;
  mylocation: L.Marker;
  mycircle: L.Circle;
  resident: any;
  showattic= false;
  showCaseDetails = false;
  stepvalue = []
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  //logic
  officeShopDetailShow:boolean
  residentialUnitDetailShow:boolean
  sliderControl:any;
  NationalCase:any;

  total_cases:Number = 0;
  red_buildings:any = 0;

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
    iconSize: [12,12]
  })
  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [12, 12]
  });

  setViewValue: boolean;
  dzo_id: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private zone: NgZone,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    this.dzo_id= this.route.snapshot.params['id'];

    const zoneId = sessionStorage.getItem('zoneId');
    const subZoneId = sessionStorage.getItem('subZoneId');
    const dzongkhagId = sessionStorage.getItem('dzongkhagId')

    this.getZoneList(dzongkhagId);
    this.getSubzoneList(zoneId);
    this.renderMap(this.dataService) 

    this.addOverallbound().then(()=>{ 
      this.getPositiveCase(this.dzo_id)
    })

    if (sessionStorage.getItem("subzoneID") !== null) {
      this.renderBuildings(sessionStorage.getItem("subzoneID"))
    }else{

    }

  }

  submit(){
    let result = this.searchForm.get("searchBuilding").value;
    this.dataService.getAStructure(result).subscribe(res => {
      this.zoomToSearched(res)
    })
  }

  zoomToSearched(response:any){
    let lat,lng,id = 0
    if(response.success === "false"){
      this.snackBar.open('Building Not Found' , '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }else{
      if(this.searchmarker !== undefined){
        this.map.removeLayer(this.searchmarker);  
        this.searchmarker = null;
      }
      lat = response.data.lat
      lng = response.data.lng

      this.map.flyTo([lat,lng],18)
      var responseJson = {
        "type":"Point",
        "coordinates":[lng,lat],
        "properties":{
          "structure_id":response.data.id
        }
      };
      this.searchmarker = L.geoJSON(<GeoJSON.Point>responseJson, {
        onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              this.residentTableShow=false;
              this.clearData = true;
              this.buildingId = feature.properties.structure_id;
              this.showBuilding(this.buildingId);
 
              if(response.data.status == 'INCOMPLETE'){
                 
              this.residentTableShow=false;
                this.deleteButton = true
                this.deleteID = feature.properties.structure_id  
                this.showBuildingInfo = false;
                this.residentTableShow = false;
                this.unitDetailShow =false
                  this.snackBar.open(`buildingID: ${this.buildingId} No Data` , '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: ['error-snackbar']
                  });
                }else{
    
              this.residentTableShow=false;
                  this.buildingId = feature.properties.structure_id;
                  this.deleteButton = true
                  this.unitDetailShow =true
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
                  this.dataService.getImg(this.buildingId).subscribe(res=>{
                    if(res.success){
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
          }, pointToLayer: (feature, latLng) => {
              return L.marker(latLng,{icon: this.myMarker});
          }
        }).addTo(this.map);
    }
  }
  

  reactiveForm(){
    this.zoneForm = this.fb.group({
      dzongkhagControl:[],
      zoneControl:[],
      subZoneControl:[]
    });
    this.searchForm = this.fb.group({
      searchBuilding:[]
    });
  }


  markerColor(status){
    if(status === "ACTIVE"){
      return '#EB3637'
    }else{
      return '#F3C13A'
    }
  }


  renderMap(dataservice: DataService){  
      var sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        minZoom: 9,
      });
      this.map = L.map('map',{
        center:[26.864894, 89.38203],
        zoom: 13,
        maxZoom: 20,
        minZoom: 9,
        layers: [sat]
      });
          
    var baseMaps = {
      "Satellite Image": sat
    }; 
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
    let newMarker: any;
    this.map.on('click', <LeafletMouseEvent>($e) => {
      if (this.isAddAllowed) {
        if (newMarker !== undefined) {
          this.map.removeLayer(newMarker);
        }
        newMarker = L.marker($e.latlng, {icon: this.myMarker}).addTo(this.map);
      }
    });


    var nationalCovidMarker = {
      radius: 5,
      fillColor: "#9D2933",
      color: "#9D2933",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
  }

  getPositiveCase(dzoid){
    this.dataService.getpositivecases(dzoid).subscribe(res => {
      console.log("positive added")
      this.addPositiveCases(res)
      
      this.responseData = res;

      this.value= res.length;
      var earliestDate = res[0].properties.day
      var latestDate= res[res.length -1].properties.day
      // var days = this.getDifferenceInDays(new Date(latestDate),new Date(earliestDate))

      console.log("latest" + latestDate)
      console.log("earliest" + earliestDate)
      // console.log(this.addDate(3,new Date(latestDate)))

      // for(var i = 0; i <= days + 1; i++){
      //   var currentElementDate:Date = this.addDate(i,new Date(latestDate))
      //   this.stepvalue.push({value:i,legend:this.monthNames[currentElementDate.getMonth()-1] + " " + currentElementDate.getDate(),date:currentElementDate.toISOString()})
      // }
      console.log(res)
      console.log("step value")
      console.log(this.stepvalue)
      this.options= {
        floor:latestDate,
        ceil:earliestDate,
        vertical:false
      };
      this.slide = true;
    })
  }

  addPositiveCases(data:any){
    if(this.NationalCase !== undefined){
      this.map.removeLayer(this.NationalCase)
    }
    this.red_buildings = 0
    this.total_cases = 0
    this.NationalCase = L.geoJSON(data, {
      pointToLayer:  (feature, latlng) => { 
        if(feature.properties.status ==="ACTIVE"){
          this.red_buildings = this.red_buildings + 1
          this.total_cases = Number(this.total_cases) + Number(feature.properties.numCases)
        }
        return L.circleMarker(latlng,{
          radius: 5,
          fillColor: this.markerColor(feature.properties.status),
          color: this.markerColor(feature.properties.status),
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        });
      },
      onEachFeature: (feature, layer) => {  
          console.log("sdfs")
          layer.on('click', e => {
            this.buildingId= e.sourceTarget.feature.geometry.properties.structure_id;
                          this.deleteButton = true
                          this.unitDetailShow =true
                          this.showBuildingInfo = true;
                          this.residentialUnitDetailShow =false;
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
                          this.dataService.getImg(this.buildingId).subscribe(res=>{
                            if(res.success){
                              this.imgs = res.data
                            }
                          })
    
          })
          layer.bindPopup(
            '<p style:"color:tomtato">Status: ' + feature.properties.status + '</p>'+
            '<p style:"color:tomtato">Case Id: ' + feature.properties.case_id+ '</p>'+
            '<p style:"color:tomtato">Number of Cases: ' + feature.properties.numCases + '</p>'+
            '<p style:"color:tomtato">Date Detected: ' + new Date(feature.properties.date).toLocaleDateString() + '</p>'
          ) 
        }
    }).addTo(this.map)
  }
  
  addOverallbound(){
    var promise = new Promise((resolve,reject)=>{
      this.dataService.getZone().subscribe(res=>{
        if(res.success == "true"){
          this.zonebound = L.geoJSON(res.data,{
            style: (feature)=>{
                return {
                color:"yellow",
                fillOpacity:0
                }
              }
            }).addTo(this.map)
        }
        resolve("success")
      })
    })
    return promise
  }

  onSliderChange($e){
    // var selectedDate = this.stepvalue[this.value].date
    var filteredJson:any = []

    filteredJson = this.responseData.filter((e,i,a)=>{
      console.log("element date" + e.properties.day)
      return e.properties.day <= this.value 
    })
    this.addPositiveCases(filteredJson)
  }

  zoneSearch() {
      const zoneId = this.zoneForm.get('subZoneControl').value;
      this.renderBuildings(zoneId)
      sessionStorage.setItem('subzoneID', zoneId)
  }

  renderBuildings(zoneId){
    const geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getzone/${zoneId}`).subscribe((json:any)=>{
      this.bound= L.geoJSON(json.data,{
        style: (feature)=>{
          return {
            color:"red",
            fillOpacity:0
          }
        }
      }).addTo(this.map);
    })

      

    this.dataService.getStructure(zoneId).subscribe((json: any) => {
      this.json = json;
      if(this.buildingGeojson !== undefined){
        this.map.removeLayer(this.buildingGeojson)
        this.buildingGeojson = null
      }
     this.totalBuilding = this.json.length
     this.totalCompleted =0
    
      this.buildingGeojson = L.geoJSON(this.json, {
                 onEachFeature: (feature, layer) => {
                  if(feature.properties.status == "COMPLETE"){
                    this.totalCompleted ++
                  }
                  layer.on('click', (e) => {
            
                    this.residentTableShow=false;
                    if(feature.properties.status == 'INCOMPLETE'){
                    
                    this.deleteButton = true
                    this.deleteID = feature.properties.structure_id  
                    this.showBuildingInfo = false;
                    this.residentTableShow = false
                    this.unitDetailShow =false
                      this.snackBar.open(`buildingID: ${this.deleteID} No Data` , '', {
                        duration: 4000,
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                      });
                    }else{
      
                      this.buildingId = feature.properties.structure_id;
                      this.deleteButton = true
                      this.unitDetailShow =true
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
                      this.dataService.getImg(this.buildingId).subscribe(res=>{
                        if(res.success){
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
          }, pointToLayer: (feature, latLng) => {
            if(feature.properties.status == 'INCOMPLETE'){
              return L.marker(latLng, {icon: this.redMarker});
            }else if(feature.properties.status == "PROGRESS"){
              return L.marker(latLng, {icon: this.yellowMarker});
            }else if(this.showattic){
              return L.marker(latLng,{icon: this.myMarker});
            } else{
              this.precentCompleted ++
              return L.marker(latLng, {icon: this.greenMarker});
            }
          }
        });
        this.map.addLayer(this.buildingGeojson)
        this.map.fitBounds(this.buildingGeojson.getBounds());       
     this.precentCompleted = (this.totalCompleted/this.totalBuilding)*100;
      this.progressShow = true;
    });
  }
  
  showResident(unitid){
    this.resident = null;
    this.residentTableShow = true

    this.snackBar.open('Scroll down' , '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.dataService.getAHousehold(unitid).subscribe(resp=>{
   

      if(resp.data.unitUse !== "Residential"){
        this.residentialUnitDetailShow = false
        this.officeShopDetailShow = true
      }else{
        this.residentialUnitDetailShow = true
        this.officeShopDetailShow = false
      }
      this.housholdsData = resp.data
     
      this.dataService.getFamilyMembers(unitid).subscribe(resp => {
       this.familyMembers = resp.data
      })
      this.dataService.getUserInfo(resp.data.userId).subscribe(res => {
        if(res.success === "error"){
          this.enumeratedBy = 'No Info.'
        }else{
          let userName = res.data.username + ',' + res.data.cid
          this.enumeratedBy = userName
        }
       
      })
      
    });
  }

  selectedRowIndex = -1;

  highlight(row){
      this.selectedRowIndex = row.id;
  }



  toggleClearData(){
    if(this.clearData ===false){
      this.clearData = true
    }else{
      this.clearData = false
    }
  }
 

  showBuilding(unitid){
    this.buildingInfo = null;
    this.buildingInfo = new BuildingInfo()

  }


  reset(){
    this.zoneForm.reset();
    this.selectZone = false;
    this.showFamilyMembers = false;
    this.progressShow = false
    this.buildingInfo = null; 
    this.unitsData = null;
    this.imgs = null;
    this.resident = null;
    if(this.bound !== undefined){
      this.map.removeLayer(this.bound)
    }
    if(this.buildingGeojson !== null){
      this.map.removeLayer(this.buildingGeojson);
    }
    if(this.searchmarker !== undefined){
      this.map.removeLayer(this.searchmarker);
    }
    sessionStorage.removeItem('subzoneID')  
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

  showFamilyMemberDetail(unitId){
    this.snackBar.open('Scroll down' , '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.showFamilyMembers = true
  }

  showSelectZone(){
  
    if(this.selectZone === false){
      this.selectZone = true
    }else{
      this.selectZone = false
    }

    if(this.clearData === false){
      this.clearData = true
    }else{
      this.clearData = false
    }
  }
}