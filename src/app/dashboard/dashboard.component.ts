import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService, UserInfo } from '../services/players-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
// import _ from "lodash";

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
  t1p1name = new FormControl('');
  t1p2name = new FormControl('');
  t1p3name = new FormControl('');
  t1p4name = new FormControl('');
  t1p5name = new FormControl('');
  t1p6name = new FormControl('');
  t1p7name = new FormControl('');
  filteredOptionsT1p1name: Observable<any>;
  filteredOptionsT1p2name: Observable<any>;
  filteredOptionsT1p3name: Observable<any>;
  filteredOptionsT1p4name: Observable<any>;
  filteredOptionsT1p5name: Observable<any>;
  filteredOptionsT1p6name: Observable<any>;
  filteredOptionsT1p7name: Observable<any>;
  options: any[] = [];
  playersToWar: FormGroup;
  team1preview: any;
  

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient, private readonly oAuthService: OAuthService, private formBuilder: FormBuilder,) { 
    // googleApi.userProfileSubject.subscribe( info => {
    //   console.log('info', info);
    //   this.userInfo = info
    // })
    // console.log(googleApi);    

   
    this.playersToWar = this.formBuilder.group({
      t1p1name: [''],
      t1p2name: [''],
      t1p3name: [''],
      t1p4name: [''],
      t1p5name: [''],
      t1p6name: [''],
      t1p7name: [''],
    })
  }  

  ngOnInit(): void { 
    this.addAmatch$ = this.googleApi.getPlayers('Add+a+Match').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;       
        // let players: any[] = [];
        // for(let i = 1; i < batchRowValues.length; i++){
        //   const rowObject: object = {};
        //   for(let j = 0; j < batchRowValues[i].length; j++){
        //     rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
        //   }
        //   players.push(rowObject);
        // }        
        // console.log('Add a Match values:', players)
        // return players;
        return batchRowValues;
      }),
    ); 
    // const addAmatchArray = this.addAmatch$.subscribe();
    this.players$ = this.googleApi.getPlayers('Players').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;
        // console.log('player 1', batchRowValues[1])        
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          
          players.push(rowObject);
        }     
     
        return players;
        // return batchRowValues[1];
      }),
    ); 
    this.filteredOptionsT1p1name = this.t1p1name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p2name = this.t1p2name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p3name = this.t1p3name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p4name = this.t1p4name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p5name = this.t1p5name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p6name = this.t1p6name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT1p7name = this.t1p7name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   

    this.players$.subscribe(data => {
      this.options = data;
    })

    this.googleApi.getPriviewPlayers().subscribe(data => {
      this.team1preview = data['values'];
      console.log('this.team1preview', this.team1preview)
      console.log('this.team1preview data', data)
    
      // If less then 7 players add array with empty string
      const t1preview = this.team1preview.concat(Array(7 - this.team1preview.length).fill([''])) 

      // set value from values from GET
      this.t1p1name?.setValue(t1preview[0][0]); 
      this.t1p2name?.setValue(t1preview[1][0]); 
      this.t1p3name?.setValue(t1preview[2][0]); 
      this.t1p4name?.setValue(t1preview[3][0]); 
      this.t1p5name?.setValue(t1preview[4][0]);
      this.t1p6name?.setValue(t1preview[5][0]);
      this.t1p7name?.setValue(t1preview[6][0]);     
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.playername.toLowerCase().includes(filterValue));     
  }

  onSubmit(){
    // const { value } = this.playersToWar;
    // console.log('value', value)
    const t1p1name = this.t1p1name.value != null ? this.t1p1name.value : ''; 
    const t1p2name = this.t1p2name.value != null ? this.t1p2name.value : '';
    const t1p3name = this.t1p3name.value != null ? this.t1p3name.value : '';;
    const t1p4name = this.t1p4name.value != null ? this.t1p4name.value : '';;
    const t1p5name = this.t1p5name.value != null ? this.t1p5name.value : '';;
    const t1p6name = this.t1p6name.value != null ? this.t1p6name.value : '';;
    const t1p7name = this.t1p7name.value != null ? this.t1p7name.value : '';;
    console.log(
      't1p1name', t1p1name,
      't1p2name', t1p2name,
      't1p3name', t1p3name,
      't1p4name', t1p4name,
      't1p5name', t1p5name,
      't1p6name', t1p6name,
      't1p7name', t1p7name
    )
  
    // const playerToPick = this.playersToWar.value.t1p1name.value;
    // console.log('playerToPick form:', playerToPick)
    // console.log('value form:', value.t1p1name.value)
    // console.log('value form:', value.t1p2name.value)
    // this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', '', '', '', '', '', '', '').subscribe();
   

  this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name,         t1p6name, t1p7name).subscribe({
        next: (res) => {
          console.log('update cell res =>', res)
          
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });
  setTimeout(() => {
    
    this.googleApi.getPriviewPlayers().subscribe(data => {
        this.team1preview = data['values'];
        // console.log('this.team1preview', this.team1preview)
        // console.log('this.team1preview', data)
      }, error => {
        console.log('error getPriviewPlayers', error)
      })      
     
    }, 3000)    
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

  clearTeam(){
    this.t1p1name.reset()
    this.t1p2name.reset()
    this.t1p3name.reset()
    this.t1p4name.reset()
    this.t1p5name.reset()
    this.t1p6name.reset()
    this.t1p7name.reset()
  }

  // updateCell(){
  //   this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12', 'jojo').subscribe({
  //     next: (res) => {
  //       console.log('update cell res =>', res)
  //     },
  //     error: (err) => {
  //       console.log('update cell err =>', err)
  //     }
  //   })
  // }
  
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