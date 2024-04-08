import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';

import { MessageService } from 'primeng/api';
import { PropertyDto } from '../Models/PropertyDto.model';




@Injectable({
  providedIn: 'root'
})

export class PropertiesApi {

  private http: HttpClient;
  private baseUrl: string = AppConsts.RemoteServiceURL;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient, private messageService: MessageService) {
    this.http = http;
  }


  private handleHttpError(error: any): void {
    let errorMessage = 'An error occurred: ' + (error.message || 'unknown error');
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }


 
  getProperties(): Observable<PropertyDto[]> {
   
    return this.http.get<{ value: PropertyDto [] }>(`${this.baseUrl}api/Property/GetProperties`)
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          //console.log("getProperties error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getProperties: ${error.statusText}`));
        })
      );
  }


 

  submitProperties(properties: PropertyDto[]): Observable<any> {
    const url = `${this.baseUrl}api/Property/SubmitProperty`;
   
    return this.http.post(url, properties).pipe(
      catchError((error: HttpErrorResponse) => {
       // console.error("Error in submitProperties", error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitProperties: ' + error.message));
      })
    );
  }


 
}

