import { Component, OnInit } from '@angular/core';
import { InactiveObjService } from './inactive-obj.service';
import { InactivePlayers } from './inactive.model';
import { combineLatest, Observable } from 'rxjs';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inactive-obj',
  templateUrl: './inactive-obj.component.html',
  styleUrls: ['./inactive-obj.component.scss']
})
export class InactiveObjComponent implements OnInit {
  public spinkit = Spinkit;
  players$: Observable<InactivePlayers[]>;
  public playersInactive$: Observable<any>;
  public historyMatches$: Observable<any>;
  public listInactive$: any;

  constructor(private inactiveObjService: InactiveObjService, private playersApiService: PlayersApiService) { }

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

          let fragsToDisplay:any;
          if (Array.isArray(fragsPerPlayerArray) && fragsPerPlayerArray.length) {
            fragsToDisplay = fragsPerPlayerArray.reduce((a, b) => a + b);
          } else {
            fragsToDisplay = 0;
          }  

          playerInactiveRow = {
            username: name.username,
            playername: name.playername,
            ranking: name.ranking,
            wars: name.warcount,
            flag: name.nationality,
            fragsperwar: (fragsToDisplay / name.warcount).toFixed(2),
            lastwar: this.findPlayerLastWar(name.username, matches)
          };

          playerInactiveRowArray.push(playerInactiveRow);
        }        
        return playerInactiveRowArray;
      })
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
