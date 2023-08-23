import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Matches, matchesAttributesMapping } from './matches.model';
import { MatchesDetailsService } from './matches-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FetchMatchesService } from './fetch-matches.service';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';
import { TranslateService } from '@ngx-translate/core';
import { CommentsService } from './single-match/comments.service';
import { SingleComment } from './single-match/single-comment.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { mergeMap } from 'rxjs/operators';


interface Length {
  idwar: any,
  comments: any
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-history-obj',
  templateUrl: './history-obj.component.html',
  styleUrls: ['./history-obj.component.scss']
})

export class HistoryObjComponent implements OnInit {
  public spinkit = Spinkit;
  matches$: Observable<Matches[]>;
  p: number = 1;
  collection: any[];   
  public match: Matches;

  public playersTab$: Observable<any>;
  public matchesTab$: Observable<any>;  
  public inactiveTab$: Observable<any>;
  public comments$: any;

  public historyObj$: any;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any; 
  length: number = 0;
  // comments: any;
  public warsAndComments$: any; 
  public newArray: any[] = []; 
 
  comments: Observable<any[]>;
  
  
  constructor(private MatchDetail: MatchesDetailsService, private activatedRoute: ActivatedRoute, private router: Router, private httpClient: HttpClient, private fetchMatches: FetchMatchesService, private tabApiService: PlayersApiService, private translateService: TranslateService, private commentsService: CommentsService, private db: AngularFireDatabase) { }
 
