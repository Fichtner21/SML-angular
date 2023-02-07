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

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   const allowedMethods = ['PUT', 'POST', 'DELETE'];
  //   // if (request.url.includes('openid-configuration')) {
  //   //   // console.log('configure =>', this.oAuthService.scope)
  //   //   return next.handle(request);
  //   // }
  //   if (!allowedMethods.includes(request.method)) {
  //     // throw new Error(`Method ${request.method} is not allowed`);
  //     return next.handle(request);
  //   } else {
  //     if (request.url.includes('openid-configuration')) {
  //         // console.log('configure =>', this.oAuthService.scope)
  //         return next.handle(request);
  //       }
  //   }
    

  //   const userToken = this.oAuthService.getAccessToken();
  //   // console.log('***userToken', userToken);
  //   const modifiedReq = request.clone({
  //     headers: request.headers.set('Authorization', `Bearer ${userToken}`),     
  //   });

  //   return next.handle(modifiedReq);
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET') {
      return next.handle(req);
    }
    const accessToken = this.oAuthService.getAccessToken();
    if (accessToken) {
      const headers = req.headers.set('Authorization', `Bearer ${accessToken}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}