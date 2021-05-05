import { Component, OnInit, NgZone} from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MarkPostiiveDialogComponent } from "../dialog/mark-postiive-dialog/mark-postiive-dialog.component";
import { Options } from "@angular-slider/ngx-slider";
import { filter } from 'rxjs/operators';
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
  selector: 'app-view-positive-map',
  templateUrl: './view-positive-map.component.html',
  styleUrls: ['./view-positive-map.component.scss']
})
export class ViewPositiveMapComponent implements OnInit {



  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','view'];
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
    numberHousehold:number,
    incomeEarner:number,
    householdIncome:number,
    shopOfficeName:string,
    shopOfficeContact:number,
    shopOfficeRent:number
  } = {
    unitId: 0,
    enumeratedBy: 'No info',
    unitOwnership:"Not added",
    name:"Not added",
    cid:0,
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


  resetHouseholdData(){

  }

  markerColor(status){
    if(status === "ACTIVE"){
      return '#9D2933'
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


    this.NationalCase = L.geoJSON(null, {
      pointToLayer:  (feature, latlng) => { 
        this.red_buildings = this.red_buildings + 1
        this.total_cases = Number(this.total_cases) + Number(feature.properties.numCases)
        console.log(feature)
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
            '<p style:"color:tomtato">Number of Cases: ' + feature.properties.numCases + '</p>'+
            '<p style:"color:tomtato">Date Detected: ' + feature.properties.date.slice(0,10) + '</p>'
          ) 
        }
    })

    const geojsosn = this.dataService.getpositivecases().subscribe(res => {
      this.NationalCase.addData(res).addTo(this.map);
      this.responseData = res;

      this.value= res.length;
      var earliestDate = res[0].properties.date
      var latestDate= res[res.length -1].properties.date
      var days = this.getDifferenceInDays(new Date(latestDate),new Date(earliestDate))

      console.log("latest" + latestDate)
      console.log("earliest" + earliestDate)
      console.log(this.addDate(3,new Date(latestDate)))

      for(var i = 0; i <= days + 1; i++){
        var currentElementDate:Date = this.addDate(i,new Date(latestDate))
        this.stepvalue.push({value:i,legend:this.monthNames[currentElementDate.getMonth()] + " " + currentElementDate.getDate(),date:currentElementDate.toISOString()})
      }
      console.log(res)
      console.log("step value")
      console.log(this.stepvalue)
      this.options= {
        showTicksValues: true,
        stepsArray: this.stepvalue 
      };
      this.slide = true;
    })

  }

  compareDate(date1: string, date2: string): number
  {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    let d1 = new Date(date1); let d2 = new Date(date2);

    console.log(d1)
    console.log(d2)
    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;
  
    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

  addDate(days:number,date:Date):Date{
    // var futureDate : Date  = new Date(date)
    var currentDate = new Date()
    var orgDate = new Date(date.toISOString())
    currentDate.setDate(orgDate.getDate()+ days)
    // console.log(date.setUTCDate(currentDate + days))
    // date.setDate(date.getDate() + days)
    return currentDate
  }

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }

  onSliderChange($e){
    var selectedDate = this.stepvalue[this.value].date
    var filteredJson:any = []

    filteredJson = this.responseData.filter((e,i,a)=>{
      console.log("selected date" + selectedDate)
      console.log("element date" + e.properties.date)
      console.log(this.compareDate(selectedDate,e.properties.date))
      return this.compareDate(selectedDate,e.properties.date) ==  1 
    })

    console.log(filteredJson)
    console.log("filtered")
    console.log(this.stepvalue)

    if(this.NationalCase !== undefined){
      this.map.removeLayer(this.NationalCase)
    }


  const zoneMap = L.geoJSON(null,{
    style: (feature)=>{
      return {
        color:"red",
        fillOpacity:0
      }
    }
  })

  // fetch(" https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/HH%20SURVEY.geojson")
  // .then(res => res.json())
  // .then( data => {
  //   zoneMap.addData(data);
  // })
  // this.http.get<any>("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/HH%20SURVEY.geojson").subscribe(res=>{
  //   zoneMap.addData(res).addTo(this.map)
  // })

    // this.dataService.getZone().subscribe(res=>{
    //   zoneMap.addData(res.data).addTo(this.map)
    // })
    this.NationalCase =  L.geoJSON(filteredJson,  {
      pointToLayer:  (feature, latlng) => { 
        console.log(feature)
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
            '<p style:"color:tomtato">Number of Cases: ' + feature.properties.numCases + '</p>'+
            '<p style:"color:tomtato">Date Detected: ' + feature.properties.date.slice(0,10) + '</p>'
          ) 
        }
  }).addTo(this.map)
    console.log("conodld")
    console.log(filteredJson)
    
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
