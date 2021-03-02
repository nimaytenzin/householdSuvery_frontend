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

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},

  {path: 'selectzone', component: SelectZoneComponent,canActivate: [RouteGuard]},
  // {path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuard]},
  {path: 'dashboard/:id', component: DashboardComponent,canActivate: [RouteGuard]},
  {path: 'building', component: RegisterComponent },
  {path: 'unit', component: RegisterUnitComponent},
  {path: 'admin', component: AdminComponent, canActivate:[RouteGuard]},
  // {path: 'update-household/:id', component: UpdateHouseholdComponent, canActivate: [RouteGuard]},
  // {path: 'changepassword', component: ChangePasswordComponent, canActivate: [RouteGuard]},
  {path: 'map', component: MapComponent,canActivate: [RouteGuard] },
  {path: 'camera',component: UploadImageComponent,canActivate: [RouteGuard]},
  {path: 'atm', component: RegisterAtmComponent},
  {path: '**', component: ErrorComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
