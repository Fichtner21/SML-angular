import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sheet } from '../models/sheet.model';
import { environment } from 'src/environments/environment';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';

const SCRIPT_ID = 'AKfycbw1UM_u6MgkD_a9P2yHtUdhCkz5kxBX-BuVDCA8tXQ';
const ENDPOINT = `https://script.googleapis.com/v1/scripts/${SCRIPT_ID}:run`;


@Injectable({
  providedIn: 'root'
})
export class PlayersApiService {
  gmail = 'https://gmail.googleapis.com'
  // userProfileSubject = new Subject<UserInfo>()
 
  // filteredOptions: Observable<any>;
  // options: any[] = [];
  input: any;
  index: any;
  private apiUrl = 'https://discord.com/api/v9'; // Wersja API Discorda

  private discordApiUrl = 'https://discord.com/api';
  private discordToken = 'MTA3NzIyOTg4Njk3MzkzNTcwNw.GZhb6Z.N_Oq-kDAVTcni7LMdcZF_NMLYVWqFmlE_FqWd8';
  private channelId = '851888778409672756';
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private readonly oAuthService: OAuthService) {}

  moveUsersToChannels(users1: any[], users2: any[], channel1Id: string, channel2Id: string): Observable<any> {
    const url = `${this.baseUrl}/move-users-to-channels`;
    const data = {
      users1: users1,
      users2: users2,
      channel1Id: channel1Id,
      channel2Id: channel2Id
    };
    console.log('data =>', data);
    console.log('url =>', url);
    return this.http.post<any>(url, data);
  }

  // isLoggedIn(): boolean {    
  //   return this.oAuthService.hasValidAccessToken()
  // }

  // signOut() {
  //   this.oAuthService.logOut()
  // }

 
  // public headers = new HttpHeaders({
  //   'X-Requested-With': 'XMLHttpRequest',
  //   'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`,
  //   "Accept": "application/json",
  //   "User-Agent": "Other"
  // });
 
  // TODO create interface for observable. Now I added "any" because I don't know how looks model for this data
  public getPlayers(name: string): Observable<any> {  
    // this.oAuthService.setupAutomaticSilentRefresh();
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
      );
  } 
  
  // public getPlayer(fieldname:any, filteredOptions:Observable<any>){
  //   filteredOptions = fieldname.valueChanges.pipe(
  //     startWith(''),
  //     map((value:any) => this._filter(value || ''))
  //   )
  // }

  // private _filter(value: string, options: any[] = []): any[] {
  //   const filterValue = value.toLowerCase();
  //   return options.filter(option => option.playername.toLowerCase().includes(filterValue));     
  // }

  public listPlayers(){
    // return this.http.get(`${environment.CONNECTION_URL}`);
    return this.http.get(`${environment.SHEETDBIO}`);
  } 
   
  public deletePlayer(username:string){
    return this.http.delete(`https://sheetdb.io/api/v1/yg8kgxivnmkec/username/${username}`);
  }

  public getPlayerByUsername(username:string){    
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players!A:W?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`)
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
            {
              headers: this.authHeader()
            }
          )
        }       
      })          
    )      
    return playerSheet;
  }

  public authHeader() : HttpHeaders { 
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
      // ,
      // 'Access-Control-Allow-Origin': 'https://mohsh.pl/, http://localhost:4500/',
      // 'Access-Control-Allow-Headers' : Content-Type, application/json',
      // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    })
    // .set('Access-Control-Allow-Headers', "Content-Type, application/json")
    //.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }

  runScriptFunction(functionName: string): Observable<any> {
    const accessToken = this.oAuthService.getAccessToken();
    // console.log('accessToken', accessToken)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`)
    
    // .set('Access-Control-Allow-Origin', 'https://mohsh.pl, http://localhost:4500').set('Access-Control-Allow-Headers', 'Authorization, Content-Type').set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // console.log('headers', headers)
  
    const request = {
      function: functionName,
      // parameters: parameters
    };

    console.log('request', request)
  
    return this.http.post(ENDPOINT, request, { headers });
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
        { headers: this.authHeader()}
      )         
  }  

  updateCell(spreadsheetId: string, sheetName: string, cellRange: string, t1p1name: string, t1p2name: string, t1p3name: string, t1p4name: string, t1p5name: string, t1p6name: string, t1p7name: string){
    const accessToken = this.oAuthService.getAccessToken();
    // const body = {
    //   "value": [[value]]
    // };
    // const accessToken = this.oAuthService.getAccessToken();
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json'
    //   })
    // };

    // const payload = {
    //   "values": [
    //     [t1p1name],[t1p2name], [t1p3name], [t1p4name], [t1p5name], [t1p6name], [t1p7name]
    //   ]
    // }

    // return this.http.put<any>(
    //   `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`,
    //   // {
    //   //   "values":
    //   //   [[t1p1name],[t1p2name], [t1p3name], [t1p4name], [t1p5name], [t1p6name], [t1p7name]]
    //   // },
    //   payload,
    //   httpOptions
    //   // { 
    //   //   headers: headers
    //   // }    
    // );
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      })
    };
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`;
    
    const data = {
      "values": [
        [t1p1name],[t1p2name], [t1p3name], [t1p4name], [t1p5name], [t1p6name], [t1p7name]
      ]
    };
     return this.http.put<any>(
      url, data, httpOptions
    );    
      
  }

  updateRoundsWon(spreadsheetId: string, sheetName: string, cellRange: string, roundsWon: string){
    return this.http.put<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`,
      {
        "values":
        [[roundsWon]]
      },     
      { 
        headers: this.authHeader()
      }
    )
  }

  sendScore(spreadsheetId: string, sheetName: string, cellRange: string, t1p1score: string, t1p2score: string, t1p3score: string, t1p4score: string, t1p5score: string, t1p6score: string, t1p7score: string, t1sumFrags: string, t1roundsWon: number, emptyCell: string, headDesc: string, t2p1score: string, t2p2score: string, t2p3score: string, t2p4score: string, t2p5score: string, t2p6score: string, t2p7score: string, t2sumFrags: string, t2roundsWon: number){
    return this.http.put<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`,
      {
        "values":
        [
          [t1p1score], [t1p2score], [t1p3score], [t1p4score], [t1p5score], [t1p6score], [t1p7score], [t1sumFrags], [t1roundsWon], [emptyCell], [headDesc], [t2p1score], [t2p2score], [t2p3score], [t2p4score], [t2p5score], [t2p6score], [t2p7score], [t2sumFrags], [t2roundsWon]
        ]
      },
      {
        headers: this.authHeader()
      }
    )
  }

  clearCell(
    spreadsheetId: string, sheetName: string, cellRange: string, cell:string
  ){
    return this.http.put<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`,
      {
        "values":
        [[cell]]
      },
      // body,
      { 
        headers: this.authHeader()
      }    
    );
  }

  public getMultipleRanges(ranges: string){
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Add+a+Match!${ranges}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    // {
    //   params: {
    //     ranges: [`Add a Match!A12:A18`]
    //   }
    // }
    )
  } 

  getGuildMembers(guildId: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bot ${token}`,
    });
    return this.http.get(`${this.apiUrl}/guilds/${guildId}/members`, { headers });
  }
  // getPlayersFromDiscord(): Promise<any>{


  //   // const headers = {
  //   //   'Authorization': `Bearer ${this.discordToken}`
  //   // };

  //   // console.log('headers', headers)
  //   // const url = `${this.discordApiUrl}/channels/${this.channelId}/members`;
  //   // console.log('url', url)
  
  //   // return this.http.get<any>(url, { headers }).toPromise();
  //   // const headers = {
  //   //   'Authorization': `Bearer MTA3NzIyOTg4Njk3MzkzNTcwNw.GZhb6Z.N_Oq-kDAVTcni7LMdcZF_NMLYVWqFmlE_FqWd8`
  //   // };
  //   // const guildId = '716723661909786690';
  //   // // const channelsUrl = `${this.discordApiUrl}/guilds/${guildId}/channels`;
  //   // const channelsUrl = `https://discord.com/api/guilds/716723661909786690/widget.json`;
    
  
  //   // return this.http.get<any[]>(channelsUrl, { headers }).toPromise()
  //   //   .then((channels) => {
  //   //     // const channel = channels.find(c => c.type === 4 && c.id === this.channelId);
  //   //     // if (!channel) {
  //   //     //   throw new Error(`Nie znaleziono kanału głosowego o ID ${this.channelId}`);
  //   //     // }
  //   //     const membersUrl = `${this.discordApiUrl}/v8/channels/851888778409672756/members`;
  //   //     return this.http.get<any[]>(membersUrl, { headers }).toPromise();
  //   //   });
  // }
}
