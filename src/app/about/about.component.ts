import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayersApiService } from '../services/players-api.service';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Contact } from './secret/secret.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public matchesTab$: Observable<any>;
  public maps: any;
  public resultMap: any;

  constructor(public route: ActivatedRoute, private router: RouterModule, private tabApiService: PlayersApiService, private translateService: TranslateService) { }
  public contactPlayers$: Observable<Contact[]>;

  ngOnInit(): void {
    this.matchesTab$ = this.tabApiService.getPlayers('Match+History').pipe(
      map((response: any) => {        
        let batchRowValuesHistory = response.values;
        let historyMatches: any[] = [];
        for(let i = 1; i < batchRowValuesHistory.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValuesHistory[i].length; j++){
            rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
          }
          historyMatches.push(rowObject);
        }        
        return historyMatches;
      }),
    )

    this.contactPlayers$ = this.tabApiService.getPlayers('Contact').pipe(
      map((response: any) => {
        let batchRowValues = response.values;
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }
        
        return players;
      })
    )
    this.contactPlayers$.subscribe(res => console.log('CONTACT', res));
    
    // this.maps = this.matchesTab$;
    // const mapsFilter = this.maps.map((a) => a.info);
    // this.resultMap = mapsFilter.filter((map: string | string[]) => map.includes('The Hunt')).length;

  } 



}
