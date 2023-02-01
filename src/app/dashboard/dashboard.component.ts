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
  cumulativeTeamOne = new FormControl('');
  roundsWonTeamOne = new FormControl('');
  t1p1preelo = new FormControl('');
  t1p2preelo = new FormControl('');
  t1p3preelo = new FormControl('');
  t1p4preelo = new FormControl('');
  t1p5preelo = new FormControl('');
  t1p6preelo = new FormControl('');
  t1p7preelo = new FormControl('');
  t1cumulative = new FormControl('');
  filteredOptionsT1p1name: Observable<any>;
  filteredOptionsT1p2name: Observable<any>;
  filteredOptionsT1p3name: Observable<any>;
  filteredOptionsT1p4name: Observable<any>;
  filteredOptionsT1p5name: Observable<any>;
  filteredOptionsT1p6name: Observable<any>;
  filteredOptionsT1p7name: Observable<any>;
  t1p1score = new FormControl('');
  t1p2score = new FormControl('');
  t1p3score = new FormControl('');
  t1p4score = new FormControl('');
  t1p5score = new FormControl('');
  t1p6score = new FormControl('');
  t1p7score = new FormControl('');
  t1sumFrags = new FormControl('');
  t1roundsWon = new FormControl('');
  t1roundsWonInput = new FormControl('');
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
  t2cumulative = new FormControl('');
  filteredOptionsT2p1name: Observable<any>;
  filteredOptionsT2p2name: Observable<any>;
  filteredOptionsT2p3name: Observable<any>;
  filteredOptionsT2p4name: Observable<any>;
  filteredOptionsT2p5name: Observable<any>;
  filteredOptionsT2p6name: Observable<any>;
  filteredOptionsT2p7name: Observable<any>;
  t2p1score = new FormControl('');
  t2p2score = new FormControl('');
  t2p3score = new FormControl('');
  t2p4score = new FormControl('');
  t2p5score = new FormControl('');
  t2p6score = new FormControl('');
  t2p7score = new FormControl('');
  t2sumFrags = new FormControl('');
  t2roundsWon = new FormControl('');
  t2roundsWonInput = new FormControl('');
  emptyCell = new FormControl('');
  headDesc = new FormControl('');
  options: any[] = [];
  playersToWar: FormGroup;
  teamTwoToWar: FormGroup;
  preEloTeamOne: FormGroup;
  scoreTeamOne: FormGroup;
  preEloTeamTwo: FormGroup;
  scoreTeamTwo: FormGroup;
  teamOneRoundsWon: FormGroup;
  teamTwoRoundsWon: FormGroup;
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

    this.preEloTeamOne = this.formBuilder.group({
      t1p1preelo: [''],
      t1p2preelo: [''],
      t1p3preelo: [''],
      t1p4preelo: [''],
      t1p5preelo: [''],
      t1p6preelo: [''],
      t1p7preelo: [''],   
      t1cumulative: ['']   
    })

    this.scoreTeamOne = this.formBuilder.group({
      t1p1score: [''],
      t1p2score: [''],
      t1p3score: [''],
      t1p4score: [''],
      t1p5score: [''],
      t1p6score: [''],
      t1p7score: [''],
      t1sumFrags: [''],
      t1roundsWon: ['']
    })

    this.preEloTeamTwo = this.formBuilder.group({
      t2p1preelo: [''],
      t2p2preelo: [''],
      t2p3preelo: [''],
      t2p4preelo: [''],
      t2p5preelo: [''],
      t2p6preelo: [''],
      t2p7preelo: [''],
      t2cumulative: ['']    
    })

    this.scoreTeamTwo = this.formBuilder.group({
      emptyCell: [''],
      headDesc: [''],
      t2p1score: [''],
      t2p2score: [''],
      t2p3score: [''],
      t2p4score: [''],
      t2p5score: [''],
      t2p6score: [''],
      t2p7score: [''],
      t2sumFrags: [''],
      t2roundsWon: ['']
    })

    this.teamOneRoundsWon = this.formBuilder.group({
      t1roundsWonInput: ['']
    });

    this.teamTwoRoundsWon = this.formBuilder.group({
      t2roundsWonInput: ['']
    });
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

    // *** TEAM ONE ***    
    this.googleApi.getMultipleRanges('A12:C20').subscribe(data => {
      this.team1preview = data['values'];         
      // If less then 7 players add array with empty string
      const t1preview = this.team1preview.concat(Array(9 - this.team1preview.length).fill(['']))      

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
      this.t1cumulative?.setValue('');

      // console.log('t1preview', t1preview)
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

    

    // *** TEAM TWO ***    
    this.googleApi.getMultipleRanges('A23:C29').subscribe(data => {
      this.team2preview = data['values'];    
  
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
      this.t2p3name?.setValue(t2p3row[0]); 
      this.t2p4name?.setValue(t2p4row[0]); 
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
      this.t2cumulative?.setValue('');

      // console.log('t2preview', t2preview)
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.playername.toLowerCase().includes(filterValue));     
  }

  scoresTwoTeams(){
    const formValues = {
      ...this.scoreTeamOne.value,
      ...this.scoreTeamTwo.value,
      ...this.teamOneRoundsWon.value,
      ...this.teamTwoRoundsWon.value
    }
    console.log('formValues', formValues)
    const t1p1score = formValues.t1p1score;
    const t1p2score = formValues.t1p2score;
    const t1p3score = formValues.t1p3score;
    const t1p4score = formValues.t1p4score;
    const t1p5score = formValues.t1p5score;
    const t1p6score = formValues.t1p6score;
    const t1p7score = formValues.t1p7score;
    const t1sumFrags = '=SUMA.JEŻELI(C12:C18,"<>#N/A")';
    const t1roundsWon = Number(formValues.t1roundsWon);
    const emptyCell = '';
    const headDesc = 'Combat Score';
    const t2p1score = formValues.t2p1score;
    const t2p2score = formValues.t2p2score;
    const t2p3score = formValues.t2p3score;
    const t2p4score = formValues.t2p4score;
    const t2p5score = formValues.t2p5score;
    const t2p6score = formValues.t2p6score;
    const t2p7score = formValues.t2p7score;
    const t2sumFrags = '=SUMA.JEŻELI(C23:C29,"<>#N/A")';
    const t2roundsWon = Number(formValues.t2roundsWon);
    const t1roundsWonInput = formValues.t1roundsWonInput;
    const t2roundsWonInput = formValues.t2roundsWonInput;  
   
    //TEAM ONE
    this.googleApi.updateRoundsWon('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo','Add+a+Match','B20', t1roundsWonInput).subscribe({
      next: (res) => {
            console.log('updateRoundsWon res =>', res)
            
          },
          error: (err) => {
            console.log('updateRoundsWon err =>', err)
          }
    })

    //TEAM TWO
    this.googleApi.updateRoundsWon('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo','Add+a+Match','B31', t2roundsWonInput).subscribe({
      next: (res) => {
            console.log('updateRoundsWon res =>', res)
            
          },
          error: (err) => {
            console.log('updateRoundsWon err =>', err)
          }
    })

    this.googleApi.sendScore('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo','Add+a+Match','C12:C31', t1p1score, t1p2score, t1p3score, t1p4score, t1p5score, t1p6score, t1p7score, t1sumFrags, t1roundsWon, emptyCell, headDesc, t2p1score, t2p2score, t2p3score, t2p4score, t2p5score, t2p6score, t2p7score, t2sumFrags, t2roundsWon).subscribe({
      next: (res) => {
        console.log('sendScore res =>', res)
        this.updateELO();
      },
      error: (err) => {
        console.log('sendScore err =>', err)
      }
    })
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
          console.log('update cells A12:A18 res =>', res)
          this.getInitialEloTeamOne('B12:B19'); 
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', t2p1name, t2p2name, t2p3name, t2p4name, t2p5name,  t2p6name, t2p7name).subscribe({
        next: (res) => {
          console.log('update cells A23:A29 res =>', res)
          this.getInitialEloTeamTwo('B23:B30') 
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });       
  }

  onOptionSelectedOne(event: any) {
    console.log('************* event =>', event.option)    
  }
  getInitialEloTeamOne(range: string){
    this.googleApi.getMultipleRanges(range).subscribe(data => {
      const values = data['values'];
     
      this.t1p1preelo?.setValue(values[0]); 
      this.t1p2preelo?.setValue(values[1]); 
      this.t1p3preelo?.setValue(values[2]); 
      this.t1p4preelo?.setValue(values[3]); 
      this.t1p5preelo?.setValue(values[4]);
      this.t1p6preelo?.setValue(values[5]);
      this.t1p7preelo?.setValue(values[6]);
      this.t1cumulative?.setValue(values[7]);
      console.log(
        'values[0]', values[0],
        'values[1]', values[1],
        'values[2]', values[2],
        'values[7]', values[7]
      )
    })
  }

  getInitialEloTeamTwo(range: string){
    this.googleApi.getMultipleRanges(range).subscribe(data => {
      const values = data['values'];
     
      this.t2p1preelo?.setValue(values[0]); 
      this.t2p2preelo?.setValue(values[1]); 
      this.t2p3preelo?.setValue(values[2]); 
      this.t2p4preelo?.setValue(values[3]); 
      this.t2p5preelo?.setValue(values[4]);
      this.t2p6preelo?.setValue(values[5]);
      this.t2p7preelo?.setValue(values[6]);
      this.t2cumulative?.setValue(values[7]);
      console.log(
        'values[0]', values[0],
        'values[1]', values[1],
        'values[2]', values[2],
        'values[7]', values[7]
      )
    })
  }

  balanceTeams(){
    this.googleApi.runScriptFunction('balanceTeams').subscribe({
      next: (res) => {
        console.log('BALANCE res =>', res)
        // this.selectTeams();
       
        this.googleApi.runScriptFunction('selectTeams').subscribe({
          next: (res) => {
            console.log(' SELECT res =>', res)
            setTimeout(() => {
              // *** TEAM ONE ***
             this.googleApi.getMultipleRanges('A12:B19').subscribe(data => {
               this.team1preview = data['values'];         
               // If less then 7 players add array with empty string
               const t1preview = this.team1preview.concat(Array(8 - this.team1preview.length).fill(['']))      
         
               // Add everytimes 3 fieldsin row
               const t1p1row = t1preview[0].concat(Array(2 - t1preview[0].length).fill(''));     
               const t1p2row = t1preview[1].concat(Array(2 - t1preview[1].length).fill(''));      
               const t1p3row = t1preview[2].concat(Array(2 - t1preview[2].length).fill(''));      
               const t1p4row = t1preview[3].concat(Array(2 - t1preview[3].length).fill(''));      
               const t1p5row = t1preview[4].concat(Array(2 - t1preview[4].length).fill(''));      
               const t1p6row = t1preview[5].concat(Array(2 - t1preview[5].length).fill(''));      
               const t1p7row = t1preview[6].concat(Array(2 - t1preview[6].length).fill(''));      
         
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
         
               // console.log('t1preview', t1preview)
             }, error => {
               console.log('error getPriviewPlayers', error)
             })
         
             // *** TEAM TWO ***    
             this.googleApi.getMultipleRanges('A23:B30').subscribe(data => {
               this.team2preview = data['values'];    
           
               // If less then 7 players add array with empty string
               const t2preview = this.team2preview.concat(Array(8 - this.team2preview.length).fill(['']))      
         
               // Add everytimes 3 fieldsin row
               const t2p1row = t2preview[0].concat(Array(2 - t2preview[0].length).fill(''));      
               const t2p2row = t2preview[1].concat(Array(2 - t2preview[1].length).fill(''));      
               const t2p3row = t2preview[2].concat(Array(2 - t2preview[2].length).fill(''));      
               const t2p4row = t2preview[3].concat(Array(2 - t2preview[3].length).fill(''));      
               const t2p5row = t2preview[4].concat(Array(2 - t2preview[4].length).fill(''));      
               const t2p6row = t2preview[5].concat(Array(2 - t2preview[5].length).fill(''));      
               const t2p7row = t2preview[6].concat(Array(2 - t2preview[6].length).fill(''));      
         
               // TEAM 2 set value from values from GET
               this.t2p1name?.setValue(t2p1row[0]);            
               this.t2p2name?.setValue(t2p2row[0]); 
               this.t2p3name?.setValue(t2p3row[0]); 
               this.t2p4name?.setValue(t2p4row[0]); 
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
         
               // console.log('t2preview', t2preview)
             }, error => {
               console.log('error getPriviewPlayers', error)
             })
           }, 3000)
          },
          error: (err) => {
            console.log(' SELECT err =>', err)
          }
        })
       
      },
      error: (err) => {
        console.log('BALANCE err =>', err)
      }
    })
  }

  selectTeams(){ 
    this.googleApi.runScriptFunction('selectTeams').subscribe({
      next: (res) => {
        console.log(' SELECT res =>', res)
      },
      error: (err) => {
        console.log(' SELECT err =>', err)
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

  updateELO(){
    this.googleApi.runScriptFunction('updateELO').subscribe({
      next: (res) => {
        console.log('updateELO res =>', res)
       
        this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C12:C18', '','','','','', '', '')
       
        this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C23:C29', '','','','','', '', '')
      },
      error: (err) => {
        console.log('updateELO err =>', err)
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
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', '','','','','', '', '').subscribe({
      next: (res) => {
        console.log('res CLEAR A12:A18 =>', res)       
        
      },
      error: (err) => {
        console.log('err clear A12:A18 =>', err)
        
      }
    })
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', '','','','','', '', '').subscribe({
      next: (res) => {
        console.log('res CLEAR A23:A29 =>', res)    
        
      },
      error: (err) => {
        console.log('err clear A23:A29 =>', err)       
      }
    })
    // this.t1p1name.reset()
    // this.t1p2name.reset()
    // this.t1p3name.reset()
    // this.t1p4name.reset()
    // this.t1p5name.reset()
    // this.t1p6name.reset()
    // this.t1p7name.reset()
    
    this.t1p1preelo.reset()
    this.t1p2preelo.reset()
    this.t1p3preelo.reset()
    this.t1p4preelo.reset()
    this.t1p5preelo.reset()
    this.t1p6preelo.reset()
    this.t1p7preelo.reset()

    // this.t2p1name.reset()
    // this.t2p2name.reset()
    // this.t2p3name.reset()
    // this.t2p4name.reset()
    // this.t2p5name.reset()
    // this.t2p6name.reset()
    // this.t2p7name.reset()

    this.t2p1preelo.reset()
    this.t2p2preelo.reset()
    this.t2p3preelo.reset()
    this.t2p4preelo.reset()
    this.t2p5preelo.reset()
    this.t2p6preelo.reset()
    this.t2p7preelo.reset()
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