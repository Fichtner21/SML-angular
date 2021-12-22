import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { idOne, IdOneAttributesMapping, IdTwoAttributesMapping, idTwo } from '../home/team-selection-one.model';
import { SelectionTeamService } from './selection-team.service';
import { map, tap } from 'rxjs/operators';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public spinkit = Spinkit;
  idOne$: Observable<idOne[]>;
  idTwo$: Observable<idTwo[]>;
  idOneToDisp: [];
  randomVideo: string;  
  // idOne$: Observable<idOne[]>;
  teamOneCumulative: any;
  teamTwoCumulative: any;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;  

  public teamOneSelection$: Observable<any>;
  public playersTest$: Observable<any>;
  public teamSelections$: Observable<any>;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private idTeamOne: SelectionTeamService, private playersApiService: PlayersApiService) { }

  ngOnInit(): void {
    this.teamOneSelection$ = this.playersApiService.getPlayers('TeamSelectionOne').pipe(
      map((response:any) => {
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
      })
    );

    this.playersTest$ = this.playersApiService.getPlayers('Players').pipe(
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

    this.teamSelections$ = combineLatest([this.playersTest$, this.teamOneSelection$]).pipe(
      map(([players, selection]) => {
        let selected;
        let selectedArray: any[] = [];

        for(let name of selection){
          selected = {
            t1playername: this.addPlayerLink(name.Team1Players, players),
            t1username: name.Team1Players,
            t1preelo: name.ELO1,            
            t2playername: this.addPlayerLink(name.Team2Players, players),
            t2username: name.Team2Players,
            t2preelo: name.ELO2,            
          };
          selectedArray.push(selected);          
        }

        const chanceFutureTeamOne = parseInt(selectedArray[selectedArray.length -1].t1preelo.replace(/,/g,''), 10);
        const chanceFutureTeamTwo = parseInt(selectedArray[selectedArray.length -1].t2preelo.replace(/,/g,''), 10);      

        const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne - chanceFutureTeamTwo) / 400)) * 100;
        const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo - chanceFutureTeamOne) / 400)) * 100;      

        this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
        this.chanceOfWinTeamTwoShow = this.floorPrecised(chanceOfWinTeamTwo, 2);       

        this.teamOneCumulative = selectedArray[selectedArray.length -1].t1preelo;
        this.teamTwoCumulative = selectedArray[selectedArray.length -1].t2preelo;
        // selectedArray[selectedArray.length -1].t1preelo = 
        selectedArray.pop()
        return selectedArray;           
      })
      
    )
  
    
    const videos = ['1','2','3','4'];
    this.randomVideo = videos[Math.floor(Math.random()*videos.length)];

  }

  public addPlayerLink(player:string, obj:any) {
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
    return convertedPlayer; 
  } 

  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }

}
