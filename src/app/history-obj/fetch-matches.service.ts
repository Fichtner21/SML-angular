import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { HistoryObjComponent } from './history-obj.component';
import { Matches, matchesAttributesMapping } from './matches.model';


@Injectable({
  providedIn: 'root'
})
export class FetchMatchesService { 
  private matchesSubject = new BehaviorSubject<Matches[]>([]);
  public matches$: Observable<Matches[]> = this.matchesSubject.asObservable();

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService){}

  fetchMatches(){
    return this.GoogleSheetsDbService.get<Matches>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Match+History', matchesAttributesMapping).pipe(
      tap((value:Matches[]) => {
        this.matchesSubject.next(value);
      })
    )    
  }

  getSingleMatch(idwar: string):Observable<Matches>{
    return this.matches$.pipe(
      map((value:Matches[]) => {
        return value.find((match:Matches) => match.idwar === idwar)
      })
    )
  }  
}
