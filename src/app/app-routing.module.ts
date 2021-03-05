import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteGuard } from './service/route.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MapComponent } from './map/map.component';
import { RegisterUnitComponent } from './register-unit/register-unit.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { RegisterAtmComponent } from './register-atm/register-atm.component';
import { AdminComponent } from './admin/admin.component';
import { EditUnitComponent } from './edit-unit/edit-unit.component';
import { EditBuildingComponent } from './edit-building/edit-building.component';

const routes: Routes = [
  {path: '', component: SelectZoneComponent},
  {path: 'login', component: LoginComponent},

  {path: 'selectzone', component: SelectZoneComponent },
  // {path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuard]},
  {path: 'dashboard/:id', component: DashboardComponent },
  {path: 'building', component: RegisterComponent },
  {path: 'unit', component: RegisterUnitComponent},
  {path:'edit-building/:sid', component:EditBuildingComponent},
  {path: 'edit-unit/:id', component: EditUnitComponent},
  {path: 'admin', component: AdminComponent },
  // {path: 'update-household/:id', component: UpdateHouseholdComponent, canActivate: [RouteGuard]},
  // {path: 'changepassword', component: ChangePasswordComponent, canActivate: [RouteGuard]},
  {path: 'map', component: MapComponent},
  {path: 'camera',component: UploadImageComponent},
  {path: 'atm', component: RegisterAtmComponent},
  {path: '**', component: ErrorComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
