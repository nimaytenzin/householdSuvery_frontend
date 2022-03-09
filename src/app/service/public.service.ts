import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  API_URL = environment.API_URL;

  constructor(
    private http: HttpClient
  ) { }

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

  getFlatDetail(){
    return this.http
      .get<any>(`${this.API_URL}/public/get-flat`,this.AuthenticatedHttpOtions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPublicByZone(){
    return this.http
      .get<any>(`${this.API_URL}/public/get-zone`,this.AuthenticatedHttpOtions)
      .pipe(
        catchError(this.handleError)
      );
  }

}
