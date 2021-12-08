import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { idOne, IdOneAttributesMapping, IdTwoAttributesMapping, idTwo } from '../home/team-selection-one.model';
import { SelectionTeamService } from './selection-team.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  idOne$: Observable<idOne[]>;
  idTwo$: Observable<idTwo[]>;
  idOneToDisp: [];
  randomVideo: string;  
  // idOne$: Observable<idOne[]>;
  idOneCumulative$: Observable<idOne>;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private idTeamOne: SelectionTeamService) { }

  ngOnInit(): void {

  
    // this.idOne$ = this.GoogleSheetsDbService.get<idOne>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdOneAttributesMapping).pipe(
    //   tap(content => console.log('Content: ', content))
    // );
    
    const videos = ['1','2','3','4'];
    this.randomVideo = videos[Math.floor(Math.random()*videos.length)];

    

    this.idOne$ = this.idTeamOne.getTeamIdOne();

    this.idOneCumulative$ = this.idTeamOne.getTeamIdOneCumulative();

    const batchRowValues = this.idOneCumulative$;
   

    // const historyMatches = [];
    // for (let i = 1; i < batchRowValues.length; i++) {
    //   const rowObject = {};
    //   for (let j = 0; j < batchRowValues[i].length; j++) {
    //     rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //   }
    //   historyMatches.push(rowObject);
    // }
   
    
    // this.idOne$ = this.idTeamOne.getTeamIdOne();
    // console.log('this ID 1 =>', this.idOne$);
    // this.idOne$ = this.GoogleSheetsDbService.get<idOne>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdOneAttributesMapping);
    // this.idTwo$ = this.GoogleSheetsDbService.get<idTwo>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdTwoAttributesMapping);
    // let toShow = this.idOne$;
    // const aaa = this.idOne$.subscribe(res => {
    //   res.map((item) => {
    //     console.log(item);
    //     // console.log('=> ',item.team2players);
    //   })
    // })
    // const bbb = this.idTwo$.subscribe(res => {
    //   res.map((item) => {
    //     console.log('ID TWO: ', item);
    //   })
    // })

  }

  

}