   ngOnInit(): void {
    
    
    this.matches$ = this.fetchMatches.fetchMatches();   
    
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

    // this.matchesTab$ = this.tabApiService.getPlayers('Match+History').pipe(
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

    // // Przyjmujemy, że selectedDate to data wybrana przez użytkownika w formacie "MM/DD/YYYY HH:mm:ss".
    // const selectedDate = new Date('7/31/2021 14:29:13');

    // // W tej funkcji filtrujemy mecze, które mają datę wcześniejszą lub równą selectedDate
    // this.matchesTab$ = this.matchesTab$.pipe(
    //   map((historyMatches: any[]) => historyMatches.filter(match => match['timestamp'] <= selectedDate))
    // );

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
    
    // this.matchesTab$.subscribe(historyMatches => {
    //   let newArray: any[] = [];
    //   historyMatches.forEach((el:any) => {
    //     let newObject = {
    //       comments: 0,
    //       id: el.idwar
    //     }
    //     newArray.push(newObject);
    //   })
    //   newArray.forEach((matchRow: any) => {
    //     this.commentsService.getCommentsForMatch(matchRow.id, '_').snapshotChanges().subscribe(data => {    
    //        const commentCount = data.length;    
    //        matchRow.comments = commentCount;
    //      });
    //   });
    //   this.warsAndComments$ = newArray; 
    //   console.log(this.warsAndComments$)
    // });
    
    this.historyObj$ = combineLatest([this.playersTab$, this.matchesTab$, this.inactiveTab$]).pipe(
      map(([players, matches, inactive]) => {
        let matchRow;
        let matchRowArray: any[] = []; 
       
        for(let match of matches){ 
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

          matchRow = {
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
            comments: 0      
            // comments: this.commentsService.getCommentsForMatch(match.idwar, '_').snapshotChanges().subscribe(data => data.length)       
          }
        
          // if (Array.isArray(warsAndComments)) {
          //   const warsAndCommentsMatch = warsAndComments.find(war => war.id === match.idwar);
          //   if (warsAndCommentsMatch) {
          //     matchRow.comments = warsAndCommentsMatch.comments;
          //   }
          // }

          
           
            // const matchToUpdate = matchRow.find(match => match.id === length.idwar);
            // if (matchToUpdate) {
            //   matchToUpdate.comments = length;
            // }
         
         
          
          const newObj = {
            ...matchRow,
            flag: '',
            flag2: ''
          };
          
          let firstPlayerFlag = '';
          let firstPlayerFlag2 = '';

          for (let i = 1; i <= 7; i++) {
            const playerName = matchRow[`t1p${i}playername`];
            
            if (playerName) {
              const playerFlag = playerName.flag;
              
              if (!firstPlayerFlag) {
                firstPlayerFlag = playerFlag;
              } else if (playerFlag && playerFlag !== firstPlayerFlag) {
                // Gracze mają różne flagi, więc nie ustawiamy flagi w newObj.
                firstPlayerFlag = '';
                break;
              }
            }
          }

          for (let i = 1; i <= 7; i++) {
            const playerName = matchRow[`t2p${i}playername`];
            
            if (playerName) {
              const playerFlag = playerName.flag;
              
              if (!firstPlayerFlag2) {
                firstPlayerFlag2 = playerFlag;
              } else if (playerFlag && playerFlag !== firstPlayerFlag2) {
                // Gracze mają różne flagi, więc nie ustawiamy flagi w newObj.
                firstPlayerFlag2 = '';
                break;
              }
            }
          }

          if (firstPlayerFlag) {
            // Ustawiamy flagę w newObj tylko wtedy, gdy wszyscy niepuste gracze mają tę samą flagę.
            newObj.flag = firstPlayerFlag;
          }          
          if (firstPlayerFlag2) {
            // Ustawiamy flagę w newObj tylko wtedy, gdy wszyscy niepuste gracze mają tę samą flagę.
            newObj.flag2 = firstPlayerFlag2;
          }   
          matchRowArray.push(newObj);         
          
        }
        // console.log('M =>', this.matchRowArray[2001]);
        // console.log('M 2 =>', this.matchRowArray[2002]);
        
        // console.log('M 2=>', matchRowArray[2062]);
        // console.log('M =>', matchRowArray);
        return matchRowArray.reverse();
      }),
      
      // tap(x => console.log('xx', x))
    )      

    // this.historyObj$ = combineLatest([this.playersTab$, this.matchesTab$, this.inactiveTab$]).pipe(
    //   map(([players, matches, inactive]): unknown => {
    //     let matchRow;
    //     let matchRowArray: any[] = []; 
    //     for (let match of matches) {
    //       const sumPreeloTeam1 = [
    //                 (Number(match.t1p1preelo) ? Number(match.t1p1preelo) : 0) + 
    //                 (Number(match.t1p2preelo) ? Number(match.t1p2preelo) : 0) + 
    //                 (Number(match.t1p3preelo) ? Number(match.t1p3preelo) : 0) + 
    //                 (Number(match.t1p4preelo) ? Number(match.t1p4preelo) : 0) + 
    //                 (Number(match.t1p5preelo) ? Number(match.t1p5preelo) : 0) + 
    //                 (Number(match.t1p6preelo) ? Number(match.t1p6preelo) : 0) + 
    //                 (Number(match.t1p7preelo) ? Number(match.t1p7preelo) : 0) 
    //               ].reduce(this.addPreelo, 0);     
        
    //               const sumPreeloTeam2 = [
    //                 (Number(match.t2p1preelo) ? Number(match.t2p1preelo) : 0) + 
    //                 (Number(match.t2p2preelo) ? Number(match.t2p2preelo) : 0) + 
    //                 (Number(match.t2p3preelo) ? Number(match.t2p3preelo) : 0) + 
    //                 (Number(match.t2p4preelo) ? Number(match.t2p4preelo) : 0) + 
    //                 (Number(match.t2p5preelo) ? Number(match.t2p5preelo) : 0) + 
    //                 (Number(match.t2p6preelo) ? Number(match.t2p6preelo) : 0) + 
    //                 (Number(match.t2p7preelo) ? Number(match.t2p7preelo) : 0) 
    //               ].reduce(this.addPreelo, 0);   
    //       matchRow = {
    //                 timestamp: match.timestamp,
    //                 idwar: match.idwar,
    //                 t1roundswon: match.t1roundswon,
    //                 t2roundswon: match.t2roundswon, 
    //                 video: match.video,
    //                 info: match.info,
    //                 t1preelo: sumPreeloTeam1,
    //                 t2preelo: sumPreeloTeam2,
    //                 t1chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[0].toFixed(2)),
    //                 t2chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[1].toFixed(2)),
    //                 t1p1playername: this.addPlayerLink(match.t1p1name, players, inactive),
    //                 t1p1username: match.t1p1name,
    //                 t1p1preelo: match.t1p1preelo,
    //                 t1p1score: match.t1p1score,
    //                 t1p1postelo: match.t1p1postelo,
    //                 t1p2playername: this.addPlayerLink(match.t1p2name, players, inactive),
    //                 t1p2username: match.t1p2name,
    //                 t1p2preelo: match.t1p2preelo,
    //                 t1p2score: match.t1p2score,
    //                 t1p2postelo: match.t1p2postelo,
    //                 t1p3playername: this.addPlayerLink(match.t1p3name, players, inactive),
    //                 t1p3username: match.t1p3name,
    //                 t1p3preelo: match.t1p3preelo,
    //                 t1p3score: match.t1p3score,
    //                 t1p3postelo: match.t1p3postelo,
    //                 t1p4playername: this.addPlayerLink(match.t1p4name, players, inactive),
    //                 t1p4username: match.t1p4name,
    //                 t1p4preelo: match.t1p4preelo,
    //                 t1p4score: match.t1p4score,
    //                 t1p4postelo: match.t1p4postelo,
    //                 t1p5playername: this.addPlayerLink(match.t1p5name, players, inactive),
    //                 t1p5username: match.t1p5name,
    //                 t1p5preelo: match.t1p5preelo,
    //                 t1p5score: match.t1p5score,
    //                 t1p5postelo: match.t1p5postelo,
    //                 t1p6playername: this.addPlayerLink(match.t1p6name, players, inactive),
    //                 t1p6username: match.t1p6name,
    //                 t1p6preelo: match.t1p6preelo,
    //                 t1p6score: match.t1p6score,
    //                 t1p6postelo: match.t1p6postelo,
    //                 t1p7playername: this.addPlayerLink(match.t1p7name, players, inactive),
    //                 t1p7username: match.t1p7name,
    //                 t1p7preelo: match.t1p7preelo,
    //                 t1p7score: match.t1p7score,
    //                 t1p7postelo: match.t1p7postelo,
    //                 t2p1playername: this.addPlayerLink(match.t2p1name, players, inactive),
    //                 t2p1username: match.t2p1name,
    //                 t2p1preelo: match.t2p1preelo,
    //                 t2p1score: match.t2p1score,
    //                 t2p1postelo: match.t2p1postelo,
    //                 t2p2playername: this.addPlayerLink(match.t2p2name, players, inactive),
    //                 t2p2username: match.t2p2name,
    //                 t2p2preelo: match.t2p2preelo,
    //                 t2p2score: match.t2p2score,
    //                 t2p2postelo: match.t2p2postelo,
    //                 t2p3playername: this.addPlayerLink(match.t2p3name, players, inactive),
    //                 t2p3username: match.t2p3name,
    //                 t2p3preelo: match.t2p3preelo,
    //                 t2p3score: match.t2p3score,
    //                 t2p3postelo: match.t2p3postelo,
    //                 t2p4playername: this.addPlayerLink(match.t2p4name, players, inactive),
    //                 t2p4username: match.t2p4name,
    //                 t2p4preelo: match.t2p4preelo,
    //                 t2p4score: match.t2p4score,
    //                 t2p4postelo: match.t2p4postelo,
    //                 t2p5playername: this.addPlayerLink(match.t2p5name, players, inactive),
    //                 t2p5username: match.t2p5name,
    //                 t2p5preelo: match.t2p5preelo,
    //                 t2p5score: match.t2p5score,
    //                 t2p5postelo: match.t2p5postelo,
    //                 t2p6playername: this.addPlayerLink(match.t2p6name, players, inactive),
    //                 t2p6username: match.t2p6name,
    //                 t2p6preelo: match.t2p6preelo,
    //                 t2p6score: match.t2p6score,
    //                 t2p6postelo: match.t2p6postelo,
    //                 t2p7playername: this.addPlayerLink(match.t2p7name, players, inactive),
    //                 t2p7username: match.t2p7name,
    //                 t2p7preelo: match.t2p7preelo,
    //                 t2p7score: match.t2p7score,
    //                 t2p7postelo: match.t2p7postelo,
    //                 comments: 0      
    //                 // comments: this.commentsService.getCommentsForMatch(match.idwar, '_').snapshotChanges().subscribe(data => data.length)       
    //               }
    
    //               const a = this.commentsService.getCommentsForMatch(match.idwar, '_').snapshotChanges().toPromise().then(data => {
    //                 const commentCount = data ? data.length : 0;
    //                 matchRow.comments = {
    //                   id: match.idwar,
    //                   comments: commentCount
    //                 };        
    //               });
    
    //       const newObj = {
    //         ...matchRow,
    //         flag: '',
    //         flag2: '',
    //         b: a
    //       };
    
    //       matchRowArray.push(newObj);
    //     }
    //     console.log('matchRow', matchRowArray[2062])
    //     return matchRowArray.reverse();
    //   })
    // );
    
  };  

