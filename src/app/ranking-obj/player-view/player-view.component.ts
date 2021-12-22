import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';
import { RankObjService } from '../rank-obj.service';
import { Players } from '../ranking.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss']
})
export class PlayerViewComponent implements OnInit {
  public player$:Observable<Players>;
  public errorMessage: string;
  
  constructor(private activatedRoute: ActivatedRoute, private playersDetail: RankObjService) {
    console.log('activatedRoute PlayerView =>', this.activatedRoute); 
   }

  ngOnInit(): void {
    // this.activatedRoute.params.pipe(
    //   take(1),
    //   tap(params => {
    //     this.player$ = this.playersDetail.getSinglePlayer(params.username);        
    //   })
    // ).subscribe();
    this.player$ = this.activatedRoute.data.pipe(
      map(data => data.player)
      
    )
    console.log(this.player$);
  }

}
