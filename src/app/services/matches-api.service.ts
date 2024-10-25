import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchesApiService {
  private apiUrl = 'https://script.googleapis.com/v1/scripts/AKfycbycrwWgZRkLq3GXhdFHyCNnVUrb8QtPMSueAAyLSU-p_rTzLJL4MUaPQo4bjt6atkbI:run';
  headers:any;

  constructor(private http: HttpClient, private readonly oAuthService: OAuthService) { 
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.oAuthService.getAccessToken()}`)
  }

  public getMatches(name:string): Observable<any>{
    return this.http.get<any>(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`);
  }
  
  public addTitleCup(place:string) {
    let cupInfoTitle = '';
    switch (place) {
      case '1': {
        cupInfoTitle = `Winner in 1on1 CUP 1st Edition`;
        break;
      }
      case '2': {
        cupInfoTitle = `2nd place in 1on1 CUP 1st Edition`;
        break;
      }
      case '3': {
        cupInfoTitle = `3rd place in 1on1 CUP 1st Edition`;
        break;
      }
      default:
    }
    return cupInfoTitle;
  }

  public findPlayerLastWar(name:string, obj:object) {    
    const findeLastWar = Object.values(obj)
      .filter((item) => JSON.stringify(item).includes(name))
      .pop();    
    let findLastTimeStamp = '';
    let newTimestampElem = '';
    if (findeLastWar) {
      findLastTimeStamp = findeLastWar.timestamp;
      newTimestampElem = new Date(findLastTimeStamp).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else if (findeLastWar === 'undefined') {
      findLastTimeStamp = 'No match';
    } else if (findeLastWar === null) {
      findLastTimeStamp = 'No match';
    } else {
      findLastTimeStamp = 'No match';
    }
    return newTimestampElem;
  }

  public authHeader(): HttpHeaders {
    // const token = this.oAuthService.getAccessToken(); // Uzyskaj aktualny token
    // if (!token) {
    //   console.error('Token dostępu nie jest dostępny. Użytkownik może nie być zalogowany.');
    // }
    return new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`, // Przekaż token w nagłówku
      'Content-Type': 'application/json'
    });
  }

  addClanMatch(matchData: any) {
    const body = {
      function: 'doPost',
      parameters: [matchData]
    }
    return this.http.post(this.apiUrl, body, {headers: this.authHeader()});
  }
}
