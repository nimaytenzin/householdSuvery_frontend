import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../service/data.service';

// interface Building Form

export class Building{
    id:number;
    structure_id: number;
    buildingOwnership:string;
    cidOwner: string;
    nameOfBuildingOwner: string;
    contactOwner: number;
    existancyStatus:string;
    costOfConstruction: number;
    constructionYear:number;
    buildingUse:string;
    floors: string;
    attic: boolean;
    basement: boolean;
    jamthog:boolean;
    buildingStyle:string;
    buildingType:string;
    structureType: string;
    buildingMaterial:string;
    floorType:string;
    roofingMaterial: string;
    sewerTreatment: string;
    wasteCollection: string;
    wasteCollectionFrequency: string;
    waterSupply: string;
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
  selector: 'app-edit-building',
  templateUrl: './edit-building.component.html',
  styleUrls: ['./edit-building.component.css']
})
export class EditBuildingComponent implements OnInit {
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
    {id:'3', name:"Composite"},
    {id:'4', name:"Informal Construction"}
  ]

  buildingTypes: DropDownOptions[]=[
    {id:'1', name:"Permanent"},
    {id:'2', name:"Temporary"},
  ]
  existancyStatuss:DropDownOptions[]=[
    {id:'1', name:"Standing"},
    {id:'2', name:"Under Construction"},
    {id:'3', name:"Abandoned"}
  ]
  ownership:DropDownOptions[]=[
    {id:'1', name:"Singly Owned"},
    {id:'2', name:"Joint Ownership"}
  ]

  structureTypes:DropDownOptions[]=[
    {id:'1', name:"Framed"},
    {id:'2', name:"Load Bearing"},
    {id:'3', name:"Composite"},
    {id:'4', name:"Others"}
  ]

  buildingTopologies :DropDownOptions[]=[
    {id:'1', name:"Rammed Earth"},
    {id:'2', name:"AAC(Aerated Autoclaved Concrete)"},
    {id:'3', name:"Adobe Block"},
    {id:'4', name:"CSEB(Cement Stabilized Earth Block)"},
    {id:'5', name:"Timber"},
    {id:'6', name:"Ekra"},
    {id:'7', name:"Confined Masonry"},
    {id:'8', name:"Concrete Blocks with no reinforcement"},
    {id:'9', name:"Concrete Blocks with  reinforcement"},
    {id:'10', name:"Red Bricks with no reinforcement"},
    {id:'11', name:"Red Bricks with reinforcement"},
    {id:'12', name:"Rubble Stone With Mud Mortar"},
    {id:'13', name:"Rubble Stone With Cement Mortar"},
    {id:'14', name:"Rubble Stone With Cement Mortar and reinforcement"},
    {id:'15', name:"Dressed Stone with Mud Mortar"},
    {id:'16', name:"Dressed Stone with Cement Mortar"},
    {id:'17', name:"Dressed Stone with Cement Mortar and reinforcement"},
    {id:'18', name:"Cut Stone with Mud Mortar"},
    {id:'19', name:"Cut Stone with Cement Mortar"},
    {id:'20', name:"Cut Stone with Cement Mortar and reinforcement"},
    {id:'21', name:"Others"}

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
    {id:'6', name:"Institutional"},
    {id:'7', name:"Others"}

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
    this.buildingId = this.route.snapshot.params['sid'];

    this.dataService.getBuildingInfo(this.buildingId).subscribe(resp=>{
      if(resp['success']=="true"){
        let bbm = resp.data.buildingMaterial;
        let roofmaterial= resp.data.roofingMaterial;
        let water= resp.data.waterSupply;

        this.building.id = resp.data.id;
        this.buildingForm.patchValue({
          buildingOwnership:resp.data.buildingOwnership,
          cidOwner:resp.data.cidOwner,
          nameOfBuildingOwner:resp.data.nameOfBuildingOwner,
          contactOwner:resp.data.contactOwner,
          existancyStatus:resp.data.existancyStatus,
          costOfConstruction:resp.data.costOfConstruction,
          constructionYear:resp.data.constructionYear,
          buildingUse:resp.data.buildingUse,
          numberOfFloors:resp.data.floors,
          attic:resp.data.attic,
          basement:resp.data.basement,
          jamthog:resp.data.jamthog,
          buildingStyle:resp.data.buildingStyle,
          structureType:resp.data.structureType,
          buildingType:resp.data.buildingType,
          floorType:resp.data.floorType,
          sewerTreatment:resp.data.sewerTreatment,
          wasteCollection:resp.data.wasteCollection,
          wasteCollectionFrequency:resp.data.wasteCollectionFrequency,
          buildingMaterial: bbm === null ? null: bbm.split(","),
          roofingMaterial: roofmaterial === null ? null :  roofmaterial.split(","),
          waterSupply: water === null ? null : water.split(",")
        })
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
      buildingOwnership:[],
      cidOwner:[],
      nameOfBuildingOwner:[],
      contactOwner:[],
      existancyStatus:[],
      costOfConstruction:[],
      constructionYear:[],
      buildingUse:[],
      numberOfFloors:[],
      attic:[],
      basement:[],
      jamthog:[],
      buildingStyle:[],
      buildingType:[],
      structureType:[],
      buildingMaterial:[],
      floorType:[],
      roofingMaterial:[],
      sewerTreatment:[],
      wasteCollection:[],
      wasteCollectionFrequency:[],
      waterSupply:[]
      });
  }

  changeCid(e){
    let cid = this.buildingForm.get('cidOwner').value;
    if(cid.length > 10){
      this.dataService.getCid(cid).subscribe(res=>{
        if(res.success === "true"){
          let data = res.data.citizendetails.citizendetail[0]
          let name = data.firstName+" "+data.lastName
          this.buildingForm.patchValue({
            nameOfBuildingOwner : name
          })
        }
      })

    }
  }


  submit(){
    this.registerBuilding();
    this.dataService.updateBuilding(this.building).subscribe(res=>{
      if(res.success === "true"){
        this.snackBar.open('Edited the building information', '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['dashboard',this.buildingId]);
      }else{
        this.snackBar.open('Error submitting edit', '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });

      }
    })
  }

  showOtherFloorType(e){
    if(e.value === "Others"){
      this.showOtherFloorTypes = true
    }else{
      this.showOtherFloorTypes = false
    }
  }

  selectRoofMaterial($e){
    this.building.roofingMaterial = $e.source.value.toString();
    console.log(this.building.roofingMaterial)
  }

  selectMaterial($e){
    this.building.buildingMaterial= $e.source.value.toString();
    console.log(this.building.buildingMaterial)
  }

  selectWater($e){
    this.building.waterSupply= $e.source.value.toString();
    console.log(this.building.waterSupply)
  }

  back(){
    this.router.navigate(['dashboard',this.buildingId]);
  }


  registerBuilding(){
    this.building.structure_id = Number(sessionStorage.getItem('buildingId'));
    this.building.buildingOwnership  = this.buildingForm.get('buildingOwnership').value;
    this.building.cidOwner = this.buildingForm.get('cidOwner').value;
    this.building.nameOfBuildingOwner = this.buildingForm.get('nameOfBuildingOwner').value;
    this.building.contactOwner = this.buildingForm.get('contactOwner').value;

    this.building.existancyStatus = this.buildingForm.get('existancyStatus').value;
    this.building.costOfConstruction = this.buildingForm.get('costOfConstruction').value;
    this.building.constructionYear = this.buildingForm.get('constructionYear').value;
    this.building.buildingUse = this.buildingForm.get('buildingUse').value;
    this.building.buildingUse = this.buildingForm.get('buildingUse').value;
    this.building.floors = this.buildingForm.get('numberOfFloors').value;
    this.building.attic = this.buildingForm.get('attic').value;
    this.building.basement = this.buildingForm.get('basement').value;
    this.building.jamthog = this.buildingForm.get('jamthog').value;
    this.building.buildingStyle = this.buildingForm.get('buildingStyle').value;
    this.building.buildingType = this.buildingForm.get('buildingType').value;
    this.building.structureType = this.buildingForm.get('structureType').value;
    this.building.floorType = this.buildingForm.get('floorType').value;
    this.building.sewerTreatment = this.buildingForm.get('sewerTreatment').value;
    this.building.wasteCollection = this.buildingForm.get('wasteCollection').value;
    this.building.wasteCollectionFrequency = this.buildingForm.get('wasteCollectionFrequency').value;
  }
  
  

}
