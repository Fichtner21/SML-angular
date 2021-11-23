import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { idOne, IdOneAttributesMapping, IdTwoAttributesMapping, idTwo } from '../home/id-one.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  idOne$: Observable<idOne[]>;
  idTwo$: Observable<idTwo[]>;
  idOneToDisp: [];

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService) { }

  ngOnInit(): void {
    
    this.idOne$ = this.GoogleSheetsDbService.get<idOne>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdOneAttributesMapping);
    this.idTwo$ = this.GoogleSheetsDbService.get<idTwo>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'TeamSelectionOne', IdTwoAttributesMapping);
    let toShow = this.idOne$;
    const aaa = this.idOne$.subscribe(res => {
      res.map((item) => {
        console.log(item);
        // console.log('=> ',item.team2players);
      })
    })
    const bbb = this.idTwo$.subscribe(res => {
      res.map((item) => {
        console.log('ID TWO: ', item);
      })
    })
  }

}
