import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { MessageService } from 'primeng/api';

import { DropdownDto } from '../Models/DropdownDto.model';

export interface DropdownFilter {
  tableName: string;
  valueField: string;
  titleField: string;
  whereConditions?: { [key: string]: string };
}

interface ApiResponse {
  value: DropdownDto[]
}

@Injectable({
  providedIn: 'root'
})



export class DropdownApi {

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

  getdata(data: DropdownFilter): Observable<any> {
    const url = `${this.baseUrl}api/DropDowns/all`;
    
    return this.http.post<ApiResponse>(url, data).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in getdropdowndata", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getdropdowndata: ' + error.message));
      })
    );
  }
 


 
}

