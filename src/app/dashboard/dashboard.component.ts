import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService, UserInfo } from '../services/players-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
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
  // Team 1
  t1p1name = new FormControl('');
  t1p2name = new FormControl('');
  t1p3name = new FormControl('');
  t1p4name = new FormControl('');
  t1p5name = new FormControl('');
  t1p6name = new FormControl('');
  t1p7name = new FormControl('');
  t1p1preelo = new FormControl('');
  t1p2preelo = new FormControl('');
  t1p3preelo = new FormControl('');
  t1p4preelo = new FormControl('');
  t1p5preelo = new FormControl('');
  t1p6preelo = new FormControl('');
  t1p7preelo = new FormControl('');
  filteredOptionsT1p1name: Observable<any>;
  filteredOptionsT1p2name: Observable<any>;
  filteredOptionsT1p3name: Observable<any>;
  filteredOptionsT1p4name: Observable<any>;
  filteredOptionsT1p5name: Observable<any>;
  filteredOptionsT1p6name: Observable<any>;
  filteredOptionsT1p7name: Observable<any>;
  // Team 2
  t2p1name = new FormControl('');
  t2p2name = new FormControl('');
  t2p3name = new FormControl('');
  t2p4name = new FormControl('');
  t2p5name = new FormControl('');
  t2p6name = new FormControl('');
  t2p7name = new FormControl('');
  t2p1preelo = new FormControl('');
  t2p2preelo = new FormControl('');
  t2p3preelo = new FormControl('');
  t2p4preelo = new FormControl('');
  t2p5preelo = new FormControl('');
  t2p6preelo = new FormControl('');
  t2p7preelo = new FormControl('');
  filteredOptionsT2p1name: Observable<any>;
  filteredOptionsT2p2name: Observable<any>;
  filteredOptionsT2p3name: Observable<any>;
  filteredOptionsT2p4name: Observable<any>;
  filteredOptionsT2p5name: Observable<any>;
  filteredOptionsT2p6name: Observable<any>;
  filteredOptionsT2p7name: Observable<any>;
  options: any[] = [];
  playersToWar: FormGroup;
  teamTwoToWar: FormGroup;
  eloAndScoreTeamOne: FormGroup;
  eloAndScoreTeamTwo: FormGroup;
  team1preview: any;
  team2preview: any;
  private readonly notifier: NotifierService;  
  disabled: boolean = true;

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient, private readonly oAuthService: OAuthService, private formBuilder: FormBuilder,notifierService: NotifierService) { 
    // googleApi.userProfileSubject.subscribe( info => {
    //   console.log('info', info);
    //   this.userInfo = info
    // })
    // console.log(googleApi);    
    this.notifier = notifierService;
   
    // Team One Form
    this.playersToWar = this.formBuilder.group({
      t1p1name: [''],
      t1p2name: [''],
      t1p3name: [''],
      t1p4name: [''],
      t1p5name: [''],
      t1p6name: [''],
      t1p7name: [''],
    });

    // Team Two Form
    this.teamTwoToWar = this.formBuilder.group({
      t2p1name: [''],
      t2p2name: [''],
      t2p3name: [''],
      t2p4name: [''],
      t2p5name: [''],
      t2p6name: [''],
      t2p7name: [''],
    });

    this.eloAndScoreTeamOne = this.formBuilder.group({
      t1p1preelo: [''],
      t1p2preelo: [''],
      t1p3preelo: [''],
      t1p4preelo: [''],
      t1p5preelo: [''],
      t1p6preelo: [''],
      t1p7preelo: [''],
      t1p1score: [''],
      t1p2score: [''],
      t1p3score: [''],
      t1p4score: [''],
      t1p5score: [''],
      t1p6score: [''],
      t1p7score: [''],
    })

    this.eloAndScoreTeamTwo = this.formBuilder.group({
      t2p1preelo: [''],
      t2p2preelo: [''],
      t2p3preelo: [''],
      t2p4preelo: [''],
      t2p5preelo: [''],
      t2p6preelo: [''],
      t2p7preelo: [''],
      t2p1score: [''],
      t2p2score: [''],
      t2p3score: [''],
      t2p4score: [''],
      t2p5score: [''],
      t2p6score: [''],
      t2p7score: [''],
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
    this.filteredOptionsT2p1name = this.t2p1name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p2name = this.t2p2name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p3name = this.t2p3name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p4name = this.t2p4name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p5name = this.t2p5name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p6name = this.t2p6name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   
    this.filteredOptionsT2p7name = this.t2p7name.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    )   

    this.players$.subscribe(data => {
      this.options = data;
    })

    this.googleApi.getMultipleRanges('A12:C18').subscribe(data => {
      this.team1preview = data['values'];    
      console.log('this.team1preview 0 0', this.team1preview[0][1])
      console.log('this.team1preview 1 1', this.team1preview[0][2])
      console.log('this.team1preview', this.team1preview)
      // If less then 7 players add array with empty string
      const t1preview = this.team1preview.concat(Array(7 - this.team1preview.length).fill(['']))      

      // Add everytimes 3 fieldsin row
      const t1p1row = t1preview[0].concat(Array(3 - t1preview[0].length).fill(''));      
      const t1p2row = t1preview[1].concat(Array(3 - t1preview[1].length).fill(''));      
      const t1p3row = t1preview[2].concat(Array(3 - t1preview[2].length).fill(''));      
      const t1p4row = t1preview[3].concat(Array(3 - t1preview[3].length).fill(''));      
      const t1p5row = t1preview[4].concat(Array(3 - t1preview[4].length).fill(''));      
      const t1p6row = t1preview[5].concat(Array(3 - t1preview[5].length).fill(''));      
      const t1p7row = t1preview[6].concat(Array(3 - t1preview[6].length).fill(''));      

      // set value from values from GET
      this.t1p1name?.setValue(t1p1row[0]); 
      this.t1p2name?.setValue(t1p2row[0]); 
      this.t1p4name?.setValue(t1p3row[0]); 
      this.t1p3name?.setValue(t1p4row[0]); 
      this.t1p5name?.setValue(t1p5row[0]);
      this.t1p6name?.setValue(t1p6row[0]);
      this.t1p7name?.setValue(t1p7row[0]);  
      
      //Team 1 Initial ELO
      this.t1p1preelo?.setValue(t1p1row[1]);
      this.t1p2preelo?.setValue(t1p2row[1]);
      this.t1p3preelo?.setValue(t1p3row[1]);
      this.t1p4preelo?.setValue(t1p4row[1]);
      this.t1p5preelo?.setValue(t1p5row[1]);
      this.t1p6preelo?.setValue(t1p6row[1]);
      this.t1p7preelo?.setValue(t1p7row[1]);

      console.log('t1preview', t1preview)
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

    this.googleApi.getMultipleRanges('A23:C29').subscribe(data => {
      this.team2preview = data['values'];    
      console.log('this.team1preview 0 0', this.team2preview[0][1])
      console.log('this.team1preview 1 1', this.team2preview[0][2])
      console.log('this.team1preview', this.team2preview)
      // If less then 7 players add array with empty string
      const t2preview = this.team2preview.concat(Array(7 - this.team2preview.length).fill(['']))      

      // Add everytimes 3 fieldsin row
      const t2p1row = t2preview[0].concat(Array(3 - t2preview[0].length).fill(''));      
      const t2p2row = t2preview[1].concat(Array(3 - t2preview[1].length).fill(''));      
      const t2p3row = t2preview[2].concat(Array(3 - t2preview[2].length).fill(''));      
      const t2p4row = t2preview[3].concat(Array(3 - t2preview[3].length).fill(''));      
      const t2p5row = t2preview[4].concat(Array(3 - t2preview[4].length).fill(''));      
      const t2p6row = t2preview[5].concat(Array(3 - t2preview[5].length).fill(''));      
      const t2p7row = t2preview[6].concat(Array(3 - t2preview[6].length).fill(''));      

      // TEAM 2 set value from values from GET
      this.t2p1name?.setValue(t2p1row[0]); 
      this.t2p2name?.setValue(t2p2row[0]); 
      this.t2p4name?.setValue(t2p3row[0]); 
      this.t2p3name?.setValue(t2p4row[0]); 
      this.t2p5name?.setValue(t2p5row[0]);
      this.t2p6name?.setValue(t2p6row[0]);
      this.t2p7name?.setValue(t2p7row[0]);  
      
      //Team 2 Initial ELO
      this.t2p1preelo?.setValue(t2p1row[1]);
      this.t2p2preelo?.setValue(t2p2row[1]);
      this.t2p3preelo?.setValue(t2p3row[1]);
      this.t2p4preelo?.setValue(t2p4row[1]);
      this.t2p5preelo?.setValue(t2p5row[1]);
      this.t2p6preelo?.setValue(t2p6row[1]);
      this.t2p7preelo?.setValue(t2p7row[1]);

      console.log('t1preview', t2preview)
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
    //TEAM 1
    const t1p1name = this.t1p1name.value != null ? this.t1p1name.value : ''; 
    const t1p2name = this.t1p2name.value != null ? this.t1p2name.value : '';
    const t1p3name = this.t1p3name.value != null ? this.t1p3name.value : '';
    const t1p4name = this.t1p4name.value != null ? this.t1p4name.value : '';
    const t1p5name = this.t1p5name.value != null ? this.t1p5name.value : '';
    const t1p6name = this.t1p6name.value != null ? this.t1p6name.value : '';
    const t1p7name = this.t1p7name.value != null ? this.t1p7name.value : '';

    //TEAM 2
    const t2p1name = this.t2p1name.value != null ? this.t2p1name.value : ''; 
    const t2p2name = this.t2p2name.value != null ? this.t2p2name.value : '';
    const t2p3name = this.t2p3name.value != null ? this.t2p3name.value : '';
    const t2p4name = this.t2p4name.value != null ? this.t2p4name.value : '';
    const t2p5name = this.t2p5name.value != null ? this.t2p5name.value : '';
    const t2p6name = this.t2p6name.value != null ? this.t2p6name.value : '';
    const t2p7name = this.t2p7name.value != null ? this.t2p7name.value : '';
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
   

  this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name,  t1p6name, t1p7name).subscribe({
        next: (res) => {
          console.log('update cell res =>', res)
          
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });
  setTimeout(() => {
    
    this.googleApi.getMultipleRanges('A12:C18').subscribe(data => {
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
        console.log('this.notifier', this.notifier)
        this.notifier.notify('success', 'getStatistics() done!');
      },
      error: (err) => {
        console.log('err =>', err)
        this.notifier.notify('error', 'getStatistics() not done!');
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

  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
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