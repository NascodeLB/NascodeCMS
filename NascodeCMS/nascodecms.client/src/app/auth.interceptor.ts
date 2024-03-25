import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service'; // Your authentication service
import { Observable, throwError, BehaviorSubject, switchMap, filter, take, catchError, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (this.authService.getToken()) {
      request = this.addTokenHeader(request, this.authService.getToken() ?? "").clone({ withCredentials: true });
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        return throwError(() => error);
      }
    }));
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(localStorage.getItem('token'));
          return next.handle(this.addTokenHeader(request, localStorage.getItem('token') ?? ""));
        }),
        catchError((error) => {
          this.isRefreshing = false; 
          this.authService.logout();
           
          return throwError(() => new Error('Failed to refresh token'));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        tap(token => {
          if (token == null) {
           /* this.authService.logout();*/
          }
        }), 
        filter(token => token != null),
        take(1),
        switchMap(accessToken => {
          return next.handle(this.addTokenHeader(request, accessToken));
        })
      );

    }
  }
}
