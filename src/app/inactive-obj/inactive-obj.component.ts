import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InactiveObjService } from './inactive-obj.service';
import { InactivePlayers } from './inactive.model';
import { combineLatest, Observable } from 'rxjs';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';
import { map, tap } from 'rxjs/operators';
import { SortByOrderPipe } from '../sort-by-order.pipe';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-inactive-obj',
  templateUrl: './inactive-obj.component.html',
  styleUrls: ['./inactive-obj.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SortByOrderPipe]
})
export class InactiveObjComponent implements OnInit {
  public spinkit = Spinkit;
  players$: Observable<InactivePlayers[]>;
  public playersInactive$: Observable<any>;
  public historyMatches$: Observable<any>;
  public listInactive$: Observable<InactivePlayers[]>;
  public ngForPlayers:any;
  booleanVar = false;
  booleanVarRank = false;
  booleanVarFpW = false; 

  constructor(private inactiveObjService: InactiveObjService, private playersApiService: PlayersApiService, private sortbyorder: SortByOrderPipe, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.players$ = this.inactiveObjService.fetchInactivePlayers();

    this.playersInactive$ = this.playersApiService.getPlayers('Inactive').pipe(
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

    this.listInactive$ = combineLatest([this.playersInactive$, this.historyMatches$]).pipe(
      map(([inactive, matches]) => {
        let playerInactiveRow;
        let playerInactiveRowArray: any[] = [];
        
        for(let name of inactive){
          const foundPlayerArray = this.filterUsername(name.username, matches);
         
          //Frags
          const fragsPerPlayerArray:any[] = [];

          foundPlayerArray.forEach((el) => {            
            const destructObjPlayers1 = Object.values(el);
            destructObjPlayers1.forEach((item:any[], i) => {
              if(item.includes(name.username) ){
                fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2]));
              }
            })
          }) 

          // let fragsToDisplay:any;
          // if (Array.isArray(fragsPerPlayerArray) && fragsPerPlayerArray.length) {
          //   fragsToDisplay = fragsPerPlayerArray.reduce((a, b) => a + b);
          // } else {
          //   fragsToDisplay = 0;
          // }  

          playerInactiveRow = {
            username: name.username,
            playername: name.playername,
            ranking: parseFloat(name.ranking.replace(/,/g,'')),            
            wars: name.warcount,
            flag: name.nationality,
            // fragsperwar: (fragsToDisplay / name.warcount).toFixed(2),
            fragsperwar: name.fpw,
            // lastwar: this.findPlayerLastWar(name.username, matches)
            lastwar: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
          };
        
          playerInactiveRowArray.push(playerInactiveRow);
        }        
        return playerInactiveRowArray;
      })
    );      
       
    if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'DESC'){        
      this.sortByWarsDesc(this.listInactive$);        
    } else if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'ASC'){
      this.sortByWarsAsc(this.listInactive$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'DESC'){
      this.sortByRankingDesc(this.listInactive$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'ASC'){
      this.sortByRankingAsc(this.listInactive$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'DESC'){
      this.sortByFpWDesc(this.listInactive$);
    } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'ASC'){
      this.sortByFpWAsc(this.listInactive$);
    } else {
      this.router.navigate(['/obj-inactive'], { queryParams: {  } });
    }
  }

  public sortByWarsDesc(res:Observable<any>){      
    this.booleanVar = !this.booleanVar;
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByWars: 'DESC' } });   
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(b.wars) - Number(a.wars))
      )
    )       
  }

  public sortByWarsAsc(res:Observable<any>){  
    this.booleanVar = !this.booleanVar; 
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByWars: 'ASC' } }); 
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(a.wars) - Number(b.wars))
      )
    )       
  }

  public sortByRankingDesc(res:Observable<any>){ 
    this.booleanVarRank = !this.booleanVarRank;    
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'DESC' } }); 
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
      )
    )       
  }

  public sortByRankingAsc(res:Observable<any>){   
    this.booleanVarRank = !this.booleanVarRank;   
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'ASC' } });   
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
      )
    )       
  }

  public sortByFpWDesc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW; 
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'DESC' } });    
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
      )
    )       
  }

  public sortByFpWAsc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;  
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'ASC' } });    
    return this.listInactive$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
      )
    )       
  }

  private filterUsername(name:string, matches:any[]){
    return matches.filter(m => {             
      return Object.values(m).includes(name);
     })
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
}
