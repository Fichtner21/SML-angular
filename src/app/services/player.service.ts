import { Injectable } from '@angular/core';
import { PlayersApiService } from './players-api.service'; // Adjust the import as necessary
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private players: any[] = [];

  constructor(private playersApiService: PlayersApiService) {
    this.loadPlayers();
  }

  public loadPlayers(): Observable<any[]> {
    return this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {    
        const batchRowValues = response.values;
        const players: any[] = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          const rowObject: any = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }
        this.players = players;
        
        return this.players; // Return the loaded players
      })
    );
  }

  public addPlayerLink(player: string): any {
    if (player === '') {
      return null; 
    }
    const foundPlayer = this.players.find((el: any) => player === el.username);
    return foundPlayer ? foundPlayer : null; // Return the entire player object
  }
}