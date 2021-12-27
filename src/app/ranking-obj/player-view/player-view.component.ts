import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { combineLatest, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {
  public player$:Observable<Players>;
  public errorMessage: string;
  public playerView: any;
  public playerDetail$: Observable<any>;
  public historyMatches$: Observable<any>;
  public playerUsername$: Observable<any>;
  
  constructor(private activatedRoute: ActivatedRoute, private playersDetail: RankObjService, private playersApiService: PlayersApiService) {
    console.log('activatedRoute PlayerView =>', this.activatedRoute);  
  
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

    this.player$ = this.activatedRoute.data.pipe(
      map(data => data.player)
      // map((data) => {
      //   let playerDetails;
      //   playerDetails = combineLatest([data.player.username, this.historyMatches$]).pipe(
      //     map(([v1, v2]) => {
      //       let playerViewCard: any;
      //       console.log('v1', v1);
      //     })
      //   )
      // })
      
    ) 

    this.playerUsername$ = this.activatedRoute.data.pipe(
      map((data) => {
      return data.player.username;
      })
    )

    // console.log('PLAYER', this.playerUsername);   
   
    this.playerDetail$ = combineLatest([this.playerUsername$, this.historyMatches$]).pipe(
      map(([player, matches]) => {
        let playerArray: any[] = [];
        let debutArray: any[] = [];

        matches.forEach((el) => {
          // const oldTimestampEl = el.timestamp;
          // const newTimestampEl = new Date(oldTimestampEl).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });
          

          if(Object.values(el).includes(player)){
            playerArray.push(el.idwar);
            debutArray.push(el.timestamp);
          }
        })

        
       
        let playerCard;
        
        playerCard = {
          username: player,
          wars: playerArray,
          debut: debutArray[0]       
        }
        
        return playerCard;
      })
    )
    
  }
}
