import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../service/data.service';

// interface Building Form


export class Building{
    structure_id: number;
    block_no: string;
    building_owner: string;
    cidOwner: string;
    contactOwner: number;
    existancyStatus:string;
    constYear: number;
    floors: number;
    attic: boolean;
    basement: boolean
    buildingStyle:string;
    buildingTypology:string;
    structureType: string;
    roofMaterial: string;
    sewerTreatment: string;
    wasteCollection: string;
    wasteCollectionFrequency: string;
    waterSupply: string;
    buildingUse: string;
}

interface Floor{
  name:string,
  value:number
}

interface DropDownOptions {
  id: string;
  name: string;
}

interface BooleanDropdown {
  name: string;
  value:boolean
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  
  buildingForm: FormGroup;
  schoolForm: FormGroup;
  institutionForm: FormGroup;
  showScanner = false;
  buildingId: number;
  qrId: string;
  houseHoldId: number;
  unitUse: string;
  shopUse: string;
  unitId: number;
  
  latitude: number;
  longitude: number;
  accuracy: number;
  building: Building;

  disableForm = false;
  displayForm = true;
  displayCamera = false;
  showOtherType = false;
  displaySchoolForm=false;
  displayInstitutionForm=false;
  showOtherFloorTypes=false;

  //i have added from here


  buildingStyles: DropDownOptions[]=[
    {id:'1', name:"Contemporary"},
    {id:'2', name:"Traditional"},
    {id:'3', name:"Composite"}
  ]

  existancyStatuss:DropDownOptions[]=[
    {id:'1', name:"Standing"},
    {id:'2', name:"Under Construction"},
    {id:'3', name:"Demolished"},
    {id:'4', name:"Abandoned"}
  ]

  structureTypes:DropDownOptions[]=[
    {id:'1', name:"Framed"},
    {id:'2', name:"Load Bearing"},
    {id:'3', name:"Composite"},
    {id:'4', name:"Others"}
  ]

  buildingTopologies :DropDownOptions[]=[
    {id:'1', name:"RCC Frame Structure"},
    {id:'2', name:"Rammed Earth"},
    {id:'3', name:"Adobe Block"},
    {id:'4', name:"CSEB"},
    {id:'5', name:"Timber"},
    {id:'6', name:"Ekra"},
    {id:'7', name:"Confined Masonry"},
    {id:'8', name:"Concrete Block with No Reinforcement"},
    {id:'9', name:"Concrete Block with Reinforcement"},
    {id:'10', name:"Red Bricks with No Reinforcement"},
    {id:'11', name:"Red Bricks with Reinforcement"},
    {id:'12', name:"Rubble Stone with Mud Mortar"},
    {id:'13', name:"Rubble Stone with Cement Mortar"},
    {id:'14', name:"Rubble Stone with Cement Mortar and Reinforcement"},
    {id:'15', name:"Dressed Stone with Mud Mortar"},
    {id:'16', name:"Dressed Stone with Cement Mortar"},
    {id:'17', name:"Dressed Stone with Cement Mortar and Reinforcement"},
    {id:'18', name:"Cut Stone with Mud Mortar"},
    {id:'19', name:"Cut Stone with Cement Mortar"},
    {id:'20', name:"Cut Stone with Cement Mortar and Reinforcement"},
    {id:'21', name:"Informal Constructions"}
  ]


  roofingMaterials: DropDownOptions[]=[
    {id:'1', name:"CGI"},
    {id:'2', name:"Fibre Glass"},
    {id:'3', name:"Slate"},
    {id:'4', name:"Tiles"},
    {id:'5', name:"Wooden Shingles"},
    {id:'6', name:"Others"}
  ]

  sewerTreatmentOptions: DropDownOptions[]=[
    {id:'1', name:"Individual Septic Tank"},
    {id:'2', name:"Communal Septic Tank"},
    {id:'3', name:"Sewerage"},
    {id:'4', name:"Pit Latrine"},
    {id:'5', name:"Others"}

  ]

  floors:Floor[]=[
    {name:'G', value:1},
    {name:'G+1', value:2},
    {name:'G+2', value:3},
    {name:'G+3', value:4},
    {name:'G+4', value:5},
    {name:'G+5', value:6},
    {name:'G+6', value:7},
    {name:'G+7', value:8}
  ]

  wasteCollectionOptions:DropDownOptions[]=[
    {id:'1', name:"Thromde"},
    {id:'2', name:"Dzongkhag"},
    {id:'2', name:"Private"},
    {id:'3', name:"Individual"}
  ];

  waterSupplyOptions:DropDownOptions[]=[
    {id:'1', name:"Thromde"},
    {id:'2', name:"Rural Water Supply"},
    {id:'3', name:"Private Individual"},
    {id:'4', name:"Private Community"},
    {id:'5', name:"Dzongkhag"},
    {id:'6', name:"Others"}
  ];

