import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sheet } from '../models/sheet.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayersApiService {

  constructor(private http: HttpClient) { }

  // TODO create interface for observable. Now I added "any" because I don't know how looks model for this data
  public getPlayers(name: string): Observable<any> {
    return this.http.get<any>(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`);
  }

  public headers = {
    'Authorization': 'Basic ' + btoa('client-id:719531931759-knap6bv72g48p5madeo3poqh4vb979tu.apps.googleusercontent.com'),
    'Content-type': 'application/x-www-form-urlencoded'
  } 

  listPlayers(){
    return this.http.get(`${environment.CONNECTION_URL}`);
  }

  public createPlayer( playername: string, username: string, ranking: string, percentile: string, place: string,
    warcount: string, nationality: string, clanhistory: string, cup1on1edition1: string, meeting: string, cup3on3: string, active: boolean, ban: boolean, lastwar: string, fpw: string, fpwmax: string, fpwmin: string, last30days: string,  last365days: string, lastwarpc: string, s1wars: string, s1fpw: string, streak: string): Observable<Sheet>{
      return this.http.post<Sheet>(
        `${environment.CONNECTION_URL}`
        // `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players!A:W:append`
        // `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players!A:W:append`
        ,{
        playername,
        username,
        ranking,
        place,
        warcount,
        nationality,
        clanhistory,
        cup1on1edition1,
        meeting,
        cup3on3,
        active,
        ban,
        lastwar,
        fpw,
        fpwmax,
        fpwmin,
        last30days,
        last365days,
        lastwarpc,
        s1wars,
        s1fpw,
        streak,
      })
    }
}
