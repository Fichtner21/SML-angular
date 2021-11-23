import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Players } from '../players.model';

@Injectable({
  providedIn: 'root'
})
export class RankObjService {
  public playerFlag = '';

  constructor(private _http: HttpClient) { }

  getPlayerFlag(playerFlag) {   
    switch (this.playerFlag) {
      case 'EU': {
        this.playerFlag = `<img src="/assets/flags/_e.gif" title="EU">`;
        break;
      }
      case 'PL': {
        this.playerFlag = `<img src="/assets/flags/pl.gif" title="Poland">`;
        break;
      }      
      default:
      // console.log('Nie pasuje');
    }
    return this.playerFlag;
  }

  
  public sheets_url_players = `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Players?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`;
  

  getRanking(): Observable<any> {    
    return this._http.get(this.sheets_url_players).pipe(map((result) => result)
    )
  }
}
