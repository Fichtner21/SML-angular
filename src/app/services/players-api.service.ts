import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sheet } from '../models/sheet.model';
import { environment } from 'src/environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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

  private apiKey = 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU';
  private spreadsheetId = '1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo';
  private playersData: any;
  private historyMatchesSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  historyMatches$: Observable<any> = this.historyMatchesSubject.asObservable();
  getHistoryMatchesClans: any;

  constructor(private http: HttpClient, private readonly oAuthService: OAuthService) {}

  setHistoryMatches(matches: any): void {
    this.historyMatchesSubject.next(matches);
  }

  getHistoryMatches(): Observable<any> {
    return this.historyMatches$;
  }

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
  // public getPlayers(name: string): Observable<any> {
  //   // this.oAuthService.setupAutomaticSilentRefresh();
  //   return this.http.get<any>(
  //     `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
  //     );
  // }

  // getPlayers(name: string): Observable<any> {
  //   if (!this.playersData) {
  //     // Pobranie danych tylko raz, jeśli nie zostały jeszcze pobrane
  //     return this.http.get<any>(
  //       `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
  //     ).pipe(
  //       tap(data => this.playersData = data)
  //     );
  //   } else {
  //     // Zwrócenie danych z pamięci podręcznej, jeśli już zostały pobrane
  //     return of(this.playersData);
  //   }
  // }
  public getPlayers(name: string): Observable<any> {
    // this.oAuthService.setupAutomaticSilentRefresh();
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
      );
  }

  public getPlayersFinal(name: string): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    ).pipe(map(
      (response: any) => {
        let batchRowValues = response.values;      
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
        players.push(rowObject);
      }
      return players;
      } 
    ))
  }      

  public getPlayersDetails(): Observable<any[]> {
    // this.oAuthService.setupAutomaticSilentRefresh();
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
      ).pipe(map(
        response => {
          const players = response.values.slice(1);
          return players.map((player) => ({            
            playername: player[0], //playername
            username: player[1], //username
            elo: player[2], //ranking
            placemix: player[4], //place
            mixwars: player[5], //warcount
            flag: player[6], //nationality
            active: player[11], //active
            ban: player[12], //ban
            fpw: player[14]  //fpw          
          }))
        })
      );
  }

  public getClans(): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Clans?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    );
  }
  
  public getMatchHistoryClans(): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Match+History+Clans?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    );
  }

  public getMatchHistoryClans2(): Observable<any[]> {
    return this.http.get<any>('https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Match+History+Clans?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU').pipe(
      map(response => {
        // Skip the header row and return matches only
        const matches = response.values.slice(1);
        return matches.map((match, index) => ({
          id: index + 1,
          timestamp: match[0],
          clan1: match[1],
          clan2: match[2],
          clan1score: match[3],
          clan2score: match[4],
          preelo1clan: match[5],
          postelo1clan: match[6],
          preelo2clan: match[7],
          postelo2clan: match[8],
          clan1players: match.slice(9, 16), // Clan 1 players
          clan2players: match.slice(16, 23) // Clan 2 players
        }));
      })
    );
  }
  
  // New method to get specific clan details
  public getClanDetails(clanName: string): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Clans?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    ).pipe(
      map(response => {
        const clans = response.values.slice(1); // Skip header
        const clanDetails = clans.find(clan => clan[0] === clanName); // Assuming clan name is in the first column
        return clanDetails ? {
          clan: clanDetails[0],
          elo: clanDetails[1],
          clantag: clanDetails[2],
          win: clanDetails[3],
          loss: clanDetails[4],
          draw: clanDetails[5],
          streak: clanDetails[6],
          clan_image: clanDetails[7]
        } : null; // Return null if clan not found
      })
    );
  }

  // public getUserTwo(): Observable<any> {
  //   return this.http.get<any>('https://reqres.in/api/users/2');
  // }

  public getPlayerDetails(username: string): Observable<any> {
    return this.getPlayers('Players').pipe(
      map((response: any) => {
        const players = response.values;        
        const playerDetails = players.find(player => player.username === username);       
        return playerDetails;
      })
    );
  }

  getPlayerDetailsByUsername(username: string): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const rows = response.values;
        if (!rows || rows.length < 2) {
          console.error('Brak danych w zakładce Players lub brak nagłówków');
          return null;
        }

        const headers = rows[0]; // Pobranie nagłówków z pierwszego wiersza
        const playerRow = rows.find(row => row[0] === username); // Szukanie gracza po username

        if (!playerRow) {
          console.error(`Gracz o username ${username} nie został znaleziony.`);
          return null;
        }

        // Tworzenie obiektu gracza z kluczami odpowiadającymi nagłówkom
        const playerData: any = {};
        headers.forEach((header, index) => {
          playerData[header] = playerRow[index] || null; // Jeśli brak wartości, ustaw na null
        });

        return playerData;
      })
    );
  }

  public getJsonDataConverted(name: string): Observable<any[]> {
    const filePath = 'assets/snapshots/31_dec_2020.json'; // Ścieżka do pliku JSON

    return this.http.get<any>(filePath).pipe(
      map((response: any) => {
        const sheetData = response[name];
        if (!sheetData) {
          throw new Error(`Nie znaleziono arkusza o nazwie '${name}' w pliku JSON.`);
        }
        return sheetData.map((item: any) => ({
          playername: item['Player Name'],
          username: item['User Name'],
          ranking: item['Ranking'],
          percentile: item['Percentile'],
          place: item['Place'],
          warcount: item['War Count'],
          nationality: item['Nationality'],
          clanhistory: item['Clan history'],
          active: item['active'],
          lastwar: item['lastwar']
        }));
      })
    );
  }

