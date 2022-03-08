import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppsDrawerComponent } from '../apps-drawer/apps-drawer.component';
import { SelectzoneComponent } from '../dialogs/selectzone/selectzone.component';
import { PublicHomeComponent } from '../public/public-home/public-home.component';
import { SelectComponent } from '../select/select.component';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  routes = new Map();
  routeRules = new Map();

  constructor(
    private router: Router
  ) {
    this.fillRoutes();
    this.fillRouteRules();
   }

  private fillRouteRules(){
    this.routeRules.set('ENUM',this.routes.get(SelectComponent.name))
    this.routeRules.set('COV_VIEW',this.routes.get(AppsDrawerComponent.name))
    this.routeRules.set('DEFAULT',this.routes.get(AppsDrawerComponent.name))
    this.routeRules.set('PUBLIC', this.routes.get(PublicHomeComponent.name))
  }
  
  private fillRoutes(){
    this.router.config.forEach((item)=>{
      this.routes.set(item.component.name, item.path);
    })
  }

  getRoleRoute(role:string){
    console.log(this.routes)
    if(this.routeRules.get(role) == undefined){
      return this.routeRules.get('DEFAULT')
    }
    return this.routeRules.get(role)
  }

}
