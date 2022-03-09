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

  AuthenticatedHttpOtions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':sessionStorage.getItem('token'),
      
    })
  };

  kmlOptions={
    headers: new HttpHeaders({
      'Authorization':sessionStorage.getItem('token'),
    }),
    responseType:'text' as 'json'
  }

  attachmentOptions={
    headers: new HttpHeaders({
      'Authorization':sessionStorage.getItem('token'),
    }),
    responseType:'text' as 'json'
  }

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

  getUserInfo(id){
    return this.http
      .get<any>(`${this.API_URL}/user/get/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDzongkhags() {
    return this.http
      .get<any>(`${this.API_URL}/dzongkhag/get-all`, this.AuthenticatedHttpOtions)
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

  getRedflats(redBuildingId){
    return this.http
      .get<any>(`${this.API_URL}/red-flat/get-all/${redBuildingId}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getRedflatDetail(flatId){
    return this.http
      .get<any>(`${this.API_URL}/red-flat/get/${flatId}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getRedflatStats(){
    return this.http
      .get<any>(`${this.API_URL}/red-flat/get-stat`,this.httpOptions)
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
      .get(`${this.API_URL}/structure/get/${structure_id}`,this.AuthenticatedHttpOtions)
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

  getpositivecases(){
    return this.http
    .get<any>(`${this.API_URL}/case/get`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getZone(){
    return this.http.get<any>("https://zhichar-pling.ddnsfree.com/zone/map/getpling",this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  
  addRedBuilding(item){
    return this.http
    .post<any>(`${this.API_URL}/case/create`, item, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  updatePositiveCase(item){
    return this.http.patch<any>(`${this.API_URL}/case/update`,item,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  normalizeBuilding(item){
    return this.http.patch<any>(`${this.API_URL}/case/unmark`,item,this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  //statistics for health
  getTotalPopulationbySubzone(id){
    return this.http
    .get<any>(`${this.API_URL}/stat/members-zone/${id}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getTotalVacinnatedBySubzone(id){
    return this.http
    .get<any>(`${this.API_URL}/stat/vaccinated-zone/${id}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getTestedBySubzone(id){
    return this.http
    .get<any>(`${this.API_URL}/stat/tested-zone/${id}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  //Redbuilding Routes
  createRedBuilding(data){
    return this.http
    .post<any>(`${this.API_URL}/red-building/create`, data, this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    );
  }

  createNewCase(data){
    return this.http
    .post<any>(`${this.API_URL}/case/create`, data, this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    );
  }


  getCasesByRedbuilingId(id){
    return this.http
    .get<any>(`${this.API_URL}/case/get-all/${id}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getRedBuildingsByDzongkhag(dzoId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get/${dzoId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getThromdeyBoundsByDzongkahgId(dzoId){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/zone/map/getDzo/${dzoId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  


  getCovidStatsByDzongkhag(dzoId){
    return this.http
    .get<any>(`${this.API_URL}/stat/case/${dzoId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getRedBuildingKmlByDzongkhag(dzoId){
    return this.http
    .get<any>(`${this.API_URL}/kml/get/${dzoId}`,this.kmlOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  searchBuildingByContact(data){
    return this.http
    .post<any>(`${this.API_URL}/search/search-contact`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  searchBuildingByCid(data){
    return this.http
    .post<any>(`${this.API_URL}/search/search-cid`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )
  }

  downloadStructureDataByZone(subzoneId){
    return this.http
    .get<any>(`${this.API_URL}/data/str/csv/${subzoneId}`,this.attachmentOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  downloadBuildingDatabyZone(subzoneId){
    return this.http
    .get<any>(`${this.API_URL}/data/building/csv/${subzoneId}`,this.attachmentOptions)
    .pipe(
      catchError(this.handleError)
    )
  }
  downloadMemberDataByZone(subzoneId){
    return this.http
    .get<any>(`${this.API_URL}/data/member/csv/${subzoneId}`,this.attachmentOptions)
    .pipe(
      catchError(this.handleError)
    )
  }
  downloadHouseholdDatabyZone(subzoneId){
    return this.http
    .get<any>(`${this.API_URL}/data/household/csv/${subzoneId}`,this.attachmentOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getChiwogGeojsonByDzongkhag(dzo_id){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-chiwogs/${dzo_id}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }



  getDzongkhagsGeojson(){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-dzongkhags`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  DownloadChiwogGeojsonByDzongkhag(dzo_id){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-chiwogs/${dzo_id}`,this.kmlOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  getExcelbyDzongkhag(dzo_id){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-sheets/${dzo_id}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  
  //RedFlats
  getRedbuildingsInSubZone(subZoneId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-zone-json/${subZoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  getInProgressRedbuildingsInSubZone(subZoneId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-zone-progress/${subZoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  getRedbuildingsDetailsById(redBuilingId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-one/${redBuilingId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  getStructureDetailsByStructureId(structure_id){
    return this.http
    .get<any>(`${this.API_URL}/structure/get/${structure_id}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  createNewRedFlat(data){
    return this.http
    .post<any>(`${this.API_URL}/red-flat/create`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  editRedFlat(data){
    return this.http
    .patch<any>(`${this.API_URL}/red-flat/update`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  getRedflatsByRedbuildingId(redbuildingId){
    return this.http
    .get<any>(`${this.API_URL}/red-flat/get-all/${redbuildingId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  createRedFlatMember(data){
    return this.http
    .post<any>(`${this.API_URL}/red-member/create/`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  editRedFlatMember(data){
    return this.http
    .patch<any>(`${this.API_URL}/red-member/update`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  deleteRedFlatMember(data){
    return this.http
    .post<any>(`${this.API_URL}/red-member/delete`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  getRedFamilyMembersByFlatId(flat_id){
    return this.http
    .get<any>(`${this.API_URL}/red-member/get-all/${flat_id}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  getRedBuildingStatsByZone(zoneId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-zone-stat/${zoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }
  getRedFlatStatsByZone(zoneId){
    return this.http
    .get<any>(`${this.API_URL}/red-flat/get-zone-stat/${zoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  getSubZOneDetails(subzoneID){
    return this.http
    .get<any>(`${this.API_URL}/zone/get-subzone-id/${subzoneID}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }


  createNewSealHistory(data){
    return this.http
    .post<any>(`${this.API_URL}/seal/create/`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  getSealHistoryByFlatId(flat_id){
    return this.http
    .get<any>(`${this.API_URL}/seal/get-all/${flat_id}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  editSealHistory(data){
    return this.http
    .patch<any>(`${this.API_URL}/seal/update`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  deleteSealHistory(data){
    return this.http
    .post<any>(`${this.API_URL}/seal/delete`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }

  //zonegojay View on Map

  getRedBuildingGeojsonByZoneId(subzoneId){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-zone/${subzoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  getRedClusterGeojsonByZoneId(subzoneId){
    return this.http
    .get<any>(`https://zhichar-pling.ddnsfree.com/cdrs/api/shapefile/get-redcluster/zone/${subzoneId}`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  //statistics Route

  statsThimphuGetMegazoneRedflats(){
    return this.http
    .get<any>(`${this.API_URL}/red-flat/get-all-megazone-stat/`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )   
  }
  statsThimphuGetMegazoneRedBuilding(){
    return this.http
    .get<any>(`${this.API_URL}/red-building/get-all-megazone-stat/`,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    )   
  }
  
  statsNotokenThimphuGetMegazoneRedflats(){
    return this.http
    .get<any>(`${this.API_URL}/stat/get-flat-megazone-stat/`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )   
  }
  statsNoTokenThimphuGetMegazoneRedBuilding(){
    return this.http
    .get<any>(`${this.API_URL}/stat/get-building-megazone-stat/`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )   
  }

  updateRedBuilding(data){
    return this.http
    .patch<any>(`${this.API_URL}/red-building/update`,data,this.AuthenticatedHttpOtions)
    .pipe(
      catchError(this.handleError)
    ) 
  }
  
}
