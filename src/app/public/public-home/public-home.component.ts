import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PublicService } from 'src/app/service/public.service';
import { Safe } from './safeHtml.pipe';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css']
})

export class PublicHomeComponent implements OnInit {
  displayForm: FormGroup;
  content:any;
  lat;
  lng;
  contacts;
  structureId;
  subzone;

  constructor(
    private publicService: PublicService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getPublicService()
    this.getFlatDetails()
  }

  reactiveForm() {
    this.displayForm= this.fb.group({
      cid: [''],
      password: ['']
    });

    this.displayForm.controls.cid.setValue(localStorage.getItem('loginId'));
  }

  filterContacts(items:[],type){
    let result = []
    items.forEach((item)=>{
      if(item['type'] == type){
        result.push(item)
      }
    })
    return result
  }

  getPublicService(){
    this.publicService.getPublicByZone().subscribe(res=>{
      this.content = res.data.content
      this.contacts = res.data['contacts']
      this.subzone = res.data['sub_zone'].name
    })
  }

  getFlatDetails(){
    this.publicService.getFlatDetail().subscribe(res=>{
      console.log(res.data)
      this.structureId=  res.data['red_building'].structure_id
      this.lat = res.data['red_building'].lat
      this.lng = res.data['red_building'].lng

      // console.log(res.data['red_building'].structure_id)
    })
  }


}
