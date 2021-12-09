import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { InactivePlayers, inactivePlayerAttributesMapping } from './inactive.model';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InactiveObjService {
  private playersSubject = new BehaviorSubject<InactivePlayers[]>([]);
  public players$: Observable<InactivePlayers[]> = this.playersSubject.asObservable();

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService) { }

  fetchInactivePlayers(){
    return this.GoogleSheetsDbService.get<InactivePlayers>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Inactive', inactivePlayerAttributesMapping).pipe(
      tap((value:InactivePlayers[]) => {
        this.playersSubject.next(value);
      })
    )
  }

  getSingleInactivePlayer(username: string):Observable<InactivePlayers>{
    return this.players$.pipe(
      map((value:InactivePlayers[]) => {
        return value.find((player:InactivePlayers) => player.username === username)
      })
    )
  }
}
