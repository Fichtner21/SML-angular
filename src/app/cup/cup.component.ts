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
    user1: 'Zielony',
    user2: 'jojo',
    user3: 'GlowaF1!' 
  };
  public teamB = {
    indexTeam: 1,
    user1: 'Wariat',
    user2: 'Jim',
    user3: 'Farnoy'
  };
  public teamC = {
    indexTeam: 2,
    user1: 'Cronic^',
    user2: 'Evildude',
    user3: 'Meg@Sh!ra'
  }
  public teamD = {
    indexTeam: 3,
    user1: 'ZielakPr0',
    user2: '-Illu$ioN-',
    user3: 'MaDiNfO'
  }
  public teamE = {
    indexTeam: 4,
    user1: 'SzyCha',
    user2: 'P3dr0',
    user3: 'ManikE'
  }
  public teamF = {
    indexTeam: 5,
    user1: 'gRaBaRz',
    user2: 'bAtOn',
    user3: 'Neo'
  }
  public teamG = {
    indexTeam: 6,
    user1: 'Wicio',
    user2: 'BL@DY',
    user3: 'KaPsEL'
  }
  public teamH = {
    indexTeam: 7,
    user1: 'Helm0r',
    user2: 'omega',
    user3: 'kurier'
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

    // console.log('teamA', this.teamA);
    
    // console.log('teamsAllToShow', this.teamsAllToShow[0]);
    // console.log('teamsAllToShow', this.teamsAllToShow);
    this.doubleEliminationTournament = {
      
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              // teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]              
              teams: [{name: this.teamA, score: null, title: 'Team 1: ', class: "Team1"}, {name: this.teamB, score: null, title: 'Team 2: ', class: "Team2"}]              
            },
            {
              // teams: [{name: 'Team  3', score: null}, {name: 'Team  4', score: null}]
              teams: [{name: this.teamC, score: null, title: 'Team 3: ', class: "Team3"}, {name: this.teamD, score: null, title: 'Team 4: ', class: "Team4"}] 
            },
            {
              // teams: [{name: 'Team  5', score: null}, {name: 'Team  6', score: null}]
              teams: [{name: this.teamE, score: null, title: 'Team 5', class: "Team5"}, {name: this.teamF, score: null, title: 'Team 6: ', class: "Team6"}] 
            },
            {
              // teams: [{name: 'Team  7', score: null}, {name: 'Team  8', score: null}]
              teams: [{name: this.teamG, score: null, title: 'Team 7: ', class: "Team7"}, {name: this.teamH, score: null, title: 'Team 8: ', class: "Team8"}] 
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  B', score: 1}, {name: 'Team  D', score: 2}]
            // },
            // {
            //   teams: [{name: 'Team  F', score: 1}, {name: 'Team  H', score: 2}]
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
          type: 'Loserbracket',
          matches: [
            // {
            //   teams: [{name: 'Team  A', score: 1}, {name: 'Team  C', score: 2}]
            // },
            // {
            //   teams: [{name: 'Team  E', score: 1}, {name: 'Team  G', score: 2}]
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

    // console.log('*** =>', this.doubleEliminationTournament.rounds);
    // console.log('teamsAll', this.teamsAll[0]);
    
  }

  public stylingFrame = '<style>#top-bar {background-color: red;</style>';

  ngAfterViewInit() {  
    const iframDoc = this.cupFrame.nativeElement.contentWindow.document;
    console.log('iframeDoc', iframDoc.head);
    iframDoc.head.appendChild(this.stylingFrame);
  }

  mouseHover(e:any) {
    
    // e.target.classList.add('active');
    // console.log('doc root', e.target.classList[1]);
    const ngtt__teamTitle = document.querySelectorAll('.ngtt__team-title');
    ngtt__teamTitle.forEach(el => {
      if(el.classList.contains(e.target.classList[1])){
        el.classList.add('active');
      }
    })
  }

  mouseOver(e:any){
    // console.log('e!', e);
    const ngtt__teamTitle = document.querySelectorAll('.ngtt__team-title');
    ngtt__teamTitle.forEach(el => {
      if(el.classList.contains(e.target.classList[1])){
        el.classList.remove('active');
      }
    })
    
  }
  
  public sortBracket(arr:any){
    arr.sort(() => {
      return 0.5 - Math.random();
    })
  }  

  public showHidden(user:any, ask:boolean, i:any){    
    ask = true;
    // console.log('showHidden user', user);
    // console.log('showHidden ask', ask);
    // console.log('showHidden i', i);        
    
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
