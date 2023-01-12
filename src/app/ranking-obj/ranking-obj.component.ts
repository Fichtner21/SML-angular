import { map } from 'rxjs/operators';
import { PlayersApiService } from './../services/players-api.service';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Players } from './ranking.model';
import { Spinkit } from 'ng-http-loader';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

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
  public playersTest2$: Observable<any>;
  public historyMatches$: Observable<any>;

  currentInfo: any = localStorage.getItem('info') ? localStorage.getItem('info') : 'more';  
  infoCode = localStorage.getItem('info') ? localStorage.getItem('info') : 'more';

  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  
  constructor(private playersApiService: PlayersApiService, public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute) {
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
          // const foundPlayerArray = this.filterUsername(name.username, v2);         

          // Frags
          // const fragsPerPlayerArray:any[] = [];
          
          // foundPlayerArray.forEach((el) => {            
          //   const destructObjPlayers1 = Object.values(el);
          //   destructObjPlayers1.forEach((item:any[], i) => {
          //     if(item.includes(name.username) ){
          //       fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2] ? Number(destructObjPlayers1[i + 2]) : 0));
          //     }
          //   })
          // }) 
          
          // let fragsToDisplay:any;
          // if (Array.isArray(fragsPerPlayerArray) && fragsPerPlayerArray.length > 0) {
          //   fragsToDisplay = fragsPerPlayerArray.reduce((a, b) => a + b);
          // } else {
          //   fragsToDisplay = '0';
          // }                 
          
          lastWarDate = {
            // lastWarDate:this.findPlayerLastWar(name.username, v2),
            username:name.username,
            playername:name.playername,
            cup:this.addTitleCup(name.cup1on1edition1),
            ranking:parseFloat(name.ranking.replace(/,/g,'')),
            // ranking: name.ranking,
            wars:name.warcount,
            flag:name.nationality,          
            // strike: this.smallStrike2(name.username, v2),
            strike: name.lastwarpc,
            // fragsperwar: (fragsToDisplay / name.warcount).toFixed(2) != 'NaN' ? (fragsToDisplay / name.warcount).toFixed(2) : '0',
            // maxfragsperwar: Math.max(...fragsPerPlayerArray) ? Math.max(...fragsPerPlayerArray) : '0',
            // minfragsperwar: Math.min(...fragsPerPlayerArray) ? Math.min(...fragsPerPlayerArray) : '0',
            maxfragsperwar: name.fpwmax,
            minfragsperwar: name.fpwmin,
            s1wars: name.s1wars,
            // activity: this.searchPlayerActivity(name.username, v2), 
            activity: name.last30days, 
            // lastyear: this.pastYearActivity(name.username, v2),
            lastyear: name.last365days,
            meeting: name.meeting,
            lastWarDate: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
            fragsperwar: name.fpw,
            inactive: name.active == 'FALSE' ? false : true            
          };
          playerRowArray.push(lastWarDate);          
        }     
        console.log('playerRowArray', playerRowArray)
        return playerRowArray;         
      })
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
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByRanking: 'DESC' } });    
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
      )
    )       
  }

  public sortByRankingAsc(res:Observable<any>){   
    this.booleanVarRank = !this.booleanVarRank;  
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByRanking: 'ASC' } });     
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
      )
    )       
  }

  public sortByFpWDesc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;    
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByFpW: 'DESC' } }); 
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
      )
    )       
  }

  public sortByFpWAsc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;     
    this.router.navigate(['/obj-ranking'], { queryParams: { sortByFpW: 'ASC' } }); 
    return this.lastWarOfPlayer$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
      )
    )       
  }
}
