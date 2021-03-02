import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../service/data.service';
import { count } from 'rxjs/operators';

interface DropDownOptions{
  id:number,
  name:string
}

interface Counts{
  count:number
}

interface BooleanDropdown{
  name:string,
  value:boolean
}


interface DropDownNumber{
  value:number
}

export class Household{
    structure_id: number;
    unitId:string;
    familiesSharing:number;
    unitOwnership:string;
    unitUse:string;
    numberOfRooms:number;


    cid: string;
    name: string;
    gender:string;
    age:number;
    martialStatus: string;
    employment:string;
    employmentOrg: string;
    yearsInService: number;
    distToWork: number;
    modeTransport:string;
    commuteCost: number;
    utilityBill:number;

    numberHousehold: number;
    incomeEarner: number;
    householdIncome: number;
    ownHouse: boolean;
    censusDzo: string;
  
    rent:number;
    typeRent: string;
    yearsResiding: number;
    rentIncreased: boolean;
    rentWaived: boolean;
    rentWaivedAmount: number;
    rentIncreaseFiveYears:string;
    hindrance:string;
    compliantResponse:string;
    maintenanceFrequency:string;
    waterAdequacy:string;
    parkingAedequacy:string;
    accessAdequacy:String;
    publicTransportAccess:string;
    femaleSafety:string;

    ownType: string;
    meansOwning:string;
    yearAcquisition: number;
    purchasePrice: number;
    meanFinance: string;
    emi:number
}


export class FamilyMember{
  household_id:number;
  cid:string;
  age:number;
  gender:string
}


@Component({
  selector: 'app-register-unit',
  templateUrl: './register-unit.component.html',
  styleUrls: ['./register-unit.component.scss']
})

export class RegisterUnitComponent implements OnInit {
  //form question hide show logic
  showRentalUnitDetails:boolean;
  showOwnedUnitDetails:boolean;
  showPurchasedUnitDetails:boolean = false;
  showConstructedUnitDetails:boolean = false;
  showHindranceRemarks:boolean

  householdForm:FormGroup;

  multiUnitForm: FormGroup;
  residentForm: FormGroup;

  contactForm: FormGroup;

  showScanner = false;
  buildingId: number;
  qrId: string;
  houseHoldId: number;
  unitUse: string;
  shopUse: string;
  unitId: number;
  multiUnitUseControl: FormGroup;
  household:Household;
  familyMember:FamilyMember;
  showConst:boolean;

  disableForm = false;
  displayForm = true;
  displayCamera = false;
  showOtherType = false;
  displayResidentForm = false;
  displayShopForm = false;

  displayOtherUse = false;

  numberOfRooms:DropDownNumber[]=[
    {value:0},
    {value:1},
    {value:2},
    {value:3},
    {value:4},
    {value:5},
    {value:6},
    {value:7},
    {value:8},
    {value:9},
    {value:10},
    {value:11},
    {value:12},
    {value:13},
    {value:14},
    {value:15},
    {value:16},
    {value:17},
    {value:18},
    {value:19},
    {value:20},
    {value:21},
    {value:22},
    {value:23},
    {value:24},
    {value:25}
  ]

  numberOfFamilies:DropDownNumber[]=[
    {value:1},
    {value:2},
    {value:3},
    {value:4},
    {value:5}
  ]

  //married /single /divorced /widow/widower

  maritalStatusOptions:DropDownOptions[]=[
    {id:1, name: "Married"},
    {id:2, name: "Single"},
    {id:3, name: "Divorced"},
    {id:4, name: "Widow"},
    {id:5, name: "Widower"}
  ]

  // / civil servants /corporate employee / private employee /Self employee 
  employmentOptions:DropDownOptions[]=[
    {id:1, name: "Civil Servant"},
    {id:2, name: "Corporate Employee"},
    {id:3, name: "Private Employee"},
    {id:4, name: "Self Employee"},
    {id:5, name: "Unemployed"},
    {id:6, name: "Project Employee"},
    {id:6, name: "Farmer"},
    {id:6, name: "Others"}


  ]

