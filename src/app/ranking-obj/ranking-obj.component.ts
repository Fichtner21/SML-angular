import { map, last,toArray, takeLast, reduce } from 'rxjs/operators';
import { PlayersApiService } from './../services/players-api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Players } from './ranking.model';
import { Spinkit } from 'ng-http-loader';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { fa1, fa2, fa3, faArrowDown, faArrowUp, faCalendarCheck, faChartGantt, faChartSimple, faDollarSign, faMinus, faSuitcaseMedical, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { OAuthService } from 'angular-oauth2-oidc';
import { parseFloat } from 'core-js/es/number';
import { RankObjService } from './rank-obj.service';
interface Streak {
  streakName: string; // 'W', 'D' lub 'L'
  streakCount: number;
}

@Component({
  selector: 'app-ranking-obj',
  templateUrl: './ranking-obj.component.html',
  styleUrls: ['./ranking-obj.component.scss']
})
export class RankingObjComponent implements OnInit {
  receivedData: number;
  public spinkit = Spinkit;
  players$: Observable<Players[]>;
  nat: string;
  randomAct:string;
  public playersRow: any;
  public lastWarOfPlayer$: any;
  booleanVar = false;
  booleanVarRank = false;
  booleanVarFpW = false;
  booleanVarS1Wars = false;
  booleanVarS1Fpw = false;
  aaa = [];

  public playersTest$: Observable<any>;
  public playersTest2$: Observable<any>;
  public historyMatches$: Observable<any>;
  public lastMatch$: Observable<any>;

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
  infoCode = localStorage.getItem('info') ? localStorage.getItem('info') : 'more';

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
  isExpanded: boolean;
  isSecondPanelExpanded: boolean;
  isThirdPanelExpanded: boolean;
  isExpandedLeft: boolean;
  isSecondPanelExpandedLeft: boolean;
  isThirdPanelExpandedLeft: boolean;
  matchRow:any;

  // playerDetail: any;

  constructor(private playersApiService: PlayersApiService, public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute, private rankObjService: RankObjService) {
    // localStorage.setItem('info', 'less');
   }

  infos = [
    { 'infoCode': 'less', 'infoName': 'Less' },
    { 'infoCode': 'more', 'infoName': 'More' },
  ]

  ngOnInit(): void {

    this.playersTest$ = this.playersApiService.getPlayers('Players').pipe(
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

    this.playersTest$.subscribe(data => {
      this.options = data;
      }
    )

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

    this.lastMatch$ = this.historyMatches$.pipe(
      map(array => array[array.length - 1])
    );

    // this.lastMatch$.subscribe(lastElement => console.log('Last Element:', lastElement));

    this.lastMatch$.pipe(

      map((match) => {
        const sumPreeloTeam1 = [
          (Number(match.t1p1preelo) ? Number(match.t1p1preelo) : 0) +
          (Number(match.t1p2preelo) ? Number(match.t1p2preelo) : 0) +
          (Number(match.t1p3preelo) ? Number(match.t1p3preelo) : 0) +
          (Number(match.t1p4preelo) ? Number(match.t1p4preelo) : 0) +
          (Number(match.t1p5preelo) ? Number(match.t1p5preelo) : 0) +
          (Number(match.t1p6preelo) ? Number(match.t1p6preelo) : 0) +
          (Number(match.t1p7preelo) ? Number(match.t1p7preelo) : 0)
        ].reduce(this.addPreelo, 0);

        const sumPreeloTeam2 = [
          (Number(match.t2p1preelo) ? Number(match.t2p1preelo) : 0) +
          (Number(match.t2p2preelo) ? Number(match.t2p2preelo) : 0) +
          (Number(match.t2p3preelo) ? Number(match.t2p3preelo) : 0) +
          (Number(match.t2p4preelo) ? Number(match.t2p4preelo) : 0) +
          (Number(match.t2p5preelo) ? Number(match.t2p5preelo) : 0) +
          (Number(match.t2p6preelo) ? Number(match.t2p6preelo) : 0) +
          (Number(match.t2p7preelo) ? Number(match.t2p7preelo) : 0)
        ].reduce(this.addPreelo, 0);
        // console.log('THIS.OPTIONS', this.options)
        // console.log('MATCH', match)

        this.matchRow = {
          timestamp: match.timestamp,
          idwar: match.idwar,
          t1roundswon: match.t1roundswon,
          t2roundswon: match.t2roundswon,
          video: match.video,
          info: match.info,
          t1preelo: sumPreeloTeam1,
          t2preelo: sumPreeloTeam2,
          t1chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[0].toFixed(2)),
          t2chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[1].toFixed(2)),
          t1p1playername: this.addPlayerLink(match.t1p1name, this.options),
          t1p1username: match.t1p1name,
          t1p1preelo: match.t1p1preelo,
          t1p1score: match.t1p1score,
          t1p1postelo: match.t1p1postelo,
          t1p2playername: this.addPlayerLink(match.t1p2name, this.options),
          t1p2username: match.t1p2name,
          t1p2preelo: match.t1p2preelo,
          t1p2score: match.t1p2score,
          t1p2postelo: match.t1p2postelo,
          t1p3playername: this.addPlayerLink(match.t1p3name, this.options),
          t1p3username: match.t1p3name,
          t1p3preelo: match.t1p3preelo,
          t1p3score: match.t1p3score,
          t1p3postelo: match.t1p3postelo,
          t1p4playername: this.addPlayerLink(match.t1p4name, this.options),
          t1p4username: match.t1p4name,
          t1p4preelo: match.t1p4preelo,
          t1p4score: match.t1p4score,
          t1p4postelo: match.t1p4postelo,
          t1p5playername: this.addPlayerLink(match.t1p5name, this.options),
          t1p5username: match.t1p5name,
          t1p5preelo: match.t1p5preelo,
          t1p5score: match.t1p5score,
          t1p5postelo: match.t1p5postelo,
          t1p6playername: this.addPlayerLink(match.t1p6name, this.options),
          t1p6username: match.t1p6name,
          t1p6preelo: match.t1p6preelo,
          t1p6score: match.t1p6score,
          t1p6postelo: match.t1p6postelo,
          t1p7playername: this.addPlayerLink(match.t1p7name, this.options),
          t1p7username: match.t1p7name,
          t1p7preelo: match.t1p7preelo,
          t1p7score: match.t1p7score,
          t1p7postelo: match.t1p7postelo,
          t2p1playername: this.addPlayerLink(match.t2p1name, this.options),
          t2p1username: match.t2p1name,
          t2p1preelo: match.t2p1preelo,
          t2p1score: match.t2p1score,
          t2p1postelo: match.t2p1postelo,
          t2p2playername: this.addPlayerLink(match.t2p2name, this.options),
          t2p2username: match.t2p2name,
          t2p2preelo: match.t2p2preelo,
          t2p2score: match.t2p2score,
          t2p2postelo: match.t2p2postelo,
          t2p3playername: this.addPlayerLink(match.t2p3name, this.options),
          t2p3username: match.t2p3name,
          t2p3preelo: match.t2p3preelo,
          t2p3score: match.t2p3score,
          t2p3postelo: match.t2p3postelo,
          t2p4playername: this.addPlayerLink(match.t2p4name, this.options),
          t2p4username: match.t2p4name,
          t2p4preelo: match.t2p4preelo,
          t2p4score: match.t2p4score,
          t2p4postelo: match.t2p4postelo,
          t2p5playername: this.addPlayerLink(match.t2p5name, this.options),
          t2p5username: match.t2p5name,
          t2p5preelo: match.t2p5preelo,
          t2p5score: match.t2p5score,
          t2p5postelo: match.t2p5postelo,
          t2p6playername: this.addPlayerLink(match.t2p6name, this.options),
          t2p6username: match.t2p6name,
          t2p6preelo: match.t2p6preelo,
          t2p6score: match.t2p6score,
          t2p6postelo: match.t2p6postelo,
          t2p7playername: this.addPlayerLink(match.t2p7name, this.options),
          t2p7username: match.t2p7name,
          t2p7preelo: match.t2p7preelo,
          t2p7score: match.t2p7score,
          t2p7postelo: match.t2p7postelo,
        }
        // console.log('THIS.match row', this.matchRow)
        return this.matchRow;
      })

    ).subscribe();


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

    //     // Przekształć timestamp na format daty
    //     historyMatches.forEach((match) => {
    //       match['timestamp'] = new Date(match['timestamp']);
    //     });

    //     return historyMatches;
    //   }),
    //   // Opcjonalnie, jeśli potrzebujesz sortowania meczów wg daty
    //   map((historyMatches: any[]) => historyMatches.sort((a, b) => a['timestamp'] - b['timestamp'])),
    // );

    // const selectedDate = new Date('1/31/2021 14:29:13');

    // // W tej funkcji filtrujemy mecze, które mają datę wcześniejszą lub równą selectedDate
    // this.historyMatches$ = this.historyMatches$.pipe(
    //   map((historyMatches: any[]) => historyMatches.filter(match => match['timestamp'] <= selectedDate))
    // );

    this.lastWarOfPlayer$ = combineLatest([this.playersTest$, this.historyMatches$]).pipe(
      map(([v1, v2, ]) => {
        let lastWarDate: any;
        let playerRowArray: any[] = [];
        for( let name of v1){
          if(name.active == 'FALSE'){
            continue;
          } else {
            lastWarDate = {
              username:name.username,
              playername:name.playername,
              cup:this.addTitleCup(name.cup1on1edition1),
              ranking:parseFloat(name.ranking.replace(/,/g,'')),
              wars:name.warcount,
              flag:name.nationality,
              strike: name.lastwarpc,
              maxfragsperwar: name.fpwmax,
              minfragsperwar: name.fpwmin,
              s1wars: parseFloat(name.s1wars),
              s1fpw: Math.round(name.s1fpw * 100) / 100,
              s2wars: parseFloat(name.s2wars),
              s2fpw: Math.round(name.s2fpw * 100) / 100,
              s3wars: parseFloat(name.s3wars),
              s3fpw: Math.round(name.s3fpw * 100) / 100,
              s4wars: parseFloat(name.s4wars),
              s4fpw: Math.round(name.s4fpw * 100) / 100,
              activity: name.last30days,
              lastyear: name.last365days,
              meeting: name.meeting,
              lastWarDate: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
              fragsperwar: Math.round(name.fpw * 100) / 100,
              inactive: name.active == 'FALSE' ? false : true,
              ban: name.ban == 'TRUE' ? true : false,
              s1wars_win: parseInt(name.s1wars_win),
              s1fpw_win: parseInt(name.s1fpw_win),
              s1ranking_win: parseInt(name.s1ranking_win),
              s2ranking_win: parseInt(name.s2ranking_win),
              s3ranking_win: parseInt(name.s3ranking_win),
              // streak: name.streak,
              winPercentage: this.handleData(this.receivedData),
              streak: this.calculateStreak(name.username, v2),
              donatorS4: name.donate_s4
            };

            if(lastWarDate.donatorS4 == 1){
              this.donatorsSeason4.push(lastWarDate)
            }  

            playerRowArray.push(lastWarDate);
          }
        }
        // console.log('v2', v2)
        // console.log('playerRowArray1', playerRowArray[0])
        // console.log('playerRowArray2', playerRowArray[1])
        // console.log('playerRowArray3', playerRowArray[2])
        // console.log('V2', v2[v2.length - 3])
        // console.log('V2', v2[v2.length - 2])
        // console.log('V2', v2[v2.length - 1])
        // this.topThreePlayers = playerRowArray
        // .sort((a, b) => b.wars - a.wars) // Sortowanie graczy według wartości "wars" (malejąco)
        // .slice(0, 3); // Pobranie trzech graczy z najwyższymi wartościami "wars"
        return playerRowArray;
      })
    );   

    // console.log('=>', this.donatorsSeason4);

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

  // getPlayerDetailsForPlayer(username: string) {
  //   this.rankObjService.getPlayerDetail().subscribe(playerDetail => {
  //     this.playerDetail = playerDetail;

  //     // Sprawdź, czy username się zgadza
  //     if (this.playerDetail.username === username) {
  //       console.log('Player Detail:', this.playerDetail);
  //     }
  //   });
  // }

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

  public searchPlayerActivity(name:string, obj:any){
    const resultObject = this.filterUsername(name, obj);
    const todayUnix = Date.now();
    const lastMonthEvent = new Date(new Date().setDate(new Date().getDate() - 30));
    const resultLastMonth = Date.parse(lastMonthEvent.toDateString());
    const unixArr = [];

    resultObject.forEach((elem) => {
      const newTimestampElem = elem.timestamp;
      const elWar = Date.parse(newTimestampElem);
      let lastMonthActivity;

      if(elWar > resultLastMonth && elWar < todayUnix){
        lastMonthActivity += elWar;
        unixArr.push(lastMonthActivity);
      }
    });

    return unixArr.length;
  }

  public findPlayerLastWar(name:string, obj:object) {
    const findeLastWar:any = Object.values(obj)
      .filter((item) => JSON.stringify(item).includes(name))
      .pop();
    // const findeLastWar = obj.filter((item) => JSON.stringify(item).includes(name)).pop();
    let findLastTimeStamp = '';
    let newTimestampElem = '';
    if (findeLastWar) {
      findLastTimeStamp = findeLastWar.timestamp;
      newTimestampElem = new Date(findLastTimeStamp).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else if (findeLastWar === 'undefined') {
      findLastTimeStamp = 'No match';
    } else if (findeLastWar === null) {
      findLastTimeStamp = 'No match';
    } else {
      findLastTimeStamp = 'No match';
    }
    return newTimestampElem;
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

  public smallStrike2(name, obj) {
    const firstFromEnd = this.rankHistory2(name, obj).slice(-1)[0];
    // console.log('name2', name, 'secondFromEnd', firstFromEnd);
    const secondFromEnd = this.rankHistory2(name, obj).slice(-2)[0];
    // console.log('name2', name, 'secondFromEnd', secondFromEnd);
    const countingPoints = firstFromEnd - secondFromEnd;

    let littleStrike2 = 0;
    if (firstFromEnd > secondFromEnd) {
      littleStrike2 = Math.round(countingPoints * 100) / 100;
    } else if (firstFromEnd < secondFromEnd) {
      littleStrike2 = Math.round(countingPoints * 100) / 100;
    } else {
      littleStrike2 = Math.round(countingPoints * 100) / 100;
    }

    return littleStrike2;
  }

  public longestWinning(arr, n) {
    let max = 1;
    let len = 1;

    for (let i = 1; i < n; i++) {
      if (arr[i] > arr[i - 1]) {
        len++;
      } else {
        if (max < len) {
          max = len;
        }
        len = 1;
      }
    }

    if (max < len) {
      max = len;
    }
    return max;
  }

  //need to refactor
  public destructObjRanks2(obj, arr) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const objInArr = obj[key];
        for (const key2 in objInArr) {
          if (objInArr.hasOwnProperty(key2)) {
            const elemOfObj = objInArr[key2];
            arr.push(elemOfObj);
          }
        }
      }
    }
  }

  //need to refactor
  public getIndexesRanks2(arr, val) {
    const indexes = [];
    let i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
      indexes.push(i + 4); // postELO
    }
    return indexes;
  }

  //need to refactor
  public ranksAllStrikes2(username, ind, arrIn, arrOut) {
    if (arrIn.includes(username)) {
      arrIn.forEach(function (el, index) {
        index += 1;
        ind.forEach(function (founded, i) {
          if (Number(index) === Number(founded)) {
            const foundedStreak = Number(el).toFixed(2);
            arrOut.push(Number(foundedStreak));
          }
        });
      });
    }
  }

  //need to refactor
  public rankHistory2(name, obj) {
    const arrNameRanks2 = [];
    this.destructObjRanks2(obj, arrNameRanks2);
    const indexesRanksName2 = this.getIndexesRanks2(arrNameRanks2, name);
    const nameRanksOut2 = [];
    this.ranksAllStrikes2(name, indexesRanksName2, arrNameRanks2, nameRanksOut2);
    nameRanksOut2.unshift(1000);
    return nameRanksOut2;
  }

  public pastYearActivity(name:string, obj:any){
    const resultObject = this.filterUsername(name, obj);
    const warDates = [];

    const todayUnix = Date.now();
    const lastYearEvent = new Date(new Date().setDate(new Date().getDate() - 365));
    const resultLastYear = Date.parse(lastYearEvent.toDateString());
    const unixYearArr = [];

     resultObject.forEach((elem) => {
      const newTimestampElem = elem.timestamp;
      const elWar = Date.parse(newTimestampElem);
      let lastYearActivity;

      if(elWar > resultLastYear && elWar < todayUnix){
        lastYearActivity += elWar;
        // new Date(elWar).toLocaleDateString('pl-PL', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});
        // console.log('lastMonthActivity: ', lastMonthActivity);
        unixYearArr.push(lastYearActivity);
      }
    });

    return unixYearArr.length;
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
        res => res.sort((a:any,b:any) => parseFloat(b.s4wars) - parseFloat(a.s4wars))
      )
    )
  }

  public sortByS1WarsAsc(res:Observable<any>){
    this.booleanVarS1Wars = !this.booleanVarS1Wars;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Wars: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.s4wars) - parseFloat(b.s4wars))
      )
    )
  }
  public sortByS1FpwDesc(res:Observable<any>){
    this.booleanVarS1Fpw = !this.booleanVarS1Fpw;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Fpw: 'DESC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.s4fpw) - parseFloat(a.s4fpw))
      )
    )
  }

  public sortByS1FpwAsc(res:Observable<any>){
    this.booleanVarS1Fpw = !this.booleanVarS1Fpw;
    this.isRedLineAdded = false;
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByS1Fpw: 'ASC' } });
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.s4fpw) - parseFloat(b.s4fpw))
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

  // getPercentage(value: number): number {
  //   if (value >= this.brownMinValue && value <= this.brownMaxValue) {
  //     return ((value - this.brownMinValue) / (this.brownMaxValue - this.brownMinValue)) * 100;
  //   } else if (value >= this.silverMinValue && value <= this.silverMaxValue) {
  //     return ((value - this.silverMinValue) / (this.silverMaxValue - this.silverMinValue)) * 100;
  //   } else if (value >= this.goldMinValue && value <= this.goldMaxValue) {
  //     return ((value - this.goldMinValue) / (this.goldMaxValue - this.goldMinValue)) * 100;
  //   } else {
  //     return 0;
  //   }
  // }

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

  // toggleExpansion(index: number) {
  //   if (this.expandedPlayerIndexes.includes(index)) {
  //     this.expandedPlayerIndexes = this.expandedPlayerIndexes.filter(i => i !== index);
  //   } else {
  //     this.expandedPlayerIndexes.push(index);
  //   }
  // }

  // calculateStreak(username: string, historyMatches: any[]): number {
  //   let currentStreak = 0;
  //   let currentTeam = ''; // 't1' or 't2'

  //   for (let i = 0; i < historyMatches.length; i++) {
  //     const match = historyMatches[i];
  //     let foundInTeam = '';
  //     let roundsWonByTeam;
  //     let roundsWonByOpponent;

  //     for (let teamIndex = 1; teamIndex <= 2; teamIndex++) {
  //       for (let playerIndex = 1; playerIndex <= 7; playerIndex++) {
  //         const playerNameKey = `t${teamIndex}p${playerIndex}name`;

  //         if (match[playerNameKey] === username) {
  //           foundInTeam = `t${teamIndex}`;
  //           break;
  //         }
  //       }

  //       if (foundInTeam) {
  //         break;
  //       }
  //     }

  //     if (foundInTeam) {
  //       const teamKey = foundInTeam;
  //       roundsWonByTeam = parseInt(match[`${teamKey}roundswon`]);
  //       roundsWonByOpponent = parseInt(match[`${teamKey === 't1' ? 't2' : 't1'}roundswon`]);

  //       if (currentTeam !== teamKey) {
  //         currentStreak = roundsWonByTeam > roundsWonByOpponent ? 1 : -1;
  //         currentTeam = teamKey;
  //       } else {
  //         if (roundsWonByTeam > roundsWonByOpponent) {
  //           currentStreak++;
  //         } else {
  //           currentStreak--;
  //         }
  //       }
  //       // Continue searching for more matches to determine the streak
  //     }

  //     // this.aaa.push({'time': historyMatches[i].timestamp, 'playerTeam': roundsWonByTeam, 'opponentTeam': roundsWonByOpponent});
  //   }
  //   // console.log('THIS.aaa', this.aaa)
  //   debugger;
  //   return currentStreak;
  // }
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
  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }

  public addPlayerLink(player:string, obj:any) {
    let convertedPlayer = '';
    obj.forEach((el:any) => {
      if (player === el.username) {
        convertedPlayer = el.playername;
      } else if (player === '') {
        // console.log('N/A player');
      } else {
        // console.log('Something went wrong.');
      }
    });
    return convertedPlayer;
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
  
}
