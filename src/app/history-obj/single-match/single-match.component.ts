import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Matches } from '../matches.model';
import { FetchMatchesService } from '../fetch-matches.service';
import { Observable, combineLatest, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { Spinkit } from 'ng-http-loader';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { SingleComment } from './single-comment.model';
import { CommentsService } from './comments.service';


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
  public matchVideo: string;
  public spinkit = Spinkit;
  public columnsGrid;
  private singlePostCollection: AngularFirestoreCollection<SingleComment>;
  singleComment$: Observable<SingleComment[]>;
  allComments$: any;
  // comment$: Observable<SingleComment | undefined>;
  comment$: any;

  comment: SingleComment = new SingleComment();
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute, private tabApiService: PlayersApiService, private fetchMatch: FetchMatchesService, private afs: AngularFirestore, private commentService: CommentsService,  ) {
      this.singlePostCollection = afs.collection<SingleComment>('postComments');
      // this.singleComment$ = this.singlePostCollection.valueChanges({idField: 'id'})
      // console.log('this.singlePostCollection', this.singlePostCollection);
    }

  ngOnInit(): void {

    // console.log('getAll =>', this.commentService.getAll().valueChanges());
    this.allComments$ = this.commentService.getAll().valueChanges();
    // this.allComments$.pipe().subscribe((res) => console.log('res', res))
    // this.allComments$.pipe(map(
    //   (el:[]) => {
    //     for(let single of el){
    //       console.log('single', single.({idField, 'id'});
    //     }
    //   }
    // )).subscribe();
    //  this.allComments$.subscribe(pipe(
    //   map((res: any) => {
    //     res = this.commentService.getAll();
    //     console.log('res', res)
    //   })
    //  ))
    const matchID = this.activatedRoute.snapshot.params['idwar'];
    // console.log('matchID', matchID);
    // console.log('this.afs', this.afs.firestore);
    this.comment$ = this.afs.collection<SingleComment>('spearhead-mix-league').doc(matchID).valueChanges();
    // console.log('this.comment', this.comment$);
    // console.log('ressss', this.afs.collection<SingleComment>('spearhead-mix-league').doc(matchID))


    this.match$ = this.activatedRoute.data.pipe(
      map(data => data.match)
    );

    this.match$.pipe(
      map(x => this.matchVideo = x.video)).subscribe();

    this.idwar$ = this.activatedRoute.data.pipe(
      map((data) => {
        return data.match.idwar;
      })
    );

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
        const singleMap = match.info;
        // console.log('match.info', match.info);

        const csLewisQuote = match.info;
        const regex1 = /The Hunt/;
        const regex2 = /The Bridge, The Church Final/g;
        const regex3 = /The Church Final/g;

        // console.log('regEx =>', csLewisQuote.match(match.info));
        const findMap = csLewisQuote.match(match.info);

        const mapArray = [];
        findMap.forEach((el) => {
          mapArray.push(el);
        });

        const newMapArray =  mapArray[0].split(', ');

        newMapArray.forEach((el, i) => {
        if(el == 'The Hunt'){
            const newEl = 'TheHunt';
            this.neMap.push(newEl);
        }
        if(el == 'V2'){
            const newEl = 'v2';
            this.neMap.push(newEl);
        }
        if(el == 'Dessau1946'){
            const newEl = 'dessau';
            this.neMap.push(newEl);
        }
         if(el == 'The Bridge'){
          const newEl = 'bridge';
          this.neMap.push(newEl);
         }
         if(el == 'Stlo'){
          const newEl = 'stlo';
          this.neMap.push(newEl);
         }
         if(el == 'V2Shelter'){
          const newEl = 'v2shleter';
          this.neMap.push(newEl);
         }
         if(el == 'VSUK Abbey'){
          const newEl = 'vsuk';
          this.neMap.push(newEl);
         }
         if(el == 'Navarone'){
          const newEl = 'navarone';
          this.neMap.push(newEl);
         }
         if(el == 'Stlo4'){
          const newEl = 'stlo4';
          this.neMap.push(newEl);
         }
         if(el == 'The Church Final'){
          const newEl = 'dmloadingTheChurch';
          this.neMap.push(newEl);
         }
        });

        // console.log('newMapArray', this.neMap);

        // this.gridTemplateColumns = { gridTemplateColumns: `${this.countColumns(this.neMap.length)}`};

        let matchRow;
          matchRow = {
            timestamp: match.timestamp,
            idwar: match.idwar,
            t1roundswon: match.t1roundswon,
            t2roundswon: match.t2roundswon,
            video: 'https://www.youtube.com/embed/' + match.video + '/?autoplay=1',
            videoImg: 'https://img.youtube.com/vi/' + match.video + '/hqdefault.jpg',
            info: match.info,
            columns: this.countColumns(this.neMap.length),
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
          // console.log('matchRow', matchRow);
          // console.log('thisSingle', this.commentService.getSingleComment(match.idwar).valueChanges())
          // this.commentService.getSingleComment(match.idwar).valueChanges().pipe().subscribe(res => console.log('res', res));

        return matchRow;
      })
    );

  }

  addComment(id:string): void {
    this.commentService.create(this.comment).then(() => {
      // console.log('this.comment', this.comment);
      // console.log('Created new comment succesfully!');
      this.submitted = true;
    })
  }

  newComment(): void {
    this.submitted = false;
    this.comment = new SingleComment();
  }

  public TheHunt = /The Hunt/;
  public V2 = /V2/;
  public TheBridge = /The Bridge/;
  public TheChurchFinal = /The Church Final/;
  public findMap = document.getElementById('findMaps');
  public mapImg = [];
  public neMap = [];

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

  countColumns(column:any){
    switch(column){
      case 1:
        return 'repeat(1, 1fr)';
      case 2:
        return 'repeat(2, 1fr)';
      case 3:
        return 'repeat(3, 1fr)';
      case 4:
        return 'repeat(4, 1fr)';
      case 5:
        return 'repeat(5, 1fr)';
      case 6:
        return 'repeat(6, 1fr)';
      default:
        return 'repeat(1, 1fr)'
    }
  }
}
