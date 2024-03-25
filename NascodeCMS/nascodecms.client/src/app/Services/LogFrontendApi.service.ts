import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../shared/AppConsts';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { LogFrontendDto } from '../Models/LogFrontend.model';
import { LogAudit } from '../Models/LogAudit.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number,
  fromdate?: string,
  todate?: string,
  operations?: string,
  usersid?: string
}
interface ApiResponse {
  logs: LogFrontendDto[];
  pagination: PaginationDto;
}
interface ApiResponse2{
  logs: LogAudit[];
  pagination: PaginationDto;
}
@Injectable({
  providedIn: 'root'
})

export class LogFrontendApi {

  private http: HttpClient;
  private baseUrl: string = AppConsts.RemoteServiceURL;

  constructor(@Inject(HttpClient) http: HttpClient, private messageService: MessageService) {
    this.http = http;
  }

  
  getLogs(filter: PaginationFilter): Observable<ApiResponse> {
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
    if (filter.language) {
      params = params.append('language', filter.language.toString());
    }
    if (filter.fromdate) {
      params = params.append('fromdate', filter.fromdate.toString());
    }
    if (filter.todate) {
      params = params.append('todate', filter.todate.toString());
    }
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/LogFrontend/GetFrontendLogs`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor

          return throwError(() => new Error(`Error in getLogs: ${error.statusText}`));
        })
      );
  }

  getAuditLogs(filter: PaginationFilter): Observable<ApiResponse2> {
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
    if (filter.language) {
      params = params.append('language', filter.language.toString());
    }

    if (filter.fromdate) {
      params = params.append('fromdate', filter.fromdate.toString());
    }
    if (filter.todate) {
      params = params.append('todate', filter.todate.toString());
    }
    if (filter.operations) {
      params = params.append('operations', filter.operations.toString());
    }
    if (filter.usersid) {
      params = params.append('usersid', filter.usersid.toString());
    }

    return this.http.get<{ value: ApiResponse2 }>(`${this.baseUrl}api/LogFrontend/GetAuditLogs`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor

          return throwError(() => new Error(`Error in getLogs: ${error.statusText}`));
        })
      );
  }

}

