import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError, combineLatest } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { AppConsts } from '../Shared/AppConsts';
import { PaginationDto } from '../Models/PaginationDto.model';

import { UserGroup } from '../Models/UserGroup.model';
import { MessageService } from 'primeng/api';
import { UserGroupsFile } from '../Models/UserGroupsFile.model';


export interface PaginationFilter {
  Sorting?: string;
  SearchText?: string;
  PageSize?: number;
  After?: number;
  PageNumber?: number;
}
interface ApiResponse {
  groups: UserGroup[];
  pagination: PaginationDto;
}
export interface GroupDetails {
  group: UserGroup;
  permission: UserGroupsFile[];
 
}
export interface GroupDetailsSubmission {
  cufexUsersGroup: UserGroup;
  cufexGroupPermissionAllowed: UserGroupsFile[];

}
@Injectable({
  providedIn: 'root'
})

export class UsersGroupsApi {

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

  
  getGroups(filter: PaginationFilter): Observable<ApiResponse> {
    let params = new HttpParams();
    if (filter.Sorting) {
      params = params.append('Sorting', filter.Sorting);
    }
    if (filter.SearchText) {
      params = params.append('SearchText', filter.SearchText);
    }
    if (filter.PageSize && filter.PageSize > 0) {
      params = params.append('PageSize', filter.PageSize.toString());
    }
    if (filter.PageNumber) {
      params = params.append('PageNumber', filter.PageNumber.toString());
    }
    if (filter.After) {
      params = params.append('After', filter.After.toString());
    }
   
    return this.http.get<{ value: ApiResponse }>(`${this.baseUrl}api/UserPermission/AllGroups`, { params })
      .pipe(
        map(response => response.value),
        catchError((error: HttpErrorResponse) => {
          // Simplified error handling as token logic is now in the interceptor
          console.log("getGroups error: " + error.message);
          this.handleHttpError(error);
          return throwError(() => new Error(`Error in getGroups: ${error.statusText}`));
        })
      );
  }

  getGroupById(groupId: string): Observable<GroupDetails> {
    return this.http.get<{ value: GroupDetails }>(`${this.baseUrl}api/UserPermission/GetGroup/${groupId}`).pipe(

      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        console.log("getGroupById" + error);
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getGroupById: ' + error));
      })
    );
  }

  

  submitGroup(group: GroupDetailsSubmission): Observable<any> {

    const url = `${this.baseUrl}api/UserPermission/SubmitGroup-Permission`;
  /* console.log('Submitting bank:', group); // Log the DTO to inspect the values*/
    return this.http.post<{ ID: number }>(url, group).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error in submitGroup", error.error); // Log detailed error
        this.handleHttpError(error);
        return throwError(() => new Error('Error in submitGroup: ' + error.message));
      })
    );
  }


  deleteGroup(groupId: number): Observable<any> { // Changed bankId to number if it's always an integer
    return this.http.post(`${this.baseUrl}api/UserPermission/DeleteGroup/${groupId}`, null).pipe(
      tap(response => {
        console.log(response); // Logging the whole response for debugging
      }),
      map(response => response), // Adjust according to the actual response structure
      catchError(error => {
        this.handleHttpError(error);
        console.log("deleteGroup" + error);
        return throwError(() => new Error('Error in deleteGroup: ' + error));
      })
    );
  }

  deleteGroups(groupsIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}api/UserPermission/DeleteManyGroups`, groupsIds).pipe(
      tap(response => {
        console.log('Response from server:', response); // Logging the whole response for debugging
      }),
      map(response => {
        // Assuming response is already in the desired format
        return response;
      }),
      catchError(error => {
        console.log("DeleteManyGroups" + error);
        this.handleHttpError(error); // Make sure to define this method to handle errors
        return throwError(() => new Error('Error in DeleteManyGroups: ' + error));
      })
    );
  }

}

