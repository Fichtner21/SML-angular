import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchesDetailsService } from '../matches-details.service';
import { Matches } from '../matches.model';
import { FetchMatchesService } from '../fetch-matches.service';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-single-match',
  templateUrl: './single-match.component.html',
  styleUrls: ['./single-match.component.scss']
})
export class SingleMatchComponent implements OnInit {
  public match$:Observable<Matches>;
  public errorMessage: string;


  constructor(
    private activatedRoute: ActivatedRoute, private fetchMatch: FetchMatchesService   
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
  }

}
