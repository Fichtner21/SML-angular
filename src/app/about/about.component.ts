import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayersApiService } from '../services/players-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public matchesTab$: Observable<any>;
  public maps: any;
  public resultMap: any;

  constructor(public route: ActivatedRoute, private router: RouterModule, private tabApiService: PlayersApiService) { }

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
    
    // this.maps = this.matchesTab$;
    // const mapsFilter = this.maps.map((a) => a.info);
    // this.resultMap = mapsFilter.filter((map: string | string[]) => map.includes('The Hunt')).length;

  } 



}
