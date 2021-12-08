import { Injectable } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { idOne, IdOneAttributesMapping, IdTwoAttributesMapping, idTwo } from '../home/team-selection-one.model';

@Injectable({
  providedIn: 'root'
})
export class SelectionTeamService {
  private teamIdOne = new BehaviorSubject<idOne[]>([]);
  public teamOne$: Observable<idOne[]> = this.teamIdOne.asObservable();
  // characters$: Observable<idOne[]>;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService) { }

  getTeamIdOne(){
    return this.GoogleSheetsDbService.get<idOne>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdOneAttributesMapping).pipe(     
      tap((value:idOne[]) => {
        this.teamIdOne.next(value);        
      })
    )
  }

  getTeamIdOneCumulative():Observable<idOne>{
    return this.GoogleSheetsDbService.get<idOne>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdOneAttributesMapping).pipe(     
      map((value:idOne[]) => {
        return value.find((idOneSel:idOne) => idOneSel.Team1Players);      
      })
    )
  }


  // getTeamIdOne(){
  //   return this.GoogleSheetsDbService.get("1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo", 'TeamSelectionOne', IdOneAttributesMapping).subscribe((characters: Object[]) => {
  //     console.log('res =>', characters);
  //   })
  // }
}
