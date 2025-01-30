import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Button } from 'protractor';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NgttTournament } from '../../../projects/ng-tournament-tree/src/lib/declarations/interfaces';
import { PlayersApiService } from '../services/players-api.service';
import { TeamCup } from './cup.model';
import {HostListener} from '@angular/core';
import { Spinkit } from 'ng-http-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tt-root',
  templateUrl: './cup.component.html',
  styleUrls: ['./cup.component.scss']
})
export class CupComponent implements OnInit, AfterViewInit {
  public spinkit = Spinkit;
  public singleEliminationTournament: NgttTournament;
  public doubleEliminationTournament: NgttTournament; 
  // public teamsCup$: Observable<TeamCup[]>;
  public teamsCup = new Subject();
  public teamsAll: any;
  public teamsAllToShow = [];
  public teammA: any;
 
  public bracket1 = [
    { 
      status: false,    
      name: 'Zielony'
    }, 
    {
      status: false,
      name: 'Zielakpr0',
    },
    {
      status: false,
      name: 'Szycha',
    },
    {
      status: false,
      name: 'KaPsEL',
    },
    {
      status: false,
      name: 'Helm0r',
    },
    {
      status: false,
      name: 'Wariat',
    },
    {
      status: false,
      name: 'Cronic',
    },
    {
      status: false,
      name: 'Neo',
    }
  ]; 
 
  public bracket2 = [
    {
      status: false,
      name: 'Evildude'
    },
    {
      status: false,
      name: 'Omega'
    },
    {
      status: false,
      name: 'BL@DY'
    },
    {
      status: false,
      name: 'Jim'
    },
    {
      status: false,
      name: '-Illu$ioN-'
    },
    {
      status: false,
      name: 'P3dr0'
    },
    {
      status: false,
      name: 'jojo'
    },
    {
      status: false,
      name: 'bAtOn'
    }           
  ];
  
  public bracket3 = [
    {
      status: false,
      name: 'GlowaF1!'
    },
    {
      status: false,
      name: 'Meg@Sh!Ra'
    },
    {
      status: false,
      name: 'MaDiNfO'
    },
    {
      status: false,
      name: 'ManikE'
    },
    {
      status: false,
      name: 'Wicio'
    },
    {
      status: false,
      name: 'kurier'
    },
    {
      status: false,
      name: 'gRaBaRz'
    },
    {
      status: false,
      name: 'Farnoy'
    }    
  ];
  
  public teamA = {
    indexTeam: 0,
    user1: `Pills N' Whine`,
    user2: '',
    user3: '' 
  };
  public teamB = {
    indexTeam: 1,
    user1: 'exclus1ve gaming',
    user2: '',
    user3: ''
  };
  public teamC = {
    indexTeam: 2,
    user1: 'Quinas',
    user2: '',
    user3: ''
  }
  public teamD = {
    indexTeam: 3,
    user1: 'TeamForce',
    user2: '',
    user3: ''
  }
  public teamE = {
    indexTeam: 4,
    user1: 'ĆIPA',
    user2: '',
    user3: ''
  }
  public teamF = {
    indexTeam: 5,
    user1: 'no name',
    user2: '',
    user3: ''
  }
  public teamG = {
    indexTeam: 6,
    user1: 'wanksluts',
    user2: '',
    user3: ''
  }
  public teamH = {
    indexTeam: 7,
    user1: 'egypt',
    user2: '',
    user3: ''
  }

  public renderedTree: 'se' | 'de' = 'de';
  @Output() elemHovered: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('cupFrame') public cupFrame: any;  

  constructor(private playersApiService: PlayersApiService, @Inject(DOCUMENT) private document: any) {
    
  }

