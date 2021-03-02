import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export const TOKEN = 'token';
export const AUTHENTICATED_USER = 'authenticatedUser';
export const IS_AUTHENTICATED = 'isAuthenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  API_URL = environment.API_URL;

  public authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) { }

  validateLogin(cid, password) {
    return this.http.post<any>(`${this.API_URL}/login`, {
      cid,
      password
    }).pipe(
      map(
        data => {
          sessionStorage.setItem(AUTHENTICATED_USER, cid);
          sessionStorage.setItem(TOKEN, `Bearer ${data.data.token}`);
          this.authState.next(true);
          return data;
      }));

  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN);
    }
  }

  setAuthenticatedUser(username) {
    sessionStorage.setItem(AUTHENTICATED_USER, username);
    this.authState.next(true);
  }

  isUserLoggedIn() {
    if (this.getAuthenticatedUser()) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem('zoneId');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('requestType');
    sessionStorage.removeItem('qrUUID');
    sessionStorage.removeItem('transactionType');
    sessionStorage.removeItem('qrCodeId');
    sessionStorage.removeItem('shopId');
    sessionStorage.removeItem('subZoneId');
    sessionStorage.removeItem('dzongkhagId');
    this.authState.next(false);
  }

  getItem(key: string): any {
    return sessionStorage.getItem(key);
  }
}
