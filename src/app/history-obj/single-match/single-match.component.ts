import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchesDetailsService } from '../matches-details.service';
import { Matches } from '../matches.model';
import { FetchMatchesService } from '../fetch-matches.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-single-match',
  templateUrl: './single-match.component.html',
  styleUrls: ['./single-match.component.scss']
})
export class SingleMatchComponent implements OnInit {
  public match$:Observable<Matches>;
  public errorMessage: string;

  public playersTab$: Observable<any>;
  public matchesTab$: Observable<any>;  
  public inactiveTab$: Observable<any>;
  public historyObj$: any;

  public idwar$: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute, private tabApiService: PlayersApiService, private fetchMatch: FetchMatchesService   
    ) { 
      console.log('activatedRoute =>', this.activatedRoute); 
    }

  // async ngOnInit(): Promise<void> {
  // //  this.activatedRoute.params.subscribe(m => this.match = m.idwar);
  // //!!!
  //   const idwar: string = this.activatedRoute.snapshot.params.idwar;
  //   this.match = await this.FetchMatchesService.getSingleMatch(idwar);
  //   console.log(this.match);
  // }
  ngOnInit(): void {
    // this.fetchMatch.getSingleMatch('707').subscribe(res => {
    //   this.match = res;
    //   console.log('match 707 =>', res);
    // })
    this.match$ = this.activatedRoute.data.pipe(
      map(data => data.match)
    );

    this.idwar$ = this.activatedRoute.data.pipe(
      map((data) => {
        return data.match.idwar;
      })
    )

    this.playersTab$ = this.tabApiService.getPlayers('Players').pipe(
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

    this.matchesTab$ = this.tabApiService.getPlayers('Match+History').pipe(
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

    this.inactiveTab$ = this.tabApiService.getPlayers('Inactive').pipe(
      map((response: any) => {        
        let batchRowValuesHistory = response.values;
        let inactivePlayers: any[] = [];
        for(let i = 1; i < batchRowValuesHistory.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValuesHistory[i].length; j++){
            rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
          }
          inactivePlayers.push(rowObject);
        }        
        return inactivePlayers;
      }),
    );

    this.historyObj$ = combineLatest([this.playersTab$, this.match$, this.inactiveTab$]).pipe(
      map(([players, match, inactive]) => {
        let matchRow;
     
          matchRow = {
            timestamp: match.Timestamp,
            idwar: match.idwar,
            t1roundswon: match.t1roundswon,
            t2roundswon: match.t2roundswon, 
            video: match.video,
            info: match.info,
            t1p1playername: this.addPlayerLink(match.t1p1name, players, inactive),
            t1p1username: match.t1p1name,
            t1p1preelo: match.t1p1preelo,
            t1p1score: match.t1p1score,
            t1p1postelo: match.t1p1postelo,
            t1p2playername: this.addPlayerLink(match.t1p2name, players, inactive),
            t1p2username: match.t1p2name,
            t1p2preelo: match.t1p2preelo,
            t1p2score: match.t1p2score,
            t1p2postelo: match.t1p2postelo,
            t1p3playername: this.addPlayerLink(match.t1p3name, players, inactive),
            t1p3username: match.t1p3name,
            t1p3preelo: match.t1p3preelo,
            t1p3score: match.t1p3score,
            t1p3postelo: match.t1p3postelo,
            t1p4playername: this.addPlayerLink(match.t1p4name, players, inactive),
            t1p4username: match.t1p4name,
            t1p4preelo: match.t1p4preelo,
            t1p4score: match.t1p4score,
            t1p4postelo: match.t1p4postelo,
            t1p5playername: this.addPlayerLink(match.t1p5name, players, inactive),
            t1p5username: match.t1p5name,
            t1p5preelo: match.t1p5preelo,
            t1p5score: match.t1p5score,
            t1p5postelo: match.t1p5postelo,
            t1p6playername: this.addPlayerLink(match.t1p6name, players, inactive),
            t1p6username: match.t1p6name,
            t1p6preelo: match.t1p6preelo,
            t1p6score: match.t1p6score,
            t1p6postelo: match.t1p6postelo,
            t1p7playername: this.addPlayerLink(match.t1p7name, players, inactive),
            t1p7username: match.t1p7name,
            t1p7preelo: match.t1p7preelo,
            t1p7score: match.t1p7score,
            t1p7postelo: match.t1p7postelo,
            t2p1playername: this.addPlayerLink(match.t2p1name, players, inactive),
            t2p1username: match.t2p1name,
            t2p1preelo: match.t2p1preelo,
            t2p1score: match.t2p1score,
            t2p1postelo: match.t2p1postelo,
            t2p2playername: this.addPlayerLink(match.t2p2name, players, inactive),
            t2p2username: match.t2p2name,
            t2p2preelo: match.t2p2preelo,
            t2p2score: match.t2p2score,
            t2p2postelo: match.t2p2postelo,
            t2p3playername: this.addPlayerLink(match.t2p3name, players, inactive),
            t2p3username: match.t2p3name,
            t2p3preelo: match.t2p3preelo,
            t2p3score: match.t2p3score,
            t2p3postelo: match.t2p3postelo,
            t2p4playername: this.addPlayerLink(match.t2p4name, players, inactive),
            t2p4username: match.t2p4name,
            t2p4preelo: match.t2p4preelo,
            t2p4score: match.t2p4score,
            t2p4postelo: match.t2p4postelo,
            t2p5playername: this.addPlayerLink(match.t2p5name, players, inactive),
            t2p5username: match.t2p5name,
            t2p5preelo: match.t2p5preelo,
            t2p5score: match.t2p5score,
            t2p5postelo: match.t2p5postelo,
            t2p6playername: this.addPlayerLink(match.t2p6name, players, inactive),
            t2p6username: match.t2p6name,
            t2p6preelo: match.t2p6preelo,
            t2p6score: match.t2p6score,
            t2p6postelo: match.t2p6postelo,
            t2p7playername: this.addPlayerLink(match.t2p7name, players, inactive),
            t2p7username: match.t2p7name,
            t2p7preelo: match.t2p7preelo,
            t2p7score: match.t2p7score,
            t2p7postelo: match.t2p7postelo,
          }

        return matchRow;
      })
    ) 

    
  }
  public addPlayerLink(player:string, obj:any, obj2:any) {
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
    obj2.forEach((el:any) => {
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
}
