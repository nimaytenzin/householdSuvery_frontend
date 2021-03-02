import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL = environment.API_URL;
  familyMember:any;
  
  constructor(
    private http: HttpClient
  ) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  authenticateUser(uid, pass) {
    const user = {
      user: uid,
      password: pass
    };

    return this.http
      .post<any>(`${this.API_URL}/login`, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDzongkhags() {
    return this.http
      .get<any>(`${this.API_URL}/get-all-dzo`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getZones(dzongkhagId) {
    return this.http
      .get<any>(`${this.API_URL}/get-zones/${dzongkhagId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSubZones(zoneId) {
    return this.http
      .get<any>(`${this.API_URL}/get-subzones/${zoneId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getResident(unitid){
    return this.http
      .get<any>(`${this.API_URL}/get-resident/${unitid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBuildingInfo(bid){
    return this.http
      .get<any>(`${this.API_URL}/get-building-info/${bid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getUnits(buildingId){
    return this.http
      .get(`${this.API_URL}/getunits/${buildingId}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getStructure(strId){
    return this.http
      .get(`${this.API_URL}/get-structure/${strId}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  validateQRCode(requestType, uuid) {
    return this.http
      .get<any>(`${this.API_URL}/validate-qr/${requestType}/${uuid}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postRegistration(item) {
    return this.http
      .post(`${this.API_URL}/household-details`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postUpdateHouseHold(item, houseHoldId) {
    return this.http
      .put(`${this.API_URL}/household-details/${houseHoldId}`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postUnit(item){
    return this.http
      .post<any>(`${this.API_URL}/createunit`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postResident(item){
    return this.http
      .post<any>(`${this.API_URL}/create-resident`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postSchool(item){

    return this.http
      .post<any>(`${this.API_URL}/create-school`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postBuilding(item){
    return this.http
      .post<any>(`${this.API_URL}/createbuilding`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postInstitute(item){
    return this.http
      .post<any>(`${this.API_URL}/create-institution`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadImg(item){
    return this.http
      .post<any>(`${this.API_URL}/upload-img`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postCompletion(buildingId) {
    return this.http
      .get(`${this.API_URL}/markComplete/${buildingId}`,  this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postProgress(bid){
    return this.http
      .get(`${this.API_URL}/markProgress/${bid}`,  this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postAtm(items){
    return this.http
      .post(`${this.API_URL}/create-bulk-atm`,items,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postNewBuilding(item) {
    return this.http
      .post<any>(`${this.API_URL}/create-str`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postQRScan(item) {
    return this.http
      .post<any>(`${this.API_URL}/scan`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