  buildingUses:DropDownOptions[]=[
    {id:'1', name:"Residential"},
    {id:'2', name:"Commercial"},
    {id:'3', name:"Mixed Use"},
    {id:'4', name:"Office"},
    {id:'5', name:"Industrial"},
    {id:'6', name:"Hospital"},
    {id:'7', name:"Educational"},
    {id:'8', name:"Religious Institution"},
    {id:'9', name:"Storage"},
    {id:'10', name:"Assembly"},
    {id:'11', name:"Others"}

  ]

  atticOptions:BooleanDropdown[]=[
    { name: "Yes",value:true},
    { name: "No",value:false}
  ]

  basementOptions:BooleanDropdown[]=[
    { name: "Yes",value:true},
    { name: "No",value:false}
  ]
  floorTypes:DropDownOptions[]=[
    {id:'1', name:"Wood"},
    {id:'2', name:"RCC Slab"},
    {id:'3', name:"Steel"},
    {id:'4', name:"Others"}
    ]

  constructionYears:DropDownOptions[]=[
    {id:'1', name:"Less than 5 Years ago"},
    {id:'2', name:"5-15 years ago"},
    {id:'3', name:"15-25 years ago"},
    {id:'4', name:"25-35 years ago"},
    {id:'5', name:"35-45 years ago"},
    {id:'6', name:"45-50 years ago"},
    {id:'7', name:"More than 50 years ago"},
  ]


 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private snackBar: MatSnackBar

  ) {
    this.building = new Building();
  }

  ngOnInit() {
    this.buildingId = Number(sessionStorage.getItem('buildingId'));
    this.dataService.getBuildingInfo(this.buildingId).subscribe(resp=>{
      if(resp['success']=="true"){
        this.snackBar.open('Building registration already complete', '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['dashboard',this.buildingId])
      }
    })
    this.reactiveForms();
  }


  changeDiff($event){
    this.displayInstitutionForm = false;
    this.displaySchoolForm = false;

    if($event.value==="4"){
      this.displayInstitutionForm= true;
    }
    if($event.value==="5"){
      this.displaySchoolForm= true;
    }
  }


  selectWatersupply($event){
    let watersuplydata =[];
    watersuplydata = $event.source.value;
    this.building.waterSupply = watersuplydata.toString();
  }
   // control

   reactiveForms() {
    this.buildingForm = this.fb.group({
      nameOfBuildingOwner:[],
      cidOwner:[],
      contactOwner:[],
      existancyStatus:[],
      buildingUse:[],
      constructionYear:[],
      numberOfFloors:[],
      attic:[],
      basement:[],
      buildingStyle:[],
      buildingTypology:[],
      structureType:[],
      floorType:[],
      floorTypeOthers:[],
      roofingMaterial:[],
      sewerTreatment:[],
      wasteCollection:[],
      wasteCollectionFrequency:[],
      waterSupply:[],
      residentialUnits:[],
      commercialUnits:[],
      officeUnits:[]
      });
  }

  changeCid(e){
    let cid = this.building.cidOwner = this.buildingForm.get('cidOwner').value;
    if(cid.length > 10){
      this.dataService.getCid(cid).subscribe(res=>{
        if(res.success === "true"){
          let data = res.data.citizendetails.citizendetail
          this.buildingForm.patchValue({
            building_owner : data.firstName + data.lastName

          })
        }
      })

    }
  }


  submit(){
    // this.registerBuilding();
    // // this.router.navigate(['dashboard',this.buildingId]);
    // console.log(this.building)
    this.router.navigate(['dashboard',1]);
  }

  showOtherFloorType(e){
    if(e.value === "Others"){
      this.showOtherFloorTypes = true
    }else{
      this.showOtherFloorTypes = false
    }
  }


  registerBuilding(){
    this.building.structure_id = Number(sessionStorage.getItem('buildingId'));
    this.building.block_no = this.buildingForm.get('blockNumber').value;
    this.building.building_owner = this.buildingForm.get('nameOfBuildingOwner').value;
    this.building.cidOwner = this.buildingForm.get('cidOwner').value;
    this.building.existancyStatus = this.buildingForm.get('existancyStatus').value;
    this.building.buildingUse = this.buildingForm.get('buildingUse').value;
    this.building.constYear = this.buildingForm.get('constructionYear').value;
    this.building.floors = this.buildingForm.get('numberOfFloors').value;
    this.building.attic = this.buildingForm.get('attic').value;
    this.building.basement = this.buildingForm.get('basement').value;
    this.building.buildingStyle = this.buildingForm.get('buildingStyle').value;
    this.building.structureType = this.buildingForm.get('structureType').value;
    this.building.roofMaterial = this.buildingForm.get('roofingMaterial').value;
    this.building.sewerTreatment = this.buildingForm.get('sewerTreatment').value;
    //buildingOwnership
    this.building.wasteCollection = this.buildingForm.get('wasteCollection').value
    this.building.wasteCollectionFrequency = this.buildingForm.get('wasteCollectionFrequency').value
    this.building.waterSupply = this.buildingForm.get('waterSupply').value

  }
  
  
}
