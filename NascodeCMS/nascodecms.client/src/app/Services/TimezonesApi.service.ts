import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { TimezonesDto } from '../Models/TimezonesDto.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number
}
interface ApiResponse {
  timezones: TimezonesDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class TimezonesApi {

  private http: HttpClient;
  private baseUrl: string = AppConsts.RemoteServiceURL;
  private token = '' //localStorage.getItem('token');
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient, private messageService: MessageService) {
    this.http = http;
  }


  private handleHttpError(error: any): void {
    let errorMessage = 'An error occurred: ' + (error.message || 'unknown error');
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }


 
  getTimezones(filter: PaginationFilter): Observable<ApiResponse> {
    let params = new HttpParams();
    if (filter.Sorting) {
      params = params.append('Sorting', filter.Sorting);
    }
    if (filter.SearchText) {
      params = params.append('SearchText', filter.SearchText);
    }
    if (filter.PageSize) {
      params = params.append('PageSize', filter.PageSize.toString());
    }
    if (filter.PageNumber) {
      params = params.append('PageNumber', filter.PageNumber.toString());
    }
    if (filter.After) {
      params = params.append('After', filter.After.toString());
    }
   
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/TimeZones/AllTimezones`, { params })
      .pipe(

        tap(response => { // this used to debug the response
          const data = response.value;
       
        }),
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getAllTimezones error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getAllTimezones: ${error.statusText}`));
        })
      );
  }

  getTimeZoneById(Id: string): Observable<TimezonesDto> {
    return this.http.get<{ value: TimezonesDto }>(`${this.baseUrl}api/TimeZones/GetTimezone/${Id}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
        
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getTimeZoneById" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getTimeZoneById: ' + error));
      })
    );
  }



  submitTimeZone(timezone: TimezonesDto): Observable<any> {
    const url = `${this.baseUrl}api/TimeZones/SubmitTimeZone`;
   
    return this.http.post<{ ID: number }>(url, timezone).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitTimeZone", error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitTimeZone: ' + error.message));
      })
    );
  }


  deleteTimezone(Id: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/TimeZones/DeleteTimezone/${Id}`, null).pipe(
      tap(response => {
        console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
        console.log("deleteTimezone" + error);
        return throwError(() => new Error('Error in deleteTimezone: ' + error));
      })
    );
  }

  deleteManyTimezones(TimezonesIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}api/TimeZones/DeleteManyTimezones`, TimezonesIds).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("deleteManyTimezones" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in deleteManyTimezones: ' + error));
      })
    );
  }

}

