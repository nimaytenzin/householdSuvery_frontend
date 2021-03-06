import { Component, OnInit, NgZone} from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {  Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','view', 'update','delete'];
  totalBuilding:number;
  totalCompleted:number;
  showBuildingInfo:boolean=false;
  precentCompleted:number;
  progressShow:boolean =false;
  showFamilyMembers:boolean = false;
  addDeleteButtons:boolean =false;
  deleteButton:boolean = false;
  deleteID:number;
  unitDetailShow:boolean;
  buildingData:any;
  unitsData:any;
  housholdsData:any;
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
  shop: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  json: any;
  bound: any;
  buildingGeojson: any;
  postiveCaseMap: any;
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
  residentAttic=[];
  showCaseDetails = false;

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

  buildingOwnership:IdName[]=[
    {id:'1', name:"Singly Owned"},
    {id:'2', name:"Jointly Owned"},
  ];
  approvedDrawing:IdName[]=[
    {id:'1', name:"Yes"},
    {id:'2', name:"No"},
  ];
  occupancyCertificate:IdName[]=[
    {id:'1', name:"Yes"},
    {id:'2', name:"No"},
  ];
  associativePosition: IdName[]=[
    {id:'1', name:"Main"},
    {id:'2', name:"Ancillary"},
  ];
  existancyStatus: IdName[]=[
    {id:'1', name:"Standing"},
    {id:'2', name:"Under Construction"},
    {id:'3', name:"Demolished"},
    {id:'4', name:"Abandoned"},
  ];
  attic: IdName[]=[
    {id:'1', name:"0"},
    {id:'2', name:"1"},
    {id:'3', name:"2"},
  ];
  stilt: IdName[]=[
    {id:'1', name:"0"},
    {id:'2', name:"1"},
    {id:'3', name:"2"},
   ];
  jamthog: IdName[]=[
    {id:'1', name:"0"},
    {id:'2', name:"1"},
    {id:'3', name:"2"},
  ];
  basement: IdName[]=[
    {id:'1', name:"0"},
    {id:'2', name:"1"},
    {id:'3', name:"2"},
  ];
  buildingStyle: IdName[]=[
    {id:'1', name:"Contemporary"},
    {id:'2', name:"Traditional"},
    {id:'3', name:"Composite"},
  ];
  structureType: IdName[]=[
    {id:'1', name:"Framed"},
    {id:'2', name:"Load Bearing"},
    {id:'3', name:"Composite"},
    {id:'4', name:"Others"},
  ];
  materialType: IdName[]=[
    {id:'1', name:"Brick Masonry"},
    {id:'2', name:"ACC Block"},
    {id:'3', name:"Rammed Earth"},
    {id:'4', name:"Steel"},
    {id:'5', name:"Concrete Block"},
    {id:'6', name:"Stabilized Mud Block"},
    {id:'7', name:"Stone Masonry"},
    {id:'8', name:"Reinforced Concrete"},
    {id:'9', name:"Timbers"},
    {id:'10', name:"Others"}
  ];
  waterSupply: IdName[]=[
    {id:'1', name:"Thromde"},
    {id:'2', name:"Rural Water Supply"},
    {id:'3', name:"Private Individual"},
    {id:'4', name:"Private Community"},
    {id:'5', name:"Others"}
  ];
  roofType: IdName[]=[
    {id:'1', name:"Gable"},
    {id:'2', name:"Hipped"},
    {id:'3', name:"Composite"},
    {id:'4', name:"Others"},
  ];
  roofingMaterial: IdName[]=[
    {id:'1', name:"CGI"},
    {id:'2', name:"Wooden Shingles"},
    {id:'3', name:"Slate"},
    {id:'4', name:"Composite"},
    {id:'6', name:"Others"},
  ];
  emergencyExit: IdName[]=[
    {id:'1', name:"Yes"},
    {id:'2', name:"No"},
  ];
  lift: IdName[]=[
    {id:'1', name:"Yes"},
    {id:'2', name:"No"},
    {id:'3', name:"Provision Provided"},
  ];
  sewerTreatment: IdName[]=[
    {id:'1', name:"Individual Septic Tank"},
    {id:'2', name:"Combined Septic Tank"},
    {id:'3', name:"Thromde Sewerage Network"},
    {id:'4', name:"Pit Latrine"},
    {id:'5', name:"Others"},
  ];
  wasteCollection: IdName[]=[
    {id:'1', name:"Thromde"},
    {id:'2', name:"Dzongkhag"},
    {id:'2', name:"Private Company"},
    {id:'3', name:"Individual"},
  ];
   buildingUse: IdName[] = [
    {id:'1', name:"Residential"},
    {id:'2', name:"Commercial"},
    {id:'3', name:"Mixed Use"},
    {id:'4', name:"Institution"},
    {id:'5', name:"School"},
    {id:'6', name:"Religious"},
    {id:'7', name:"Hospital"},
    {id:'8', name:"Workshop"},
    {id:'9', name:"Sawmill"},
    {id:'10', name:"Industry"},
    {id:'11', name:"Others"},
  ];
  parking: IdName[]=[
    {id:'1', name:"Designated Onstreet"},
    {id:'2', name:"Un-designated Onstreet"},
    {id:'3', name:"Offstreet"},
    {id:'4', name:"Private Parking"}
  ];
  numberOfFloors: IdName[]=[
    {id:'1', name:"G"},
    {id:'2', name:"G+1"},
    {id:'3', name:"G+2"},
    {id:'4', name:"G+3"},
    {id:'5', name:"G+4"},
    {id:'6', name:"G+5"},
    {id:'7', name:"G+6"},
    {id:'8', name:"G+7"},

  ];
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
              this.clearData = true;
              this.buildingId = feature.properties.structure_id;
              this.showBuilding(this.buildingId);
              this.resident = null;
              if(response.data.status == 'INCOMPLETE'){
                this.buildingData= null
                this.deleteButton = true
                this.deleteID = feature.properties.structure_id  
                this.showBuildingInfo = false;
                this.unitDetailShow =false
                  this.snackBar.open('Data Not Added' , '', {
                    duration: 3000,
                    verticalPosition: 'top',
                    panelClass: ['error-snackbar']
                  });
                }else{
                  this.buildingData= null
                  this.buildingId = feature.properties.structure_id;
                  this.deleteButton = true
                  this.unitDetailShow =true
                  this.showBuildingInfo = true;
                  this.deleteID = feature.properties.structure_id  
                  this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                    this.buildingData = res.data
                  })
                  this.dataService.getHouseholds(this.buildingId).subscribe(res => {
                    this.unitsData = res.data
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



  renderMap(dataservice: DataService){
        function zoneStyle(feature) {
          return {
          fillColor:'white',
          weight: 2,
          opacity: 1,
          color: 'yellow',
          dashArray: '3',
          fillOpacity: 0
        };
        }

        function broadZones(feature) {
          return {
          fillColor:'white',
          weight: 2,
          opacity: 1,
          color: 'red',
          dashArray: '3',
          fillOpacity: 0
        };
        }

   
        var sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          minZoom: 9,
        });
        var osm = L.tileLayer('https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png', {
          maxZoom: 20,
          minZoom: 9,
        });
        this.map = L.map('map',{
          center:[27.4712,89.64191],
          zoom: 13,
          maxZoom: 20,
          minZoom: 9,
          layers: [sat]
        });
       

      
      var baseMaps = {
        "Satellite Image": sat,
        "OSM base map": osm 
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
  }


  zoneSearch() {
      const zoneId = this.zoneForm.get('subZoneControl').value;
      this.renderBuildings(zoneId)
      sessionStorage.setItem('subzoneID', zoneId)
  }

  //zone Search End

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
      // this.map.fitBounds(this.bound.getBounds());
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
                    if(feature.properties.status == 'INCOMPLETE'){
                    this.buildingData= null
                    this.deleteButton = true
                    this.deleteID = feature.properties.structure_id  
                    this.showBuildingInfo = false;
                    this.unitDetailShow =false
                      this.snackBar.open('Data Not Added' , '', {
                        duration: 3000,
                        verticalPosition: 'top',
                        panelClass: ['error-snackbar']
                      });
                    }else{
                      this.buildingData= null
                      this.buildingId = feature.properties.structure_id;
                      this.deleteButton = true
                      this.unitDetailShow =true
                      this.showBuildingInfo = true;

                      this.deleteID = feature.properties.structure_id  
                      this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                        this.buildingData = res.data
                      })
                      this.dataService.getHouseholds(this.buildingId).subscribe(res => {
                        this.unitsData = res.data
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
            if(feature.properties.status == 'INCOMPLETE'){
              
              return L.marker(latLng, {icon: this.redMarker});
            }else if(feature.properties.status == "PROGRESS"){
              return L.marker(latLng, {icon: this.yellowMarker});
            }else if(this.showattic){
              for(var i = 0;i<this.residentAttic.length;i++){
                // if(this.residentAttic[i]['structure_id'] == this.);
                // if()
              }
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
      this.housholdsData = resp.data
      this.dataService.getFamilyMembers(unitid).subscribe(resp => {
       this.familyMembers = resp.data
       console.log('familymember',resp)
      })
      
    });
  }

  deleteUnit(id){
    console.log(id)
    const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: "Confirm Delete Unit",
        message: "Are you sure you want to delete the Unit? You will be held accountable for information loss and User details will be recorded"
      }
    });
    confirmDialog.afterClosed().subscribe(result=>{
      if(result == true){
        this.dataService.deleteHousehold(id).subscribe(res => {
          if(res.success = "true"){
            this.snackBar.open('Unit Deleted' , '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          }else{
            this.snackBar.open('Unit kept' , '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
        }
        })   
     }
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

  deleteBuilding(){
    const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: "Delete Building?",
        message: `Are you sure you want to delete ${this.deleteID}? You will be held accountable, User details will be recorded`
      }
    });
    confirmDialog.afterClosed().subscribe(result=>{
      if(result == true){
        this.dataService.deleteBuilding(this.deleteID).subscribe(res => {
          this.snackBar.open('Deleted. You may want to refresh the browser to see the changes' , '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        })
        
          }else{
              this.snackBar.open('Oks' , '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
          }
    });
  }

  showBuilding(unitid){
    // this.building = null;
    this.buildingInfo = null;
    this.buildingInfo = new BuildingInfo();
    this.dataService.getBuildingInfo(unitid).subscribe(resp=>{
      this.buildingInfo.BuildingName = resp.data[0]['nameOfTheBuilding'];
      this.buildingInfo.BuildingOwner = resp.data[0]['nameOfTheBuildingOwner'];
      this.buildingInfo.Contact = resp.data[0]['contactNumberBuilding'];
      this.buildingInfo.Water = resp.data[0]['waterSupply'];
      // this.buildingInfo.BuildingUse = this.buildingUse(resp.data[0]['buildingUse']);
      var useIndex = Number(resp.data[0]['buildingUse'])-1;
      var sewerIndex = Number(resp.data[0]['sewerTreatment'])-1;
      var wasteIndex = Number(resp.data[0]['wasteCollection'])-1;
      this.buildingInfo.BuildingUse = this.buildingUse[useIndex]['name'];
      this.buildingInfo.Sewer = this.sewerTreatment[sewerIndex]['name'];
      this.buildingInfo.Waste = this.wasteCollection[wasteIndex]['name'];
      this.buildingInfo.Remarks = resp.data[0]['buildingRemarksstring'];
    });

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
    if(this.bound !== null){
      this.map.removeLayer(this.bound)
      // this.bound = null;
    }
    if(this.buildingGeojson !== null){
      this.map.removeLayer(this.buildingGeojson);
      // this.buildingGeojson = null;
    }
    if(this.searchmarker !== undefined){
      this.map.removeLayer(this.searchmarker);
      // this.searchmarker = null;
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

  unlockBuilding(){
    const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: "Unlock Building?",
        message: "Are you sure?"
      }
    });
    confirmDialog.afterClosed().subscribe(result=>{
      if(result == true){
        this.dataService.postProgress(this.buildingId).subscribe(res => {
          if(res.success === "true"){
            this.snackBar.open('Unlocked Successfully' , '', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          }
         })
      }
    });


    
    
  }

  editBuilding(){
    this.router.navigate([`edit-building/${this.buildingId}`])
  }

  editFamilyMember(){
    this.snackBar.open('Redirect to update Family Member Component' , '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  deleteFamilyMember(){
    const confirmDialog = this.dialog.open(ConfirmDialogComponent,{
      data:{
        title: "Delete Family Member?",
        message: "Are you sure?"
      }
    });
    confirmDialog.afterClosed().subscribe(result=>{
      if(result == true){
        this.snackBar.open('Deleted' , '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }else{
        this.snackBar.open('Ok' , '', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  updateUnit(unitID){
    this.router.navigate([`edit-unit/${unitID}`])
  }

} 