  ngAfterViewInit(){
    // console.log('after view');
    // this.updateKomentarze();
  }

  // getCommentsForMatch(idwar: string): AngularFireList<SingleComment> {     
  //   return this.db.list(`postComments${idwar}/_`)
  // }

  getCommentsForMatch(idwar: string): AngularFireList<SingleComment[]> {     
    return this.db.list<SingleComment[]>(`postComments${idwar}/_`)
  }

  getCommentsCountForMatch(idwar: string): AngularFireList<any> {
    const commentsRef = this.db.list(`postComments${idwar}/_`);
    console.log('commentsRef', commentsRef)
    return commentsRef;
    // return commentsRef.snapshotChanges().pipe(
    //   map(changes => changes.length)
    // );
  }

  updateComments(length: any) {
    const matchId = length.id;
    const commentsCount = length.comments;
    console.log('MATCH ID:', matchId, ' comments: ', commentsCount)
    return length.id;
    // this.historyObj$ = this.historyObj$.pipe(
    //   map((matchRowArray:any) => {
    //     const updatedMatchRowArray = matchRowArray.map((matchRow) => {
    //       if (matchRow.idwar === matchId) {
    //         return { ...matchRow, comments: commentsCount };
    //       }
    //       return matchRow;
    //     });
    //     return updatedMatchRowArray;
    //   })
    // );
  }

