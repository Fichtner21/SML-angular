import { map, mergeAll, flatMap, withLatestFrom, tap } from 'rxjs/operators';
import { PlayersApiService } from './../services/players-api.service';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { RankObjService } from './rank-obj.service';
import { Players } from './ranking.model';
import { GetflagService } from '../services/getflag.service';
import { MatchesApiService } from '../services/matches-api.service';
import { Matches } from '../history-obj/matches.model';
import { Spinkit } from 'ng-http-loader';
import { stringify } from '@angular/compiler/src/util';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-ranking-obj',
  templateUrl: './ranking-obj.component.html',
  styleUrls: ['./ranking-obj.component.scss']
})
export class RankingObjComponent implements OnInit {
  public spinkit = Spinkit;
  players$: Observable<Players[]>;
  nat: string;
  randomAct:string;  
  public playersRow: any;
  public lastWarOfPlayer$: any;  
  booleanVar = false;
  booleanVarRank = false;
  booleanVarFpW = false; 

  public playersTest$: Observable<any>;
  public historyMatches$: Observable<any>;
  
  constructor(
    private rankObjService: RankObjService,
    private playersApiService: PlayersApiService,
    private matchesApiService: MatchesApiService,
    private translateService: TranslateService
    ) { } 

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

    this.lastWarOfPlayer$ = combineLatest([this.playersTest$, this.historyMatches$]).pipe(
      map(([v1, v2]) => {
        
        let lastWarDate: any;
        let playerRowArray: any[] = [];
        for( let name of v1){          
          const foundPlayerArray = this.filterUsername(name.username, v2);
                           
          const strikeResults1 = foundPlayerArray.slice(-1)[0] ? foundPlayerArray.slice(-1)[0] : 0;          
          const strikeResults2 = foundPlayerArray.slice(-2)[0] ? foundPlayerArray.slice(-2)[0] : 0;              
          const strikesArrayToCompare = [];

          const destructObj1 = Object.values(strikeResults1);          
          destructObj1.forEach((el, i) => {
            if(el === name.username){
              strikesArrayToCompare.push(destructObj1[i + 3])
            }
          })

          const destructObj2 = Object.values(strikeResults2);
          destructObj2.forEach((el, i) => {
            if(el === name.username){
              strikesArrayToCompare.push(destructObj2[i + 3])
            }
          })

          const resultCompareArr = strikesArrayToCompare.map((x) => {
            return Math.round(x * 100) / 100;
          });         

          const resultCompare = resultCompareArr[0] - resultCompareArr[1];
         
          let finalStreak = resultCompare.toFixed(2);         

          if(Number(finalStreak) > 0){
            finalStreak = `+${finalStreak}`
          }

          // Frags
          const fragsPerPlayerArray:any[] = [];
          
          foundPlayerArray.forEach((el) => {            
            const destructObjPlayers1 = Object.values(el);
            destructObjPlayers1.forEach((item:any[], i) => {
              if(item.includes(name.username) ){
                fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2] ? Number(destructObjPlayers1[i + 2]) : 0));
              }
            })
          }) 
          
          let fragsToDisplay;
          if (Array.isArray(fragsPerPlayerArray) && fragsPerPlayerArray.length > 0) {
           
            fragsToDisplay = fragsPerPlayerArray.reduce((a, b) => a + b);
          } else {
            fragsToDisplay = '0';
          }                 
          
          lastWarDate = {
            lastWarDate:this.findPlayerLastWar(name.username, v2),
            username:name.username,
            playername:name.playername,
            cup:this.addTitleCup(name.cup1on1edition1),
            ranking:parseFloat(name.ranking.replace(/,/g,'')),
            wars:name.warcount,
            flag:name.nationality,          
            strike: this.smallStrike2(name.username, v2),
            fragsperwar: (fragsToDisplay / name.warcount).toFixed(2) != 'NaN' ? (fragsToDisplay / name.warcount).toFixed(2) : '0',
            maxfragsperwar: Math.max(...fragsPerPlayerArray) ? Math.max(...fragsPerPlayerArray) : '0',
            minfragsperwar: Math.min(...fragsPerPlayerArray) ? Math.min(...fragsPerPlayerArray) : '0',
            activity: this.searchPlayerActivity(name.username, v2), 
            lastyear: this.pastYearActivity(name.username, v2),
            meeting: name.meeting 
          };
          playerRowArray.push(lastWarDate);          
        }     
      