  ngOnInit() {    
    this.teamsAll = this.playersApiService.getPlayers('Cup').pipe(
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
      })      
    ).subscribe(res => {     
      // console.log('res', res[0]);
      // this.teamA = {
      //   indexTeam: res[0].lp,
      //   user1: res[0].user1,
      //   user2: res[0].user2,
      //   user3: res[0].user3
      // }
      // return res;
    });
   
    this.doubleEliminationTournament = {
      
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              // teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]              
              teams: [{name: this.teamA, score: 1, title: 'Team 1: ', class: "Team1"}, {name: this.teamB, score: 2, title: 'Team 2: ', class: "Team2"}]              
            },
            {
              // teams: [{name: 'Team  3', score: null}, {name: 'Team  4', score: null}]
              teams: [{name: this.teamC, score: 3, title: 'Team 3: ', class: "Team3"}, {name: this.teamD, score: 4, title: 'Team 4: ', class: "Team4"}] 
            },
            {
              // teams: [{name: 'Team  5', score: null}, {name: 'Team  6', score: null}]
              teams: [{name: this.teamE, score: 5, title: 'Team 5', class: "Team5"}, {name: this.teamF, score: 6, title: 'Team 6: ', class: "Team6"}] 
            },
            {
              // teams: [{name: 'Team  7', score: null}, {name: 'Team  8', score: null}]
              teams: [{name: this.teamG, score: 7, title: 'Team 7: ', class: "Team7"}, {name: this.teamH, score: 8, title: 'Team 8: ', class: "Team8"}] 
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: this.teamB, score: 1, class: 'Team2'}, {name: this.teamD, score: 2, class: 'Team4'}]
            },
            {
              teams: [{name: this.teamF, score: 1, class: 'Team6'}, {name: this.teamH, score: 2, class: 'Team8'}]
            }
            // {           
            //   teams: [{}]
            // },
            // {
            //   teams: [{}]
            // }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [{name: this.teamA, score: 1, class: 'Team1'}, {name: this.teamC, score: 2}]
            },
            {
              teams: [{name: this.teamE, score: 1}, {name: this.teamG, score: 2}]
            }
            // {
            //   teams: [{}]
            // },
            // {
            //   teams: [{}]
            // }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  C', score: 1}, {name: 'Team  B', score: 2}]
            // },
            // {
            //   teams: [{name: 'Team  G', score: 1}, {name: 'Team  F', score: 2}]
            // }
            {
              teams: [{}]
            },
            {
              teams: [{}]
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  D', score: 1}, {name: 'Team  H', score: 2}]
            // }
            {
              teams: [{}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  B', score: 1}, {name: 'Team  F', score: 2}]
            // }
            {
              teams: [{}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  D', score: 1}, {name: 'Team  F', score: 2}]
            // }
            {
              teams: [{}]
            }
          ]
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                // {
                //   name: 'Team  H',
                //   // name: '',
                //   score: 1
                //   // score: null
                // },
                // {
                //   name: 'Team  F',
                //   // name: '',
                //   score: 2
                //   // score: null
                // }
                {
                 
                },
                {
                  
                }
              ]
            }
          ]
        }
      ]
    };      
  }

  public stylingFrame = '<style>#top-bar {background-color: red;</style>';

  ngAfterViewInit() {  
    // const iframDoc = this.cupFrame.nativeElement.contentWindow.document;
    // console.log('iframeDoc', iframDoc.head);
    // iframDoc.head.appendChild(this.stylingFrame);
  }

  mouseHover(e: any) {   
    const className = e.target.classList[1]; // Pobieramy klasę drużyny np. "team1"
    if (!className) return;
  
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
      el.classList.add('highlight-text', 'highlight-bg');
    });
  }
  
  mouseOver(e: any) {    
    const className = e.target.classList[1];
    if (!className) return;
  
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
      el.classList.remove('highlight-text', 'highlight-bg');
    });
  }
  
  public sortBracket(arr:any){
    arr.sort(() => {
      return 0.5 - Math.random();
    })
  }  

  public showHidden(user:any, ask:boolean, i:any){    
    ask = true;
       
    if(this.teamA.indexTeam == i){
      if(this.teamA.user1 == ''){
        this.teamA.user1 = user;
      } else if(this.teamA.user2 == ''){
        this.teamA.user2 = user;
      } else if(this.teamA.user3 == ''){
        this.teamA.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    // console.log(this.teamA);
    if(this.teamB.indexTeam == i){
      if(this.teamB.user1 == ''){
        this.teamB.user1 = user;
      } else if(this.teamB.user2 == ''){
        this.teamB.user2 = user;
      } else if(this.teamB.user3 == ''){
        this.teamB.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamC.indexTeam == i){
      if(this.teamC.user1 == ''){
        this.teamC.user1 = user;
      } else if(this.teamC.user2 == ''){
        this.teamC.user2 = user;
      } else if(this.teamC.user3 == ''){
        this.teamC.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamD.indexTeam == i){
      if(this.teamD.user1 == ''){
        this.teamD.user1 = user;
      } else if(this.teamD.user2 == ''){
        this.teamD.user2 = user;
      } else if(this.teamD.user3 == ''){
        this.teamD.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamE.indexTeam == i){
      if(this.teamE.user1 == ''){
        this.teamE.user1 = user;
      } else if(this.teamE.user2 == ''){
        this.teamE.user2 = user;
      } else if(this.teamE.user3 == ''){
        this.teamE.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamF.indexTeam == i){
      if(this.teamF.user1 == ''){
        this.teamF.user1 = user;
      } else if(this.teamF.user2 == ''){
        this.teamF.user2 = user;
      } else if(this.teamF.user3 == ''){
        this.teamF.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamG.indexTeam == i){
      if(this.teamG.user1 == ''){
        this.teamG.user1 = user;
      } else if(this.teamG.user2 == ''){
        this.teamG.user2 = user;
      } else if(this.teamG.user3 == ''){
        this.teamG.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    if(this.teamH.indexTeam == i){
      if(this.teamH.user1 == ''){
        this.teamH.user1 = user;
      } else if(this.teamH.user2 == ''){
        this.teamH.user2 = user;
      } else if(this.teamH.user3 == ''){
        this.teamH.user3 = user;
      } else {
        console.log('yyyy??');
      }      
    } 
    // console.log('^^^ =>', this.doubleEliminationTournament.rounds);
   
  }

  public getMultipleRandom(arr:any, num:any) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    // console.log('2 random el:', shuffled.slice(0, num));
    const shuffledArr = shuffled.slice(0, num);
    shuffledArr.forEach(el => {
      el.status = true;
    })
    console.log('shuffledArr', shuffledArr);
    return shuffledArr;
  }

  public hiddenUser(user1:any, user2:any){
    // console.log('user1', user1);
    // console.log('user2', user2);
  }
}
