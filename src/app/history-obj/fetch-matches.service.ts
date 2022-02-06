import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { HistoryObjComponent } from './history-obj.component';
import { Matches, matchesAttributesMapping } from './matches.model';
import { PlayersApiService } from '../services/players-api.service';


@Injectable({
  providedIn: 'root'
})
export class FetchMatchesService { 
  private matchesSubject = new BehaviorSubject<Matches[]>([]);
  public matches$: Observable<Matches[]> = this.matchesSubject.asObservable();

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private playerApiService: PlayersApiService){}

  fetchMatches(){
    return this.playerApiService.getPlayers('Match+History').pipe(
      tap((value:any) => {
          // const resultMatches = value.values;
          // console.log('r', resultMatches);
          //   console.log('v', resultMatches.find((match:Matches) => match.idwar === '901'))
          let batchRowValuesHistory = value.values;
          let historyMatches: any[] = [];
          for(let i = 1; i < batchRowValuesHistory.length; i++){
            const rowObject: object = {};
            for(let j = 0; j < batchRowValuesHistory[i].length; j++){
              rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
            }
            historyMatches.push(rowObject);
          }  
            // console.log('v', historyMatches.find((match:Matches) => match.idwar === '901'))
            this.matchesSubject.next(historyMatches);
          })
    )
    // return this.GoogleSheetsDbService.get<Matches>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Match+History', matchesAttributesMapping).pipe(
    //   tap((value:Matches[]) => {
    //     console.log('v', value.find((match:Matches) => match.idwar === '901'))
    //     this.matchesSubject.next(value);
    //   })
    // )    
  }

  getSingleMatch(idwar: string):Observable<Matches>{
    return this.matches$.pipe(
      map((value:Matches[]) => {        
        return value.find((match:Matches) => match.idwar === idwar)
      })
    )
  }  
}
