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

  getSinglePlayer(username: string):Observable<Players>{
    return this.players$.pipe(
      map((value:Players[]) => {
        return value.find((player:Players) => player.username === username)
      })
    )
  }   
}
