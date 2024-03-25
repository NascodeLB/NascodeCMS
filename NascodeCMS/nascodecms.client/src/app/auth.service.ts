import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http'
import { Subject, of, throwError } from 'rxjs'
import { Router } from '@angular/router';
import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, finalize, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Inject } from '@angular/core';
import { AppConsts } from './shared/AppConsts';
import { BoundElementProperty, ConditionalExpr } from '@angular/compiler';
import { MessageService } from 'primeng/api';
import { UserGroupsFile } from './Models/UserGroupsFile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  errmsg: string = "";
  private http: HttpClient;
  private baseUrl: string = AppConsts.RemoteServiceURL;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(private router: Router, @Inject(HttpClient) http: HttpClient,
    private messageService: MessageService) {
    this.http = http;
  }

  getPagePermissions(pagename: string):  Observable<UserGroupsFile>{
    
    return this.http.get<UserGroupsFile>(this.baseUrl + 'api/UserPermission/GetPermissionsPerPage/'+ pagename)
      .pipe(map((res: any) => {
        
        if (res.value.permissions[0].viewOpr == 0) {
          return this.router.navigateByUrl('access-denied');
        }
        return res.value.permissions[0];
       
      }));
  }

  getSidebarPagesPermissions(): Observable<UserGroupsFile[]> {
    return this.http.get<UserGroupsFile[]>(this.baseUrl + 'api/UserPermission/GetPermissionsPerMember')
      .pipe(map((res: any) => {
        return res.value.permissions;
      }));
  }

  CheckIfUserLoggedin(id: string | null, token: string | null, usertype: string) {
    return this.http.get<any>(this.baseUrl + "api/Account/validateToken?id=" + encodeURIComponent("" + id) + "&token=" + token + "&usertype=" + usertype + "&")
      .pipe(map((res: any) => {
        return res;
      }));
  }


  catchExceptionError(error: string) {
    if (error.indexOf("Exception") !== -1) {
      return "Invalid Request!";

    } else {
      return error;
    }
  }
 

  GetUserTimeZone(): Observable<any> {
    return this.http.get(`${this.baseUrl}api/User/GetUserTimeZone`).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error('Error in TimeZone: ' + error));
      })
    );
  }

  SendResetPasswordEmail(body: ResetCode | undefined): Observable<boolean> {
    const url = this.baseUrl + 'api/User/ResetCode';

    return this.http.post<void>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(() => true), // On success, return true
      catchError(error => {
        let errorMessage = 'Failed to send reset password email.';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error.message || 'Server error';
        }
        this.errmsg = this.catchExceptionError(error.error);
        this.messageService.add({ severity: 'error', summary: 'View', detail: this.errmsg }); 
        return of(false); // Return Observable of false in case of error
      })
    );
  }

  CheckVerificationCode(body: ResetCode | undefined): Observable<boolean> {
    const url = this.baseUrl + 'api/User/CheckVerificationCode';

    return this.http.post<void>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(() => true), // On success, return true
      catchError(error => {
        let errorMessage = 'Failed to send reset password email.';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error.message || 'Server error';
        }
        this.errmsg = this.catchExceptionError(error.error);
        this.messageService.add({ severity: 'error', summary: 'View', detail: this.errmsg });
        return of(false); // Return Observable of false in case of error
      })
    );
  }

  ResetPassword(body: ResetCode | undefined): Observable<boolean> {
    const url = this.baseUrl + 'api/User/ResetPassword';

    return this.http.post<void>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(() => true), // On success, return true
      catchError(error => {
        let errorMessage = 'Failed to send reset password email.';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error.message || 'Server error';
        }
        this.errmsg = this.catchExceptionError(error.error);
        this.messageService.add({ severity: 'error', summary: 'View', detail: this.errmsg });
        return of(false); // Return Observable of false in case of error
      })
    );
  }

  loginCufex(credentials: any): Observable<boolean> {
    return this.http.post<any>(this.baseUrl + "api/User/Login", credentials, { withCredentials: true }).pipe(
      map(res => {
        if (res.token) { 
          this.authenticate(res.token.accessToken);
          return true;
        }
        return false;
      }),
      catchError(error => {
        localStorage.clear();
        let errmsg: string;

        if (error.error instanceof ErrorEvent) {
          errmsg = error.error.message;
        } else {
          errmsg = error.error.message || 'Server error';
        }
        this.errmsg = this.catchExceptionError(error.error);
        this.messageService.add({ severity: 'error', summary: 'View', detail: this.errmsg });
        return of(false); // Return Observable of false in case of error
      })
    );
  }


  authenticate(token: string, redirect: boolean = true) {
    localStorage.setItem('token', token); 
  }
  logout() {
    localStorage.clear();
    window.location.href = '';
  }
  getToken() {
    var accesstoken = localStorage.getItem('token');
    return accesstoken;
  }
  refreshToken(): Observable<any> { 
    return this.http.post<any>(`${this.baseUrl}api/User/Refresh-Token`, { withCredentials: true }).pipe(
      map(response => { 
        this.authenticate(response.accessToken);
        return true;
      }),
      catchError(error => {
        // Handle error
        console.error('Error refreshing token:', error);
        return throwError(() => new Error('Error refreshing token'));
      })
    );
  }
}

export class Credential {
  userName!: string;
  email!: string;
  password!: string;
  phoneNumber!: string;
  userType!: string;
  googleToken!: string;
}
export class ResetCode {
  userName!: string;
  email!: string;
  ResetCode!: string;
  Password!: string;
  ConfirmPassword!: string;
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
  if (result !== null && result !== undefined)
    return _observableThrow(result);
  else
    return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next("");
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = event => {
        observer.next((<any>event.target).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}

export class ApiException extends Error {
  override message: string;
  status: number;
  response: string;
  headers: { [key: string]: any; };
  result: any;

  constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }



}



export class ReturnRegisterDto implements IReturnRegisterDto {
  id!: string;
  token!: string;


  constructor(data?: IReturnRegisterDto) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.id = data["id"];
      this.token = data["token"];
    }
  }

  static fromJS(data: any): ReturnRegisterDto {
    data = typeof data === 'object' ? data : {};
    let result = new ReturnRegisterDto();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["id"] = this.id;
    data["token"] = this.token;

    return data;
  }
}

export interface IReturnRegisterDto {
  id: string;
  token: string;
}
