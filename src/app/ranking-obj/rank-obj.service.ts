import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Players, playerAttributesMapping } from './ranking.model';

@Injectable({
  providedIn: 'root'
})
export class RankObjService {
  // public playerFlag = '';

  private playersSubject = new BehaviorSubject<Players[]>([]);
  public players$: Observable<Players[]> = this.playersSubject.asObservable();

  constructor(private _http: HttpClient, private GoogleSheetsDbService: GoogleSheetsDbService) { }

  fetchPlayers(){
    return this.GoogleSheetsDbService.get<Players>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Players', playerAttributesMapping).pipe(
      tap((value:Players[]) => {
        this.playersSubject.next(value);
      })
    )
  }

  // fetchPlayersFlag(nationality: string){
  //   return this.GoogleSheetsDbService.get<Players>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Players', playerAttributesMapping).pipe(
  //     map((value:Players[]) => {
  //       return value.find((player:Players) => player.nationality === nationality)
  //     })
  //   )
  // }

  getSinglePlayer(username: string):Observable<Players>{
    return this.players$.pipe(
      map((value:Players[]) => {
        return value.find((player:Players) => player.username === username)
      })
    )
  }

  // getPlayerFlag(playerFlag) {   
  //   switch (this.playerFlag) {
  //     case 'EU': {
  //       this.playerFlag = `<img src="/assets/flags/_e.gif" title="EU">`;
  //       break;
  //     }
  //     case 'PL': {
  //       this.playerFlag = `<img src="/assets/flags/pl.gif" title="Poland">`;
  //       break;
  //     }      
  //     default:
  //     // console.log('Nie pasuje');
  //   }
  //   return this.playerFlag;
  // }

  
  // public sheets_url_players = `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`;
  

  // getRanking(): Observable<any> {    
  //   return this._http.get(this.sheets_url_players).pipe(map((result) => result)
  //   )
  // }
}
