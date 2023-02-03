import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export interface Rule {
  problem_or_ask: string;
  solution: string;
  rule: string;
}


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})

export class RulesComponent implements OnInit {
  public rules$: Observable<Rule[]>;
  arrowRightIcon = faArrowRight;

  constructor(private service: PlayersApiService) { }

  ngOnInit(): void {
    this.rules$ = this.service.getPlayers('Rules').pipe(
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
      }),
    );
  }

}
