import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  public rules$: Observable<any>;

  constructor(private googleApi: PlayersApiService) { }

  ngOnInit(): void {
    this.rules$ = this.googleApi.getPlayers('Rules').pipe(
      map((response: any) => {        
        let batchRowValuesHistory = response.values;
        // console.log('batchRowValuesHistory', batchRowValuesHistory)
        let rules: any[] = [];
        for(let i = 1; i < batchRowValuesHistory.length; i++){
          const rowObject: any = [];
          for(let j = 0; j < batchRowValuesHistory[i].length; j++){
            rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
          }
          // console.log('rowObject', rowObject);
          rules.push(rowObject);
        }        
        // console.log('rules', rules)
        return rules;
      }),
    )
  }

}
