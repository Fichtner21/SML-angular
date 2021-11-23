import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Matches } from './matches.model';

@Injectable({
  providedIn: 'root'
})
export class MatchesDetailsService {

  constructor(private _http: HttpClient) { }

  public sheets_url_matches = `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Match+History?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`;

  private static readonly API_SHEETS = `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Match+History?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`;

  getMatches(): Observable<any> {    
    return this._http.get(this.sheets_url_matches).pipe(map((result) => result)
    )
  }

  public async getSingleMatch(shortname: string): Promise<Matches> {
    const response = await this._http.get<Matches>(MatchesDetailsService.API_SHEETS).pipe(json => json).toPromise();
    return response;
  }
}
