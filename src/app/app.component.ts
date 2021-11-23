import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { GoogleSheetsDbService } from 'ng-google-sheets-db';

import { environment } from '../environments/environment';
import { Players, playerAttributesMapping } from './players.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'SML-angular';
  players$: Observable<Players[]>;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService) {}

  ngOnInit(): void {
    console.log('test');
    // this.players$ = this.GoogleSheetsDbService.getActive<Players>(
    //   environment.players.spreadsheetId, environment.players.worksheetId, playerAttributesMapping, 'Active'
    // );
    this.players$ = this.GoogleSheetsDbService.get<Players>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Players', playerAttributesMapping);
    const subscribePlayers = this.players$.subscribe(res => res);
    //const subToShowPlayers = subscribePlayers.filter(value => Object.keys(value).length !== 0);
    //console.log(subToShowPlayers);
  }
}
