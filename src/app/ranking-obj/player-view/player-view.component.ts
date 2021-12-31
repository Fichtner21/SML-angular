import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { combineLatest, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Chart, ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';


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
  public playersTab$: Observable<any>;
  canvas: any;
  ctx: any;

  public dataToChartFrags: any;
 
  constructor(private activatedRoute: ActivatedRoute, private playersDetail: RankObjService, private playersApiService: PlayersApiService) {
    // console.log('activatedRoute PlayerView =>', this.activatedRoute);  
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

    this.playersTab$ = this.playersApiService.getPlayers('Players').pipe(
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
        let frags: any[] = [];
        let listwars: any[] = [];

        const foundPlayerArray = this.filterUsername(player, matches);

        const fragsPerPlayerArray:any[] = [];
          
        foundPlayerArray.forEach((el) => {            
          const destructObjPlayers1 = Object.values(el);
          destructObjPlayers1.forEach((item:any[], i) => {
            if(item.includes(player) ){
              fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2]));
            }
          })
        })

        // console.log('Array =>', fragsPerPlayerArray);       

        matches.forEach((el) => {
          if(Object.values(el).includes(player)){              
            const destructObjPlayers1 = Object.values(el);
            let fragPerWar;
            destructObjPlayers1.forEach((item:any[], index) => {
              if(item.includes(player)){                
                fragPerWar = Number(destructObjPlayers1[index + 2]);
              }
            });
            listwars.push(Number(el.idwar));
            playerArray.push([el.idwar, el.timestamp, fragPerWar]);           
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
          frags: fragsPerPlayerArray,
          debut: timestampArray[0], 
          listwars: listwars,               
        }        
        
        console.log('P =>', playerCard);
        return playerCard;
      })
    )    
  }

  private filterUsername(name:string, matches:any[]){
        return matches.filter(m => {             
          return Object.values(m).includes(name);
          })
      } 
  public showFrags(frags:any[], listwars:any[] ){
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: listwars,
          // labels: ["USA", "Spain", "Italy", "France", "Germany", "UK", "Turkey", "Iran", "China", "Russia", "Brazil", "Belgium", "Canada", "Netherlands", "Switzerland", "India", "Portugal", "Peru", "Ireland", "Sweden"],
          datasets: [{
              label: 'Frags per war:',
              // data: [886789, 213024, 189973, 158183, 153129, 138078, 101790, 87026, 82804, 62773, 50036, 42797, 42110, 35729, 28496, 23502, 22353, 20914, 17607, 16755],
              data: frags,
              backgroundColor: ["red", , , , , , , , "orange"],
              borderWidth: 1
          }]
      },
      options: {
    legend: {
        display: false
    },
        responsive: false,
        // display:true
      }
    });
  }    
}
