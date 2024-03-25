import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../shared/AppConsts';
import { GlobalStaticKeywordsCategoriesDto } from '../Models/GlobalStaticKeywordsCategoriesDto.model';
import { GlobalStaticKeywordsDto } from '../Models/GlobalStaticKeywordsDto .model';
import { MessageService } from 'primeng/api';




@Injectable({
  providedIn: 'root'
})

export class GlobalStaticKeywordsApi {

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


 
  getPages(): Observable<GlobalStaticKeywordsCategoriesDto[]> {
   
    return this.http.get<{ value: GlobalStaticKeywordsCategoriesDto [] }>(`${this.baseUrl}api/GlobalStaticKeywords/GetPages`)
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getPages error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getPages: ${error.statusText}`));
        })
      );
  }

  getPageById(pageId: number, languageId: number): Observable<GlobalStaticKeywordsDto[]> {
    return this.http.get<{ value: GlobalStaticKeywordsDto[] }>(`${this.baseUrl}api/GlobalStaticKeywords/GetPageFields/${pageId}/${languageId}`).pipe(
        
      map(response => response.value),
      catchError(error => {
        
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getPageById: ' + error.message));
      })
    );
  }

 

  submitStaticKeywords(pageId: number, languageId: number, keywords: GlobalStaticKeywordsDto[]): Observable<any> {
    const url = `${this.baseUrl}api/GlobalStaticKeywords/GetPageFields/${pageId}/${languageId}`;
   
    return this.http.post(url, { "keyword": keywords }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitStaticKeywords", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitStaticKeywords: ' + error.message));
      })
    );
  }


 
}

