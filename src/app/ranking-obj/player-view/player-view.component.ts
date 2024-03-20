import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Chart, ChartConfiguration, ChartDataSets, ChartOptions } from 'chart.js';
import {ThemePalette} from '@angular/material/core';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { DatePipe } from '@angular/common';
import { clearScreenDown } from 'readline';

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
  // @Input('tabTitle') title: string;
  // @Input() active = false;
  // @Output() dataEvent = new EventEmitter<number>();
  public player$:Observable<Players>;
  numOfPlayers$: Observable<any>;
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
  chartRank2: any;
  public chartFrags: any;
  season2players = 55;
  season2wars = 333;
  season3players = 41;
  season3wars = 215;
  season4wars = 194; // Zmienna, do której przypiszesz ilość wystąpień
  season5wars: number = 0; // Zmienna, do której przypiszesz ilość wystąpień
  currentActivePlayers: number = 0; // Zmienna, do której przypiszesz ilość aktywnych graczy
  aaa = [];
  resultCanvas: any;
  ctxResult: any;

  public dataToChartFrags: any;
  chart: Chart;
  // public resultPerPlayer = [];
  status: boolean = false;
  mostOftenPlayed = [];
  currentRanking = [];

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

  // @Input() playerDetail: any;
  // @Input() expanded: boolean;
  
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
    'ENG': 'England'
  };  

  constructor(private activatedRoute: ActivatedRoute, private playersDetail: RankObjService, private playersApiService: PlayersApiService, private elementRef: ElementRef, private router: Router, private datePipe: DatePipe, private rankObjService: RankObjService) {
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

    this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
      map((response: any) => {
        return Number(response.values[0][2]);
      })
    )    

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
        let listwars1: any[] = [];
        let listwars2: any[] = [];
        let listwars3: any[] = [];
        let listwars4: any[] = [];
        let listwars5: any[] = [];
        let rankings: any[] = [];
        let rankings2: any[] = [];
        let resultPerPlayer: any[] = [];
        let s1wars: string;
        let s1fpw: string;
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
        let s4fpw_win: number;
        let s4ranking_win: number;

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
        const matchResultsArray = [];

        
      

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

        let streak = { streakName: '', streakCount: 0 };  // Inicjalizuj zmienną serii jako obiekt
        let currentResult = '';  // Inicjalizuj bieżący wynik (wygrana, przegrana, remis)
        let previousResult = '';  // Inicjalizuj zmienną do śledzenia poprzedniego wyniku
        let stopCounting = false;  // Inicjalizuj zmienną do kontrolowania, czy należy przestać liczyć serię

        let numPlayerTeam;  // Inicjalizuj zmienną numPlayerTeam
        let firstMatchResult = ''; // Inicjalizuj zmienną do przechowania wyniku pierwszego meczu gracza
        let secondMatchResult = ''; // Inicjalizuj zmienną do przechowania wyniku drugiego meczu gracza
        let thirdMatchResult = ''; // Inicjalizuj zmienną do przechowania wyniku trzeciego meczu gracza

        const lastFiveMatches = foundPlayerArray.reverse();
        // Iteruj od końca listy meczów, aby znaleźć bieżącą serię
        for (let i = 0; i < lastFiveMatches.length; i++) {
          numPlayerTeam = Number(this.getKeyByValue(lastFiveMatches[i], player).slice(1, 2));
        
          // Odczytaj wynik drużyny, do której należy gracz
          const playerTeamRoundswon = Number(lastFiveMatches[i][`t${numPlayerTeam}roundswon`]);
        
          // Odczytaj wynik przeciwnej drużyny
          const numOpponentTeam = (numPlayerTeam === 1) ? 2 : 1;
          const opponentTeamRoundswon = Number(lastFiveMatches[i][`t${numOpponentTeam}roundswon`]);
        
          // Dodaj mecz do tablicy `aaa`
          this.aaa.push({'time': lastFiveMatches[i].timestamp, 'playerTeam': playerTeamRoundswon, 'opponentTeam': opponentTeamRoundswon});
          
          // Porównaj wyniki i określ bieżący wynik (win/lose/draw)
          if (playerTeamRoundswon > opponentTeamRoundswon) {
            currentResult = 'W';
          } else if (playerTeamRoundswon < opponentTeamRoundswon) {
            currentResult = 'L';
          } else {
            currentResult = 'D';
          }
        
          // Jeśli to pierwszy mecz gracza, zapisz jego wynik
          if (i === 0) {
            firstMatchResult = currentResult;
          }
        
          // Jeśli bieżący wynik jest taki sam jak poprzedni (czyli gracz wygrał, przegrał lub zremisował kolejny mecz), zwiększamy wartość `streakCount`
          if (currentResult === previousResult) {
            streak.streakCount++;
          } else {
            // Jeśli bieżący wynik jest inny niż poprzedni (gracz zmienił wynik meczu), ustawiamy `streakName` i resetujemy `streakCount`
            if (streak.streakCount === 0) {
              streak.streakName = currentResult;
            }
            streak.streakCount = 1;
          }
        
          // Aktualizujemy `previousResult` na bieżący wynik
          previousResult = currentResult;
        }        
        
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

            listwars1.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars2.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars3.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars4.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

            listwars5.push({idwar: Number(el.idwar), timestamp: el.timestamp, frags: fragPerWar, ranking: Math.round(rankHistory * 100) / 100})

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
          listwars1: this.filterObjects1(listwars1),
          listwars2: this.filterObjects(listwars2),
          listwars3: this.filterObjects3(listwars3),
          listwars4: this.filterObjects4(listwars4),
          listwars5: this.filterObjects5(listwars5),
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
          s4wars_win: s3wars_win ? s3wars_win : '',
          s4fpw_win: s3fpw_win ? s3fpw_win : '',
          s4ranking_win: s3ranking_win ? s3ranking_win : '',
          streak: streak,
        }
        console.log('playerCard', playerCard);

        return playerCard;
      }),     
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

  filterObjects1(list) {
    const startDate = new Date('1/1/2023 0:00:00');
    const endDate = new Date('3/31/2023 23:59');
    return list.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp > startDate && timestamp < endDate;
    });
  }
  filterObjects(list) {
    const startDate = new Date('4/1/2023 0:00:00');
    const endDate = new Date('6/30/2023 23:59');
    return list.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp > startDate && timestamp < endDate;
    });
  }
  filterObjects3(list) {
    const startDate = new Date('7/1/2023 0:00:00');
    const endDate = new Date('9/30/2023 23:59');
    return list.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp > startDate && timestamp < endDate;
    });
  }

  filterObjects4(list) {
    const startDate = new Date('10/1/2023 0:00:00');
    const endDate = new Date('12/31/2023 23:59');
    return list.filter(item => {
      const timestamp = new Date(item.timestamp);
      return timestamp > startDate && timestamp < endDate;
    });
  }

  filterObjects5(list) {
    const startDate = new Date('1/1/2024 0:00:00');
    const endDate = new Date('3/31/2024 23:59');
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
}