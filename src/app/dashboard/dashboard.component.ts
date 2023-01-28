import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService, UserInfo } from '../services/players-api.service';
// import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
// import { GoogleSigninService } from '../services/google-signin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent { 
  mailSnippets: string[] = []
  userInfo?: UserInfo 
  user: gapi.auth2.GoogleUser

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient) { 
    // googleApi.userProfileSubject.subscribe( info => {
    //   console.log('info', info);
    //   this.userInfo = info
    // })
    // console.log(googleApi);
  }  
  
  isLoggedIn(): boolean {    
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  // async getEmails() {
  //   if (!this.userInfo) {
  //     return;
  //   }

  //   const userId = this.userInfo?.info.sub as string
  //   const messages = await (this.googleApi.emails(userId)).toPromise()
  //   messages.messages.forEach( (element: any) => {
  //     const mail = (this.googleApi.getMail(userId, element.id)).toPromise()
  //     mail.then( mail => {
  //       this.mailSnippets.push(mail.snippet)
  //     })
  //   });
  // }

}
