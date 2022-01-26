import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

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

interface Shop {
  id: string;
  name: string;
}

interface Dzongkhag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  zoneForm: FormGroup;
  dzongkhags: Dzongkhag[] = [];
  zones: Zone[] = [];
  subZones: Subzone[] = [];
  shops: Shop[] = [];

  isUserLoggedIn: boolean;

  dzongkhag: string;
  zone: string;
  subZone: string;
  shop: string;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.reactiveForm();
    this.getDzongkhagList();

    const dzongkhagId = sessionStorage.getItem('dzongkhagId');
    const zoneId = sessionStorage.getItem('zoneId');
    const subZoneId = sessionStorage.getItem('subZoneId');
    const shopId = sessionStorage.getItem('shopId');
    this.getZoneList(dzongkhagId);
    this.getSubzoneList(zoneId);
    this.dzongkhag = dzongkhagId;
    this.zone = zoneId;
    this.subZone = subZoneId;
    this.shop = shopId;
  }

  reactiveForm() {
    this.zoneForm = this.fb.group({
      zoneControl: ['', Validators.compose([Validators.required])],
      subZoneControl: ['', Validators.compose([Validators.required])],
      dzongkhagControl: ['', Validators.compose([Validators.required])]
    });
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

  redirectToDashboard() {
    if (this.zoneForm.valid) {
      sessionStorage.setItem('dzongkhagId', this.zoneForm.get('dzongkhagControl').value);
      sessionStorage.setItem('zoneId', this.zoneForm.get('zoneControl').value);
      sessionStorage.setItem('subZoneId', this.zoneForm.get('subZoneControl').value);
      this.router.navigate(['map']);
    }
  }
}
