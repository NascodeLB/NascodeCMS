import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { BankDto } from '../Models/BankDto.model';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { ContactDto } from '../Models/ContactDto.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number,
  fromdate?: string,
  todate?: string
}
interface ApiResponse {
  contacts: ContactDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class ContactApiService {

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


 
  getContacts(filter: PaginationFilter): Observable<ApiResponse> {
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
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/Contact/AllContacts`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getContacts error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getContacts: ${error.statusText}`));
        })
      );
  }

  getContactById(Id: string): Observable<ContactDto> {
    return this.http.get<{ value: ContactDto }>(`${this.baseUrl}api/Contact/GetContact/${Id}`).pipe(
      map(response => response.value),
      catchError(error => {
        console.log("getContactById" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getContactById: ' + error));
      })
    );
  }

  

  //submitBank(bank: BankDto): Observable<any> {
  //  const url = `${this.baseUrl}api/Banks/SubmitBank`;
  //  console.log('Submitting bank:', bank); // Log the DTO to inspect the values
  //  return this.http.post<{ ID: number }>(url, bank).pipe(
  //    catchError((error: HttpErrorResponse) => {
  //      console.error("Error in submitBank", error.error); // Log detailed error
  //      this.handleHttpError(error);
  //      return throwError(() => new Error('Error in submitBank: ' + error.message));
  //    })
  //  );
  //}


 
}

