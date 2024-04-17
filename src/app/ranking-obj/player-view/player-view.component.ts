import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Players } from '../ranking.model';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Chart, ChartOptions } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

interface CountryCodeMap {
  [code: string]: string;
}

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlayerViewComponent implements OnInit {
  // public player$:Observable<Players>;
  public player$:Observable<any>;
  numOfPlayers$: Observable<any>;
  public errorMessage: string;
  public playerView: any;
  public playerDetail$: Observable<any>;
  public historyMatches$: Observable<any>;
  public playerUsername$: Observable<any>;
  // public playerUsername$ = new BehaviorSubject<string>('');
  public playerUsernameToCompare$: Observable<any>;
  public playersTab$: Observable<any>;
  public inactiveTab$: Observable<any>;
  canvas: any;
  ctx: any;
  isShown: Boolean = false;
  canvasRank: any;
  ctxRank: any;
  chartRank: any;
  chartRank2: any;
  public chartFrags: any;
  season2players = 55;
  season2wars = 333;
  season3players = 41;
  season3wars = 215;
  season4wars = 194;
  season5wars: number = 0;
  season6wars: number;
  currentActivePlayers: number = 0;
  aaa = [];
  resultCanvas: any;
  ctxResult: any;

  public dataToChartFrags: any;
  chart: Chart;
  status: boolean = false;
  mostOftenPlayed = [];
  currentRanking = [];
  players: any[] = [];
  // selectedPlayer: any;

  totalChartVisible: boolean = true;
  season1ChartVisible: boolean = true;
  season2ChartVisible: boolean = true;
  season3ChartVisible: boolean = true;
  season4ChartVisible: boolean = true;
  season5ChartVisible: boolean = true;
  totalFragsChartVisible: boolean = true;
  seasonFrags1ChartVisible: boolean = true;
  seasonFrags2ChartVisible: boolean = true;
  seasonFrags3ChartVisible: boolean = true;
  seasonFrags4ChartVisible: boolean = true;
  seasonFrags5ChartVisible: boolean = true;
  filteredPlayers: any[] = [];

  playerCard: any;
  private playerDetailToCompare$ = new BehaviorSubject<any>(null);
  selectedPlayer: boolean = false;

  public countryCodeMap: CountryCodeMap = {
    'AF': 'Afghanistan',
    'DZ': 'Algeria',
    'AL': 'Albania',
    'AD': 'Andorra',
    'AM': 'Armenia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BA': 'Bosnia and Herzegovina',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'CY': 'Cyprus',
    'CZ': 'Czech Republic',
    'DK': 'Denmark',
    'EE': 'Estonia',
    'FI': 'Finland',
    'FR': 'France',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GR': 'Greece',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IE': 'Ireland',
    'IT': 'Italy',
    'KZ': 'Kazakhstan',
    'XK': 'Kosovo',
    'LV': 'Latvia',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MK': 'North Macedonia',
    'MT': 'Malta',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'ME': 'Montenegro',
    'NL': 'Netherlands',
    'NO': 'Norway',
    'PL': 'Poland',
    'PT': 'Portugal',
    'RO': 'Romania',
    'RU': 'Russia',
    'SM': 'San Marino',
    'RS': 'Serbia',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'ES': 'Spain',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'UA': 'Ukraine',
    'UK': 'United Kingdom',
    'PS': 'Palestine',
    'EG': 'Egypt',
    'US': 'United States',
    'CA': 'Canada',
    'MON': 'Gay Paradise',
    'ENG': 'England',
    'BR': 'Brasil'
  };

  currentPlayer: any;

  constructor(private activatedRoute: ActivatedRoute, private playersApiService: PlayersApiService, private router: Router) {
   }

  ngOnInit(): void {

    this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
      map((response: any) => {
        this.season6wars = response.values[1][3];
        return this.season6wars;
      })
    );

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
        const startDate = new Date('1/1/2024 0:00:00');
        const endDate = new Date('3/31/2024 23:59');

        // Wykonaj filtrowanie dla przedziału dat
        const filteredMatches = this.totalWarsSeason4(historyMatches, startDate, endDate);

        // Przypisz ilość wystąpień do zmiennej s5
        // this.season4wars = filteredMatches.length;
        this.season5wars = filteredMatches.length;
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

        const activePlayers = players.filter(player => player.active === 'TRUE');

        // Oblicz ilość aktywnych graczy i przypisz wynik do zmiennej currentActivePlayers
        this.currentActivePlayers = activePlayers.length;
        // console.log('PLAYERS', players)
        this.players = players;
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

    // this.player$ = this.activatedRoute.data.pipe(
    //   map(data => data.player)
    // );

    this.playerUsername$ = this.activatedRoute.data.pipe(
      map((data) => {
        if(data.player == undefined){
          this.router.navigate(['/obj-inactive/']);
        } else {
          return data.player.username;
        }
      })
    );


    // this.activatedRoute.data.pipe(
    //   tap((data) => {
    //     if (data.player == undefined) {
    //       this.router.navigate(['/obj-inactive/']);
    //     } else {
    //       this.playerUsername$.next(data.player.username);
    //     }
    //   })
    // ).subscribe();

    // this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
    //   map((response: any) => {
    //     return Number(response.values[0][2]);
    //   })
    // )

    this.playerDetail$ = combineLatest([this.playerUsername$, this.historyMatches$, this.playersTab$, this.inactiveTab$]).pipe(
      map(([player, matches, players, inactives]) => {
        let playerArray: any[] = [];
        let timestampArray: any[] = [];
        let playerName: string;
        let warCount: string;
        let nationality: string;
        let ranking: string;
        let clanHistory: string;
        let listwars: any[] = [];
        let listwars1: any[] = [];
        let listwars2: any[] = [];
        let listwars3: any[] = [];
        let listwars4: any[] = [];
        let listwars5: any[] = [];
        let listwars6: any[] = [];
        let rankings: any[] = [];
        let resultPerPlayer: any[] = [];
        let s1wars: string;
        let s1fpw: string;
        let s2fpw: string;
        let s3fpw: string;
        let s4fpw: string;
        let s5fpw: string;
        let s6fpw: string;
        let active: string;
        let place: string;
        let ban: string;
        let banDue: string;
        let s1wars_win: number;
        let s1fpw_win: number;
        let s1ranking_win: number;
        let s2wars_win: number;
        let s2fpw_win: number;
        let s2ranking_win: number;
        let s3wars_win: number;
        let s3fpw_win: number;
        let s3ranking_win: number;
        let s4wars_win: number;
        let s4fpw_win: number;
        let s4ranking_win: number;
        let s5wars_win: number;
        let s5fpw_win: number;
        let s5ranking_win: number;

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

          // const playerPosition = el[`t${numPlayerTeam}p${numPlayerTeamPosition}name`];

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
        const mostOftenPlayedFilter = this.mostOftenPlayed.filter(n => n);
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

            listwars1.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars2.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars3.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars4.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars5.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars6.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

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
            s2fpw = el.s2fpw;
            s3fpw = el.s3fpw;
            s4fpw = el.s4fpw;
            s5fpw = el.s5fpw;
            s6fpw = el.s6fpw;
            place = el.place;
            ban = el.ban;
            banDue = el.ban_due;
            s1wars_win = el.s1wars_win,
            s1fpw_win = el.s1fpw_win,
            s1ranking_win = el.s1ranking_win,
            s2wars_win = el.s2wars_win,
            s2fpw_win = el.s2fpw_win,
            s2ranking_win = el.s2ranking_win,
            s3wars_win = el.s3wars_win,
            s3fpw_win = el.s3fpw_win,
            s3ranking_win = el.s3ranking_win,
            s4fpw_win = el.s4fpw_win,
            s4ranking_win = el.s4ranking_win,
            s5fpw_win = el.s5fpw_win,
            s5ranking_win = el.s5ranking_win,
            active = el.active
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
          listwars1: this.filterObjectsByDateRange(listwars1, new Date(2023, 0, 1), new Date(2023, 2, 31)), // Styczeń - Marzec 2023
          listwars2: this.filterObjectsByDateRange(listwars2, new Date(2023, 3, 1), new Date(2023, 5, 30)), // Kwiecień - Czerwiec 2023
          listwars3: this.filterObjectsByDateRange(listwars3, new Date(2023, 6, 1), new Date(2023, 8, 30)), // Lipiec - Wrzesień 2023
          listwars4: this.filterObjectsByDateRange(listwars4, new Date(2023, 9, 1), new Date(2023, 11, 31)), // Październik - Grudzień 2023
          listwars5: this.filterObjectsByDateRange(listwars5, new Date(2024, 0, 1), new Date(2024, 2, 31)), // Styczeń - Marzec 2024
          listwars6: this.filterObjectsByDateRange(listwars6, new Date(2024, 3, 1), new Date(2024, 5, 30)), // Kwiecień - Czerwiec 2024
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
          s1fpw: parseFloat(s1fpw),
          s2fpw: parseFloat(s2fpw),
          s3fpw: parseFloat(s3fpw),
          s4fpw: parseFloat(s4fpw),
          s5fpw: parseFloat(s5fpw),
          s6fpw: parseFloat(s6fpw),
          active: (active == 'FALSE') ? false : true,
          ban: (ban == 'FALSE') ? false : true,
          place: place !== '' ? place : '-',
          banDue: banDue,
          s1wars_win: s1wars_win ? s1wars_win : '',
          s1fpw_win: s1fpw_win ? s1fpw : '',
          s1ranking_win: s1ranking_win ? s1ranking_win : '',
          s2wars_win: s2wars_win ? s2wars_win : '',
          s2fpw_win: s2fpw_win ? s2fpw_win : '',
          s2ranking_win: s2ranking_win ? s2ranking_win : '',
          s3wars_win: s3wars_win ? s3wars_win : '',
          s3fpw_win: s3fpw_win ? s3fpw_win : '',
          s3ranking_win: s3ranking_win ? s3ranking_win : '',
          s4wars_win: s4wars_win ? s4wars_win : '',
          s4fpw_win: s4fpw_win ? s4fpw_win : '',
          s4ranking_win: s4ranking_win ? s4ranking_win : '',
          s5wars_win: s5wars_win ? s5wars_win : '',
          s5fpw_win: s5fpw_win ? s5fpw_win : '',
          s5ranking_win: s5ranking_win ? s5ranking_win : ''
        }
        console.log('playerCardNative', playerCard)
        return playerCard;
      }),
      shareReplay(1)
    )
  }

  // onPlayerClick() {
  //   this.rankObjService.setPlayerDetail(this.playerDetail);
  // }

  determineOutcome(playerTeamWon, opponentTeamWon) {
    if (playerTeamWon > opponentTeamWon) {
      return 'win';
    } else if (playerTeamWon < opponentTeamWon) {
      return 'lose';
    } else {
      return 'draw';
    }
  }

  filterObjectsByDateRange(list: any[], startDate: Date, endDate: Date) {
    return list.filter(item => {
        const timestamp = new Date(item.timestamp);
        return timestamp > startDate && timestamp < endDate;
    });
  }

  totalWarsSeason4(list: any[], startDate: Date, endDate: Date): any[] {
    return list.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp > startDate && timestamp < endDate;
    });
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

  public showFrags(frags:any[], listwars:any[], chartId: string){
    this.canvas = document.getElementById(chartId);
    if (!this.canvas) return;
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

  public showFragsSeason(listwars:any[], chartId: string){
    this.canvas = document.getElementById(chartId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const labels = listwars.map(obj => obj.idwar);
    const frags = listwars.map(obj => obj.frags);
    const rankings = listwars.map(obj => obj.ranking);
    const timestamp = listwars.map(obj => obj.timestamp);
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: labels.map(i => 'War #' + i),
          datasets: [{
              label: 'Frags in war',
              data: frags,
              backgroundColor: frags.map(function(frag, i){
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
    if (!this.resultCanvas) return;
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

  public showRanking(rankings:any[], listwars:any[], chartId: string){
    this.canvasRank = document.getElementById(chartId);
    if (!this.canvasRank) return;
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

  public showRankingSeason(listwars:any[], chartId: string){
    this.canvasRank = document.getElementById(chartId);
    if (!this.canvasRank ) return;
    this.ctxRank = this.canvasRank.getContext('2d');
    const labels = listwars.map(obj => obj.idwar);
    const frags = listwars.map(obj => obj.frags);
    const rankings = listwars.map(obj => obj.ranking);
    const timestamp = listwars.map(obj => obj.timestamp);
    let myChart = new Chart(this.ctxRank, {
      type: 'line',
      data: {
          labels: labels.map(i => '#' + i),
          datasets: [{
              label: 'Ranking',
              borderColor: '#ffffc0',
              lineTension: 0,
              order: 1,
              data: rankings,
              backgroundColor: rankings.map(function(rank, i){
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
//   public showRankingSeason(player1ListWars: any[], chartId: string, player1Name: string, player2ListWars?: any[], player2Name?: string){
//     let myChart: Chart; // Deklaracja zmiennej myChart przed użyciem

//     this.canvasRank = document.getElementById(chartId);
//     if (!this.canvasRank) return;
//     this.ctxRank = this.canvasRank.getContext('2d');

//     const player1Labels = player1ListWars.map((_, index) => '#' + (index + 1)); // użyj indeksu jako etykiety dla gracza 1
//     const player1Rankings = player1ListWars.map(obj => obj.ranking);

//     const labels = player2ListWars ?
//         player2ListWars.map((_, index) => '#' + (index + 1)) :
//         player1Labels;

//     const datasets = [
//         {
//             label: player1Name,
//             borderColor: '#ffffc0',
//             lineTension: 0,
//             order: 1,
//             data: player1Rankings,
//             backgroundColor: player1Rankings.map(function(rank, i){
//                 if(rank === Math.max(...player1Rankings)){
//                     return 'rgba(11,156,49,0.6)';
//                 }
//                 if(rank === Math.min(...player1Rankings)){
//                     return 'rgba(255,0,0,0.6)';
//                 }
//                 // return "rgba(199, 199, 199, 0.1)";
//             }),
//             borderWidth: 1
//         }
//     ];

//     if (player2ListWars && player2ListWars.length > 0) {
//         const player2Rankings = player2ListWars.map(obj => obj.ranking);

//         datasets.push({
//             label: player2Name || 'Player 2',
//             borderColor: '#ff0000',
//             lineTension: 0,
//             order: 2,
//             data: player2Rankings,
//             backgroundColor: player2Rankings.map(function(rank, i){
//                 if(rank === Math.max(...player2Rankings)){
//                     return 'rgba(11,156,49,0.6)';
//                 }
//                 if(rank === Math.min(...player2Rankings)){
//                     return 'rgba(255,0,0,0.6)';
//                 }
//                 // return "rgba(199, 199, 199, 0.1)";
//             }),
//             borderWidth: 1
//         });
//     }

//     myChart = new Chart(this.ctxRank, {
//       type: 'line',
//       data: {
//           labels: player1Labels.map(i => '#' + i),
//           datasets: datasets
//       },
//       options: {
//           // Reszta opcji
//       } as ChartOptions,
//       plugins: [ChartAnnotation]
//   });
// }




  // public showRankingSeason(listwars:any[], chartId: string){
  //   this.canvasRank = document.getElementById(chartId);
  //   if (!this.canvasRank ) return;
  //   this.ctxRank = this.canvasRank.getContext('2d');
  //   const labels = listwars.map(obj => obj.idwar);
  //   const rankings = listwars.map(obj => obj.ranking);
  //   let myChart = new Chart(this.ctxRank, {
  //     type: 'line',
  //     data: {
  //         labels: labels.map(i => '#' + i),
  //         datasets: [{
  //             label: 'Ranking',
  //             borderColor: '#ffffc0',
  //             lineTension: 0,
  //             order: 1,
  //             data: rankings,
  //             backgroundColor: rankings.map(function(rank, i){
  //               if(rankings[i] == Math.max.apply(null, rankings)){
  //                 return 'rgba(11,156,49,0.6)';
  //               }
  //               if(rankings[i] == Math.min.apply(null, rankings)){
  //                 return 'rgba(255,0,0,0.6)';
  //               }
  //               // return "rgba(199, 199, 199, 0.1)";
  //             }),
  //             borderWidth: 1
  //         }]
  //     },
  //     options: {
  //       onClick: function(c,i) {
  //         let e:any;
  //         e = i[0];
  //         console.log(e._index)
  //         var x_value = this.data.labels[e._index];
  //         var y_value = this.data.datasets[0].data[e._index];
  //         const toWarLink = x_value.substring(1);
  //         window.open(`/obj-matches/${toWarLink}`);
  //         console.log(toWarLink);
  //         console.log(y_value);
  //       },
  //       elements: {
  //         line: {
  //           tension: 0,
  //         },
  //       },
  //       annotation: {
  //         drawTime: 'afterDatasetsDraw',
  //         annotations: [
  //           {
  //             id: 'hline1',
  //             type: 'line',
  //             mode: 'horizontal',
  //             scaleID: 'y-axis-0',
  //             value: 1000,
  //             borderColor: 'red',
  //             borderDash: [10, 5],
  //             label: {
  //               backgroundColor: 'red',
  //               content: '1000pc',
  //               enabled: true,
  //             },
  //           },
  //         ]
  //       },
  //       legend: {
  //         display: false
  //       },
  //       responsive: true,

  //       // display:true
  //     } as ChartOptions,
  //     plugins: [ChartAnnotation]
  //   });
  // }

  toggleChart(chart: string) {
    switch (chart) {
      case 'totalChartVisible':
        this.totalChartVisible = !this.totalChartVisible;
        break;
      case 'season1ChartVisible':
        this.season1ChartVisible = !this.season1ChartVisible;
        break;
      case 'season2ChartVisible':
        this.season2ChartVisible = !this.season2ChartVisible;
        break;
      case 'season3ChartVisible':
        this.season3ChartVisible = !this.season3ChartVisible;
        break;
      case 'season4ChartVisible':
        this.season4ChartVisible = !this.season4ChartVisible;
        break;
      case 'season5ChartVisible':
        this.season5ChartVisible = !this.season5ChartVisible;
        break;
      case 'totalFragsChartVisible':
        this.totalChartVisible = !this.totalChartVisible;
        break;
      case 'seasonFrags1ChartVisible':
        this.season1ChartVisible = !this.season1ChartVisible;
        break;
      case 'seasonFrags2ChartVisible':
        this.season2ChartVisible = !this.season2ChartVisible;
        break;
      case 'seasonFrags3ChartVisible':
        this.season3ChartVisible = !this.season3ChartVisible;
        break;
      case 'seasonFrags4ChartVisible':
        this.season4ChartVisible = !this.season4ChartVisible;
        break;
      case 'seasonFrags5ChartVisible':
        this.season5ChartVisible = !this.season5ChartVisible;
        break;
    }
  }

  public avarageWarsPerMonth(obj:any){
    return obj.reduce((a:any, b:any) => a + b) / obj.length;
  }

  public get3TopItems(arr:any[]) {
    return arr.sort((a, b) => b - a).slice(0, 3);
  }

  public publicsortObjectbyValue(obj={},asc=true){
    const ret = {};
    Object.keys(obj).sort((a,b) => obj[asc?b:a]-obj[asc?a:b]).forEach(s => ret[s] = obj[s]);
    return ret
 }

  public getCountryName(countryCode: string): string | undefined {
    return this.countryCodeMap[countryCode] || 'Unknown Country';
  }

  onPlayerSelected() {
    // Logowanie szczegółów wybranego gracza po wyborze z dropdown
    console.log('Selected Player:', this.selectedPlayer);
  }

  filterPlayers(value: string): void {
    if (!value) {
      this.filteredPlayers = [];
      return;
    }

    const filterValue = value.toLowerCase();
    this.playersTab$.pipe(
      map(players => players.filter(player => player.playername.toLowerCase().includes(filterValue))),
      startWith([])
    ).subscribe(filteredPlayers => this.filteredPlayers = filteredPlayers);
  }

  getPlayerFields(player: any): { key: string, value: any }[] {
    const fields: { key: string, value: any }[] = [];
    for (const key in player) {
      if (Object.prototype.hasOwnProperty.call(player, key)) {
        fields.push({ key, value: player[key] });
      }
    }
    return fields;
  }

  onPlayerSelect(player: string) {
    this.selectedPlayer = true;
    combineLatest([of(player), this.historyMatches$, this.playersTab$, this.inactiveTab$]).pipe(
      map(([selectedPlayer, matches, players, inactives]) => {
        let playerArray: any[] = [];
        let timestampArray: any[] = [];
        let playerName: string;
        let warCount: string;
        let nationality: string;
        let ranking: string;
        let clanHistory: string;
        let listwars: any[] = [];
        let listwars1: any[] = [];
        let listwars2: any[] = [];
        let listwars3: any[] = [];
        let listwars4: any[] = [];
        let listwars5: any[] = [];
        let listwars6: any[] = [];
        let rankings: any[] = [];
        let resultPerPlayer: any[] = [];
        let s1wars: string;
        let s1fpw: string;
        let s2fpw: string;
        let s3fpw: string;
        let s4fpw: string;
        let s5fpw: string;
        let s6fpw: string;
        let active: string;
        let place: string;
        let ban: string;
        let banDue: string;
        let s1wars_win: number;
        let s1fpw_win: number;
        let s1ranking_win: number;
        let s2wars_win: number;
        let s2fpw_win: number;
        let s2ranking_win: number;
        let s3wars_win: number;
        let s3fpw_win: number;
        let s3ranking_win: number;
        let s4wars_win: number;
        let s4fpw_win: number;
        let s4ranking_win: number;
        let s5wars_win: number;
        let s5fpw_win: number;
        let s5ranking_win: number;

        const foundPlayerArray = this.filterUsername(selectedPlayer, inactives, matches);
        const fragsPerPlayerArray: any[] = [];

        foundPlayerArray.forEach((el) => {
          const destructObjPlayers1 = Object.values(el);
          destructObjPlayers1.forEach((item: any[], i) => {
            if (item.includes(selectedPlayer)) {
              fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2]));
            }
          })
        })

        // console.log('foundPlayerArray', foundPlayerArray);

        let win = 0;
        let lose = 0;
        let draw = 0;

        foundPlayerArray.forEach(el => {
          const numPlayerTeam = Number(this.getKeyByValue(el, selectedPlayer).slice(1, 2));
          const numPlayerTeamPosition = Number(this.getKeyByValue(el, selectedPlayer).slice(3, 4));

          for (let i = 1; i < 8; i++) {
            const restOfTeam = el[`t${numPlayerTeam}p${(i == numPlayerTeamPosition) ? 'continue' : i}name`];
            if (restOfTeam != (undefined || '')) {
              this.mostOftenPlayed.push(restOfTeam);
            }
          }

          const numOpponentTeam = (numPlayerTeam === 1) ? 2 : 1;
          const numPlayerTeamWon = Number(el[`t${numPlayerTeam}roundswon`]);
          const numOpponentTeamWon = Number(el[`t${numOpponentTeam}roundswon`]);

          if (numPlayerTeamWon > numOpponentTeamWon) {
            win++;
          } else if (numPlayerTeamWon < numOpponentTeamWon) {
            lose++;
          } else {
            draw++;
          }
        });

        resultPerPlayer.push(win, lose, draw);
        const mostOftenPlayedFilter = this.mostOftenPlayed.filter(n => n);
        const count = {};

        for (const element of mostOftenPlayedFilter) {
          if (count[element]) {
            count[element] += 1;
          } else {
            count[element] = 1;
          }
        }

        let keys = Object.keys(count);

        keys.sort(function (a, b) { return count[a] - count[b] });

        const sorttedCount = this.publicsortObjectbyValue(count);
        const sorttedCountArr = Object.entries(sorttedCount);

        matches.forEach((el) => {
          if (Object.values(el).includes(selectedPlayer)) {
            const destructObjPlayers1 = Object.values(el);
            let fragPerWar;
            let rankHistory;
            destructObjPlayers1.forEach((item: any[], index) => {
              if (item.includes(selectedPlayer)) {
                fragPerWar = Number(destructObjPlayers1[index + 2]);
                rankHistory = Number(destructObjPlayers1[index + 3]);
              }
            });

            listwars.push(Number(el.idwar));

            listwars1.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            listwars2.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            listwars3.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            listwars4.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            listwars5.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            listwars6.push({ idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100 })

            rankings.push(Math.round(rankHistory * 100) / 100);
            playerArray.push([el.idwar, el.timestamp, fragPerWar]);
            timestampArray.push(new Date(el.timestamp).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
          }
        });

        players.forEach((el) => {
          if (el.username === selectedPlayer) {
            playerName = el.playername;
            warCount = el.warcount;
            nationality = el.nationality;
            ranking = el.ranking;
            clanHistory = el.clanhistory;
            s1wars = el.s1wars;
            s1fpw = el.s1fpw;
            s2fpw = el.s2fpw;
            s3fpw = el.s3fpw;
            s4fpw = el.s4fpw;
            s5fpw = el.s5fpw;
            s6fpw = el.s6fpw;
            place = el.place;
            ban = el.ban;
            banDue = el.ban_due;
            s1wars_win = el.s1wars_win,
            s1fpw_win = el.s1fpw_win,
            s1ranking_win = el.s1ranking_win,
            s2wars_win = el.s2wars_win,
            s2fpw_win = el.s2fpw_win,
            s2ranking_win = el.s2ranking_win,
            s3wars_win = el.s3wars_win,
            s3fpw_win = el.s3fpw_win,
            s3ranking_win = el.s3ranking_win,
            s4fpw_win = el.s4fpw_win,
            s4ranking_win = el.s4ranking_win,
            s5fpw_win = el.s5fpw_win,
            s5ranking_win = el.s5ranking_win,
            active = el.active
          }
        });

        let playerCard;
        playerCard = {
          username: selectedPlayer,
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
          listwars1: this.filterObjectsByDateRange(listwars1, new Date(2023, 0, 1), new Date(2023, 2, 31)), // Styczeń - Marzec 2023
          listwars2: this.filterObjectsByDateRange(listwars2, new Date(2023, 3, 1), new Date(2023, 5, 30)), // Kwiecień - Czerwiec 2023
          listwars3: this.filterObjectsByDateRange(listwars3, new Date(2023, 6, 1), new Date(2023, 8, 30)), // Lipiec - Wrzesień 2023
          listwars4: this.filterObjectsByDateRange(listwars4, new Date(2023, 9, 1), new Date(2023, 11, 31)), // Październik - Grudzień 2023
          listwars5: this.filterObjectsByDateRange(listwars5, new Date(2024, 0, 1), new Date(2024, 2, 31)), // Styczeń - Marzec 2024
          listwars6: this.filterObjectsByDateRange(listwars6, new Date(2024, 3, 1), new Date(2024, 5, 30)), // Kwiecień - Czerwiec 2024
          win: win,
          lose: lose,
          draw: draw,
          winPercentage: (win / (win + lose + draw) * 100),
          losePercentage: (lose / (win + lose + draw) * 100),
          drawPercentage: (draw / (win + lose + draw) * 100),
          resultPerPlayer: resultPerPlayer,
          mostOftenPlayed: sorttedCountArr,
          mostOftenPlayed1: { c: sorttedCountArr[0], n: sorttedCountArr[0] },
          mostOftenPlayed2: { c: sorttedCountArr[1], n: sorttedCountArr[1] },
          mostOftenPlayed3: { c: sorttedCountArr[2], n: sorttedCountArr[2] },
          s1wars: s1wars,
          s1fpw: parseFloat(s1fpw),
          s2fpw: parseFloat(s2fpw),
          s3fpw: parseFloat(s3fpw),
          s4fpw: parseFloat(s4fpw),
          s5fpw: parseFloat(s5fpw),
          s6fpw: parseFloat(s6fpw),
          active: (active == 'FALSE') ? false : true,
          ban: (ban == 'FALSE') ? false : true,
          place: place !== '' ? place : '-',
          banDue: banDue,
          s1wars_win: s1wars_win ? s1wars_win : '',
          s1fpw_win: s1fpw_win ? s1fpw : '',
          s1ranking_win: s1ranking_win ? s1ranking_win : '',
          s2wars_win: s2wars_win ? s2wars_win : '',
          s2fpw_win: s2fpw_win ? s2fpw_win : '',
          s2ranking_win: s2ranking_win ? s2ranking_win : '',
          s3wars_win: s3wars_win ? s3wars_win : '',
          s3fpw_win: s3fpw_win ? s3fpw_win : '',
          s3ranking_win: s3ranking_win ? s3ranking_win : '',
          s4wars_win: s4wars_win ? s4wars_win : '',
          s4fpw_win: s4fpw_win ? s4fpw_win : '',
          s4ranking_win: s4ranking_win ? s4ranking_win : '',
          s5wars_win: s5wars_win ? s5wars_win : '',
          s5fpw_win: s5fpw_win ? s5fpw_win : '',
          s5ranking_win: s5ranking_win ? s5ranking_win : ''
        }
        console.log('playerCard', playerCard);
        this.playerCard = playerCard;
      }),
    ).subscribe();
  }



 // W ciele klasy lub w metodzie...
// Subskrybujemy się do strumienia playerDetailToCompare$ i dodajemy console.log
// this.playerDetailToCompare$.subscribe(playerData => {
//   console.log('playerDetailToCompare$:', playerData); // Dodajemy console.log dla playerDetailToCompare$
// });


}