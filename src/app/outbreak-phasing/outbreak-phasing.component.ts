import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DataService } from '../service/data.service';
@Component({
  selector: 'app-outbreak-phasing',
  templateUrl: './outbreak-phasing.component.html',
  styleUrls: ['./outbreak-phasing.component.css']
})
export class OutbreakPhasingComponent implements OnInit {
  map: L.Map;
  carto = L.tileLayer("https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png");
  dzongkhagMap :L.GeoJSON;


  constructor(
    private dataservice:DataService,
    private router: Router
  ) { }

  ngOnInit() {
    let router = this.router;

    this.map = L.map('map', {
      center: [26.864894, 89.38203],
      zoom: 13,
      maxZoom: 20,
      minZoom: 9,
      layers: [this.carto],
      zoomControl: false
    });
    this.dataservice.getDzongkhagsGeojson().subscribe(res =>{
      this.dzongkhagMap = L.geoJSON(res, {
        onEachFeature:function(feature, featureLayer){
          featureLayer.bindTooltip(`${feature.properties.name}`, {
            permanent:true,
            direction:'center',
            opacity:0.6,
            className:'myCSSClass' 
          })
          featureLayer.on('click', (e)=>{
            if(e.target.feature.properties.status === "Red" || e.target.feature.properties.status === "Yellow"){
             navigateToDzongkhag(e.target.feature.properties.dzo_id)
            }
           
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

    function navigateToDzongkhag(dzoId){
      // console.log(dzoId)
      router.navigate([`outbreak-dzo/${dzoId}`])
    }
  
  }


 
}
