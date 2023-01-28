import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sheet } from '../models/sheet.model';
import { environment } from 'src/environments/environment';
// import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { faAreaChart } from '@fortawesome/free-solid-svg-icons';

// const authCodeFlowConfig: AuthConfig = {
//   // Url of the Identity Provider
//   issuer: 'https://accounts.google.com',

//   // strict discovery document disallows urls which not start with issuers url
//   strictDiscoveryDocumentValidation: false,

//   // URL of the SPA to redirect the user to after login
//   redirectUri: window.location.origin,

//   // The SPA's id. The SPA is registerd with this id at the auth-server
//   // clientId: 'server.code',
//   // clientId: '719531931759-h0pj1eq3bnjptkd6kppo8fkf68orq87q.apps.googleusercontent.com',
//   clientId: '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com',
  
//   // set the scope for the permissions the client should request
//   // scope: 'openid profile email https://www.googleapis.com/auth/gmail.readonly',
//   // scope: 'https://www.googleapis.com/auth/drive.file',       
//   // scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets',
//   scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.external_request',
//   // scope: 'https://www.googleapis.com/auth/script.external_request',

//   showDebugInformation: true, 
// }

// export interface UserInfo {
//   info: {
//     sub: string
//     email: string,
//     name: string,
//     picture: string
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class PlayersApiService {
  // gmail = 'https://gmail.googleapis.com'
  // userProfileSubject = new Subject<UserInfo>()
  index:any;
  input:any;

  constructor(private http: HttpClient) {  
    
    //     // confiure oauth2 service
    //  oAuthService.configure(authCodeFlowConfig);
    //  // manually configure a logout url, because googles discovery document does not provide it
    //  oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";     
 
    //  // loading the discovery document from google, which contains all relevant URL for
    //  // the OAuth flow, e.g. login url
    //  oAuthService.loadDiscoveryDocument().then( () => {
    //    // // This method just tries to parse the token(s) within the url when
    //    // // the auth-server redirects the user back to the web-app
    //    // // It doesn't send the user the the login page
    //    oAuthService.tryLoginImplicitFlow().then( () => {
 
    //      // when not logged in, redirecvt to google for login
    //      // else load user profile
    //      if (!oAuthService.hasValidAccessToken()) {
    //        oAuthService.initLoginFlow()
    //      } else {
    //        oAuthService.loadUserProfile().then( (userProfile) => {
    //          this.userProfileSubject.next(userProfile as UserInfo)
    //        })
    //      }
 
    //    })
    //  });
  }

  // emails(userId: string): Observable<any> {
  //   return this.http.get(`${this.gmail}/gmail/v1/users/${userId}/messages`, { headers: this.authHeader() })
  // }

  // getMail(userId: string, mailId: string): Observable<any> {
  //   return this.http.get(`${this.gmail}/gmail/v1/users/${userId}/messages/${mailId}`, { headers: this.authHeader() })
  // }

  // isLoggedIn(): boolean {    
  //   return this.oAuthService.hasValidAccessToken()
  // }

  // signOut() {
  //   this.oAuthService.logOut()
  // }

  // public authHeader() : HttpHeaders { 
  //   return new HttpHeaders ({
  //     'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
  //   })
  // }
  
  // public headers = new HttpHeaders({
  //   'X-Requested-With': 'XMLHttpRequest',
  //   'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
  //   "Accept": "application/json",
  //   "User-Agent": "Other"
  // });
  // public headers = new HttpHeaders()
  //   .set('Content-Type', 'application/json; charset=utf-8')
  //   .set('Authorization', `Bearer' ${this.oAuthService.getAccessToken()}`)

  // TODO create interface for observable. Now I added "any" because I don't know how looks model for this data
  public getPlayers(name: string): Observable<any> {  
    // this.oAuthService.setupAutomaticSilentRefresh();
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
      );
  }

  // public headers = {
  //   'Authorization': 'Basic ' + btoa('client-id:719531931759-knap6bv72g48p5madeo3poqh4vb979tu.apps.googleusercontent.com'),
  //   'Content-type': 'application/x-www-form-urlencoded'
  // } 

  public listPlayers(){
    // return this.http.get(`${environment.CONNECTION_URL}`);
    return this.http.get(`${environment.SHEETDBIO}`);
  }   

  public createPlayer( 
    spreadsheetId:any,  
    valueInputOption: any,
    playername: string, username: string, ranking: string, percentile:   string,   place: string,
    warcount: string, nationality: string, clanhistory: string, cup1on1edition1: string, meeting: string, cup3on3: string, active: string, ban: boolean, lastwar: string, fpw: string, fpwmax: string, fpwmin: string, last30days: string,  last365days: string, lastwarpc: string, s1wars: string, s1fpw: string, streak: string
    ): Observable<Sheet>{
      return this.http.post<Sheet>(       
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Players:append?valueInputOption=${valueInputOption}`
        ,
        {  
          "values": [
              [playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak]
          ]                                  
        },
        // { 
        //   headers: this.authHeader()
        // }
      )         
  } 

  runScript() {
    // Make a request to the API to run the function
    const scriptId = '176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf';
    const request = {
      'function': 'sortTeams'
    };

    this.http.post(
      `https://script.googleapis.com/v1/scripts/${scriptId}:run`, 
      request, 
      // { 
      //   // headers: this.authHeader()
      // }
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  public testRunScript(method:string):Observable<any>{
    return this.http.post<any>(
      `https://script.googleapis.com/v1/scripts/176De6l1FHasz8DZjLBR3hqoMzA2XmmafAD81rT8HQCTtCALjNNMecTZf:run`,
      {
        "function": method,
        "parameters": [
          
        ],  
        "devMode": false
      },
      // {
      //   // headers: this.authHeader()
      // }
    )
  }
   
  public deletePlayer(username:string){
    return this.http.delete(`https://sheetdb.io/api/v1/yg8kgxivnmkec/username/${username}`);
  }

  public getPlayerByUsername(username:string){    
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players!A:W`)
    // return this.http.get(`https://sheetdb.io/api/v1/yg8kgxivnmkec?single_object=${username}`);
  }

  public fetchAsObservable(url) {
    return from(fetch(url));
  }

  public updatePlayerNEW(pname:any, uname: string, ranking: any, percentile: any, place: any, warcount: any, nationality:any, clanhistory: any, cup1on1edition1:any, meeting: any, cup3on3:any, active:boolean, ban: boolean, lastwar: any, fpw: any, fpwmax:any, fpwmin:any, last30days:any, last365days:any, lastwarpc:any, s1wars:any, s1fpw:any, streak:any){ 
      
    const playerSheet = this.getPlayers('Players').pipe(
      switchMap((res:any) => {              
        const source = res.values;
        this.input = source.map(function (row:any, index:any) {
          row.unshift(index);
          return row;
        }).filter(function (iRow:any) {         
            return iRow[2] === uname;
        });        
        this.index = parseInt(this.input[0]) + 1;        
        this.input[0].shift();         
        this.input[0][0] = pname;
        this.input[0][1] = uname;
        this.input[0][2] = ranking;
        this.input[0][3] = percentile;
        this.input[0][4] = place;
        this.input[0][5] = warcount;
        this.input[0][6] = nationality;
        this.input[0][7] = clanhistory;
        this.input[0][8] = cup1on1edition1;
        this.input[0][9] = meeting;
        this.input[0][10] = cup3on3;
        this.input[0][11] = active;
        this.input[0][12] = ban;
        this.input[0][13] = lastwar;
        this.input[0][14] = fpw;
        this.input[0][15] = fpwmax;
        this.input[0][16] = fpwmin;
        this.input[0][17] = last30days;
        this.input[0][18] = last365days;
        this.input[0][19] = lastwarpc;
        this.input[0][20] = s1wars;
        this.input[0][21] = s1fpw;
        this.input[0][22] = streak;        
        let values = [
          this.input[0]
        ];
        const resource = {
            values
        };       
        if(this.input){
          return this.http.put<any>(
            `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Players!A${this.index}:W${this.index}?valueInputOption=USER_ENTERED`,             
            {
              "values": [
                [pname, uname, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak],                              
              ]
            },
            // {
            //   // headers: this.authHeader()
            // }
          )
        }       
      })          
    )      
    return playerSheet;
  }

  public updatePlayer(         
    playername: string, 
    username: string, 
    ranking: string, 
    percentile: string, 
    nationality: string 
    //  place: string,
    // warcount: string, nationality: string, clanhistory: string, cup1on1edition1: string, meeting: string, cup3on3: string, active: boolean, ban: boolean, lastwar: string, fpw: string, fpwmax: string, fpwmin: string, last30days: string,  last365days: string, lastwarpc: string, s1wars: string, s1fpw: string, streak: string
    ): Observable<Sheet>{
      return this.http.put<Sheet>(       
        `https://sheetdb.io/api/v1/yg8kgxivnmkec/username/${username}`, 
        {
          playername,
          username,
          ranking,
          percentile,
          // place,
          // warcount,
          nationality,
          // clanhistory,
          // cup1on1edition1,
          // meeting,
          // cup3on3,
          // active,
          // ban,
          // lastwar,
          // fpw,
          // fpwmax,
          // fpwmin,
          // last30days,
          // last365days,
          // lastwarpc,
          // s1wars,
          // s1fpw,
          // streak     
        }
      )      
  }
}
