import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService, UserInfo } from '../services/players-api.service';
// import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
// import { gapi } from 'gapi';
// import { GoogleSigninService } from '../services/google-signin.service';
import { gapi } from 'gapi-client';
import { OAuthService } from 'angular-oauth2-oidc';
declare var gapi: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{ 
  mailSnippets: string[] = []
  userInfo?: UserInfo 
  // user: gapi.auth2.GoogleUser
  public token = this.oAuthService.getAccessToken();
  public headers; 

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient, private readonly oAuthService: OAuthService) { 
    // googleApi.userProfileSubject.subscribe( info => {
    //   console.log('info', info);
    //   this.userInfo = info
    // })
    // console.log(googleApi);

    // gapi.load('client', () => {
    //   gapi.client.init({
    //     'apiKey': 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU',
    //     'clientId': '326844544836-lpdua268ku34anm1js1uj28criqm63cs.apps.googleusercontent.com',
    //     'scope': 'https://www.googleapis.com/auth/script.projects',
    //     'discoveryDocs': ['https://script.googleapis.com/$discovery/rest?version=v1'],
    //     'access_token': this.oAuthService.getAccessToken()
    //   });
    // });

    gapi.load('client', () => {
      console.log('this.oAuthService.getAccessToken() =>', this.oAuthService.getAccessToken());
      gapi.client.init({
        // 'apiKey': 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU',       
        'clientId': '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/script.projects',
        'discoveryDocs': ['https://script.googleapis.com/$discovery/rest?version=v1'],
        'access_token': `Bearer ${this.oAuthService.getAccessToken()}`
      });
      
    })
    
  }  

  ngOnInit(): void {  
 

   


    //    if (this.oAuthService.hasValidAccessToken()) {
    //   console.log('przechodzi dobry token');//
    //   console.log('GAPI =>', gapi.client.script);
    //   console.log('GAPI =>', gapi.client)
    //   // gapi.client.script.scripts.run({
    //   //   'scriptId': '176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf',
    //   //   'function': 'getStatistics'
    //   // }).then((response) => {
    //   //   console.log('RESPONSE => ',response);
    //   // });
    //   // gapi.client.script.scripts.run({
    //   //   'scriptId': '176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf',
    //   //   'function': 'getStatistics',
    //   //   'devMode': true
    //   // }).then((response) => {
    //   //   console.log('response.result', response.result);
    //   // });
    // }
  }

  balanceTeams(){
    this.googleApi.runScriptFunction('balanceTeams').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  selectTeams(){
    this.googleApi.runScriptFunction('selectTeams').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  sortPlayers(){
    this.googleApi.runScriptFunction('sortPlayers').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  // rn(){
  //   this.googleApi.runScriptt();
  // }

  runS(){
    this.googleApi.runScript().subscribe({
      next: (res) => {
        console.log('res runScript() =>', res)
      },
      error: (err) => {
        console.log('err runScript() =>', err)
      }
    })
  }
  
  isLoggedIn(): boolean {    
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  // async run() {
  //   const response = await this.googleApi.runScript()
  //   // const scriptId = '176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf';
  //   // const functionName = 'sortTeams';
  //   // // const parameters = ['param1', 'param2'];
  //   // const parameters = [''];
  //   // const response = await this.googleApi.runScript(scriptId, functionName, parameters);
  //   console.log(response);
  //   response.pipe(
  //     map(el => {
  //       console.log('el')
  //     })
  //   )
  // }

  // handleClientLoad() {
  //   gapi.load('client:auth2', this.initClient);
  // }

  // initClient() {
  //   gapi.client.init({
  //     apiKey: 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU',
  //     clientId: '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com',
  //     discoveryDocs: ['https://script.googleapis.com/$discovery/rest?version=v1'],
  //     scope: 'https://www.googleapis.com/auth/script.run'
  //   }).then(() => {
  //     gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
  //     this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  //   });
  // }

  // updateSigninStatus(isSignedIn) {
  //   if (isSignedIn) {
  //     this.runScript();
  //   }
  // }

  // runScript() {
  //   gapi.client.script.scripts.run({
  //     'scriptId': '176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf',
  //     'resource': {
  //       'function': 'sortTeams'
  //     }
  //   }).then((response) => {
  //     console.log(response);
  //   });
  // }



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