  numbers:Counts[]=[
    {count:1},
    {count:2},
    {count:3},
    {count:4},
    {count:5},
    {count:6},
    {count:7},
    {count:8},
    {count:9},
    {count:10},
    {count:11},
    {count:12}
  ]

  unitUses:DropDownOptions[]=[
    {id:1, name: "Residential"},
    {id:2, name: "Shop"},
    {id:3, name: "Office"},
    {id:4, name: "Commercial"},
    {id:5, name: "Others"}

  ]
  modeOfTransports:DropDownOptions[]=[
    {id:1, name: "Private"},
    {id:2, name: "Bus"},
    {id:3, name: "Taxi"},
    {id:4, name: "Walk"}
  ]

  yesNoOptions: DropDownOptions[]=[
    {id:1, name: "Yes"},
    {id:2, name: "No"}
  ]

  booleanDropdownOptions: BooleanDropdown[]=[
    {name:"Yes", value: true},
    {name:"No", value: false}
  ]

  genders:DropDownOptions[]=[
    {id:1, name: "Male"},
    {id:2, name: "Female"}
  ]

  dzongkhags:DropDownOptions[]=[
    {id:1, name: "Bumthang"},
    {id:2, name: "Chhukha"},
    {id:3, name: "Dagana"},
    {id:4, name: "Gasa"},
    {id:5, name: "Haa"},
    {id:6, name: "Lhuntse"},
    {id:7, name: "Mongar"},
    {id:8, name: "Paro"},
    {id:9, name: "Pema Gatshel"},
    {id:10, name: "Punakha"},
    {id:11, name: "Samdrup Jongkhar"},
    {id:12, name: "Samtse"},
    {id:13, name: "Sarpang"},
    {id:14, name: "Thimphu"},
    {id:15, name: "Trashigang"},
    {id:16, name: "Trashi Yangtse"},
    {id:17, name: "Trongsa"},
    {id:18, name: "Tsirang"},
    {id:19, name: "Wangdue Phodrang"},
    {id:20, name: "Zhemgang"},
  ]

  unitOccupationOptions:DropDownOptions[]=[
    {id:1, name: "Owned"},
    {id:2, name: "Rented"},
  ]

  // NHDCL quarters /Employer provided housing / Private rented housing/others
  livingYears:DropDownOptions[]=[
    {id:1, name: "Less than a year"},
    {id:1, name: "One to three Years"},
    {id:2, name: "Three to Five Years"},
    {id:3, name: "Five to Eight Years"},
    {id:4, name: "More than Eight Years"}  
  ]
  rentalTypes: DropDownOptions[]=[
    {id:1, name: "NHDCL Quarters"},
    {id:1, name: "NPPF Quarters"},
    {id:2, name: "Employer provided housing"},
    {id:3, name: "Private rented housing"},
    {id:4, name: "Others"}  
  ]
  unitOwnershipOptions: DropDownOptions[]=[
    {id:1, name: "Building Owner"},
    {id:2, name: "Apartment Owner"}
    
  ]

  //Purchased/gifted/inherited/constructed on my own
  meansOfOwnership:DropDownOptions[]=[
    {id:1, name: "Purchased"},
    {id:2, name: "Gifted"},
    {id:3, name: "Inherited"},
    {id:4, name: "Constructed on my Own"}
  ]

  // Loan/savings/ loan+savings/borrowed from relatives
  meansOfFinance:DropDownOptions[]=[
    {id:1, name: "Loans"},
    {id:2, name: "Savings"},
    {id:3, name: "Loan + Savings"},
    {id:4, name: "Borrowed from relatives"}
  ]

  //Qualitative options  disagree/disagree/neutral/agree/strongly disagree

  likerthScale:DropDownOptions[]=[
    {id:5, name: "Strongly Agree"},
    {id:4, name: "Agree"},
    {id:3, name: "Neutral"},
    {id:2, name: "Disagree"},
    {id:1, name: "Strongly Disagree"}
  ]

