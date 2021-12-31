import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { InactivePlayers } from '../inactive.model';
import { ActivatedRoute } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-inactive-view',
  templateUrl: './inactive-view.component.html',
  styleUrls: ['./inactive-view.component.scss']
})
export class InactiveViewComponent implements OnInit {
  public player$:Observable<InactivePlayers>;
  public playerDetail$: Observable<any>;
  public historyMatches$: Observable<any>;
  public playerUsername$: Observable<any>;
  public playersTab$: Observable<any>;

  constructor(private activatedRoute: ActivatedRoute, private playersApiService: PlayersApiService) { 
    console.log('activatedRoute InactivePlayerView =>', this.activatedRoute);  
  }

  ngOnInit(): void {
    this.historyMatches$ = this.playersApiService.getPlayers('Match+History').pipe(
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
    );

    this.playersTab$ = this.playersApiService.getPlayers('Inactive').pipe(
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

    this.player$ = this.activatedRoute.data.pipe(
      map(data => data.player)      
    ) 

    this.playerUsername$ = this.activatedRoute.data.pipe(
      map((data) => {
        return data.player.username;
      })
    ) 

    this.playerDetail$ = combineLatest([this.playerUsername$, this.historyMatches$, this.playersTab$]).pipe(
      map(([player, matches, players]) => {
        let playerArray: any[] = [];
        let timestampArray: any[] = [];
        let playerName: string;
        let warCount: string;
        let nationality: string;
        let ranking: string;
        let clanHistory: string;

        matches.forEach((el) => {
          if(Object.values(el).includes(player)){

            playerArray.push([el.idwar, el.timestamp]);
            timestampArray.push(new Date(el.timestamp).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
          }
        });
        
        players.forEach((el) => {
         if(el.username === player){
           playerName = el.playername;
           warCount = el.warcount;
           nationality = el.nationality;
           ranking = el.ranking;
           clanHistory = el.clanhistory;
         }         
        })
       
        let playerCard;
        
        playerCard = {
          username: player,
          playername: playerName,
          warcount: warCount,
          nationality: nationality,
          ranking: ranking,
          clanhistory: clanHistory,
          wars: playerArray,
          debut: timestampArray[0],                
        }        
        
        return playerCard;
      })
    )  
  }

}
