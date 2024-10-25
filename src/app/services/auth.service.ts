import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { authCodeFlowConfig } from '../dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // constructor() {}

  // checkAuthentication(): void {
  //   const token = localStorage.getItem('authToken');
    
  //   if (!!token) {
  //     // Update state to authenticated after checking for valid token in local storage or HTTP call result.
  //     this.isAuthenticatedSubject.next(true); 
      
  //     console.log("User is Authenticated");
  //   } else {
  //     	// Update state to not authenticated if no token found in local storage or HTTP call result failed.
  //     	this.isAuthenticatedSubject.next(false); 
       
  //     	console.log("User is Not Authenticated");
  //    }
  //  }
  constructor(private oAuthService: OAuthService) {
    oAuthService.configure(authCodeFlowConfig);

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    });

    this.oAuthService.events.subscribe(() => {
      this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    });
  }

  login() {
    this.oAuthService.initLoginFlow();
  }

  logout() {
    this.oAuthService.logOut();
  }
}