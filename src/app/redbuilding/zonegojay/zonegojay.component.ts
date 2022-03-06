import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AddRedflatDialogComponent } from '../add-redflat-dialog/add-redflat-dialog.component';

@Component({
  selector: 'app-zonegojay',
  templateUrl: './zonegojay.component.html',
  styleUrls: ['./zonegojay.component.css']
})
export class ZonegojayComponent implements OnInit {

  constructor(  
   
    private router:Router
    ) { }

  ngOnInit() {
   
  }



  viewRedBuildingDetails(redbuildingId){
    this.router.navigate(['redbuilding/redflats/',redbuildingId ])
  }

}
