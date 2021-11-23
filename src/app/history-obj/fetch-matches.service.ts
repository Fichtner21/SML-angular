import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { HistoryObjComponent } from './history-obj.component';
import { Matches } from './matches.model';


@Injectable({
  providedIn: 'root'
})
export class FetchMatchesService {
  public HISTORY = this.matches.matches$;

  constructor(private matches: HistoryObjComponent, private httpClient: HttpClient) { }  

  // getSingleMatch(idwar: string): Observable<any> {
  //   // return this.httpClient.get(this.HISTORY).pipe(
  //   //   map((result) => result)
  //   //   )
  // }

  // public async getSingleMatcha(idwar: string): Promise<Matches>{   
  //   const response = this.httpClient.get<Matches>(FetchMatchesService.this.HISTORY).pipe(flatMap(jsonContent => jsonContent.data), filter(data => data.idwar === idwar)).toPromise();
  //   return response;
  // }
}
