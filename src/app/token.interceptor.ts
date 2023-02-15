import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { authCodeFlowConfig } from './dashboard/dashboard.component';

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
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (req.method === 'GET') {
  //     return next.handle(req);
  //   }
  //   const accessToken = this.oAuthService.getAccessToken();
  //   if (accessToken) {
  //     const headers = req.headers.set('Authorization', `Bearer ${accessToken}`);
  //     const authReq = req.clone({ headers });
  //     return next.handle(authReq);
  //   } else {
  //     return next.handle(req);
  //   }
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'GET') {
      return next.handle(req);
    }
  
    // Add the necessary scopes to the request
    const scopes = [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/script.scriptapp',
      'https://www.googleapis.com/auth/script.external_request'
    ];
    // const authConfig = this.oAuthService.getAuthConfig(scopes);
    
    const accessToken = this.oAuthService.getAccessToken();
  
    if (accessToken) {
      let authReq: HttpRequest<any>;
  
      if (req.method === 'POST') {
        // Send a POST request with the access token in the Authorization header and set the content type
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        });
        authReq = req.clone({ headers });
      } else if (req.method === 'PUT') {
        // Send a PUT request with the access token in the Authorization header and set the content type
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        });
        authReq = req.clone({ headers });
      } else if (req.method === 'DELETE') {
        // Send a DELETE request with the access token in the Authorization header
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        authReq = req.clone({ headers });
      } else {
        // For all other requests, send the request with the access token in the Authorization header and set the auth config
        // const headers = new HttpHeaders({
        //   'Authorization': `Bearer ${accessToken}`
        // });
        // const params = req.params.set('access_token', accessToken);
        // const urlWithParams = req.urlWithParams;
        // authReq = req.clone({ headers, params, urlWithParams });
        // authReq = authConfig.configure(authReq);
      }
  
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}