import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { PlayersApiService } from './../services/players-api.service';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Players } from './ranking.model';
import { Spinkit } from 'ng-http-loader';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { fa1, fa2, fa3, faArrowDown, faArrowUp, faCalendarCheck, faCentSign, faChartGantt, faChartSimple, faDollarSign, faFire, faInfoCircle, faMinus, faSuitcaseMedical, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { parseFloat } from 'core-js/es/number';
import { Chart } from 'chart.js';
import { FormControl } from '@angular/forms';

interface Streak {
  streakName: string; // 'W', 'D' lub 'L'
  streakCount: number;
}

@Component({
  selector: 'app-ranking-obj',
  templateUrl: './ranking-obj.component.html',
  styleUrls: ['./ranking-obj.component.scss']
})
export class RankingObjComponent implements OnInit, AfterViewInit {
  @Input() playersData: any;
  receivedData: number;
  public spinkit = Spinkit;
  players$: Observable<Players[]>;
  nat: string;
  randomAct:string;
  public playersRow: any;
  public lastWarOfPlayer$: any;
  selectedOption = new FormControl('currentSeason');
  booleanVar = false;
  booleanVarRank = false;
  booleanVarFpW = false;
  booleanVarS1Wars = false;
  booleanVarS1Fpw = false;
  aaa = [];
  showInactivePlayersOnly$ = new BehaviorSubject<boolean>(false);
  showActivePlayersOnly: boolean = true;
  infoCode: string;
  private startTime: number;
  private endTime: number;

  @ViewChild('shIcon') shIcon!: ElementRef;
  @ViewChild('blackOverlay') blackOverlay!: ElementRef;

  public playersTest$: Observable<any>;
  public playersTest2$: Observable<any>;
  public historyMatches$: Observable<any>;
  public lastMatch$: Observable<any>;

  public state_s1_20_ranking$: Observable<any>;
  public state_s1_20_wars$: Observable<any>;
  public state_s4_20$: any;
  public state_s4_20_matches$: any;
  public season_31_03_2024_players$: any;
  public season_31_03_2024_matches$: any;
  public season_31_12_2023_players$: any;
  public season_31_12_2023_matches$: any;
  public season_30_09_2023_players$: any;
  public season_30_09_2023_matches$: any;
  public season_30_06_2023_players$: any;
  public season_30_06_2023_matches$: any;
  public season_31_03_2023_players$: any;
  public season_31_03_2023_matches$: any;
  public season_31_12_2022_players$: any;
  public season_31_12_2022_matches$: any;

  minValue = 100;
  maxValue = 2000;
  brownMinValue = 100;
  brownMaxValue = 499;
  silverMinValue = 500;
  silverMaxValue = 999;
  goldMinValue = 1000;
  goldMaxValue = 1500;
  startingPercentage = 25;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;
  options: any[] = [];
  donatorsSeason4: any[] = [];

  topThreePlayers: any[]
  // expandedPlayerIndexes: number[] = [];
  isRedLineAdded: boolean = true;
  showStreak: string = 'no';
  showCharts: string = 'no';

  tooltipContent: string = `
    <div>
      <p>Tekst tooltipu</p>
      <img src="assets/sh_icon.png" alt="Your Image">
      <table>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </table>
    </div>
  `;

  @Output() ranking:EventEmitter<any> = new EventEmitter();

  currentInfo: any = localStorage.getItem('info') ? localStorage.getItem('info') : 'more';
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  arrowMinus = faMinus;
  number1 = fa1;
  number2 = fa2;
  number3 = fa3;
  trophy = faTrophy;
  chartSimple = faChartSimple;
  chartGantt = faChartGantt;
  calendarCheck = faCalendarCheck;
  dolar = faDollarSign;
  medic = faSuitcaseMedical;
  cent = faCentSign;
  fire = faFire;
  infoCircle = faInfoCircle;
  isExpanded: boolean;
  isSecondPanelExpanded: boolean;
  isThirdPanelExpanded: boolean;
  isExpandedLeft: boolean;
  isSecondPanelExpandedLeft: boolean;
  isThirdPanelExpandedLeft: boolean;
  matchRow:any;
  showAllPlayers: boolean = false;
  season8 = { name: 'Season #8', startDate: '01.10.2024', endDate: '31.12.2024' };
  season7 = { name: 'Season #7', startDate: '01.07.2024', endDate: '30.09.2024' };
  season6 = { name: 'Season #6', startDate: '01.04.2024', endDate: '30.06.2024' };
  season5 = { name: 'Season #5', startDate: '01.01.2024', endDate: '31.03.2024' };
  season4 = { name: 'Season #4', startDate: '01.10.2023', endDate: '31.12.2023' };
  season3 = { name: 'Season #3', startDate: '01.07.2023', endDate: '30.09.2023' };
  season2 = { name: 'Season #2', startDate: '01.04.2023', endDate: '30.06.2023' };
  season1 = { name: 'Season #1', startDate: '01.01.2023', endDate: '31.03.2023' };
  
  constructor(private playersApiService: PlayersApiService, public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute) {}

  infos = [
    { 'infoCode': 'less', 'infoName': 'Less' },
    { 'infoCode': 'more', 'infoName': 'More' },
  ]

  ngOnInit(): void {
    this.startTime = performance.now();
    console.log('Komponent inicjowany...');

    // this.playersTest$ = this.playersApiService.getPlayers('Players').pipe(
    //   map((response: any) => {
    //     let batchRowValues = response.values;
    //     let players: any[] = [];
    //     for(let i = 1; i < batchRowValues.length; i++){
    //       const rowObject: object = {};
    //       for(let j = 0; j < batchRowValues[i].length; j++){
    //         rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //       }
    //       players.push(rowObject);
    //     }     
    //     // console.log('Players', players)   
    //     return players;
    //   }),     
    // );

    this.playersTest$ = this.playersApiService.getPlayersFinal('Players').pipe(
      shareReplay(1)
    );

    // this.playersApiService.getUserTwo().pipe(map((res: any) => console.log('RES', res))).subscribe()

    this.playersTest$.subscribe(data => {
      this.options = data;
      }
    )
    
    // this.historyMatches$ = this.playersApiService.getPlayers('Match+History').pipe(
    //   map((response: any) => {
    //     let batchRowValuesHistory = response.values;
    //     let historyMatches: any[] = [];
    //     for(let i = 1; i < batchRowValuesHistory.length; i++){
    //       const rowObject: object = {};
    //       for(let j = 0; j < batchRowValuesHistory[i].length; j++){
    //         rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
    //       }
    //       historyMatches.push(rowObject);
    //     }
    //     this.playersApiService.setHistoryMatches(historyMatches);
    //     return historyMatches;
    //   }),
    //   // shareReplay(1)
    // );

    this.historyMatches$ = this.playersApiService.getPlayersFinal('Match+History')

    // this.lastMatch$ = this.historyMatches$.pipe(
    //   map(array => array[array.length - 1])
    // );

    // this.lastMatch$.pipe(
    //   map((match) => {
    //     const calculateSumPreelo = (teamPrefix: string) => {
    //       return Array.from({ length: 7 }, (_, i) => 
    //         Number(match[`${teamPrefix}p${i + 1}preelo`]) || 0
    //       ).reduce(this.addPreelo, 0);
    //     };
    
    //     const sumPreeloTeam1 = calculateSumPreelo('t1');
    //     const sumPreeloTeam2 = calculateSumPreelo('t2');
    
    //     this.matchRow = {
    //       timestamp: match.timestamp,
    //       idwar: match.idwar,
    //       t1roundswon: match.t1roundswon,
    //       t2roundswon: match.t2roundswon,
    //       video: match.video,
    //       info: match.info,
    //       t1preelo: sumPreeloTeam1,
    //       t2preelo: sumPreeloTeam2,
    //       t1chance: Number(this.calculateChance(sumPreeloTeam1, sumPreeloTeam2)[0].toFixed(2)),
    //       t2chance: Number(this.calculateChance(sumPreeloTeam1, sumPreeloTeam2)[1].toFixed(2)),
    //     };
    
    //     for (let i = 1; i <= 7; i++) {
    //       this.matchRow[`t1p${i}playername`] = this.addPlayerLink(match[`t1p${i}name`], this.options);
    //       this.matchRow[`t1p${i}username`] = match[`t1p${i}name`];
    //       this.matchRow[`t1p${i}preelo`] = match[`t1p${i}preelo`];
    //       this.matchRow[`t1p${i}score`] = match[`t1p${i}score`];
    //       this.matchRow[`t1p${i}postelo`] = match[`t1p${i}postelo`];
    
    //       this.matchRow[`t2p${i}playername`] = this.addPlayerLink(match[`t2p${i}name`], this.options);
    //       this.matchRow[`t2p${i}username`] = match[`t2p${i}name`];
    //       this.matchRow[`t2p${i}preelo`] = match[`t2p${i}preelo`];
    //       this.matchRow[`t2p${i}score`] = match[`t2p${i}score`];
    //       this.matchRow[`t2p${i}postelo`] = match[`t2p${i}postelo`];
    //     }
    
    //     return this.matchRow;
    //   })
    // ).subscribe();

    const storedInfo = localStorage.getItem('info');
    this.infoCode = storedInfo ? storedInfo : 'less';

    const savedValue = localStorage.getItem('showCharts');
    if (savedValue) {
      this.showCharts = savedValue; // Ustawiamy wartość na wcześniej zapisaną, jeśli istnieje
    }

    const savedValueStreak = localStorage.getItem('showStreak');
    if (savedValueStreak) {
      this.showStreak = savedValueStreak; // Ustawiamy wartość na wcześniej zapisaną, jeśli istnieje
    }   

    this.lastWarOfPlayer$ = this.selectedOption.valueChanges.pipe(
      startWith('currentSeason'),    
      switchMap(option => {
        if (option === 'currentSeason') {
          return combineLatest([this.playersTest$, this.historyMatches$]);
        } else if (option === 'season7'){
          return this.loadSeasonData('30_09_2024')
        } else if (option === 'season6'){
          return this.loadSeasonData('30_06_2024');
        } else if (option === 'season5') {
          return this.loadSeasonData('31_03_2024');
        } else if (option === 'season4') {
          return this.loadSeasonData('31_12_2023');
        } else if (option === 'season3') {
          return this.loadSeasonData('30_09_2023');
        } else if (option === 'season2') {
          return this.loadSeasonData('30_06_2023');
        } else if (option === 'season1') {
          return this.loadSeasonData('31_03_2023');
        } else if (option === 'season9') {
          return this.loadSeasonData('31_12_2022');
        } else {
          return combineLatest([this.playersTest$, this.historyMatches$])
        }
      }),
      map(([v1, v2]) => {
        let lastWarDate: any;
        let playerRowArray: any[] = [];
        for( let name of v1){          
          if(name.active == 'FALSE'){          
            continue;
          } else {
            lastWarDate = {
              username: name.username,
              playername: name.playername,
              cup: this.addTitleCup(name.cup1on1edition1),
              ranking: parseFloat(name.ranking.replace(/,/g, '')),
              wars: name.warcount,
              flag: name.nationality,
              strike: name.lastwarpc,
              maxfragsperwar: name.fpwmax,
              minfragsperwar: name.fpwmin,
              s1wars: name.s1wars ? parseFloat(name.s1wars) : '',
              s1fpw: name.s1fpw ? Math.round(name.s1fpw * 100) / 100 : '',
              s2wars: name.s2wars ? parseFloat(name.s2wars) : '',
              s2fpw: name.s2fpw ? Math.round(name.s2fpw * 100) / 100 : '',
              s3wars: name.s3wars ? parseFloat(name.s3wars) : '',
              s3fpw: name.s3fpw ? Math.round(name.s3fpw * 100) / 100 : '',
              s4wars: name.s4wars ? parseFloat(name.s4wars) : '',
              s4fpw: name.s4fpw ? Math.round(name.s4fpw * 100) / 100 : '',
              s5wars: name.s5wars ? parseFloat(name.s5wars) : '',
              s5fpw: name.s5fpw ? Math.round(name.s5fpw * 100) / 100 : '',
              s6wars: name.s6wars ? parseFloat(name.s6wars) : '',
              s6fpw: name.s6fpw ? Math.round(name.s6fpw * 100) / 100 : '',
              s7wars: name.s7wars ? parseFloat(name.s7wars) : '',
              s8wars: name.s8wars ? parseFloat(name.s8wars) : '',
              s7fpw: name.s7fpw ? Math.round(name.s7fpw * 100) / 100 : '',
              s8fpw: name.s8fpw ? Math.round(name.s8fpw * 100) / 100 : '',
              s4_22wars: name.s4_22wars ? name.s4_22wars : '',
              s4_22fpw: name.s4_22fpw ? name.s4_22fpw : '',
              activity: name.last30days,
              lastyear: name.last365days,
              meeting: name.meeting,
              lastWarDate: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
              fragsperwar: Math.round(name.fpw * 100) / 100,
              inactive: name.active === 'FALSE' ? false : true,
              ban: name.ban === 'TRUE' ? true : false,
              s1wars_win: name.s1wars_win ? parseInt(name.s1wars_win) : undefined,
              s1fpw_win: name.s1fpw_win ? parseInt(name.s1fpw_win) : undefined,
              s1ranking_win: name.s1ranking_win ? parseInt(name.s1ranking_win) : undefined,
              s2ranking_win: name.s2ranking_win ? parseInt(name.s2ranking_win) : undefined,
              s3ranking_win: name.s3ranking_win ? parseInt(name.s3ranking_win) : undefined,
              s4ranking_win: name.s4ranking_win ? parseInt(name.s4ranking_win) : undefined,
              s5ranking_win: name.s5ranking_win ? parseInt(name.s5ranking_win) : undefined,
              s6ranking_win: name.s6ranking_win ? parseInt(name.s6ranking_win) : undefined,
              s7ranking_win: name.s7ranking_win ? parseInt(name.s7ranking_win) : undefined,
              winPercentage: this.handleData(this.receivedData),
              streak: this.calculateStreak(name.username, v2),
              donatorS4: name.donate_s4,
              donatorS5: name.donate_s5,
              donatorS6: name.donate_s6,
              donatorS7: name.donate_s7,
              donatorS8: name.donate_s8,
              lastMatches: [],
              last10ranking: []
            };

            for (let match of v2.slice().reverse()) { // Odwrócenie listy meczów, aby uzyskać najnowsze mecze jako pierwsze
              let playerParticipated = false; // Zmienna flagowa określająca, czy gracz uczestniczył w tym meczu
              // Iteracja przez graczy w meczu
              for(let j = 1; j <= 2; j++){
                for (let i = 1; i <= 7; i++) {
                    // Sprawdzenie, czy gracz uczestniczył w meczu
                    const playerNameField = `t${j}p${i <= 7 ? i : i - 7}name`; // Pole zawierające nazwę gracza
                    const playerPosteloField = `t${j}p${i <= 7 ? i : i - 7}postelo`;

                    if (name.username === match[playerNameField]) {
                        playerParticipated = true;
                        const playerTeamNumber = playerNameField.charAt(1);
                        const playerTeam = `t${playerTeamNumber}roundswon`;
                        const playerTeamOpponent = `t${playerTeamNumber == '1' ? '2': '1'}roundswon`;

                        const playerTeamResult = parseInt(match[playerTeam]);
                        const opponentTeamResult = parseInt(match[playerTeamOpponent]);
                        let result;
                        if (playerTeamResult > opponentTeamResult) {
                            result = 'W';
                        } else if (playerTeamResult < opponentTeamResult) {
                            result = 'L';
                        } else {
                            result = 'D';
                        }
                        let resultOfMatch;
                        resultOfMatch = `${playerTeamResult}:${opponentTeamResult}`;

                        lastWarDate.lastMatches.unshift({'result': result, 'resultOfMatch': resultOfMatch, 'id': match.idwar, 'time': match.timestamp});

                        lastWarDate.last10ranking.unshift(parseFloat(parseFloat(match[playerPosteloField]).toFixed(2)))
                        const rankingData = lastWarDate.last10ranking;
                        const minValue = Math.min(...rankingData) - 30; // Najniższa wartość danych pomniejszona o 10
                        const maxValue = Math.max(...rankingData) + 30; // Najwyższa wartość danych powiększona o 10

                        const interval = setInterval(() => {
                          const canvasId = `id-${name.username}`;
                          const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

                          if (ctx) {
                            clearInterval(interval); // Zatrzymuje sprawdzanie, gdy canvas jest dostępny

                            const myChart = new Chart(ctx, {
                              type: 'line',
                              data: {
                                labels: rankingData.map((_, index) => index === 9 ? "last" : `${rankingData.length - index}`),
                                datasets: [{
                                  label: 'Ranking',
                                  data: rankingData,
                                  fill: false,
                                  borderColor: 'rgb(75, 192, 192)',
                                  lineTension: 0,
                                  yAxisID: 'y-axis-0'
                                }]
                              },
                              options: {
                                scales: {
                                  yAxes: [
                                    {
                                      ticks: {
                                        beginAtZero: false
                                      },
                                    },
                                  ],
                                },
                                legend: {
                                  display: false
                                }
                              }
                            });
                          }
                        }, 100); // Sprawdzanie co 100ms


                        if (lastWarDate.lastMatches.length >= 10) {
                            break;
                        }
                    }
                }
            }

              if (playerParticipated && lastWarDate.lastMatches.length >= 10) {
                  break;
              }
            }

            if(lastWarDate.donatorS4 == 1){
              this.donatorsSeason4.push(lastWarDate)
            }

            playerRowArray.push(lastWarDate);
          }
        }

        // console.log('playerRowArray1', playerRowArray[0])
        // console.log('playerRowArray2', playerRowArray[1])
        // console.log('playerRowArray3', playerRowArray[2])
        // console.log('V2', v2[v2.length - 3])
        // console.log('V2', v2[v2.length - 2])
        // console.log('V2', v2[v2.length - 1])
        // this.topThreePlayers = playerRowArray
        // .sort((a, b) => b.wars - a.wars) // Sortowanie graczy według wartości "wars" (malejąco)
        // .slice(0, 3); // Pobranie trzech graczy z najwyższymi wartościami "wars"
        // console.log('playerRowArray', playerRowArray)
        return playerRowArray;
      }),
    );


    if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'DESC'){
      this.sortByWarsDesc(this.lastWarOfPlayer$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'ASC'){
      this.sortByWarsAsc(this.lastWarOfPlayer$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'DESC'){
      this.sortByRankingDesc(this.lastWarOfPlayer$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'ASC'){
      this.sortByRankingAsc(this.lastWarOfPlayer$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'DESC'){
      this.sortByFpWDesc(this.lastWarOfPlayer$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'ASC'){
      this.sortByFpWAsc(this.lastWarOfPlayer$);
    } else {
      this.router.navigate(['/obj-ranking'], { queryParams: {  } });
    }

    this.ranking.emit(this.lastWarOfPlayer$);

    // Odczytywanie stanu z Local Storage
    const panelStorageValue = localStorage.getItem('panelState');
    this.isExpanded = panelStorageValue === 'expand';

    const secondPanelStorageValue = localStorage.getItem('secondPanelState');
    this.isSecondPanelExpanded = secondPanelStorageValue === 'expand';

    const thirdPanelStorageValue = localStorage.getItem('thirdPanelState');
    this.isThirdPanelExpanded = thirdPanelStorageValue === 'expand';

    const panelStorageValueLeft = localStorage.getItem('panelStateLeft');
    this.isExpandedLeft = panelStorageValueLeft === 'expand';

    const secondPanelStorageValueLeft = localStorage.getItem('secondPanelStateLeft');
    this.isSecondPanelExpandedLeft = secondPanelStorageValueLeft === 'expand';

    const thirdPanelStorageValueLeft = localStorage.getItem('thirdPanelStateLeft');
    this.isThirdPanelExpandedLeft = thirdPanelStorageValueLeft === 'expand';
  }  

  ngAfterViewInit(): void {
    // Zakończenie pomiaru po zakończeniu renderowania widoku
    this.endTime = performance.now();
    const loadingTime = this.endTime - this.startTime;
    console.log(`Czas ładowania komponentu: ${loadingTime.toFixed(2)} ms`);
  }

  infoChange($event){
    this.currentInfo = $event;
    localStorage.setItem('info', this.currentInfo);
  }

  get isInfo(){
    let is_info = localStorage.getItem('info');
    if(is_info === 'more'){
      return true;
    }else{
      return false;
    }
  }

  private filterUsername(name:string, matches:any[]){
    return matches.filter(m => {
      return Object.values(m).includes(name);
     })
  }

  public addTitleCup(int:string) {
    let cupInfoTitle = '';
    switch (int) {
      case '1': {
        cupInfoTitle = `Winner in 1on1 CUP 1st Edition`;
        break;
      }
      case '2': {
        cupInfoTitle = `2nd place in 1on1 CUP 1st Edition`;
        break;
      }
      case '3': {
        cupInfoTitle = `3rd place in 1on1 CUP 1st Edition`;
        break;
      }
      default:
    }
    return cupInfoTitle;
  }
  
  //SORTING
  public sortByWarsDesc(res:Observable<any>){
    this.booleanVar = !this.booleanVar;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: {sortByWars: 'DESC' }});
    // console.log('this.booleanVar', this.booleanVar);
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(b.wars) - Number(a.wars))
      )
    )
  }

  public sortByWarsAsc(res:Observable<any>){
    this.booleanVar = !this.booleanVar;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByWars: 'ASC' } });
    // console.log('this.booleanVar', this.booleanVar);
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(a.wars) - Number(b.wars))
      )
    )
  }

  public sortByRankingDesc(res:Observable<any>){
    this.booleanVarRank = !this.booleanVarRank;
    this.isRedLineAdded = true;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByRanking: 'DESC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
      )
    )
  }

  public sortByRankingAsc(res:Observable<any>){
    this.booleanVarRank = !this.booleanVarRank;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByRanking: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
      )
    )
  }

  public sortByFpWDesc(res:Observable<any>){
    this.booleanVarFpW = !this.booleanVarFpW;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByFpW: 'DESC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
      )
    )
  }

  public sortByFpWAsc(res:Observable<any>){
    this.booleanVarFpW = !this.booleanVarFpW;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByFpW: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
      )
    )
  }

  public sortByS1WarsDesc(res:Observable<any>){
    this.booleanVarS1Wars = !this.booleanVarS1Wars;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Wars: 'DESC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.s8wars) - parseFloat(a.s8wars))
      )
    )
  }

  public sortByS1WarsAsc(res:Observable<any>){
    this.booleanVarS1Wars = !this.booleanVarS1Wars;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Wars: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.s8wars) - parseFloat(b.s8wars))
      )
    )
  }
  public sortByS1FpwDesc(res:Observable<any>){
    this.booleanVarS1Fpw = !this.booleanVarS1Fpw;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Fpw: 'DESC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.s8fpw) - parseFloat(a.s8fpw))
      )
    )
  }

  public sortByS1FpwAsc(res:Observable<any>){
    this.booleanVarS1Fpw = !this.booleanVarS1Fpw;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Fpw: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.s8fpw) - parseFloat(b.s8fpw))
      )
    )
  }

  getActivityColor(activity: number): string {
    if (activity == 0) {
      return '#003200';
    } else if (activity >= 1 && activity <= 5) {
      return '#050';
    } else if (activity >= 6 && activity <= 10) {
      return '#00a100';
    } else if (activity >= 11 && activity <= 20) {
      return '#8aff1a';
    } else if (activity >= 21 && activity <= 40) {
      return '#ffff00';
    } else if (activity >= 41 && activity <= 60) {
      return 'orange';
    } else if (activity >= 61 && activity <= 90) {
      return '#ff4500';
    } else {
      return '#003200';
    }
  }

  getActivityGradient(activity: number): string {
    let percentage = 0;
    if (activity >= 1 && activity <= 5) {
      percentage = ((activity - 1) / 5) * 100;
    } else if (activity >= 6 && activity <= 10) {
      percentage = ((activity - 6) / 5) * 100;
    } else if (activity >= 11 && activity <= 20) {
      percentage = ((activity - 11) / 10) * 100;
    } else if (activity >= 21 && activity <= 40) {
      percentage = ((activity - 21) / 20) * 100;
    } else if (activity >= 41 && activity <= 60) {
      percentage = ((activity - 41) / 20) * 100;
    } else if (activity >= 61 && activity <= 90) {
      percentage = ((activity - 61) / 30) * 100;
    } else if (activity > 90) {
      percentage = 100;
    }
    const color = this.getActivityColor(activity);
    return `linear-gradient(to top, ${color} ${percentage}%, gray ${percentage}%)`;
  }  

  getPercentage(value: number): number {
    if (value >= this.brownMinValue && value <= this.brownMaxValue) {
      const range = this.brownMaxValue - this.brownMinValue;
      const adjustedValue = value - this.brownMinValue;
      return this.startingPercentage + (adjustedValue / range) * (100 - this.startingPercentage);
    } else if (value >= this.silverMinValue && value <= this.silverMaxValue) {
      const range = this.silverMaxValue - this.silverMinValue;
      const adjustedValue = value - this.silverMinValue;
      return this.startingPercentage + (adjustedValue / range) * (100 - this.startingPercentage);
    } else if (value >= this.goldMinValue && value <= this.goldMaxValue) {
      const range = this.goldMaxValue - this.goldMinValue;
      const adjustedValue = value - this.goldMinValue;
      return this.startingPercentage + (adjustedValue / range) * (100 - this.startingPercentage);
    } else {
      return this.startingPercentage;
    }
  }

  getBarColor(value: number): string {
    if (value >= this.goldMinValue && value <= this.goldMaxValue) {
      return 'gold';
    } else if (value >= this.silverMinValue && value <= this.silverMaxValue) {
      return 'silver';
    } else if (value >= this.brownMinValue && value <= this.brownMaxValue) {
      return 'brown';
    }
  }

  handleData(data: number) {
    this.receivedData = data;
  }

  showPlayerData(player: any) {
    console.log("Player Data:", player);
  }
 
  calculateStreak(username: string, historyMatches: any[]): Streak {
    let currentStreak = 0;
    let streakName = '';
    let streakCount = 0;
    let currentTeam = '';

    for (let i = historyMatches.length - 1; i >= 0; i--) {
      const match = historyMatches[i];
      let foundInTeam = '';

      for (let teamIndex = 1; teamIndex <= 2; teamIndex++) {
        for (let playerIndex = 1; playerIndex <= 7; playerIndex++) {
          const playerNameKey = `t${teamIndex}p${playerIndex}name`;

          if (match[playerNameKey] === username) {
            foundInTeam = `t${teamIndex}`;
            break;
          }
        }

        if (foundInTeam) {
          break;
        }
      }

      if (foundInTeam) {
        const teamKey = foundInTeam;
        const roundsWonByTeam = parseInt(match[`${teamKey}roundswon`]);
        const roundsWonByOpponent = parseInt(match[`${teamKey === 't1' ? 't2' : 't1'}roundswon`]);

        if (currentTeam !== teamKey) {
          if (roundsWonByTeam > roundsWonByOpponent) {
            streakName = 'W';
          } else if (roundsWonByTeam < roundsWonByOpponent) {
            streakName = 'L';
          } else {
            streakName = 'D';
          }

          currentStreak = 1;
          currentTeam = teamKey;
        } else {
          if (roundsWonByTeam > roundsWonByOpponent) {
            currentStreak++;
          } else {
            currentStreak--;
          }
        }

        if (currentStreak !== 0) {
          streakCount = currentStreak;
        }
      } else {
        break; // Przerwij, jeśli gracz nie znaleziony w drużynie w danym meczu
      }
    }

    return {
      streakName,
      streakCount,
    };
  }

  togglePanel(panel: string) {
    if (panel === 'first') {
      this.isExpanded = !this.isExpanded;
      this.isSecondPanelExpanded = false; // Zamknij drugi panel
      this.isThirdPanelExpanded = false; // Zamknij trzeci panel
    } else if (panel === 'second') {
      this.isSecondPanelExpanded = !this.isSecondPanelExpanded;
      this.isExpanded = false; // Zamknij pierwszy panel
      this.isThirdPanelExpanded = false; // Zamknij trzeci panel
    } else if (panel === 'third') {
      this.isThirdPanelExpanded = !this.isThirdPanelExpanded;
      this.isExpanded = false; // Zamknij pierwszy panel
      this.isSecondPanelExpanded = false; // Zamknij drugi panel
    }

    // Zapisz stan do Local Storage
    localStorage.setItem('panelState', this.isExpanded ? 'expand' : 'collapse');
    localStorage.setItem('secondPanelState', this.isSecondPanelExpanded ? 'expand' : 'collapse');
    localStorage.setItem('thirdPanelState', this.isThirdPanelExpanded ? 'expand' : 'collapse');
  }

  toggleShowAllPlayers() {
    this.showAllPlayers = !this.showAllPlayers;
    console.log('this.showAllPlayers', this.showAllPlayers)
  }

  togglePanelLeft(panel: string) {
    if (panel === 'first-left') {
      this.isExpandedLeft = !this.isExpandedLeft;
      this.isSecondPanelExpandedLeft = false; // Zamknij drugi panel
      this.isThirdPanelExpandedLeft = false; // Zamknij trzeci panel
    } else if (panel === 'second-left') {
      this.isSecondPanelExpandedLeft = !this.isSecondPanelExpandedLeft;
      this.isExpandedLeft = false; // Zamknij pierwszy panel
      this.isThirdPanelExpandedLeft = false; // Zamknij trzeci panel
    } else if (panel === 'third-left') {
      this.isThirdPanelExpandedLeft = !this.isThirdPanelExpandedLeft;
      this.isExpandedLeft = false; // Zamknij pierwszy panel
      this.isSecondPanelExpandedLeft = false; // Zamknij drugi panel
    }

    // Zapisz stan do Local Storage
    localStorage.setItem('panelStateLeft', this.isExpandedLeft ? 'expand' : 'collapse');
    localStorage.setItem('secondPanelStateLeft', this.isSecondPanelExpandedLeft ? 'expand' : 'collapse');
    localStorage.setItem('thirdPanelStateLeft', this.isThirdPanelExpandedLeft ? 'expand' : 'collapse');
  }

  public calculateChance(team1PreElo:any, team2PreElo:any){
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((team1PreElo - team2PreElo) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((team2PreElo - team1PreElo) / 400)) * 100;

    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);

    const arrChance = [];

    arrChance.push(chanceOfWinTeamOne, chanceOfWinTeamTwo);

    return arrChance;
  }

  public floorPrecised(number:number, precision:number) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }

  public ceilPrecised(number:number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  } 

  public addPlayerLink(player: string, obj: any[]): string {
    if (player === '') {
      return ''; 
    }  
    const foundPlayer = obj.find((el: any) => player === el.username);    
    return foundPlayer ? foundPlayer.playername : ''; 
  }

  public addPreelo(accumulator:any, a:any) {
    return accumulator + a;
  }

  getTooltipText(index: number, list: any): string {
    if (index === list - 1) {
      return 'Apothecary TOP1';
    } else if (index === list - 2) {
      return 'Apothecary TOP2';
    } else if (index === list - 3) {
      return 'Apothecary TOP3';
    } else {
      return ''; // Jeśli nie ma Tooltipu dla pozostałych graczy
    }
  }

  handleClick() {
    // Pobieramy referencje do ikony i tła
    const shIcon = this.shIcon.nativeElement as HTMLElement;
    const blackOverlay = this.blackOverlay.nativeElement as HTMLElement;

    // Pokazujemy ikonę i czarne tło
    shIcon.style.display = 'block';
    blackOverlay.style.display = 'block';

    // Ustawiamy timer, który wyłączy ikonę po 5 sekundach
    setTimeout(() => {
      shIcon.style.display = 'none';
      blackOverlay.style.display = 'none';
    }, 5000);
  }

  showChartsChanged(value: string) {
    // Zapisujemy nową wartość w localStorage po zmianie wartości radiobuttona
    localStorage.setItem('showCharts', value);
  }

  showStreakChanged(value: string) {
    localStorage.setItem('showStreak', value);
  }

  onSeasonChange(option: any): void {
    // Aktualizujemy wartość wybranej opcji sezonu
    this.selectedOption = option;
  }

  getSelectedSeasonFpw(player: any): number {
    // Sprawdź wybrany sezon z dropdown i zwróć odpowiednią wartość fpw
    switch (this.selectedOption.value) {
      case 'currentSeason':
        return player.s8fpw;
      case 'season7':
        return player.s7fpw;
      case 'season6':
        return player.s6fpw;
      case 'season5':
        return player.s5fpw;
      case 'season4':
        return player.s4fpw;
      case 'season3':
        return player.s3fpw;
      case 'season2':
        return player.s2fpw;
      case 'season1':
        return player.s1fpw;
      case 'season9':
        return player.s4_22fpw;
      default:
        return player.s8fpw; // Domyślnie zwracamy wartość s8fpw
    }
  }
 
  toggleInfo() {
    const isInfo = localStorage.getItem('info');
    if (isInfo === 'more') {
      localStorage.setItem('info', 'less');
    } else {
      localStorage.setItem('info', 'more');
    }
  }

  loadSeasonData(season: string): Observable<any> {
    return combineLatest([
      this.playersApiService.getJsonSeason('Players', `../../assets/snapshots/${season}.json`),
      this.playersApiService.getJsonSeason('Match History', `../../assets/snapshots/${season}.json`)
    ]);
  }
}