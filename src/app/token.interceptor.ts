import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private readonly oAuthService: OAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   
    if (request.url.includes('openid-configuration')) {
      // console.log('configure =>', this.oAuthService.scope)
      return next.handle(request);
    }

    const userToken = this.oAuthService.getAccessToken();
    // console.log('***userToken', userToken);
    const modifiedReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${userToken}`),     
    });

    return next.handle(modifiedReq);
  }
}