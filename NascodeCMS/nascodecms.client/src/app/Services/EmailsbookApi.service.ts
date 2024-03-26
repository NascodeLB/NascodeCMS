import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { EmailsbookDto } from '../Models/EmailsbookDto.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number
}
interface ApiResponse {
  emailsbooks: EmailsbookDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class EmailsbookApi {

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


 
  getEmailsbooks(filter: PaginationFilter): Observable<ApiResponse> {
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
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/Emailsbook/AllEmailsbooks`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getAllEmailsbooks error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getAllEmailsbooks: ${error.statusText}`));
        })
      );
  }

  getEmailbookById(Id: string, languageId: number): Observable<EmailsbookDto> {
    return this.http.get<{ value: EmailsbookDto }>(`${this.baseUrl}api/Emailsbook/GetEmailsbook/${Id}/${languageId}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getEmailbookById" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in GetEmailbook: ' + error));
      })
    );
  }



  submitEmailbook(emailbook: EmailsbookDto): Observable<any> {
    const url = `${this.baseUrl}api/Emailsbook/SubmitEmailBook`;
   
    return this.http.post<{ ID: number }>(url, emailbook).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitEmailbook", error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitEmailbook: ' + error.message));
      })
    );
  }


  deleteEmailbook(Id: number, languageId: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/Emailsbook/DeleteEmailbook/${Id}/${languageId}`, null).pipe(
      tap(response => {
        console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
        console.log("deleteEmailbook" + error);
        return throwError(() => new Error('Error in deleteEmailbook: ' + error));
      })
    );
  }

  deleteManybanks(EmailsbooksIds: number[],languageId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/Emailsbook/DeleteManyEmailsBook/${languageId}`, EmailsbooksIds).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("DeleteManyEmailsBook" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in DeleteManyEmailsBook: ' + error));
      })
    );
  }

}

