import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, PRIMARY_OUTLET, NavigationStart } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  subscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this.authService.isUserLoggedIn()) {
        if (this.isPageRefresh()) {
          this.router.navigateByUrl( this.getUrlWithoutSecondary(state) );
          return false;
        }

        return true;
      }

      this.router.navigate(['login']);
      return false;
  }

  private getUrlWithoutSecondary( routerStateSnapshot: RouterStateSnapshot ): UrlTree {
    const urlTree = this.router.parseUrl( routerStateSnapshot.url );
    let segment = urlTree.root;

    while ( segment && segment.children ) {
      delete( segment.children.secondary );
      segment = segment.children[ PRIMARY_OUTLET ];
    }
    return( urlTree );
  }

  // determine if the current route-request is part of a page refresh.
  private isPageRefresh(): boolean {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        return( ! this.router.navigated );
      }
    });

    return;
  }
}
