import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ErrorComponent } from './error/error.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterAtmComponent } from './register-atm/register-atm.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { MatTableModule } from '@angular/material/table'
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatSidenavModule,
  MatMenuModule,
  MatGridListModule,
  MatDialogModule,
  MatCheckboxModule,
  MatSnackBarModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MapComponent } from './map/map.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RegisterUnitComponent } from './register-unit/register-unit.component';
import { CameraComponent } from './camera/camera.component';
import {WebcamModule} from 'ngx-webcam';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { AdminComponent } from './admin/admin.component';
import { DataTableComponent} from './DataTable/data-table/data-table.component'
import { DialogBoxComponent } from './DataTable/dialog-box/dialog-box.component';
import { EditUnitComponent } from './edit-unit/edit-unit.component';
import { EditBuildingComponent } from './edit-building/edit-building.component';
import { MemberTableComponent } from './member-table/member-table.component';
import { ViewPositiveComponent } from './view-positive/view-positive.component';
import { MarkPositiveDialogComponent } from './mark-positive-dialog/mark-positive-dialog.component';
import {  MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CovAdminComponent } from './cov-admin/cov-admin.component';
import { EditPositiveDialogComponent } from './edit-positive-dialog/edit-positive-dialog.component';
import { CreateRedBuildingDialogComponent } from './red-buildings/create-red-building-dialog/create-red-building-dialog.component';
import { AddCasesDialogComponent } from './red-buildings/add-cases-dialog/add-cases-dialog.component';
import { AppsDrawerComponent } from './apps-drawer/apps-drawer.component';
import { SelectzoneComponent } from './dialogs/selectzone/selectzone.component';
import { SelectdzongkhagComponent } from './dialogs/selectdzongkhag/selectdzongkhag.component';
import { HhDashboardComponent } from './hh-dashboard/hh-dashboard.component';
import { SelectComponent } from './select/select.component';
import { OutbreakPhasingComponent } from './outbreak-phasing/outbreak-phasing.component';
import { OutbreakDzongkhagComponent } from './outbreak-dzongkhag/outbreak-dzongkhag.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterAtmComponent,
    ErrorComponent,
    DashboardComponent,
    ChangePasswordComponent,
    MapComponent,
    ConfirmDialogComponent,
    RegisterUnitComponent,
    CameraComponent,
    UploadImageComponent,
    RegisterAtmComponent,
    AdminComponent,
    DataTableComponent,
    DialogBoxComponent,
    EditUnitComponent,
    EditBuildingComponent,
    MemberTableComponent,
    ViewPositiveComponent,
    MarkPositiveDialogComponent,
    CovAdminComponent,
    EditPositiveDialogComponent,
    CreateRedBuildingDialogComponent,
    AddCasesDialogComponent,
    AppsDrawerComponent,
    SelectzoneComponent,
    SelectdzongkhagComponent,
    HhDashboardComponent,
    SelectComponent,
    OutbreakPhasingComponent,
    OutbreakDzongkhagComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    MatListModule,
    MatCheckboxModule,
    WebcamModule,
    MatTableModule,
    MatProgressBarModule,
    NgxSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ ConfirmDialogComponent, DialogBoxComponent,MarkPositiveDialogComponent,EditPositiveDialogComponent,CreateRedBuildingDialogComponent,AddCasesDialogComponent,SelectdzongkhagComponent,SelectzoneComponent]
})
export class AppModule { }
