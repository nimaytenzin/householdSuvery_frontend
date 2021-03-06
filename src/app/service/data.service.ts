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

  getCid(cid){
    return this.http
      .get<any>(`${this.API_URL}/api/get/${cid}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDzongkhags() {
    return this.http
      .get<any>(`${this.API_URL}/dzongkhag/get-all`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getZones(dzongkhagId) {
    return this.http
      .get<any>(`${this.API_URL}/zone/get-zone/${dzongkhagId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSubZones(zoneId) {
    return this.http
      .get<any>(`${this.API_URL}/zone/get-sub-zone/${zoneId}`, this.httpOptions)
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
      .get<any>(`${this.API_URL}/building/get/${bid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getHouseholds(sid){
    return this.http
      .get<any>(`${this.API_URL}/household/get-all/${sid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getAHousehold(hhid){
    return this.http
      .get<any>(`${this.API_URL}/household/get/${hhid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getFamilyMembers(hhid){
    return this.http
    .get<any>(`${this.API_URL}/member/get-all/${hhid}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  postStructure(item){
    return this.http
      .post<any>(`${this.API_URL}/structure/create`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }



  deleteBuilding(structure_id){
    return this.http
      .delete<any>(`${this.API_URL}/structure/delete/${structure_id}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getAStructure(structure_id){
    return this.http
      .get(`${this.API_URL}/structure/get/${structure_id}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteBuildingInfo(bid){
    return this.http.delete<any>(`${this.API_URL}/building/delete/${bid}`,this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
  
  getStructure(subzoneID){
    return this.http
      .get<any>(`${this.API_URL}/structure/get-json-zone/${subzoneID}`,this.httpOptions)
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

  postHousehold(data){
    return this.http.post<any>(`${this.API_URL}/household/create`,data,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  createMember(data){
    return this.http.post<any>(`${this.API_URL}/member/create`,data,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateHousehold(data){
    return this.http.patch<any>(`${this.API_URL}/household/update`,data,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  updateMember(data){
    return this.http.patch<any>(`${this.API_URL}/member/update`,data,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateBuilding(data){
    return this.http.patch<any>(`${this.API_URL}/building/update`,data,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteHousehold(hhid){
    return this.http.delete<any>(`${this.API_URL}/household/delete/${hhid}`,this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  deleteMember(memberid){
    return this.http.delete<any>(`${this.API_URL}/member/delete/${memberid}`,this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  postRegistration(item) {
    return this.http
      .post(`${this.API_URL}/household-details`, item, this.httpOptions)
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
      .post<any>(`${this.API_URL}/building/create`,item,this.httpOptions)
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
    return this.http.post<any>(`${this.API_URL}/image/create`,item,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImg(sid){
    return this.http.get<any>(`${this.API_URL}/image/get-all/${sid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postCompletion(buildingId) {
    let data = {
      "structure_id":buildingId
    }
    return this.http.patch<any>(`${this.API_URL}/structure/mark-complete`,data,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  postProgress(bid){
    let data = {
      "structure_id":bid
    }
    return this.http.patch<any>(`${this.API_URL}/structure/mark-progress`,data, this.httpOptions)
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
