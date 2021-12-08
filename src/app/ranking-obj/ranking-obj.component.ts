import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { RankObjService } from './rank-obj.service';
import { Players } from './ranking.model';
import { GetflagService } from '../services/getflag.service';


@Component({
  selector: 'app-ranking-obj',
  templateUrl: './ranking-obj.component.html',
  styleUrls: ['./ranking-obj.component.scss']
})
export class RankingObjComponent implements OnInit {
  players$: Observable<Players[]>;
  nat: string;
  randomAct:string;
  
  constructor(private rankObjService: RankObjService, private getFlag: GetflagService) { }

  ngOnInit(): void {
    // this.rankObjService.getRanking().subscribe(res => {
    //   console.log('res =>', res.values);
    // })
    // this.players$ = this.GoogleSheetsDbService.get<Players>('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 1, playerAttributesMapping);
    // const subscribePlayers = this.players$.subscribe(res => {
    //   res.map((item) => {
    //     console.log(item.nationality);
    //     let natio = item.nationality;
    //     this.nat = getPlayerFlag(natio);
    //   })
    // })

    this.players$ = this.rankObjService.fetchPlayers();

    const actSquares = ['green0', 'green1_5', 'green6_10', 'green11_20', 'green21_40', 'green41_70','green71'];
    this.randomAct = actSquares[Math.floor(Math.random()*actSquares.length)];
     
  //  this.nat = this.rankObjService.fetchPlayersFlag(this.getFlag.getPlayerFlag(this.nat))
    
    // const playerFlag = this.flag.getPlayerFlag()

    // let playerFlag2 = '';
    // function getPlayerFlag(playerFlag) {   
    //   switch (playerFlag) {
    //     case 'EU': {
    //       playerFlag2 = `11`;
    //       break;
    //     }
    //     case 'PL': {
    //       playerFlag2 = `<img src="/assets/flags/pl.gif" title="Poland">`;
    //       break;
    //     }      
    //     default:
    //     // console.log('Nie pasuje');
    //   }
    //   return playerFlag2;
    // }

    // this.nat = 'getPlayerFlag(this.nat)';
  }
}
