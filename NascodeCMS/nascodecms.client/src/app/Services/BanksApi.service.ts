import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { BankDto } from '../Models/BankDto.model';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number
}
interface ApiResponse {
  banks: BankDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class BanksApiService {

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


 
  getBanks(filter: PaginationFilter): Observable<ApiResponse> {
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
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/Banks/AllBanks`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getBanks error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getBanks: ${error.statusText}`));
        })
      );
  }

  getBankById(bankId: string, languageId: number): Observable<BankDto> {
    return this.http.get<{ value: BankDto }>(`${this.baseUrl}api/Banks/GetBank/${bankId}/${languageId}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getBankById" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getBank: ' + error));
      })
    );
  }

  //submitBank(bank: BankDto): Observable<any> {
  //  const url = this.baseUrl + 'api/Banks/SubmitBank';
  //  const headers = new HttpHeaders({
  //    'Authorization': `Bearer ${this.token}` // Assuming you're using a Bearer token
  //  });
  //  return this.http.post<{ ID: number }>(url, bank).pipe(
  //    map(response => response), // Map the response to extract the ID
  //    catchError(error => {
  //      console.log("submitBank" + error);
  //      this.handleHttpError(error);
  //      return throwError(() => new Error('Error in submitBank: ' + error));
  //    })
  //  );
  //}

  submitBank(bank: BankDto): Observable<any> {
    const url = `${this.baseUrl}api/Banks/SubmitBank`;
    console.log('Submitting bank:', bank); // Log the DTO to inspect the values
    return this.http.post<{ ID: number }>(url, bank).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitBank", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitBank: ' + error.message));
      })
    );
  }


  deleteBank(bankId: number, languageId: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/Banks/DeleteBank/${bankId}/${languageId}`, null).pipe(
      tap(response => {
        console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
        console.log("deleteBank" + error);
        return throwError(() => new Error('Error in deleteBanks: ' + error));
      })
    );
  }

  deleteBanks(bankIds: number[],languageId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Banks/DeleteManyBank/${languageId}`, bankIds).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("deleteBanks" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in deleteBanks: ' + error));
      })
    );
  }

}

