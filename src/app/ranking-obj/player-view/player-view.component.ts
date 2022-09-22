import { Component, OnInit   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { combineLatest, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Chart, ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { MatchesApiService } from 'src/app/services/matches-api.service';



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
  isShown: Boolean = false;
  canvasRank: any;
  ctxRank: any; 
  chartRank: any; 
  public chartFrags: any;

  public dataToChartFrags: any;
  chart: Chart;
  
 
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
        let rankings: any[] = [];

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

        matches.forEach((el) => {
          if(Object.values(el).includes(player)){              
            const destructObjPlayers1 = Object.values(el);
            let fragPerWar;
            let rankHistory;
            destructObjPlayers1.forEach((item:any[], index) => {
              if(item.includes(player)){                
                fragPerWar = Number(destructObjPlayers1[index + 2]);
                rankHistory = Number(destructObjPlayers1[index + 3]);
              }
            });
            listwars.push(Number(el.idwar));
            rankings.push(Math.round(rankHistory * 100) / 100);
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
          rankings: rankings,             
        }         

        // console.log('P =>', playerCard);
        return playerCard;
      })
    ) 

    
  }  

  private filterUsername(name:string, matches:any[]){
        return matches.filter(m => {             
          return Object.values(m).includes(name);
          })
  } 

  public showFrags(frags:any[], listwars:any[]){    
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: listwars.map(i => 'War #' + i),          
          datasets: [{
              label: 'Frags in war',             
              data: frags,              
              backgroundColor: listwars.map(function(frag, i){
                if(frags[i] == Math.max.apply(null, frags)){
                  return 'rgba(11,156,49,0.6)';
                }
                if(frags[i] == Math.min.apply(null, frags)){
                  return 'rgba(255,0,0,0.6)';
                }
                return "rgba(199, 199, 199, 0.6)";
              }),
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: false,
                min: 1,
              },
              offset: true,
              id: 'date-x-axis',
              scaleLabel: {
                display: false,
                labelString: 'Date of match',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: false,
                labelString: 'Frags per war',
              },
            },
          ],
        },
        // display:true
      }
    });
  } 

  public showRanking(rankings:any[], listwars:any[]){    
    this.canvasRank = document.getElementById('rankChart');
    this.ctxRank = this.canvasRank.getContext('2d');
    let myChart = new Chart(this.ctxRank, {
      type: 'line',
      data: {
          labels: listwars.map(i => '#' + i),         
          datasets: [{
              label: 'Ranking', 
              borderColor: '#ffffc0',
              lineTension: 0,
              order: 1,             
              data: rankings,              
              backgroundColor: listwars.map(function(rank, i){
                if(rankings[i] == Math.max.apply(null, rankings)){
                  return 'rgba(11,156,49,0.6)';
                }
                if(rankings[i] == Math.min.apply(null, rankings)){
                  return 'rgba(255,0,0,0.6)';
                }
                // return "rgba(199, 199, 199, 0.1)";
              }),
              borderWidth: 1
          }]
      },
      options: {      
        onClick: function(c,i) {
          let e:any;
          e = i[0];
          console.log(e._index)
          var x_value = this.data.labels[e._index];
          var y_value = this.data.datasets[0].data[e._index];
          const toWarLink = x_value.substring(1);
          window.open(`/obj-matches/${toWarLink}`);
          console.log(toWarLink);
          console.log(y_value);
        },
        elements: {
          line: {
            tension: 0,
          },
        },
        // scales: {
        //   xAxes: [
        //     {
        //       scaleLabel: {
        //         display: true,
        //         labelString: '# War',
        //       },
        //     },
        //   ],
        //   yAxes: [
        //     {
        //       scaleLabel: {
        //         display: true,
        //         labelString: 'RANKING',
        //       },
        //     },
        //   ],
        // },        
        legend: {
          display: false
        },
        responsive: true,
        // display:true
      }
    });
  }  

  public showHorizontalScrolling(frags:any[], listwars:any[]){
    this.canvas = <HTMLCanvasElement>document.getElementById('myChart2');
    this.ctx = this.canvas.getContext('2d');
    var data = {
      // labels: ["January", "February", "March", "April", "May", "June", "July"],
      labels: listwars,
      datasets: [
          {
              label: "My First dataset",
              // fillColor: "rgba(220,220,220,0.2)",
              // strokeColor: "rgba(220,220,220,1)",
              // pointColor: "rgba(220,220,220,1)",
              // pointStrokeColor: "#fff",
              // pointHighlightFill: "#fff",
              // pointHighlightStroke: "rgba(220,220,220,1)",
              // data: [65, 59, 80, 81, 56, 55, 40]
              data: frags
          },
          // {
          //     label: "My Second dataset",
          //     fillColor: "rgba(151,187,205,0.2)",
          //     strokeColor: "rgba(151,187,205,1)",
          //     pointColor: "rgba(151,187,205,1)",
          //     pointStrokeColor: "#fff",
          //     pointHighlightFill: "#fff",
          //     pointHighlightStroke: "rgba(151,187,205,1)",
          //     data: [28, 48, 40, 19, 86, 27, 90]
          // }
      ]
  };
    new Chart(this.ctx, {
      type: 'bar',
      data: data,
      options: {
        legend: {
          display: false,
        },
        responsive: false,
        animation: {
          onComplete : function(e){
            this.options.animation.onComplete = null;
            var sourceCanvas = this.chart.ctx.canvas;
            // the -5 is so that we don't copy the edges of the line
            // var copyWidth = this.scale.xScalePaddingLeft - 5; //ORG
            var copyWidth = this.scales["x-axis-0"].paddingLeft - 5;
            // console.log('copyWidth this.scales', this.scales);
            console.log('copyWidth this.scales x-axis-0', this.scales["x-axis-0"]);
            // var copyWidth = this.scale - 5;
            // the +5 is so that the bottommost y axis label is not clipped off
            // we could factor this in using measureText if we wanted to be generic
            // var copyHeight = this.scale.endPoint + 5; //ORG
            var copyHeight = this.scales["y-axis-0"].endPixel + 5;
            // console.log('copyHeight this.scales y-axis-0', this.scales["y-axis-0"]);
            var targetCanvas = <HTMLCanvasElement>document.getElementById("myChartAxis");
            var targetCtx = targetCanvas.getContext('2d');
            // var targetCtx = document.getElementById("myChartAxis").getContext("2d");
            targetCtx.canvas.width = copyWidth;
            targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
          }
        }
      }

    })
  
  }

  // public cssHorizontal(frags:any[], listwars:any[]){
  //   this.canvas = <HTMLCanvasElement>document.getElementById("chart");
  //   this.ctx = this.canvas.getContext('2d');
  //   var data = {
  //     labels: listwars,
  //     datasets: [{
  //       /* data */
  //       label: "Data label",
  //       backgroundColor: ["red", "#8e5ea2","#3cba9f", '#1d49b8'],
  //       data: frags,
  //     }]
  //   };

  //   var options = {
  //     responsive: true,
  //     maintainAspectRatio: true,
  //     title: {
  //       text: 'Hello',
  //       display: true
  //     },
  //     scales: {
  //       xAxes: [{
  //         stacked: false,
  //         ticks: {
    
  //         },
  //       }],
  //       yAxes: [{
  //         stacked: true,
  //         ticks: {
    
  //         }
  //       }]
  //     }
  //   };

  //   new Chart(this.ctx, {
  //     type: 'bar',
  //     data: data,
  //     options: options
  //   })
  // }
}
function annotations(annotations: any) {
  throw new Error('Function not implemented.');
}

