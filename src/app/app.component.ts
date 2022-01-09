import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { GoogleSheetsDbService } from 'ng-google-sheets-db';

import { environment } from '../environments/environment';
import { PlayersApiService } from './services/players-api.service';
import { Players } from './ranking-obj/ranking.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'SML-angular';
  players$: Observable<any>;
  matches$: Observable<any>;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private playersApiService: PlayersApiService) {}

  ngOnInit(): void {
    this.players$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {  
        return response.values;       
      })
    )
    this.matches$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {  
        return response.values;       
      })
    )       
  }

 public toggleMenu(){ 
    document.getElementById('nav').classList.toggle('block_class');
  }
}
