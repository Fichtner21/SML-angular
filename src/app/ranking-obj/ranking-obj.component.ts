import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Players, playerAttributesMapping } from '../players.model';
import { RankObjService } from './rank-obj.service';


@Component({
  selector: 'app-ranking-obj',
  templateUrl: './ranking-obj.component.html',
  styleUrls: ['./ranking-obj.component.scss']
})
export class RankingObjComponent implements OnInit {
  players$: Observable<Players[]>;
  nat: string;
  
  constructor(private rankObjService: RankObjService) { }

  ngOnInit(): void {
    this.rankObjService.getRanking().subscribe(res => {
      console.log('res =>', res.values);
    })
    // this.players$ = this.GoogleSheetsDbService.get<Players>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 1, playerAttributesMapping);
    // const subscribePlayers = this.players$.subscribe(res => {
    //   res.map((item) => {
    //     console.log(item.nationality);
    //     let natio = item.nationality;
    //     this.nat = getPlayerFlag(natio);
    //   })
    // })

    

    let playerFlag2 = '';
    function getPlayerFlag(playerFlag) {   
      switch (playerFlag) {
        case 'EU': {
          playerFlag2 = `11`;
          break;
        }
        case 'PL': {
          playerFlag2 = `<img src="/assets/flags/pl.gif" title="Poland">`;
          break;
        }      
        default:
        // console.log('Nie pasuje');
      }
      return playerFlag2;
    }

    // this.nat = 'getPlayerFlag(this.nat)';
  }
}
