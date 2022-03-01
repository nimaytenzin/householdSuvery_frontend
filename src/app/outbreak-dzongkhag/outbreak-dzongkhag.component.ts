import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { DataService } from '../service/data.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-outbreak-dzongkhag',
  templateUrl: './outbreak-dzongkhag.component.html',
  styleUrls: ['./outbreak-dzongkhag.component.css']
})
export class OutbreakDzongkhagComponent implements OnInit {
  map: L.Map;
  carto = L.tileLayer("https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png");
  dzongkhagMap :L.GeoJSON;

  dzoId;
  excelUrl;
  dzongkhagName:string;


  constructor(
    private dataservice: DataService,
    private route : ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  

  ngOnInit() {
    this.dzoId =  this.route.snapshot.params['dzoId'];
    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 13,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.carto],
      zoomControl: false
    });

    this.dataservice.getExcelbyDzongkhag(this.dzoId).subscribe(res=>{
      this.excelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.sheetslink)
      this.dzongkhagName = res.name;
    })


    this.dataservice.getChiwogGeojsonByDzongkhag(this.dzoId).subscribe(res =>{
      this.dzongkhagMap = L.geoJSON(res, {
        onEachFeature:function(feature, featureLayer){
         featureLayer.bindPopup(`
            Chiwog: ${feature.properties.chiwog} <br>
            Gewog: ${feature.properties.gewog}
            `
         )
          featureLayer.on('click', (e)=>{
            console.log(e);
          })
        },
        style:function(feature){
          switch(feature.properties.status){
            case 'Green' :return { color:'black',fillColor:"#59ae52", weight:0.4, fillOpacity:.7 };
            case 'Red'   :return { color:'black',fillColor:"#e31a1c", weight:0.4, fillOpacity:.7 };
            case 'Yellow':return { color:'black',fillColor:"#fde66f", weight:0.4, fillOpacity:.7 };
          }
        }
      }).addTo(this.map)

      this.map.fitBounds(this.dzongkhagMap.getBounds())
    })

  

  }


  goBack(){
    this.router.navigate(['outbreak-phasing'])
  }

}
