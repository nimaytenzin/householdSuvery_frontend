import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SelectdzongkhagComponent } from '../dialogs/selectdzongkhag/selectdzongkhag.component';

@Component({
  selector: 'app-apps-drawer',
  templateUrl: './apps-drawer.component.html',
  styleUrls: ['./apps-drawer.component.css']
})
export class AppsDrawerComponent implements OnInit {

  constructor( 
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  goToRedBuildingDashboard(){

    this.dialog.open(SelectdzongkhagComponent)
    
  }

}
