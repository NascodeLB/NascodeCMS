import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { PaginationDto } from '../Models/PaginationDto.model';
import { MessageService } from 'primeng/api';
import { UserDto } from '../Models/UserDto.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
  language?: number
}
interface ApiResponse {
  users: UserDto[];
  pagination: PaginationDto;
}

@Injectable({
  providedIn: 'root'
})

export class UsersApiService {

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


 
  getUsers(filter: PaginationFilter): Observable<ApiResponse> {
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
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/user/AllUsers`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getUsers error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getUsers: ${error.statusText}`));
        })
      );
  }

  getUser(Id: string): Observable<UserDto> {
    return this.http.get<{ value: UserDto }>(`${this.baseUrl}api/User/GetUser/${Id}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getUser" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getUsers: ' + error));
      })
    );
  }
  getLoggedUserData(): Observable<UserDto> {
    return this.http.get<{ value: UserDto }>(`${this.baseUrl}api/User/GetLoggedUser`).pipe(
      map(response => response.value),
      catchError(error => {
       
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getloggedUser: ' + error));
      })
    );
  }
  
  submitUser(user: UserDto): Observable<any> {
    const url = `${this.baseUrl}api/User/SubmitUser`;
   
    return this.http.post<{ ID: number }>(url, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submituser", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submituser: ' + error.message));
      })
    );
  }


  deleteUser(Id: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/User/DeleteUser/${Id}`, null).pipe(
      tap(response => {
        console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
        console.log("deleteuser" + error);
        return throwError(() => new Error('Error in deleteuser: ' + error));
      })
    );
  }

  deleteUsers(Ids: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}api/User/DeleteManyUsers`, Ids).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("deleteUsers" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in deleteUsers: ' + error));
      })
    );
  }

  UpdateUserStatus(Id: number, status: number): Observable<any> { // Changed bankId to number if it's always an integer
  ;
    return this.http.post(`${this.baseUrl}api/User/UpdateUserStatus/${Id}/${status}`, null).pipe(
      map(response => response), 
      catchError(error => {
        console.log(error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in UpdateUserStatus: ' + error));
      })
    );
  }

}

