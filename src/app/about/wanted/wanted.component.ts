import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Wanted } from './wanted.model';
import { map, take } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';
import { shuffle } from 'lodash';
import { OAuthService } from 'angular-oauth2-oidc';

interface Player {
  username: string;
  playerName: string;
  s1wars: number;
  s1fpw: number;
  ranking: number;
}

@Component({
  selector: 'app-wanted',
  templateUrl: './wanted.component.html',
  styleUrls: ['./wanted.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1s', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class WantedComponent implements OnInit {
  public wantedPlayers$: Observable<Wanted[]>
  public allPlayers$: Observable<any>
  activePlayers: any[] = [];
  losers: any[] = [];
  winner: any | null = null;

  constructor(private playersApiService: PlayersApiService, private oauthService: OAuthService) { 
    this.allPlayers$ = this.playersApiService.getPlayers('Players').pipe(
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

    this.allPlayers$.subscribe(players => {
      this.activePlayers = players.filter(player => player.s1wars > 0);
      // const averageS1wars = this.activePlayers.reduce((sum, player) => sum + player.s1wars, 0) / this.activePlayers.length;
      // console.log('this.activePlayers', this.activePlayers)

      // for (const [nationality, count] of this.activePlayers.entries()) {
      //   // console.log('nationality', nationality)
      //   // console.log('count', count)
      //   if(count.nationality == 'PL'){
      //     console.log(count.nationality)
      //   }
      //   // if (count === 'PL') {
      //   //   console.log(`Nationality ${nationality} wystąpił ${count} razy.`);
      //   // }
      // }

      // check nations of players and length
      const nationalityCounts = this.activePlayers.reduce((nationalityMap, player) => {
        const nationality = player.nationality;
        const count = nationalityMap.get(nationality) || 0;
        nationalityMap.set(nationality, count + 1);
        return nationalityMap;
      }, new Map());
      
      // console.log(nationalityCounts);

      this.activePlayers = this.activePlayers.filter(player => player.ban != 'TRUE')
      // const notBannedPlayers = 
      // console.log('ACTIVE', this.activePlayers)
      // Calculate average s1wars
      const sumS1wars = this.activePlayers.reduce((acc, player) => acc + parseFloat(player.s1wars), 0);
      // console.log('sumS1wars', sumS1wars)
      const averageS1wars = sumS1wars / this.activePlayers.length;
      // console.log('avarageS1wars', averageS1wars)
      // Filter out players with s1wars < averageS1wars
      const aboveAveragePlayers = this.activePlayers.filter(player => parseFloat(player.s1wars) > averageS1wars / 2);
      // console.log('aboveAveragePlayers', aboveAveragePlayers)
      // const shuffledPlayers = shuffle(aboveAveragePlayers);
      const shuffledPlayers = aboveAveragePlayers.sort((player1, player2) => parseFloat(player2.s1wars) - parseFloat(player1.s1wars));

      // Move the selected player from aboveAveragePlayers to losers
      // const playerToMove = shuffledPlayers.pop();
      this.activePlayers = shuffledPlayers;
      // this.losers.push(playerToMove);

      // If there is only one player left in aboveAveragePlayers, move them to winners
      if (aboveAveragePlayers.length === 1) {
        this.winner = aboveAveragePlayers[0];
        this.activePlayers = [];
      }
    });

    // console.log('ACTIVE PLAYERS', this.activePlayers)
  }

  moveRandomPlayer() {
    if (this.activePlayers.length <= 1) {
      return; // Cannot move players if there is only one or none active players
    }

    // Shuffle the active players array to select a random player to move
    const shuffledPlayers = shuffle(this.activePlayers);

    // Move the selected player from activePlayers to losers
    const playerToMove = shuffledPlayers.pop();
    this.activePlayers = shuffledPlayers;
    this.losers.push(playerToMove);

    // If there is only one player left in activePlayers, move them to winners
    if (this.activePlayers.length === 1) {
      this.winner = this.activePlayers[0];
      this.activePlayers = [];
    }
  }

  isAuthenticated() {
    return this.oauthService.hasValidIdToken();
  }
}
