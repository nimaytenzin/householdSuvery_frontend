import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {Location} from '@angular/common';

export class MatMenuListItem {
  menuLinkText: string;
  menuIcon: string;
  routerLink: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isUserLoggedIn: boolean;
  menuList: MatMenuListItem[] = [
    {
      menuLinkText: 'Registration',
      menuIcon: 'contacts',
      routerLink: 'register'
    },
    {
      menuLinkText: 'Scan',
      menuIcon: 'crop_free',
      routerLink: 'scan'
    },
    {
      menuLinkText: 'Change Password',
      menuIcon: 'refresh',
      routerLink: 'changepassword'
    }
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }

  redirect(menuItem: MatMenuListItem) {
    this.router.navigate([menuItem.routerLink]);
    this.changeDetectorRef.detectChanges();
  }

  logout() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Do you really want to logout?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['login']);
      }
    });
  }

  back() {
    if (this.router.url === '/selectzone') {
      this.logout();
    } else {
      this.location.back();
    }
  }
}
