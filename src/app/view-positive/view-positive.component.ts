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
import tokml from "geojson-to-kml";
import { ifStmt } from '@angular/compiler/src/output/output_ast';
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



  displayedColumns: string[] = ['position', 'view'];
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

  buildingUse: string = "Not in database";
  cidOwner: string = "Not in database";
  nameOfBuildingOwner: string = "Not in database";
  contactOwner: string = "Not in database";
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
  mylocation: L.Circle;
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
    iconSize: [8, 8]
  });
  yellowMarker = L.icon({
    iconUrl: 'assets/marker-yellow.png',
    iconSize: [12, 12]
  })
  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [12, 12]
  });

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

  setViewValue: boolean;



  //New
  dzongkhagId: number
  redBuildingGeojson: any;
  selectedRedBuilding: any;
  redBuildingCases: any;
  dzongkhag: any;
  totalCases: number;
  totalRedBuildings: number;
  selectedDzongkhagId: number;
  searchDzongkhagId: number;

  quarantineFacilityGeojsonUrl = "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/quarantine.geojson";
  isolationFacilityGeojsonUrl = "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/isolation.geojson"
  zoneMapUrl;
  quarantineFacilities: L.GeoJSON;
  isolationFacilities: L.GeoJSON;
  zoneMap: L.GeoJSON;
  mapLayerControl: L.Control;

  map: L.Map;
  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });
  carto = L.tileLayer("https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png");
  overlayMaps = {}
  baseMaps = {
    "Satellite": this.sat,
    "Carto": this.carto
  }

  yellowChiwogs;
  redChiwogs;

  searchBuildingId: number;
  redbuildings;
  serachCircleMarker: L.Circle;

  zonesUrl: "https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/thimphuZones.geojson";
  MegaZonesUrl: "";

  thimphuZones: L.GeoJSON;
  thimphuMegaZones: L.GeoJSON;
  thimphuPoe: L.GeoJSON;
  thimphuRedClusters: L.GeoJSON;




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
    this.totalCases = 0;
    this.totalRedBuildings = 0
  }

  ngOnInit() {
    this.dzongkhagId = Number(sessionStorage.getItem("dzongkhagId"));
    this.searchDzongkhagId = Number(sessionStorage.getItem("dzongkhagId"))

    console.log("Load zone map of dzo_id", this.searchDzongkhagId);

    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 13,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.sat],
      zoomControl: false
    });

    this.dataService.getChiwogGeojsonByDzongkhag(this.dzongkhagId).subscribe(res => {
      let yellowChiwogs = [];
      let redChiwogs = [];

      this.zoneMap = L.geoJSON(res, {
        onEachFeature: function (feature, featureLayer) {
          // if(feature.properties.status === "Red"){
          //   redChiwogs.push(feature.properties.chiwog)
          // }else if(feature.properties.status === "Yellow"){
          //   yellowChiwogs.push(feature.properties.chiwog)
          // }
          featureLayer.bindPopup("Chiwog: " + feature.properties.chiwog + "<br>" +
            "Gewog: " + feature.properties.gewog + "<br>" +
            "Dzongkhag: " + feature.properties.dzongkhag + "<br>" +
            "Population: " + feature.properties.population
          );
        },
        style: function (feature) {
          switch (feature.properties.status) {
            case 'Green': return { color: "#10A335", weight: 0.4, fillOpacity: 0.4 };
            case 'Yellow': return { color: "#C0DD40", weight: 0.4, fillOpacity: 0.4 };
            case 'Red': return { color: "#E63D27", weight: 0.4, fillOpacity: 0.4 };
          }
        }
      })

      if (this.dzongkhagId === 1) {
        fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/thimphuZones.geojson")
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.thimphuZones = L.geoJSON(data, {
              onEachFeature: function (feature, featureLayer) {
                featureLayer.bindPopup(
                  '<p style:"color:tomtato">Zone Name: ' + feature.properties.Zone + '</p>'
                )

              },
              style: {
                color: "#29DCFB", weight: 1.5, fillOpacity: 0.1
              }
            })


            fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/megaZoneThimphu.geojson")
              .then(res => res.json())
              .then(dat => {
                this.thimphuMegaZones = L.geoJSON(dat, {
                  onEachFeature: function (feature, featureLayer) {
                    featureLayer.bindPopup(
                      '<p style:"color:tomtato">MegaZone: ' + feature.properties.Name + '</p>'
                    )
                    // let ok = new L.Marker(feature.)
                    // console.log9
                    if (!featureLayer.isPopupOpen()) {
                      featureLayer.openPopup()
                    }
                    featureLayer.openPopup()
                  },
                  style: {
                    color: "#D2FF0CCE", weight: 2, fillOpacity: 0.1
                  }
                }).addTo(this.map)

                fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/pointOfentry.geojson")
                  .then(res => res.json())
                  .then(dat => {
                    this.thimphuPoe = L.geoJSON(dat, {


                      pointToLayer: (feature, latLng) => {

                        return new L.CircleMarker(latLng, {
                          radius: 4,
                          color: "blue",
                          fillOpacity: 1,
                          weight: 2
                        }).bindPopup("ok")

                      }



                    }).addTo(this.map)
                  })

                fetch("https://raw.githubusercontent.com/nimaytenzin/householdSuvery_frontend/main/redclusterThimphu.geojson")
                  .then(res => res.json())
                  .then(ok => {
                    console.log(ok)
                    this.thimphuRedClusters = L.geoJSON(ok, {
                      onEachFeature: function (feature, featureLayer) {
                        featureLayer.bindPopup(
                          '<p style:"color:tomtato">Cluster: ' + feature.properties.Name + '</p>'
                        )
                      },
                      style: {
                        color: "#E72424CE", weight: 3, fillOpacity: 0.2
                      }
                    }).addTo(this.map)
                  })
              })
          })
      }

      // if (this.dzongkhagId === 1) {
      //   fetch(this.zonesUrl).then(res => res.json()).then(data => {
      //     console.log(data)
      //     let ok = L.geoJSON(data, {
      //       // onEachFeature: function (feature, featureLayer) {
      //       //  console.log(feature);
      //       // },
      //       style: {
      //         color: "#10A335", weight: 0.4, fillOpacity: 0.4
      //       }}
      //     )
      //   })
      // }



      fetch(this.quarantineFacilityGeojsonUrl).then(data => data.json()).then(res => {
        this.quarantineFacilities = L.geoJSON(res, {
          onEachFeature: (feature, layer) => {
            layer.bindPopup(
              '<p style:"color:tomtato">Name: ' + feature.properties.Name + '</p>' +
              '<p style:"color:tomtato">Dzongkhag: ' + feature.properties.dzongkhag + '</p>'
            )
            layer.on('click', (e) => {
              console.log(feature)
            });

          },
          pointToLayer: (feature, latLng) => {
            return new L.CircleMarker(latLng, {
              radius: 4,
              color: "yellow",
              fillOpacity: 0.85
            });
          }
        });

        fetch(this.isolationFacilityGeojsonUrl).then(res => res.json()).then(data => {
          this.isolationFacilities = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
              layer.bindPopup(
                '<p style:"color:tomtato">Name: ' + feature.properties.Name + '</p>' +
                '<p style:"color:tomtato">Dzongkhag: ' + feature.properties.dzongkhag + '</p>'
              ).openPopup()
            },
            pointToLayer: (feature, latLng) => {
              return new L.CircleMarker(latLng, {
                radius: 4,
                color: "blue",
                fillOpacity: 0.85
              });
            }
          });

          this.overlayMaps = {
            "Quarantine Facilities": this.quarantineFacilities,
            "Isolation Facilities": this.isolationFacilities,
            "Zone Map": this.zoneMap
          };

          this.mapLayerControl = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.map);
          this.fetchAndSetCovidStats(this.dzongkhagId)
          // this.renderMap();
          this.renderRedBuildings(this.dzongkhagId)
          this.yellowChiwogs = yellowChiwogs;
          this.redChiwogs = redChiwogs;
          console.log(this.yellowChiwogs, this.redChiwogs)
        })
      })
    })
    this.dataService.getDzongkhags().subscribe(response => {
      this.dzongkhags = response.data
      response.data.forEach(element => {
        if (this.dzongkhagId === element.id) {
          this.dzongkhag = element.name
        }
      });
    });
  }

  fetchAndSetCovidStats(dzoId) {
    this.dataService.getCovidStatsByDzongkhag(dzoId).subscribe(res => {
      console.log(res)
      this.totalCases = res.data.numCases;
      this.totalRedBuildings = res.data.activeBuilding
    })
  }

  transformChiwogName(name) {
    return name.replace(/_/g, ' ');
  }

  getMyLocation() {
    this.map.locate({ watch: true, enableHighAccuracy: true });
    this.map.on('locationfound', (e) => {
      var radius = e.accuracy;
      if (this.mylocation !== undefined) {
        this.map.removeLayer(this.mylocation);
      }
      this.mylocation = new L.Circle(e.latlng, { radius: 5, color: "green", fillColor: "green", weight: 0, fillOpacity: 1 }).addTo(this.map);
      this.mylocation.bindPopup("You are here").openPopup()
      if (radius < 100) {
        if (this.mycircle !== undefined) {
          this.map.removeLayer(this.mycircle);
        }
        this.mycircle = L.circle(e.latlng, radius).addTo(this.map);
      }
    });
  }


  renderCasebyDzongkhag() {
    this.showBuildingInfo = false;
    this.totalCases = 0;
    this.resident = null;
    this.totalRedBuildings = 0;
    sessionStorage.removeItem("dzongkhagId")
    sessionStorage.setItem("dzongkhagId", String(this.searchDzongkhagId));
    console.log("Load zone map of dzo_id", this.searchDzongkhagId)
    window.location.reload();

    // this.dzongkhags.forEach(dzo => {
    //   if (Number(dzo.id) === Number(sessionStorage.getItem("dzongkhagId"))) {
    //     this.dzongkhag = dzo.name
    //   }
    // })
    // this.fetchAndSetCovidStats(this.searchDzongkhagId);
    // this.renderRedBuildings(this.searchDzongkhagId);
  }


  downloadKml() {

    this.dataService.getRedBuildingKmlByDzongkhag(Number(sessionStorage.getItem("dzongkhagId"))).subscribe(res => {
      let filename: string = `${this.dzongkhag}_redbuilding.kml`
      let binaryData = [];
      binaryData.push(res);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }

  searchBuildingByBuildingNumber() {
    if (this.searchBuildingId) {
      console.log(this.searchBuildingId)

      for (let i = 0; i < this.redbuildings.length; i++) {
        if (this.searchBuildingId === this.redbuildings[i].properties.structure_id) {
          let lat = this.redbuildings[i].coordinates[1];
          let lng = this.redbuildings[i].coordinates[0];
          this.map.flyTo([lat, lng], 18);
          if (this.serachCircleMarker !== undefined) {
            this.map.removeLayer(this.serachCircleMarker)
          }
          this.serachCircleMarker = new L.Circle([lat, lng], {
            radius: 20,
            fillColor: "white"
          }).addTo(this.map)
        } else {
          this.snackBar.open('No Matching Red Building', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      }
    } else {
      this.snackBar.open('Enter a Building Number', '', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }

  toggleThimphuZone() {
    if (this.map.hasLayer(this.thimphuZones)) {
      this.map.removeLayer(this.thimphuZones);
    } else {
      this.map.addLayer(this.thimphuZones);
    }
  }

  togglePoes() {
    if (this.map.hasLayer(this.thimphuPoe)) {
      this.map.removeLayer(this.thimphuPoe);
    } else {
      this.map.addLayer(this.thimphuPoe);
    }
  }

  toggleThimphuMegaZone() {
    if (this.map.hasLayer(this.thimphuMegaZones)) {
      this.map.removeLayer(this.thimphuMegaZones);
    } else {
      this.map.addLayer(this.thimphuMegaZones);
    }
    // this.map.removeLayer(this.thimphuMegaZones);
  }

  toggleRedClusters() {
    if (this.map.hasLayer(this.thimphuRedClusters)) {
      this.map.removeLayer(this.thimphuRedClusters);
    } else {
      this.map.addLayer(this.thimphuRedClusters);
    }
  }

  downloadZoneKml() {
    this.dataService.DownloadChiwogGeojsonByDzongkhag(Number(sessionStorage.getItem("dzongkhagId"))).subscribe(res => {
      let filename: string = `${this.dzongkhag}_zone.geojson`
      let binaryData = [];
      binaryData.push(res);
      console.log(binaryData)
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'text' }));
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    })
  }

  reOrderLayer() {
    if (this.buildingGeojson != undefined && this.redBuildingGeojson != undefined) {
      this.map.removeLayer(this.buildingGeojson)
      this.map.removeLayer(this.redBuildingGeojson)
      this.map.addLayer(this.buildingGeojson)
      this.map.addLayer(this.redBuildingGeojson)
    }
  }

  renderRedBuildings(dzongkhagId: number) {
    this.dataService.getRedBuildingsByDzongkhag(dzongkhagId).subscribe(res => {
      if (res.length !== 0) {
        this.redbuildings = res;
        this.redBuildingGeojson = L.geoJSON(res, {
          onEachFeature: (feature, layer) => {
            layer.on('click', (e) => {
              console.log(feature)
              this.selectedRedBuilding = feature
              // this.map.setView([e.target.feature.geometry.coordinates[1], e.target.feature.geometry.coordinates[0]], 18);
              this.dataService.getCasesByRedbuilingId(feature.properties.id).subscribe(res => {
                this.redBuildingCases = res.data;
                let totalCases = 0;
                this.unitDetailShow = true;
                res.data.forEach(element => {
                  totalCases += element.numCases;
                });
                layer.bindPopup(
                  '<p style:"color:tomtato">Status: ' + feature.properties.status + '</p>' +
                  '<p style:"color:tomtato">Number of Cases: ' + totalCases + '</p>' +
                  '<p style:"color:tomtato">First Detection: ' + new Date(res.data[0].date).toLocaleDateString() + '</p>'
                )
                this.buildingId = feature.properties.structure_id;
                this.showBuildingInfo = true;
                this.dataService.getBuildingInfo(this.buildingId).subscribe(res => {
                  if (res.success === "true") {
                    this.bid = res.data.id
                    this.buildingUse = res.data.buildingUse;
                    this.cidOwner = res.data.cidOwner;
                    this.nameOfBuildingOwner = res.data.nameOfBuildingOwner;
                    this.contactOwner = res.data.contactOwner;
                  } else {
                    this.buildingUse = "No Record";
                    this.cidOwner = "No Record";
                    this.nameOfBuildingOwner = "No Record";
                    this.contactOwner = "No Record";
                  }
                })
                this.showBuildingInfo = true;

                this.dataService.getImg(this.buildingId).subscribe(res => {
                  if (res.success) {
                    this.imgs = res.data
                  }
                })

                this.dataService.getHouseholds(this.buildingId).subscribe(res => {
                  this.unitsData = res.data
                  this.length = res.data.length
                })
              })
            });

          },
          pointToLayer: (feature, latLng) => {
            let bldgMarker: L.CircleMarker;
            console.log(feature.properties.status)
            switch (feature.properties.status) {
              case "INACTIVE":
                bldgMarker = L.circleMarker(latLng, this.redBuildingInactiveMarkerOptions)
                break;
              case "ACTIVE":
                bldgMarker = L.circleMarker(latLng, this.redBuildingMarkerActiveOptions)
                break;
            }
            return bldgMarker;
          }
        }).addTo(this.map);

        // const geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getDzo/${dzongkhagId}`).subscribe((json: any) => {
        //   if (this.bound !== undefined) {
        //     this.map.removeLayer(this.bound);
        //   }
        //   this.bound = L.geoJSON(json.data, {
        //     onEachFeature: (feature, layer) => {

        //     },
        //     style: (feature) => {
        //       return {
        //         color: "white",
        //         fillOpacity: 0,
        //         weight: 1.5
        //       }
        //     }
        //   }).addTo(this.map);
        //   this.map.addLayer(this.redBuildingGeojson)
        // })


        this.map.fitBounds(this.redBuildingGeojson.getBounds());
      }
      // else {
      //   if (this.bound !== undefined) {
      //     this.map.removeLayer(this.bound);
      //     if (this.redBuildingGeojson !== undefined) {
      //       this.map.removeLayer(this.redBuildingGeojson);
      //       const geojson = this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getDzo/${dzongkhagId}`).subscribe((json: any) => {
      //         this.bound = L.geoJSON(json.data, {
      //           style: (feature) => {
      //             return {
      //               color: "#f8fafc",
      //               fillOpacity: 0,
      //               weight: 1
      //             }
      //           }
      //         }).addTo(this.map);
      //       })

      //       this.map.fitBounds(this.bound.getBounds());
      //     }
      //   }
      // }

    })
  }

  renderBoundary(dzoId, isZoom: boolean) {
    this.http.get(`https://zhichar-pling.ddnsfree.com/zone/map/getDzo/${dzoId}`).subscribe((json: any) => {
      if (this.bound !== undefined) {
        this.map.removeLayer(this.bound);
      }
      this.bound = L.geoJSON(json.data, {
        interactive: false,
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

  parseDate(date) {
    return new Date(date).toLocaleDateString()
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
}