        return playerRowArray;         
      })
    )   

    this.players$ = this.rankObjService.fetchPlayers();    
  }  

  private filterUsername(name:string, matches:any[]){
    return matches.filter(m => {             
      return Object.values(m).includes(name);
     })
  } 

  public searchPlayerActivity(name:string, obj:any){
    const resultObject = this.filterUsername(name, obj)
    const warDates = [];

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
        // new Date(elWar).toLocaleDateString('pl-PL', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'});
        // console.log('lastMonthActivity: ', lastMonthActivity);
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

  public getPlayerFlag(playerFlag) {
    let flag = '';
    switch (playerFlag) {
      case 'EU': {
        flag = 'EU';
        break;
      }
      case 'PL': {
        flag = '<img [src]="/assets/images/flags/PL.gif" title="Poland">';
        break;
      }
      case 'EG': {
        flag = `<img src="/assets/flags/EG.gif" title="Egypt">`;
        break;
      }
      case 'NL': {
        flag = `<img src="/assets/flags/nl.gif" title="Netherlands">`;
        break;
      }
      case 'RU': {
        flag = `<img src="/assets/flags/RU.gif" title="Russia">`;
        break;
      }
      case 'RO': {
        flag = `<img src="/assets/flags/ro.gif" title="Romania">`;
        break;
      }
      case 'FR': {
        flag = `<img src="/assets/flags/fr.gif" title="France">`;
        break;
      }
      case 'UK': {
        flag = `<img src="/assets/flags/uk.gif" title"United Kingdom">`;
        break;
      }
      case 'BE': {
        flag = `<img src="/assets/flags/be.gif" title="Belgium">`;
        break;
      }
      case 'GR': {
        flag = `<img src="/assets/flags/gr.gif" title="Greece">`;
        break;
      }
      case 'DE': {
        flag = `<img src="/assets/flags/de.gif" title="Germany">`;
        break;
      }
      case 'ES': {
        flag = `<img src="/assets/flags/es.gif" title="Spain">`;
        break;
      }
      case 'PT': {
        flag = `<img src="/assets/flags/pt.gif" title="Portugal">`;
        break;
      }
      case 'FI': {
        flag = `<img src="/assets/flags/fi.gif" title="Finland">`;
        break;
      }
      case 'AM': {
        flag = `<img src="/assets/flags/am.gif" title="Armenia">`;
        break;
      }
      case 'SE': {
        flag = `<img src="/assets/flags/se.gif" title="Sweden">`;
        break;
      }
      default:
      // console.log('Nie pasuje');
    }
    return flag;
  }

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

  public getIndexesRanks2(arr, val) {
    const indexes = [];
    let i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
      indexes.push(i + 4); // postELO
    }
    return indexes;
  }

  public getIndexesFrags2(arr, val) {
    const indexes = [];
    let i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
      indexes.push(i + 3); // frags
    }
    return indexes;
  }

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

  public rankHistory2(name, obj) {
    const arrNameRanks2 = [];
    this.destructObjRanks2(obj, arrNameRanks2);
    const indexesRanksName2 = this.getIndexesRanks2(arrNameRanks2, name);
    const nameRanksOut2 = [];
    this.ranksAllStrikes2(name, indexesRanksName2, arrNameRanks2, nameRanksOut2);
    nameRanksOut2.unshift(1000);
    return nameRanksOut2;
  }

  public sumOfFrags2(name, obj) {
    const arrNameFrags2 = [];
    this.destructObjRanks2(obj, arrNameFrags2);
    // const arrNameFrags2 = this.destructObjRanks2(obj);
    const indexesFragsName2 = this.getIndexesFrags2(arrNameFrags2, name);
    const nameFragsOut2 = [];
    this.ranksAllStrikes2(name, indexesFragsName2, arrNameFrags2, nameFragsOut2);
    let nameFragsOutExist2;
    if (Array.isArray(nameFragsOut2) && nameFragsOut2.length) {
      nameFragsOutExist2 = nameFragsOut2.reduce((a, b) => a + b);
    } else {
      nameFragsOutExist2 = 0;
    }
    return nameFragsOutExist2;
  }

  public minMaxFrags2(name, obj) {
    const arrNameFrags2 = [];
    this.destructObjRanks2(obj, arrNameFrags2);
    const indexesFragsName2 = this.getIndexesFrags2(arrNameFrags2, name);
    const nameFragsOut2 = [];
    this.ranksAllStrikes2(name, indexesFragsName2, arrNameFrags2, nameFragsOut2);
    nameFragsOut2.unshift(0);
    return nameFragsOut2;
  }

  public minFrags(name, obj) {
    const arrNameFrags2 = [];
    this.destructObjRanks2(obj, arrNameFrags2);
    const indexesFragsName2 = this.getIndexesFrags2(arrNameFrags2, name);
    const nameFragsOut2 = [];
    this.ranksAllStrikes2(name, indexesFragsName2, arrNameFrags2, nameFragsOut2);
    return nameFragsOut2;
  }

  public countWars(name, obj) {
    const playerWarsObj = [];
    const playerRankHistory2 = this.rankHistory2(name, obj);
    playerRankHistory2.forEach((war, index) => {
      playerWarsObj.push(index);
    });
    return playerWarsObj;
  }

  public getNumOfPlayers(obj) {
    // return obj.length;
    return Object.keys(obj).length;
  }

  public searchPlayerKeyName2(name, obj) {
    const searchPlayerKeyNameArr = [];
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].t1p1name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p2name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p3name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p4name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p5name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p6name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t1p7name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p1name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p2name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p3name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p4name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p5name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p6name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      } else if (obj[i].t2p7name === name) {
        searchPlayerKeyNameArr.push(obj[i]);
      }
    }
    return searchPlayerKeyNameArr;
  }

  public searchPlayerActivity2(name, obj) {
    const resultObject = this.searchPlayerKeyName2(name, obj);
    const warDates = [];
    resultObject.forEach((elem) => {
      const newTimestampElem = elem.timestamp;
      warDates.push(newTimestampElem);
    });

    warDates.unshift(0);
    return warDates;
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

  public pastMonthActivity2(name, obj) {
    const playerDates = this.searchPlayerActivity2(name, obj);

    const todayUnix = Date.now();
    const lastMonthEvent = new Date(new Date().setDate(new Date().getDate() - 30));
    
    const resultLastMonth = Date.parse(lastMonthEvent.toDateString());
    
    const unixArr = [];
    

    playerDates.forEach((el) => {
      const elWar = Date.parse(el);
      let lastMonthActivity = '';
      let lastYearActivity = '';

      if (elWar > resultLastMonth && elWar < todayUnix) {
        lastMonthActivity += elWar;
        unixArr.push(lastMonthActivity);
      } else {
        // console.log('nie ma takich dat');
      }
    });

    let actSquare = '';
    if (unixArr.length === 0) {
      actSquare = `<div class="green0" title="${unixArr.length} wars in last month. "></div>`; 
    } else if (unixArr.length > 0 && unixArr.length <= 5) {
      actSquare = `<div class="green1_5" title="${unixArr.length} wars in last month."></div>`;
    } else if (unixArr.length > 5 && unixArr.length <= 10) {
      actSquare = `<div class="green6_10" title="${unixArr.length} wars in last month."></div>`;
    } else if (unixArr.length > 10 && unixArr.length <= 20) {
      actSquare = `<div class="green11_20" title="${unixArr.length} wars in last month."></div>`;
    } else if (unixArr.length > 20 && unixArr.length <= 50) {
      actSquare = `<div class="green21_50" title="${unixArr.length} wars in last month."></div>`;
    } else if (unixArr.length > 50 && unixArr.length <= 79) {
      actSquare = `<div class="green51_100" title="${unixArr.length} wars in last month."></div>`;
    } else if (unixArr.length > 79) {
      actSquare = `<div class="green101" title="${unixArr.length} wars in last month."></div>`;
    } else {
      // console.log('reszta ma inne niz 0');
    }
    return actSquare;
  }

  public searchPlayer2(name, obj) {
    const resultObject = this.searchPlayerKeyName2(name, obj);
    const warDates = [];
    resultObject.forEach((elem) => {
      const oldTimestampElem = elem.timestamp;
      const newTimestampElem = new Date(oldTimestampElem).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });

      warDates.push(newTimestampElem);
    });

    warDates.unshift(0);
    return warDates;
  }

  public searchPlayerWars2(name, obj) {
    // Date.prototype.removeHours = function (h) {
    //   this.setHours(this.getHours() - h);
    //   return this;
    // };
    const resultObject = this.searchPlayerKeyName2(name, obj);
    const warIDs = [];

    resultObject.forEach((elem) => {
      warIDs.push(elem);
    });

    const linkWars = [];
    warIDs.forEach((el) => {
      const squads = `<div><h2>Squads</h2><div>${el.t1p1name ? el.t1p1name : ''}<div><div>${
        el.t2p1name ? el.t2p1name : ''
      }</div></div></div>`;
      const oldTimestampEl = el.timestamp;
      const newTimestampEl = new Date(oldTimestampEl).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });

      let linkWar = '';
      linkWar = `<a href="#match-${el.idwar}" data-title="Show war #${el.idwar} - ${newTimestampEl}"><span>#</span>${el.idwar}</a>`;
      linkWars.push(linkWar);
    });

    const showIDwars = linkWars.join(', ');

    return showIDwars;
  }

  public sortByWarsDesc(res:Observable<any>){      
    this.booleanVar = !this.booleanVar;    
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(b.wars) - Number(a.wars))
      )
    )       
  }

  public sortByWarsAsc(res:Observable<any>){  
    this.booleanVar = !this.booleanVar;     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(a.wars) - Number(b.wars))
      )
    )       
  }

  public sortByRankingDesc(res:Observable<any>){ 
    this.booleanVarRank = !this.booleanVarRank;     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
      )
    )       
  }

  public sortByRankingAsc(res:Observable<any>){   
    this.booleanVarRank = !this.booleanVarRank;     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
      )
    )       
  }

  public sortByFpWDesc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
      )
    )       
  }

  public sortByFpWAsc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
      )
    )       
  }
}