  handleChildObject(obj: any) {
    // kod obsługi obiektu z dziecka
    this.historyObj$.pipe(
      map((parentArray:any) => {
        parentArray.forEach(parentObject => {
          if (parentObject.idwar === obj.idwar) {
            parentObject.comments += obj.comments;
          }
        });
        return parentArray;
      })
    ).subscribe(updatedParentArray => {
      // zaktualizowane dane w rodzicu
    });
  }

  updateKomentarze() {
    this.historyObj$.pipe(
      map((matches:any) => {
        return matches.map(match => {
          this.getCommentsForMatch(match.idwar).valueChanges().subscribe(comments => {
            if (comments) {
              match.comments = comments.length;
            }
          });
          return match;
        });
      })
    ).subscribe(matches => {
      // console.log(matches);      
      // tu możesz dodać logikę do aktualizacji listy meczów i ich liczby komentarzy
    });
  }
  
  fn(id){
    let aaa;
    this.commentsService.getCommentsForMatch(id, '_').snapshotChanges().subscribe(result => result = aaa)
    return aaa;
  }

  async someFunction(id:any): Promise<any> {
    const comments = await this.commentsService.getCommentsForMatch(id, '_').valueChanges().toPromise();
    return comments;
  }
 
  onChildComments(event: { id: string, comments: number }) {
    this.historyObj$.forEach(matchRow => {
      if (matchRow.idwar === event.id) {
        matchRow.comments = event.comments;
      }
    });
  }
  
  // handleLength(event: {idwar: string, comments: number}) {
  //   this.historyObj$.forEach((el) => {
  //     if(el.idwar == event.idwar){
  //       return event.comments;
  //     }
  //   })    
  // }

  public addPlayerLink(player:string, obj:any, obj2:any) {
    let convertedPlayer = {};    
    obj.forEach((el:any) => {
      if (player === el.username) {
        convertedPlayer = {
          name: el.playername,
          flag: el.nationality
        };
      } else if (player === '') {
        // console.log('N/A player');
      } else {
        // console.log('Something went wrong.');
      }
    });
    obj2.forEach((el:any) => {
      if (player === el.username) {
        convertedPlayer = {
          name: el.playername,
          flag: el.nationality
        };
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

  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
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

  public betOdd(bet:number){
    let code = bet;
    switch (true) {
      case code == 0:
        return "100";
        break;
      case bet > 0 && bet < 20:
        return "20";
        break;
      case bet > 20 && bet < 30:
        return this.randomNumber(8, 15);
        break;
      case bet > 30 && bet < 40:
        return this.randomNumber(4, 7.99);
        break;
      case bet > 40 && bet < 42:
        return this.randomNumber(3.31, 4);
        break;
      case bet > 42 && bet < 44:
        return this.randomNumber(2.81, 3.30);
        break;
      case bet > 44 && bet < 46:
        return this.randomNumber(2.51, 2.8);
        break;
      case bet > 46 && bet < 48:
        return this.randomNumber(2.21, 2.5);
        break;
      case bet > 48 && bet < 50.1:
        return this.randomNumber(2.01, 2.2);
        break;
      case bet == 50:
        return "2";
        break;
      case bet > 50.1 && bet < 52: 
        return this.randomNumber(1.85, 1.99);
        break;
      case bet > 52 && bet < 54:
        return this.randomNumber(1.70, 1.84);
        break;
      case bet > 54 && bet < 56:
        return this.randomNumber(1.55, 1.69);
        break;
      case bet > 56 && bet < 58:
        return this.randomNumber(1.40, 1.54);
        break;
      case bet > 58 && bet < 60:
        return this.randomNumber(1.31, 1.39);
        break;
      case bet > 60 && bet < 80:
        return "1.3";
        break;
      case bet > 80 && bet < 100:
        return "1.1";
        break;
      case bet == 100:
        return "1";
        break;
      default:
        return "unknown odd";      
    }
  }

  public randomNumber(min, max) { 
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  updateCommentsLength(length: { id: string, comments: number }) {
    // Aktualizacja historii na podstawie emitowanego zdarzenia
    this.historyObj$.subscribe(history => {
      const matchToUpdate = history.find(match => match.id === length.id);
      if (matchToUpdate) {
        matchToUpdate.comments = length.comments;
      }
    });
  }
 
}
