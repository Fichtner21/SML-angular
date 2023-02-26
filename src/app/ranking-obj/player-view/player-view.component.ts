import { Component, ElementRef, Input, OnInit, ViewEncapsulation   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { combineLatest, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Chart, ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import {ThemePalette} from '@angular/material/core';
import * as ChartAnnotation from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerViewComponent implements OnInit {
  @Input('tabTitle') title: string;
  @Input() active = false;
  public player$:Observable<Players>;
  public errorMessage: string;
  public playerView: any;
  public playerDetail$: Observable<any>;
  public historyMatches$: Observable<any>;
  public playerUsername$: Observable<any>;
  public playersTab$: Observable<any>;
  public inactiveTab$: Observable<any>;
  canvas: any;
  ctx: any;
  isShown: Boolean = false;
  canvasRank: any;
  ctxRank: any; 
  chartRank: any; 
  public chartFrags: any;

  resultCanvas: any;  
  ctxResult: any;

  public dataToChartFrags: any;
  chart: Chart;
  // public resultPerPlayer = [];
  status: boolean = false;
  mostOftenPlayed = [];
 
  constructor(private activatedRoute: ActivatedRoute, private playersDetail: RankObjService, private playersApiService: PlayersApiService, private elementRef: ElementRef, private router: Router) {
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

    this.inactiveTab$ = this.playersApiService.getPlayers('Inactive').pipe(
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
    );    

    this.playerUsername$ = this.activatedRoute.data.pipe(
      map((data) => {         
        if(data.player == undefined){
          this.router.navigate(['/obj-inactive/']);
        } else {
          return data.player.username;
        }       
      })
    ); 
   
    this.playerDetail$ = combineLatest([this.playerUsername$, this.historyMatches$, this.playersTab$, this.inactiveTab$]).pipe(
      map(([player, matches, players, inactives]) => {
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
        let resultPerPlayer: any[] = [];
        let s1wars: string;
        let s1fpw: string;
        let active: string;
        let place: string;

        const foundPlayerArray = this.filterUsername(player, inactives, matches);               

        const fragsPerPlayerArray:any[] = [];
          
        foundPlayerArray.forEach((el) => {            
          const destructObjPlayers1 = Object.values(el);
          destructObjPlayers1.forEach((item:any[], i) => {
            if(item.includes(player) ){
              fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2]));
            }
          })
        })  
        
        // console.log('foundPlayerArray', foundPlayerArray);        
        
        let win = 0;
        let lose = 0;
        let draw = 0;        

        foundPlayerArray.forEach(el => {
          const numPlayerTeam = Number(this.getKeyByValue(el, player).slice(1,2));         
          const numPlayerTeamPosition = Number(this.getKeyByValue(el, player).slice(3,4));    

          const playerPosition = el[`t${numPlayerTeam}p${numPlayerTeamPosition}name`];

          for(let i = 1; i < 8; i++){
            const restOfTeam = el[`t${numPlayerTeam}p${(i == numPlayerTeamPosition) ? 'continue' : i}name`];           
            if(restOfTeam != (undefined || '')){
              this.mostOftenPlayed.push(restOfTeam);
            }
          }               

          const numOpponentTeam = (numPlayerTeam === 1) ? 2 : 1;

          const numPlayerTeamWon = Number(el[`t${numPlayerTeam}roundswon`]);
          const numOpponentTeamWon = Number(el[`t${numOpponentTeam}roundswon`]);

          if(numPlayerTeamWon > numOpponentTeamWon) {
            win++;
          } else if(numPlayerTeamWon < numOpponentTeamWon){
            lose++;
          } else {
            draw++;
          }              
        });
        
        resultPerPlayer.push(win, lose, draw);

        // console.log('mostOftenPlayed', mostOftenPlayed.filter(n => n)); 
        const mostOftenPlayedFilter = this.mostOftenPlayed.filter(n => n);
        // console.log('mostOftenPlayedFilter', mostOftenPlayedFilter);

        const count = {};

        for (const element of mostOftenPlayedFilter) {
          if (count[element]) {           
            count[element] += 1;
          } else {
            count[element] = 1;
          }
        }

        let keys = Object.keys(count); 
      
        keys.sort(function(a, b) { return count[a] - count[b] });

        const sorttedCount = this.publicsortObjectbyValue(count);
        const sorttedCountArr = Object.entries(sorttedCount);
        const countPlayers = this.get3TopItems(Object.entries(count)); 

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
          if (el.username === player) {
            playerName = el.playername;
            warCount = el.warcount;
            nationality = el.nationality;
            ranking = el.ranking;
            clanHistory = el.clanhistory;
            s1wars = el.s1wars;
            s1fpw = el.s1fpw;
            place = el.place;
          }
        });    
       
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
          win: win,
          lose: lose,
          draw: draw,  
          winPercentage: (win/(win + lose + draw)*100),       
          losePercentage: (lose/(win + lose + draw)*100),       
          drawPercentage: (draw/(win + lose + draw)*100),
          resultPerPlayer: resultPerPlayer,    
          mostOftenPlayed: sorttedCountArr,      
          mostOftenPlayed1: { c: sorttedCountArr[0], n: sorttedCountArr[0]},
          mostOftenPlayed2: { c: sorttedCountArr[1], n: sorttedCountArr[1]},
          mostOftenPlayed3: { c: sorttedCountArr[2], n: sorttedCountArr[2]},
          s1wars: s1wars,
          s1fpw: s1fpw,
          active: (active == 'FALSE') ? false : true,
          place: place
        }  
        // console.log('playerCard', playerCard);
        
        return playerCard;
      })
    )  
  } 

  clickEvent(){
    this.status = !this.status;    
    const playerWith = document.querySelector('.playedWith');
    const moreDiv = document.querySelector('.open');
    
    if(this.status){    
      playerWith.classList.add('success');
      playerWith.classList.remove('danger');     
    } else {
      playerWith.classList.remove('success')
      playerWith.classList.add('danger');     
    }
  }

  public getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  private filterUsername(name:string, inactive:string, matches:any[]){ 
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
        annotation: {
          drawTime: 'afterDatasetsDraw',
          annotations: [
            {
              id: 'hline1',
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.avarageWarsPerMonth(frags),
              borderColor: 'red',
              borderDash: [10, 5],
              label: {
                backgroundColor: 'red',
                content: 'Avg. ' + this.avarageWarsPerMonth(frags).toFixed(2) + ' frags per war.',
                enabled: true,
              },
            },
          ]
        }, 
        // display:true
      } as ChartOptions,
      plugins: [ChartAnnotation]
    });
  } 

  public showResult(resultPerPlayer:any[]){
    this.resultCanvas = document.getElementById('playerResult');            
    this.ctxResult = this.resultCanvas.getContext('2d');   
    new Chart(this.ctxResult, {
      type: 'bar',
      data: {
        labels: ['Win', 'Lose', 'Draw'],
        datasets: [{
          label: 'War',
          data: resultPerPlayer,
          backgroundColor: ["rgba(11,156,49,0.6)", "rgba(255,0,0,0.6)", "rgba(239, 239, 240, 0.6)"],                  
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
        plugins: {
          
        }
        // display:true
      }, 
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
        annotation: {
          drawTime: 'afterDatasetsDraw',
          annotations: [
            {
              id: 'hline1',
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: 1000,
              borderColor: 'red',
              borderDash: [10, 5],
              label: {
                backgroundColor: 'red',
                content: '1000pc',
                enabled: true,
              },
            },
          ]
        },       
        legend: {
          display: false
        },
        responsive: true,
        // display:true
      } as ChartOptions,
      plugins: [ChartAnnotation]
    });
  }  

  public avarageWarsPerMonth(obj:any){
    return obj.reduce((a:any, b:any) => a + b) / obj.length;
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

  public get3TopItems(arr:any[]) {
    return arr.sort((a, b) => b - a).slice(0, 3);
  }

  public getDisplayName(name:string, actRanking: any, inRanking: any){

    const activeANDinactive = combineLatest(actRanking, inRanking).pipe(
      map(([active, inactive]) => {
        let activeInactive: any;
        // console.log('active', active);
        // console.log('inactive', inactive);
      })
    );

    return activeANDinactive;
    actRanking.filter((active:string) => {
      if(active != null || undefined || ''){
        return Object.values(active).includes(name);
      } 
    });

    inRanking.filter((inactive:string) => {
      if(inactive != null || undefined || ''){
        return Object.values(inactive).includes(name)
      }
    })
  }

  public publicsortObjectbyValue(obj={},asc=true){ 
    const ret = {};
    Object.keys(obj).sort((a,b) => obj[asc?b:a]-obj[asc?a:b]).forEach(s => ret[s] = obj[s]);
    return ret
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

