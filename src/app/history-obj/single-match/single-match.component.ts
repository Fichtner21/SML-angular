import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchesDetailsService } from '../matches-details.service';
import { Matches } from '../matches.model';
import { FetchMatchesService } from '../fetch-matches.service';

@Component({
  selector: 'app-single-match',
  templateUrl: './single-match.component.html',
  styleUrls: ['./single-match.component.scss']
})
export class SingleMatchComponent implements OnInit {
  public match: Matches;
  public errorMessage: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private matchesDetail: MatchesDetailsService, private fetchMatch: FetchMatchesService   
    ) { 
      console.log('activatedRoute =>', ActivatedRoute); 
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
  }

}
