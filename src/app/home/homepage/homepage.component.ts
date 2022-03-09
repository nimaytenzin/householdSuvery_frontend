import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(
    private dataservice: DataService
  ) { }

  redFlatStatsByMegazone = {}
  redBuildingStatsByMegazone = {};
  selectedMegazoneLayer = null;



  map: L.Map;
  megazoneMap;

  megaZoneStatistics: any = [
    { id: 1, name: "North Megazone" },
    { id: 2, name: "C1 Megazone" },
    { id: 3, name: "C2 Megazone" },
    { id: 4, name: "South Megazone" }
  ]
  cumulativeStatistics: any = {
    totalActiveRedClusters: 13
  }

  sat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 9,
  });

  ngOnInit() {

    this.map = L.map('map', {
      center: [27.472712, 89.637622],
      zoom: 13,
      maxZoom: 16,
      minZoom: 10,
      attributionControl: false,
      zoomControl: false
    });





    this.dataservice.statsNotokenThimphuGetMegazoneRedflats().subscribe(res => {
      this.cumulativeStatistics.totalActiveRedFlats = res.data.totalActive;
      this.megaZoneStatistics.forEach(megazone => {
        megazone.activeFlats = res.data.activeFlats[megazone.id] ? res.data.activeFlats[megazone.id] : 0;
        megazone.inactiveFlats = res.data.activeFlats[megazone.id] ? res.data.inactiveFlats[megazone.id] : 0;
      })
      this.dataservice.statsNoTokenThimphuGetMegazoneRedBuilding().subscribe(resp => {
        this.cumulativeStatistics.totalActiveRedBuildings = resp.data.totalActive;
        this.megaZoneStatistics.forEach(megazone => {
          megazone.activeBuildings = resp.data.activeBuildings[megazone.id] ? resp.data.activeBuildings[megazone.id] : 0;
          megazone.inactiveBuildings = resp.data.inactiveBuildings[megazone.id] ? resp.data.inactiveBuildings[megazone.id] : 0;
        })

        fetch(`${environment.BASE_URL}/assets/megaZoneThimphu.geojson`)
          .then(res =>
            res.json())
          .then(
            data => {
              function getColor(val) {
                return val > 90 ? '#B71D1C' :
                  val > 80 ? '#c41a3c' :
                    val > 65 ? '#C62828' :
                      val > 50 ? '#D42626' :
                        val > 45 ? '#EC5B51' :
                          val > 23 ? '#EC5752' :
                            val > 10 ? '#F6A9A9' :
                              '#A6DDAB';
              }

              function getStyle(feature) {
                return {
                  weight: 0.4,
                  opacity: 1,
                  color:"white",
                  fillOpacity: 1,
                  fillColor: getColor(feature.properties.activeBuildings)
                };
              }
              data.features.forEach(feat => {
                this.megaZoneStatistics.forEach(stats => {
                  if (feat.properties.Id === stats.id) {
                    feat.properties.activeBuildings = stats.activeBuildings
                  }
                })

              })

              console.log("Transformed Data", data)

              this.megazoneMap = L.geoJSON(data, {
                onEachFeature: function (feature, featureLayer) {
                  featureLayer.on("click", function () {
                    console.log(feature)

                  })
                  featureLayer.bindTooltip(
                    `${feature.properties.Name} <br>
                      redBuildings: ${feature.properties.activeBuildings}
                    `
                    , {
                    permanent: true,
                    direction: 'center',
                    opacity: 0.5,
                    className: 'myCSSClass'
                  })

                },
                style: getStyle
              }).addTo(this.map);
            }
          )
      })

    })



    console.log("MEgazone Statistics", this.megaZoneStatistics)


    console.log("CUmulative stats", this.cumulativeStatistics)
    // this.dataservice.statsThimphuGetMegazoneRedBuilding().subscribe(res=>{
    //   console.log(res.data)
    //   this.megaZoneStatistics.forEach(megazone=>{
    //     megazone.activeBuildings = res.data.activeBuildings[megazone.id]? res.data.activeFlats[megazone.id]:0;
    //     megazone.inactiveBuildings = res.data.inactiveBuildings[megazone.id]? res.data.activeBuildings[megazone.id]:0;
    //   }) 
    // })

   


  }



}