  //lack of affordable finance scheme from banks/ owns home in other parts of Bhutan / no land /higher cost of construction/Other…specify


  hindrances:DropDownOptions[]=[
    {id:1, name: "Lack of affordable finance schemes from banks"},
    {id:2, name: "Owns home in other parts of Bhutan"},
    {id:3, name: "No land"},
    {id:4, name: "Higher Cost of Construction"},
    {id:4, name: "Others"}
  ]

constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private dataService: DataService,
  private router: Router,
  private snackBar: MatSnackBar
) {
  this.household = new Household();
  this.familyMember = new FamilyMember();
}

ngOnInit() {
  this.buildingId = Number(sessionStorage.getItem('buildingId'));
  this.reactiveForms();
}

changeDiff($event){
  this.displayResidentForm = false;
  this.displayShopForm = false;

  this.displayOtherUse = false;
  if($event.value === "Residential"){
    this.displayResidentForm=true;
  }else if($event.value === "Others"){
    this.displayOtherUse =true;
    this.displayShopForm = true;
  }else{ 

    this.displayShopForm = true;
  }
};

 // control
reactiveForms() {

  this.householdForm = this.fb.group({
    unidID:[],
    familySharing:[],
    unitOwnership:[],
    unitUse:[],
    numberOfRooms:[],

    cidHoh:[],
    nameHoh:[],
    genderHoh:[],
    ageHoh:[],
    maritalStatusHoh:[],
    employmentStatusHoh:[],
    workAgencyHoh:[],
    serviceYearHoh:[],
    workPlaceDistance:[],
    modeTransport:[],
    commutingCost:[],
    utilityBills:[],

    numberHouseholdMembers:[],
    numberIncomeEarners:[],
    monthlyIncome:[],
    ownHouse:[],
    

    monthlyRent:[],
    rentalType:[],
    howLongLiving:[],
    rentIncrease:[],
    rentIncreaseFiveYears:[],
    rentWaiver:[],
    rentWaiverAmount:[],
    hindrance:[],
    hindranceOthers:[],
    complaintResponse:[],
    maintenanceFrequency:[],
    waterAdequacy:[],
    parkingAdequacy:[],
    accessAdequacy:[],
    femaleSafety:[],
    publicTransportAccess:[],
    ownedUnitType:[],
    meansOfOwning:[],
    acquisitionYear:[],
    costPrice:[],
    financeMode:[],
    monthlyEmi:[]
    })    
}


  getAge(age2){
    var from = age2.split("/");
    var birthdateTimeStamp = new Date(from[2], from[1] - 1, from[0]);
    var cur = new Date().getTime();
    var diff = cur - birthdateTimeStamp.getTime();
    var currentAge = Math.floor(diff/31557600000);
    return currentAge
  }

  hohCid(){
    let cid = this.householdForm.get('cidHoh').value;
    if(cid.length > 10){
      this.dataService.getCid(cid).subscribe(res=>{
        if(res.success === "true"){
          let data = res.data.citizendetails.citizendetail[0]
          let name = data.firstName+" "+data.lastName
          let age = this.getAge(data.dob)
          let gender = data.gender === "F" ? "Female" : "Male"
          this.householdForm.patchValue({
            nameHoh: name,
            ageHoh:age,
            genderHoh: gender
          })
        }
      })

    }
  }

  submit(){
    this.household.structure_id = this.houseHoldId;
    this.household.unitId = this.householdForm.get('unidID').value;
    this.household.familiesSharing = this.householdForm.get('familySharing').value;
    this.household.unitOwnership = this.householdForm.get('unitOwnership').value;
    this.household.unitUse = this.householdForm.get('unitUse').value;
    this.household.numberOfRooms = this.householdForm.get('numberOfRooms').value

    this.household.cid = this.householdForm.get('cidHoh').value
    this.household.name = this.householdForm.get('nameHoh').value;
    this.household.gender = this.householdForm.get('genderHoh').value;
    this.household.age = this.householdForm.get('ageHoh').value;
    this.household.martialStatus = this.householdForm.get('maritalStatusHoh').value;
    this.household.employment = this.householdForm.get('employmentStatusHoh').value;
    this.household.employmentOrg = this.householdForm.get('workAgencyHoh').value;
    this.household.yearsInService = this.householdForm.get('serviceYearHoh').value;
    this.household.distToWork = this.householdForm.get('workPlaceDistance').value;
    this.household.modeTransport = this.householdForm.get('modeTransport').value;
    this.household.commuteCost = this.householdForm.get('commutingCost').value;
    this.household.utilityBill = this.householdForm.get("utilityBills").value;

    
    this.household.numberHousehold = this.householdForm.get('numberHouseholdMembers').value;
    this.household.incomeEarner = this.householdForm.get('numberIncomeEarners').value;
    this.household.householdIncome = this.householdForm.get('monthlyIncome').value;
    this.household.ownHouse = this.householdForm.get('ownHouse').value;
    this.household.rentIncreaseFiveYears = this.householdForm.get('rentIncreaseFiveYears').value
    this.household.rent = this.householdForm.get('monthlyRent').value;
    this.household.typeRent = this.householdForm.get('rentalType').value
    this.household.yearsResiding = this.householdForm.get('howLongLiving').value;
    this.household.rentIncreased = this.householdForm.get('rentIncrease').value;
    this.household.rentWaived = this.householdForm.get('rentWaiver').value;
    this.household.rentWaivedAmount = this.householdForm.get('rentWaiverAmount').value;
    
    if(this.householdForm.get('hindrance').value === "Others"){
      this.household.hindrance = this.householdForm.get('hindranceOthers').value 
    } else{
      this.household.hindrance = this.householdForm.get('hindrance').value 
    }

    this.household.compliantResponse = this.householdForm.get('complaintResponse').value;
    this.household.maintenanceFrequency = this.householdForm.get('maintenanceFrequency').value;
    this.household.waterAdequacy = this.householdForm.get('waterAdequacy').value;
    this.household.accessAdequacy = this.householdForm.get('accessAdequacy').value;
    this.household.parkingAedequacy = this.householdForm.get('parkingAdequacy').value;
    this.household.publicTransportAccess = this.householdForm.get('publicTransportAccess').value;
    this.household.femaleSafety = this.householdForm.get('femaleSafety').value;

    this.household.ownType = this.householdForm.get('ownedUnitType').value;
    this.household.meansOwning = this.householdForm.get('meansOfOwning').value;
    this.household.yearAcquisition= this.householdForm.get('acquisitionYear').value;
    this.household.purchasePrice = this.householdForm.get('costPrice').value;
    this.household.meanFinance= this.householdForm.get('financeMode').value;
    this.household.emi = this.householdForm.get('monthlyEmi').value
 
    this.router.navigate(['dashboard', this.buildingId]);

    // this.registerUnit();
    // this.snackBar.open('Unit Registration Complete', '', {
    //   duration: 5000,
    //   verticalPosition: 'bottom',
    //   panelClass: ['success-snackbar']
    // });
    // this.router.navigate(['dashboard',this.buildingId]);

  }
  // registerResident(unitid){
  //   this.resident.unit_id = unitid;
  //   this.resident.structure_id= Number(sessionStorage.getItem('buildingId'));
  //   this.resident.headHousehold = this.residentForm.get('headHouseholdControl').value;
  //   this.resident.contactNumberHead = this.residentForm.get('contactNumberHeadControl').value;
  //   this.resident.cid = this.residentForm.get('cidControl').value;
  //   this.resident.bhutaneseNationals = this.residentForm.get('bhutaneseNationalsControl').value;
  //   this.resident.nonBhutaneseNationals= this.residentForm.get('nonBhutaneseNationalsControl').value;
  //   this.resident.nationalityRemarks = this.residentForm.get('nationalityRemarksControl').value;
  //   this.resident.buddhismMale = this.residentForm.get('buddhismMaleControl').value;
  //   this.resident.buddhismFemale = this.residentForm.get('buddhismFemaleControl').value;
  //   this.resident.hinduismMale = this.residentForm.get('hinduismMaleControl').value;
  //   this.resident.hinduismFemale = this.residentForm.get('hinduismFemaleControl').value;
  //   this.resident.christianityMale = this.residentForm.get('christianityMaleControl').value;
  //   this.resident.christianityFemale = this.residentForm.get('christianityFemaleControl').value;
  //   this.resident.otherMaleR = this.residentForm.get('otherMaleRControl').value;
  //   this.resident.otherFemaleR = this.residentForm.get('otherFemaleRControl').value;
  //   this.resident.maleBelow6= this.residentForm.get('maleBelow6Control').value;
  //   this.resident.femaleBelow6 = this.residentForm.get('femaleBelow6Control').value;
  //   this.resident.male617 = this.residentForm.get('male617Control').value;
  //   this.resident.female617 = this.residentForm.get('female617Control').value;
  //   this.resident.male1824 =  this.residentForm.get('male1824Control').value;
  //   this.resident.female1824 = this.residentForm.get('female1824Control').value;
  //   this.resident.male2559 = this.residentForm.get('male2559Control').value;
  //   this.resident.female2559 = this.residentForm.get('female2559Control').value;
  //   this.resident.male60 = this.residentForm.get('male60Control').value;
  //   this.resident.female60 = this.residentForm.get('female60Control').value;

   
  //   this.resident.armedMale = this.residentForm.get("armedMaleControl").value;
  //   this.resident.armedFemale = this.residentForm.get("armedFemaleControl").value;
  //   this.resident.civilMale = this.residentForm.get("civilMaleControl").value;
  //   this.resident.civilFemale = this.residentForm.get("civilFemaleControl").value;
  //   this.resident.farmerMale = this.residentForm.get("farmerMaleControl").value;
  //   this.resident.farmerFemale = this.residentForm.get("farmerFemaleControl").value;
  //   this.resident.houseHusband = this.residentForm.get("houseHusbandControl").value;
  //   this.resident.houseWife = this.residentForm.get("houseWifeControl").value;
  //   this.resident.jobSeekerMale = this.residentForm.get("jobSeekerMaleControl").value;
  //   this.resident.jobSeekerFemale = this.residentForm.get("jobSeekerFemaleControl").value;
  //   this.resident.monk = this.residentForm.get("monkControl").value;
  //   this.resident.nun = this.residentForm.get("nunControl").value;
  //   this.resident.privateEmployeeMale = this.residentForm.get("privateEmployeeMaleControl").value;
  //   this.resident.privateEmployeeFemale = this.residentForm.get("privateEmployeeFemaleControl").value;
  //   this.resident.retireeMale = this.residentForm.get("retireeMaleControl").value;
  //   this.resident.retireeFemale = this.residentForm.get("retireeFemaleControl").value;
  //   this.resident.corporateMale = this.residentForm.get("corporateMaleControl").value;
  //   this.resident.corporateFemale = this.residentForm.get("corporateFemaleControl").value;
  //   this.resident.studentMale = this.residentForm.get("studentMaleControl").value;
  //   this.resident.studentFemale = this.residentForm.get("studentFemaleControl").value;
  //   this.resident.othersMale = this.residentForm.get("othersMaleControl").value;
  //   this.resident.othersFemale = this.residentForm.get("othersFemaleControl").value;
  //   this.resident.familyIncome = this.residentForm.get("familyIncomeControl").value;
  //   this.resident.differentlyAbled = this.residentForm.get("differentlyAbledControl").value;
  //   this.resident.electricCar = this.residentForm.get("electricCarControl").value;
  //   this.resident.hybridCar = this.residentForm.get("hybridCarControl").value;
  //   this.resident.taxi = this.residentForm.get("taxiControl").value;
  //   this.resident.resParking = this.residentForm.get("resParkingControl").value;
  //   this.resident.otherVehicle = this.residentForm.get("otherVehicleControl").value;
  //   this.resident.busTransport = this.residentForm.get("busTransportControl").value;
  //   this.resident.ownLand = this.residentForm.get("ownLandControl").value;
  //   this.resident.workPlaceSchool = this.residentForm.get("workPlaceSchoolControl").value;
  //   this.resident.ownHouse = this.residentForm.get("ownHouseControl").value;
  //   this.resident.residentRemarks = this.residentForm.get("residentRemarksControl").value;

  //   this.dataService.postResident(this.resident).subscribe(response=>{
  //     if(response.success === "true"){
  //       this.snackBar.open('Registration complete', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['success-snackbar']
  //       });
  //       this.router.navigate(['dashboard',this.buildingId])
  //     }else if (response.success === "false"){
  //       this.snackBar.open('Cannot register unit', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }else if(response.success === "error"){
  //       this.snackBar.open('Error Registering unit', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   })
  // }
  // registerUnit(){
  //   this.unit.structure_id=Number(sessionStorage.getItem('buildingId'));
  //   this.unit.unitNumber = this.multiUnitForm.get('multiUnitIdControl').value;
  //   this.unit.unitName = this.multiUnitForm.get('unitNameControl').value;
  //   this.unit.occupancyStatus = this.multiUnitForm.get('occupancyStatusControl').value;
  //   this.unit.floorLevel = this.multiUnitForm.get('floorLevelControl').value;
  //   this.unit.unitOwnership = this.multiUnitForm.get('unitOwnershipControl').value;
  //   this.unit.rent = this.multiUnitForm.get('rentControl').value;

  //   this.unitUse = this.multiUnitForm.get('multiUnitUseControl').value;
  //   if(this.unitUse=== "Others"){
  //     this.unitUse = this.multiUnitForm.get('otherUseRemarkControl').value;
  //   }
  //   this.unit.unitUse = this.unitUse;
  //   this.unit.remarks = this.multiUnitForm.get('multiUnitRemarksControl').value;
  //   this.unit.contact = this.contactForm.get('contactControl').value;
  //   this.unit.user_id = Number(sessionStorage.getItem('userId'));

  //   this.dataService.postUnit(this.unit).subscribe(response=>{
  //     if(response.success === "true"){
  //       this.unitId = response.data.id
  //       this.dataService.postProgress(this.buildingId).subscribe(resp=>{
  //         if(resp['success']==="true"){
  //           console.log("marked progress")
  //         }
  //       });
  //       if(this.unitUse === "Residential"){
  //         this.registerResident(this.unitId)
  //       }else{
  //         this.snackBar.open('Registration complete', '', {
  //           duration: 5000,
  //           verticalPosition: 'bottom',
  //           panelClass: ['success-snackbar']
  //         });
  //         this.router.navigate(['dashboard',this.buildingId])
  //       }
  //     }else if (response.success === "false"){
  //       this.snackBar.open('Cannot register unit', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }else if(response.success === "error"){
  //       this.snackBar.open('Error Registering unit', '', {
  //         duration: 5000,
  //         verticalPosition: 'bottom',
  //         panelClass: ['error-snackbar']
  //       });
  //     }
  //   });
  // }


houseOccupationListener(e){
  if(e.value === "Owned"){
    this.showOwnedUnitDetails = true;
    this.showRentalUnitDetails = false;
  }else{  
    this.showOwnedUnitDetails = false;
    this.showRentalUnitDetails = true;
  }
}



meansOfOwnershipListner(e){ 
  if(e.value === "Constructed on my Own" ){
    this.showPurchasedUnitDetails = true;
    this.showConst = false
  }else if(e.value === "Purchased"){
    this.showPurchasedUnitDetails = true;
    this.showConst = true
  }else{
    this.showPurchasedUnitDetails = false;
  }
}

hindranceRemarksShow(e){
  if(e.value === "Others"){
    this.showHindranceRemarks = true
   
  }else{
    this.showHindranceRemarks = false
  }
}
}
