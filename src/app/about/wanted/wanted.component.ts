import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Wanted } from './wanted.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-wanted',
  templateUrl: './wanted.component.html',
  styleUrls: ['./wanted.component.scss']
})
export class WantedComponent implements OnInit {
  public wantedPlayers$: Observable<Wanted[]>

  constructor(private playersApiService: PlayersApiService) { }

  ngOnInit(): void {
    this.wantedPlayers$ = this.playersApiService.getPlayers('Wanted').pipe(
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
