import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Matches, matchesAttributesMapping } from './matches.model';
import { MatchesDetailsService } from './matches-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-history-obj',
  templateUrl: './history-obj.component.html',
  styleUrls: ['./history-obj.component.scss']
})

export class HistoryObjComponent implements OnInit {
  matches$: Observable<Matches[]>;
  p: number = 1;
  collection: any[];
  t1p2name: String;
  t1p1preelo: String;
  t1p1nameB: any;
  test: any;
  public match: Matches;
  
  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private MatchDetail: MatchesDetailsService, private activatedRoute: ActivatedRoute, private router: Router, private httpClient: HttpClient) { }
  // constructor(private matchesService: MatchesDetailsService) { }

  // showSingle(idwar:string): void {
  //   this.router.navigateByUrl('/obj-matches/'+idwar)
  // }

  
  

  ngOnInit(): void {
    this.matches$ = this.GoogleSheetsDbService.get<Matches>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Match+History', matchesAttributesMapping);
    const subscribeMatches = this.matches$.subscribe(res => {
      console.log('res idwar =>', res);      
      res.forEach((el, index) => {       
        const idWar = el.idwar;
        // console.log('ID WAR => ', idWar); 
        const t1p1nameA =  el.t1p1preelo;
        this.t1p1nameB = Number(t1p1nameA).toFixed(2);
      });
    }); 
    
    

    // this.matchesService.getMatches().subscribe(res => {      
    //   const batchRowValues = res.values;
    //   console.log('RANGE', batchRowValues);
    //   const matches = [];
    //   for(let i = 1; i < batchRowValues.length; i++){
    //     const rowObject = {};
    //     for(let j = 0; j < batchRowValues[i].length; j++){
    //       rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //     }
    //     matches.push(rowObject);
    //   }      
    // })    
  }
}