public getJsonSeason(name: string, path: string): Observable<any[]> {
    const filePath = path; // Ścieżka do pliku JSON

    return this.http.get<any>(filePath).pipe(
      map((response: any) => {
        const sheetData = response[name];
        if (!sheetData) {
          throw new Error(`Nie znaleziono arkusza o nazwie '${name}' w pliku JSON.`);
        }
        // console.log('sheetData', sheetData)
        return sheetData;
        // return sheetData.map((item: any) => ({
        //   playername: item['Player Name'],
        //   username: item['User Name'],
        //   ranking: item['Ranking'],
        //   percentile: item['Percentile'],
        //   place: item['Place'],
        //   warcount: item['War Count'],
        //   nationality: item['Nationality'],
        //   clanhistory: item['Clan history'],
        //   active: item['active'],
        //   lastwar: item['lastwar']
        // }));
      })
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
    return this.http.get(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players!A:BR?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`)
    // return this.http.get(`https://sheetdb.io/api/v1/yg8kgxivnmkec?single_object=${username}`);
  }

  public fetchAsObservable(url) {
    return from(fetch(url));
  }

  // public updatePlayerNEW(pname:any, uname: string, ranking: any, percentile: any, place: any, warcount: any, nationality:any, clanhistory: any, cup1on1edition1:any, meeting: any, cup3on3:any, active:boolean, ban: boolean, lastwar: any, fpw: any, fpwmax:any, fpwmin:any, last30days:any, last365days:any, lastwarpc:any, s1wars:any, s1fpw:any, streak:any, ban_due: string){

  //   const playerSheet = this.getPlayers('Players').pipe(
  //     switchMap((res:any) => {
  //       const source = res.values;
  //       this.input = source.map(function (row:any, index:any) {
  //         row.unshift(index);
  //         return row;
  //       }).filter(function (iRow:any) {
  //           return iRow[2] === uname;
  //       });
  //       this.index = parseInt(this.input[0]) + 1;
  //       this.input[0].shift();
  //       this.input[0][0] = pname;
  //       this.input[0][1] = uname;
  //       this.input[0][2] = ranking;
  //       this.input[0][3] = percentile;
  //       this.input[0][4] = place;
  //       this.input[0][5] = warcount;
  //       this.input[0][6] = nationality;
  //       this.input[0][7] = clanhistory;
  //       this.input[0][8] = cup1on1edition1;
  //       this.input[0][9] = meeting;
  //       this.input[0][10] = cup3on3;
  //       this.input[0][11] = active;
  //       this.input[0][12] = ban;
  //       this.input[0][13] = lastwar;
  //       this.input[0][14] = fpw;
  //       this.input[0][15] = fpwmax;
  //       this.input[0][16] = fpwmin;
  //       this.input[0][17] = last30days;
  //       this.input[0][18] = last365days;
  //       this.input[0][19] = lastwarpc;
  //       this.input[0][20] = s1wars;
  //       this.input[0][21] = s1fpw;
  //       this.input[0][22] = streak;
  //       this.input[0][23] = ban_due;
  //       let values = [
  //         this.input[0]
  //       ];
  //       const resource = {
  //           values
  //       };
  //       if(this.input){
  //         return this.http.put<any>(
  //           `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Players!A${this.index}:W${this.index}?valueInputOption=USER_ENTERED`,
  //           {
  //             "values": [
  //               [pname, uname, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak, ban_due],
  //             ]
  //           },
  //           {
  //             headers: this.authHeader()
  //           }
  //         )
  //       }
  //     })
  //   )
  //   return playerSheet;
  // }

  // public updatePlayerNEW(playerName: any, uname: string, ranking: any, clanHistory: any, nationality: any, ban: boolean, banDue: string, banExpires: string, donateS6: any) {
  //   return this.getPlayers('Players').pipe(
  //     switchMap((res: any) => {
  //       const source = res.values;
  //       const row = source.find((row: any) => row[1] === uname); // Szukamy wiersza po unikatowym identyfikatorze (uname)
  //       if (row) {
  //         const rowIndex = source.indexOf(row); // Indeks wiersza (numeracja od 0)
  //         const updatedRow = [...row]; // Tworzymy kopię wiersza, który chcemy zaktualizować
  //         // Ustawiamy wartości dla pól, które chcemy zaktualizować
  //         updatedRow[0] = playerName;
  //         updatedRow[2] = ranking;
  //         updatedRow[7] = clanHistory;
  //         updatedRow[6] = nationality;
  //         updatedRow[12] = ban;
  //         updatedRow[33] = banDue; // Kolumna AH
  //         updatedRow[34] = banExpires; // Kolumna AI
  //         updatedRow[52] = donateS6; // Kolumna BA

  //         const values = [updatedRow];
  //         return this.http.put<any>(
  //           `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Players!A${rowIndex + 1}:BR${rowIndex + 1}?valueInputOption=USER_ENTERED`,
  //           { values },
  //           { headers: this.authHeader() }
  //         );
  //       } else {
  //         throw new Error(`Player with username '${uname}' not found.`);
  //       }
  //     })
  //   );
  // }

  public updatePlayerNEW(username: string, formData: any) {
    return this.getPlayers('Players').pipe(
      switchMap((res: any) => {
        const source = res.values;
        const row = source.find((row: any) => row[1] === username); // Find row by username
  
        if (row) {
          const rowIndex = source.indexOf(row);
          const updatedRow = [...row];
  
          // Update the row based on the form data
          Object.keys(formData).forEach((key, index) => {
            updatedRow[index] = formData[key]; // Map form data to correct column index
          });
  
          const values = [updatedRow];
          return this.http.put<any>(
            `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Players!A${rowIndex + 1}:BR${rowIndex + 1}?valueInputOption=USER_ENTERED`,
            { values },
            { headers: this.authHeader() }
          );
        } else {
          throw new Error(`Player with username '${username}' not found.`);
        }
      })
    );
  }
  
  // public createClan(
  //   spreadsheetId: string,
  //   valueInputOption: string,
  //   clan: string, 
  //   clantag: string, 
  //   cl: string, 
  //   wa: string, 
  //   clan_image: string, 
  //   flag: string,
  //   last30days: string
  // ): Observable<any> {
  //   const defaultElo = 1000;
      
  
  //   return this.http.post<any>(
  //     `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clans:append?valueInputOption=${valueInputOption}`,
  //     {
  //       "values": [
  //         [
  //           clan,          // Nazwa klanu
  //           defaultElo,    // Elo (wartość domyślna)
  //           clantag,       // Tag klanu
  //           cl,            // Clan Leader
  //           wa,            // War Arranger
  //           clan_image,    // URL zdjęcia klanu
  //           flag,          // Flaga
  //           last30days,
  //           "",            // last30days (zostawiamy puste - formuła w Google Sheets)
  //           "",            // last365days (formuła w Google Sheets)
  //           "",            // win (formuła)
  //           "",            // loss (formuła)
  //           "",            // draw (formuła)
  //           "",            // streak (formuła)
  //           ""             // preelo (formuła)
  //         ]
  //       ]
  //     },
  //     { headers: this.authHeader() }
  //   );
  // }
  

// ...

public createClan(
  spreadsheetId: string,
  valueInputOption: string,
  clan: string, 
  clantag: string, 
  cl: string, 
  wa: string, 
  clan_image: string, 
  flag: string,
  last30days: string,
  last365days: string,
  win: string,
  loss: string,
  draw: string,
  members: string,
  preelo: string,
  totalwars: string
): Observable<any> {
  const defaultElo = 1000;

  return this.http.post<any>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clans:append?valueInputOption=${valueInputOption}`, {
      "values": [
          [
              clan,          // Nazwa klanu
              defaultElo,    // Elo (wartość domyślna)
              clantag,       // Tag klanu
              cl,            // Clan Leader
              wa,            // War Arranger
              clan_image,    // URL zdjęcia klanu
              flag,          // Flaga
              last30days,
              last365days,            // last30days (zostawiamy puste - formuła w Google Sheets)
              win,            // last365days (formuła w Google Sheets)
              loss,            // win (formuła)
              draw,            // loss (formuła)
              members,            // draw (formuła)
              preelo,            // streak (formuła)
              totalwars             // preelo (formuła)
          ]
      ]
  }, { headers: this.authHeader() });
}

updateClanMembers(spreadsheetId: string, sheetName: string, clanName: string, members: string): Observable<any> {
  const range = `${sheetName}!A:M`;

  return this.http.get<any>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`)
      .pipe(
          switchMap(response => {
              const rows = response.values;
              const rowIndex = rows.findIndex(row => row[0] === clanName);

              if (rowIndex === -1) {
                  throw new Error(`Clan "${clanName}" not found`);
              }

              const updateRange = `${sheetName}!M${rowIndex + 1}`;

              return this.http.put(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${updateRange}?valueInputOption=USER_ENTERED`, {
                  range: updateRange,
                  majorDimension: 'ROWS',
                  values: [[members]]
              }, { headers: this.authHeader() });
          })
      );
}


updateClanField(sheetName: string, clanName: string, fieldName: string, newValue: string): Observable<any> {
  const body = {
      sheetName,
      clanName,
      fieldName,
      newValue
  };

  return this.http.post(`/update-clan-field`, body);
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
    playername: string, 
    username: string, 
    ranking: string, 
    percentile: string, 
    place: string,
    warcount: string, 
    nationality: string, 
    clanhistory: string, 
    cup1on1edition1: string, 
    meeting: string, 
    cup3on3: string, 
    active: string, 
    ban: boolean, 
    lastwar: string, 
    fpw: string, 
    fpwmax: string, 
    fpwmin: string, 
    last30days: string,  
    last365days: string, 
    lastwarpc: string, 
    s1wars: string, 
    s2wars: string, 
    s3wars: string, 
    s4wars: string, 
    s5wars: string, 
    s6wars: string, 
    s1fpw: string, 
    s2fpw: string, 
    s3fpw: string, 
    s4fpw: string, 
    s5fpw: string, 
    s6fpw: string, 
    streak: string
    ): Observable<Sheet>{
      return this.http.post<Sheet>(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Players:append?valueInputOption=${valueInputOption}`
        ,
        {
          "values": [
              [playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s2wars, s3wars, s4wars, s5wars, s6wars, s1fpw, s2fpw, s3fpw, s4fpw, s5fpw, s6fpw, streak]
          ]
        },
        { headers: this.authHeader()}
      )
  }

  updateCell(spreadsheetId: string, sheetName: string, cellRange: string, t1p1name: string, t1p2name: string, t1p3name: string, t1p4name: string, t1p5name: string, t1p6name: string, t1p7name: string){
    const accessToken = this.oAuthService.getAccessToken();    
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

  // updatePlayerClan(spreadsheetId: string, sheetName: string, username: string, clanName: string) {
  //   const accessToken = this.oAuthService.getAccessToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     })
  //   };
  
  //   // Najpierw pobierz wszystkie dane z zakładki Players, aby znaleźć odpowiedni wiersz
  //   const urlGet = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:H`;
  //   return this.http.get<any>(urlGet, httpOptions).pipe(
  //     switchMap(response => {
  //       const playersData = response.values;
  //       const rowIndex = playersData.findIndex(row => row[1] === username); // Zakładając, że username jest w kolumnie B (index 1)
  
  //       if (rowIndex !== -1) {
  //         const currentClans = playersData[rowIndex][7] || ""; // Pobierz aktualne klany z kolumny H (index 7)
  //         const clanList = currentClans ? currentClans.split(',').map(clan => clan.trim()) : [];
  
  //         // Jeśli gracz jest już w dwóch klanach, nie dodawaj nowego klanu
  //         if (clanList.length >= 2) {
  //           console.warn(`Player ${username} is already in two clans: ${currentClans}`);
  //           return of(null); // lub inna obsługa błędu
  //         }
  
  //         // Dodaj nowy klan do listy (jeśli lista jest pusta, dodaj bez przecinka)
  //         const updatedClans = clanList.length === 0 ? clanName : `${currentClans}, ${clanName}`;
  
  //         const cellRange = `H${rowIndex + 1}`; // Kolumna H dla wybranego wiersza
  //         const urlUpdate = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`;
          
  //         const data = {
  //           values: [[updatedClans]]
  //         };
  
  //         return this.http.put<any>(urlUpdate, data, httpOptions);
  //       } else {
  //         console.error(`Player with username ${username} not found`);
  //         return of(null); // lub inna obsługa błędu
  //       }
  //     })
  //   );
  // }

 
  

  // updateClan(rowIndex: number, clanData: any): Observable<any> {
  //   const accessToken = this.oAuthService.getAccessToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     })
  //   };
  
  //   // Zakres dla wybranego wiersza (od A do G)
  //   const cellRange = `A${rowIndex}:G${rowIndex}`;
  //   const url = `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Clans!${cellRange}`;
  
  //   // Najpierw pobieramy obecne wartości
  //   return this.http.get<any>(url, httpOptions).pipe(
  //     map(response => {
  //       const currentValues = response.values[0];
        
  //       // Tylko te pola, które się zmieniły
  //       const updatedValues = [
  //         clanData.clan || currentValues[0],         // Pole 'clan'
  //         '',                                        // Puste pole (zajęte na stałe)
  //         clanData.clantag || currentValues[2],      // Pole 'clantag'
  //         clanData.cl || currentValues[3],           // Pole 'cl'
  //         clanData.wa || currentValues[4],           // Pole 'wa'
  //         clanData.clan_image || currentValues[5],   // Pole 'clan_image'
  //         clanData.flag || currentValues[6]          // Pole 'flag'
  //       ];
  
  //       // Jeśli nie zmieniono żadnego pola, zwracamy obecne dane bez wysyłania
  //       if (updatedValues.every((val, i) => val === currentValues[i])) {
  //         return { status: 'no_change' };
  //       }
  
  //       // Wyślij zaktualizowane dane
  //       return this.http.put<any>(`${url}?valueInputOption=USER_ENTERED`, { values: [updatedValues] }, httpOptions);
  //     })
  //   );
  // }

  // updateClan(rowIndex: number, clanData: any): Observable<any> {
  //   const accessToken = this.oAuthService.getAccessToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json'
  //     })
  //   };
  
  //   // Zakres dla wybranego wiersza (od A do M)
  //   const cellRange = `A${rowIndex}:M${rowIndex}`;
  //   const url = `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Clans!${cellRange}`;
  
  //   // Najpierw pobieramy obecne wartości
  //   return this.http.get<any>(url, httpOptions).pipe(
  //     map(response => {
  //       const currentValues = response.values[0];
  
  //       // Tylko te pola, które się zmieniły
  //       const updatedValues = [
  //         clanData.clan || currentValues[0],         // Pole 'clan'
  //         '',                                        // Puste pole (zajęte na stałe)
  //         clanData.clantag || currentValues[2],      // Pole 'clantag'
  //         clanData.cl || currentValues[3],           // Pole 'cl'
  //         clanData.wa || currentValues[4],           // Pole 'wa'
  //         clanData.clan_image || currentValues[5],   // Pole 'clan_image'
  //         clanData.flag || currentValues[6],          // Pole 'flag'
  //         currentValues[7],                          // Zachowaj obecne pole (np. preelo) - kolumna H
  //         currentValues[8],                          // Zachowaj obecne pole (np. postelo) - kolumna I
  //         currentValues[9],                          // Zachowaj obecne pole (np. totalwars) - kolumna J
  //         currentValues[10],                         // Zachowaj obecne pole (np. win) - kolumna K
  //         currentValues[11],                         // Zachowaj obecne pole (np. loss) - kolumna L
  //         clanData.members || currentValues[12]     // Uaktualnienie pola 'members' (kolumna M)
  //       ];
  
  //       // Jeśli nie zmieniono żadnego pola, zwracamy obecne dane bez wysyłania
  //       if (updatedValues.every((val, i) => val === currentValues[i])) {
  //         return { status: 'no_change' };
  //       }
  
  //       // Wyślij zaktualizowane dane
  //       return this.http.put<any>(`${url}?valueInputOption=USER_ENTERED`, { values: [updatedValues] }, httpOptions);
  //     })
  //   );
  // }

  updateClan(rowIndex: number, clanData: any): Observable<any> {
    const accessToken = this.oAuthService.getAccessToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      })
    };

    const cellRange = `A${rowIndex}:M${rowIndex}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${environment.SPREADSHEET_ID}/values/Clans!${cellRange}`;

    return this.http.get<any>(url, httpOptions).pipe(
      switchMap(response => {
        const currentValues = response.values[0];

        const updatedValues = [
          clanData.clan || currentValues[0],         // 'clan'
          clanData.elo || currentValues[1],         // Stałe puste pole
          clanData.clantag || currentValues[2],      // 'clantag'
          clanData.cl || currentValues[3],           // 'cl'
          clanData.wa || currentValues[4],           // 'wa'
          clanData.clan_image || currentValues[5],   // 'clan_image'
          clanData.flag || currentValues[6],         // 'flag'
          currentValues[7],                          // Pomijanie kolumny H
          currentValues[8],                          // Pomijanie kolumny I
          currentValues[9],                          // Pomijanie kolumny J
          currentValues[10],                         // Pomijanie kolumny K
          currentValues[11],                         // Pomijanie kolumny L
          clanData.members || currentValues[12]      // Aktualizacja 'members' w kolumnie M
        ];

        if (updatedValues.every((val, i) => val === currentValues[i])) {
          return of({ status: 'no_change' });
        }

        return this.http.put<any>(`${url}?valueInputOption=USER_ENTERED`, { values: [updatedValues] }, httpOptions);
      })
    );
  }
  
  updatePlayerClan(spreadsheetId: string, sheetName: string, username: string, clanName: string, action: 'add' | 'remove') {
    const accessToken = this.oAuthService.getAccessToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      })
    };
  
    const urlGet = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:H`;
    return this.http.get<any>(urlGet, httpOptions).pipe(
      switchMap(response => {
        const playersData = response.values;
        const rowIndex = playersData.findIndex(row => row[1] === username); // Zakładając, że username jest w kolumnie B (index 1)
  
        if (rowIndex !== -1) {
          const currentClans = playersData[rowIndex][7] || ""; // Pobierz aktualne klany z kolumny H (index 7)
          const clanList = currentClans ? currentClans.split(',').map(clan => clan.trim()) : [];
  
          // Logika dodawania lub usuwania klanu
          if (action === 'add') {
            if (clanList.length >= 2) {
              console.warn(`Player ${username} is already in two clans: ${currentClans}`);
              return of(null); // lub inna obsługa błędu
            }
            if (!clanList.includes(clanName)) {
              clanList.push(clanName); // Dodaj klan
            }
          } else if (action === 'remove') {
            const index = clanList.indexOf(clanName);
            if (index > -1) {
              clanList.splice(index, 1); // Usuń klan
            }
          }
  
          const updatedClans = clanList.join(', '); // Połącz klany w jeden string
          const cellRange = `H${rowIndex + 1}`; // Kolumna H dla wybranego wiersza
          const urlUpdate = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!${cellRange}?valueInputOption=USER_ENTERED`;
  
          const data = {
            values: [[updatedClans]]
          };
  
          return this.http.put<any>(urlUpdate, data, httpOptions);
        } else {
          console.error(`Player with username ${username} not found`);
          return of(null); // lub inna obsługa błędu
        }
      })
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
  getSheetDataWithHistoryByDate(selectedDate: string) {
    // Tworzymy obiekt parametrów z odpowiednimi właściwościami
    const params = new HttpParams()
      .set('ranges', 'A:Z')
      .set('includeGridData', 'true')
      .set('fields', 'sheets.properties,sheets.data.rowData.values(effectiveValue,effectiveFormat)')
      .set('dateTimeRenderOption', 'FORMATTED_STRING')
      .set('valueRenderOption', 'FORMATTED_VALUE');

    // Tworzymy pełny URL z dodanymi parametrami
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}`;

    // Wysyłamy żądanie HTTP GET do Google Sheets API z odpowiednimi parametrami
    return this.http.get(url, { params }).toPromise().then((response: any) => {
      // Przetwarzamy otrzymane dane i wyciągamy odpowiednie arkusze z historią zmian dla wybranej daty
      const sheetsWithHistory = response.sheets.filter((sheet: any) => {
        return this.hasDateInHistory(sheet, selectedDate);
      });

      return sheetsWithHistory;
    });
  }
  private hasDateInHistory(sheet: any, selectedDate: string): boolean {
    // Arkusz z historią zmian ma dane o zmianach w polu "effectiveFormat", które zawiera datę
    const changes = sheet.data[0].rowData?.map((row: any) => row.values?.[0]?.effectiveFormat?.numberFormat?.pattern);
    return changes?.some((change: any) => change.includes(selectedDate)) || false;
  }
}
