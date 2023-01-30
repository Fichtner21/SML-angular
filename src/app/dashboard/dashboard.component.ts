import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService, UserInfo } from '../services/players-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit { 
  mailSnippets: string[] = []
  userInfo?: UserInfo; 
  public addAmatch$: Observable<any>;
  public players$: Observable<any>;

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient, private readonly oAuthService: OAuthService) { 
    // googleApi.userProfileSubject.subscribe( info => {
    //   console.log('info', info);
    //   this.userInfo = info
    // })
    // console.log(googleApi);
  }  

  ngOnInit(): void { 
    this.addAmatch$ = this.googleApi.getPlayers('Add+a+Match').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;
        console.log('batchRowValues', batchRowValues)
        // let players: any[] = [];
        // for(let i = 1; i < batchRowValues.length; i++){
        //   const rowObject: object = {};
        //   for(let j = 0; j < batchRowValues[i].length; j++){
        //     rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
        //   }
        //   players.push(rowObject);
        // }        
        // return players;
        return batchRowValues;
      }),
    ); 
    // const addAmatchArray = this.addAmatch$.subscribe();
    this.players$ = this.googleApi.getPlayers('Players').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;
        console.log('player 1', batchRowValues[1])        
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          
          players.push(rowObject);
        }        
        console.log('players all', players)
        return players;
        // return batchRowValues[1];
      }),
    ); 
  }

  balanceTeams(){
    this.googleApi.runScriptFunction('balanceTeams').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  selectTeams(){
    this.googleApi.runScriptFunction('selectTeams').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  sortPlayers(){
    this.googleApi.runScriptFunction('sortPlayers').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  getStatistics(){
    this.googleApi.runScriptFunction('getStatistics').subscribe({
      next: (res) => {
        console.log('res =>', res)
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }
  
  isLoggedIn(): boolean {    
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  // async getEmails() {
  //   if (!this.userInfo) {
  //     return;
  //   }

  //   const userId = this.userInfo?.info.sub as string
  //   const messages = await (this.googleApi.emails(userId)).toPromise()
  //   messages.messages.forEach( (element: any) => {
  //     const mail = (this.googleApi.getMail(userId, element.id)).toPromise()
  //     mail.then( mail => {
  //       this.mailSnippets.push(mail.snippet)
  //     })
  //   });
  // }
}