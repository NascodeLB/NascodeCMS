import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { BankDto } from '../Models/BankDto.model';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { DynamicContentDto } from '../Models/DynamicContentDto.model';
import { DynamicContentCategoriesDto } from '../Models/DynamicContentCategoriesDto.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number
}
interface ApiResponse {
  content: DynamicContentDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class DynamicContentApiService {

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

  getDynamicContentPages(): Observable<DynamicContentCategoriesDto[]> {

    return this.http.get<{ value: DynamicContentCategoriesDto[] }>(`${this.baseUrl}api/DynamicContent/GetPages`)
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getDynamicContentPages Pages error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getDynamicContentPages: ${error.statusText}`));
        })
      );
  }
 
  getcontent(filter: PaginationFilter, CategoryId: number): Observable<ApiResponse> {
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
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/DynamicContent/AllContent/${CategoryId}`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getallcontent error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getallcontent: ${error.statusText}`));
        })
      );
  }

  getContentById(contentId: string, languageId: number, categoryId: number): Observable<DynamicContentDto> {
    return this.http.get<{ value: DynamicContentDto }>(`${this.baseUrl}api/DynamicContent/GetContent/${categoryId}/${languageId}/${contentId}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getcontentbyid" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getcontent: ' + error));
      })
    );
  }

  

  submitcontent(content: DynamicContentDto, categoryId: number, languageId: number): Observable<any> {
    const url = `${this.baseUrl}api/DynamicContent/SubmitContent/${categoryId}/${languageId}`;
    
    return this.http.post<{ ID: number }>(url, content).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitcontent", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitcontent: ' + error.message));
      })
    );
  }

  UpdateContentStatus(contentId: number, languageId: number, categoryId: number, status: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/DynamicContent/UpdateRecordStatus/${categoryId}/${languageId}/${contentId}/${status}`, null).pipe(
      tap(response => {
        //console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);

        return throwError(() => new Error('Error in UpdateContentStatus: ' + error));
      })
    );
  }
  deleteContent(contentId: number, languageId: number, categoryId: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/DynamicContent/DeleteContent/${categoryId}/${languageId}/${contentId}`, null).pipe(
      tap(response => {
        //console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
  
        return throwError(() => new Error('Error in deletecontent: ' + error));
      })
    );
  }

  deleteContents(contentIds: number[],languageId: number, categoryId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}api/DynamicContent/DeleteManyContent/${languageId}/${categoryId}`, contentIds).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("deletecontents" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in deletecontents: ' + error));
      })
    );
  }

}

