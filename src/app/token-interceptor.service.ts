import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private readonly oAuthService: OAuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('tokenLogin');
    
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', token),        
    });
      // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      //clone http to the custom AuthRequest and send it to the server
      // const AuthRequest = request.clone({ headers: headers });
      // return next.handle(AuthRequest);
      return next.handle(request);
    } else {
      return next.handle(request);
    }    
   
  }

  
}
