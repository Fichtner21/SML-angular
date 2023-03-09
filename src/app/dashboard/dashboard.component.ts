import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { PlayersApiService } from '../services/players-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faArrowsUpDown, faDoorOpen, faPaperPlane, faPuzzlePiece, faRightFromBracket, faRotateRight, faScaleBalanced, faShareFromSquare, faStamp, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export interface UserInfo {
  info: {
    at_hash: string,
    aud: string,
    azp: string,    
    email: string,
    email_verified: boolean,
    exp: number,
    family_name: string,
    given_name: string,
    iat: number,
    iss: string,
    jti: string,
    locale: string,
    name: string,
    nonce: string,
    picture: string,
    sub: string
  }
}

export interface EmpFilter {
  name:string;
  options:string[];
  defaultValue:string;
}

export interface filterOption{
  name:string;
  value:string;
  isdefault:boolean;
}

export interface Employee {  
  index: number;
  name: string,
  username: string,
  elo: string,
  active: boolean,
  ban: boolean,
  flag: string,
  wars: string
}

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  // redirectUri: window.location.origin,
  redirectUri: window.location.origin + '/dashboard',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com',
  
  // set the scope for the permissions the client should request  
  scope: 'openid profile email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.external_request',  
  
  // maybe help with CORS?
  oidc: true,

  showDebugInformation: true  
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy { 
  @Input() ranking:any;
  userPlusIcon = faUserPlus;
  usersIcon = faUsers;
  rightFromBracket = faRightFromBracket;
  balanced = faScaleBalanced;
  arrowUpArrowDown = faArrowsUpDown;
  refreshIcon = faRotateRight;
  doorOpen = faDoorOpen;
  paperPlaneTop = faPaperPlane;
  puzzle = faPuzzlePiece;
  stamp = faStamp;
  shareFromSquare = faShareFromSquare;
  google = faGoogle;
  gmail = 'https://gmail.googleapis.com';
  errorMessage = '';
  modalHeader = '';
  @ViewChild('content', { static: false }) content: TemplateRef<any>;
  encapsulation: ViewEncapsulation.None;
  mailSnippets: string[] = []
  userInfo?: UserInfo; 
  public addAmatch$: Observable<any>;
  public players$: Observable<any>;
  public lastMatch$: Observable<any>;
  public lastMatchDisplay$: Observable<any>;
  public listPlayers$: Observable<any>;
  sumSubscription: Subscription;
  // Team 1
  t1p1name = new FormControl('');
  t1p2name = new FormControl('');
  t1p3name = new FormControl('');
  t1p4name = new FormControl('');
  t1p5name = new FormControl('');
  t1p6name = new FormControl('');
  t1p7name = new FormControl('');
  selectedUsername: string = '';
  selectedPlayername: string = '';
  cumulativeTeamOne = new FormControl('');
  roundsWonTeamOne = new FormControl('');
  t1p1preelo = new FormControl('');
  t1p1preeloNgModel = new FormControl('');
  t1p2preeloNgModel = new FormControl('');
  t1p3preeloNgModel = new FormControl('');
  t1p4preeloNgModel = new FormControl('');
  t1p5preeloNgModel = new FormControl('');
  t1p6preeloNgModel = new FormControl('');
  t1p7preeloNgModel = new FormControl('');
  t1p2preelo = new FormControl('');
  t1p3preelo = new FormControl('');
  t1p4preelo = new FormControl('');
  t1p5preelo = new FormControl('');
  t1p6preelo = new FormControl('');
  t1p7preelo = new FormControl('');
  t1cumulative = new FormControl('');
  t1cumulativeNgModel = new FormControl();
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
  cumulativeTeamOneArray: any[];
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
  t2p1preeloNgModel = new FormControl('');
  t2p2preeloNgModel = new FormControl('');
  t2p3preeloNgModel = new FormControl('');
  t2p4preeloNgModel = new FormControl('');
  t2p5preeloNgModel = new FormControl('');
  t2p6preeloNgModel = new FormControl('');
  t2p7preeloNgModel = new FormControl('');
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
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any; 
  // public selectedOptionT1p1name;  
  matchRow:any;
  public sumCumulativeTeamOne:any;
  public sumCumulativeTeamTwo:number = 0;
  selectedValues: number[] = [];
 
  // displayedColumns: string[] = ['Name', 'ELO', 'Active', 'Flag'];
  displayedColumns: string[];
  EmpData: Employee[];
  playerRowArray: any[] = [];
  filterDictionary= new Map<string,string>();
  dataSource: any;
  dataSourceFilters: any;
  empFilters: EmpFilter[] = [];
  defaultValue = "All";

  selectedValues1: string[] = [];
  selectedValues2: string[] = [];
  sum = 0;
  userProfile: any;

  firstFormValue: string;
  @Output() firstFormValueChange = new EventEmitter<string>();

  constructor(private readonly googleApi: PlayersApiService, private http: HttpClient, public oAuthService: OAuthService, private formBuilder: FormBuilder,notifierService: NotifierService, private modalService: NgbModal) { 

  //  
    // confiure oauth2 service
    oAuthService.configure(authCodeFlowConfig);
    // manually configure a logout url, because googles discovery document does not provide it
    oAuthService.logoutUrl = "https://www.google.com/accounts/Logout";     

    // loading the discovery document from google, which contains all relevant URL for
    // the OAuth flow, e.g. login url
    oAuthService.loadDiscoveryDocument().then( () => {
      // // This method just tries to parse the token(s) within the url when
      // // the auth-server redirects the user back to the web-app
      // // It doesn't send the user the the login page
      oAuthService.tryLoginImplicitFlow().then( () => {

        // when not logged in, redirecvt to google for login
        // else load user profile
        if (!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow()          
        } else {
          oAuthService.loadUserProfile().then((userProfile: UserInfo) => {
            // console.log('USER PROFILES',userProfile);
            // console.log('info:', userProfile.info.name);
            // Do something with the user profile data, e.g. store it in a variable or display it on the page
          }).catch((error) => {
            console.error(error);
            // Handle any errors that occur while loading the user profile
          });
          // console.log(oAuthService.loadUserProfile())
          // oAuthService.loadUserProfile().then( (userProfile) => {
          //   this.userProfile.subscribe((data) => {
          //     console.log('data', data)
          //   })
          //   // .next(userProfile as UserInfo)            
          // })
          // this.oAuthService.loadUserProfile().subscribe((profile) => {
          //   this.userProfile = profile;
          // });
        }

      })
    });

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

    this.addAmatch$ = this.googleApi.getPlayers('Add+a+Match').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;      
        return batchRowValues;
      })
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

    this.lastMatch$ = this.googleApi.getPlayers('Match+History').pipe(
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
        return players[players.length -1];       
      }),
    )

    this.players$.subscribe(data => {
      this.options = data;      
      }     
    )

    this.listPlayers$ = this.players$;

    this.listPlayers$.subscribe(data => {
      
      // console.log('data =>', data)
      for(let [index, value] of data.entries()){
        const obj = {
          nr: Number(index) + 1,
          username: value.username,
          name: value.playername,
          elo: value.ranking,
          active: value.active == 'TRUE' ? true : false,
          ban: value.ban == 'TRUE' ? true : false,
          // flag: value.nationality,
          wars: value.warcount
        }
        // console.log('OBJ', obj)
        this.playerRowArray.push(obj)
      }
      // console.log('playerRowArray', this.playerRowArray)
      return this.playerRowArray;
    })
  }  

  ngOnInit(): void { 
    // this.oAuthService.configure(environment.authConfig);
    this.oAuthService.loadDiscoveryDocumentAndLogin();

    this.oAuthService.setupAutomaticSilentRefresh();   
 
    this.displayedColumns= ['nr','name','username','elo','wars','active', 'ban'];
   
    this.dataSource = new MatTableDataSource(this.playerRowArray);
    this.dataSourceFilters = new MatTableDataSource(this.playerRowArray);

    this.dataSourceFilters.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Employee] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
   
    // console.log('PERMUTATION:', this.splitPermutations([1000,1001,1002,1003,1004,1005,1009,1010, 1023,1023]))

    this.filteredOptionsT1p1name = this.t1p1name.valueChanges.pipe(
      startWith(''),    
      map(value => this._filter(value || '')),
            
    );
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

    // *** TEAM ONE ***    
    this.googleApi.getMultipleRanges('A12:B19').subscribe(data => {
      this.team1preview = data['values'];         
      // console.log('this.team1preview', this.team1preview)
      // If less then 7 players add array with empty string
      const t1preview = this.team1preview.concat(Array(8 - this.team1preview.length).fill(['']))      


      // console.log('t1preview ! =>', t1preview);

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
      this.t1p3name?.setValue(t1p3row[0]); 
      this.t1p4name?.setValue(t1p4row[0]); 
      this.t1p5name?.setValue(t1p5row[0]);
      this.t1p6name?.setValue(t1p6row[0]);
      this.t1p7name?.setValue(t1p7row[0]);  
    
      
      // Team 1 Initial ELO
     
      this.t1p1preelo?.setValue(t1p1row[1]);
      this.t1p2preelo?.setValue(t1p2row[1]);   
      this.t1p3preelo?.setValue(t1p3row[1]);
      this.t1p4preelo?.setValue(t1p4row[1]);
      this.t1p5preelo?.setValue(t1p5row[1]);
      this.t1p6preelo?.setValue(t1p6row[1]);
      this.t1p7preelo?.setValue(t1p7row[1]);
    
      // this.t1cumulative?.setValue('');
      this.t1cumulative?.setValue(Number(t1preview[7][1]).toFixed(2));
  

      // console.log('t1preview', t1preview)
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

    // *** TEAM TWO ***    
    this.googleApi.getMultipleRanges('A23:C30').subscribe(data => {
      this.team2preview = data['values'];    
  
      // If less then 7 players add array with empty string
      const t2preview = this.team2preview.concat(Array(9 - this.team2preview.length).fill(['']))  
      // console.log('t2preview', t2preview)    

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
      this.t2cumulative?.setValue(Number(t2preview[7][1]).toFixed(2));

      // console.log('t2preview', t2preview)
    }, error => {
      console.log('error getPriviewPlayers', error)
    })

    this.lastMatch$.pipe(
      map((match) => {        
        const sumPreeloTeam1 = [
          (Number(match.t1p1preelo) ? Number(match.t1p1preelo) : 0) + 
          (Number(match.t1p2preelo) ? Number(match.t1p2preelo) : 0) + 
          (Number(match.t1p3preelo) ? Number(match.t1p3preelo) : 0) + 
          (Number(match.t1p4preelo) ? Number(match.t1p4preelo) : 0) + 
          (Number(match.t1p5preelo) ? Number(match.t1p5preelo) : 0) + 
          (Number(match.t1p6preelo) ? Number(match.t1p6preelo) : 0) + 
          (Number(match.t1p7preelo) ? Number(match.t1p7preelo) : 0) 
        ].reduce(this.addPreelo, 0);     

        const sumPreeloTeam2 = [
          (Number(match.t2p1preelo) ? Number(match.t2p1preelo) : 0) + 
          (Number(match.t2p2preelo) ? Number(match.t2p2preelo) : 0) + 
          (Number(match.t2p3preelo) ? Number(match.t2p3preelo) : 0) + 
          (Number(match.t2p4preelo) ? Number(match.t2p4preelo) : 0) + 
          (Number(match.t2p5preelo) ? Number(match.t2p5preelo) : 0) + 
          (Number(match.t2p6preelo) ? Number(match.t2p6preelo) : 0) + 
          (Number(match.t2p7preelo) ? Number(match.t2p7preelo) : 0) 
        ].reduce(this.addPreelo, 0); 
        // console.log('THIS.OPTIONS', this.options)
        // console.log('MATCH', match)
        
        this.matchRow = {
          timestamp: match.timestamp,
          idwar: match.idwar,
          t1roundswon: match.t1roundswon,
          t2roundswon: match.t2roundswon, 
          video: match.video,
          info: match.info,
          t1preelo: sumPreeloTeam1,
          t2preelo: sumPreeloTeam2,
          t1chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[0].toFixed(2)),
          t2chance: Number(this.calculateChance(sumPreeloTeam1,sumPreeloTeam2)[1].toFixed(2)),
          // t1p1playername: this.addPlayerLink(match.t1p1name, this.options),
          t1p1playername: match.t1p1name,
          t1p1username: match.t1p1name,
          t1p1preelo: match.t1p1preelo,
          t1p1score: match.t1p1score,
          t1p1postelo: match.t1p1postelo,
          t1p2playername: this.addPlayerLink(match.t1p2name, this.options),
          t1p2username: match.t1p2name,
          t1p2preelo: match.t1p2preelo,
          t1p2score: match.t1p2score,
          t1p2postelo: match.t1p2postelo,
          t1p3playername: this.addPlayerLink(match.t1p3name, this.options),
          t1p3username: match.t1p3name,
          t1p3preelo: match.t1p3preelo,
          t1p3score: match.t1p3score,
          t1p3postelo: match.t1p3postelo,
          t1p4playername: this.addPlayerLink(match.t1p4name, this.options),
          t1p4username: match.t1p4name,
          t1p4preelo: match.t1p4preelo,
          t1p4score: match.t1p4score,
          t1p4postelo: match.t1p4postelo,
          t1p5playername: this.addPlayerLink(match.t1p5name, this.options),
          t1p5username: match.t1p5name,
          t1p5preelo: match.t1p5preelo,
          t1p5score: match.t1p5score,
          t1p5postelo: match.t1p5postelo,
          t1p6playername: this.addPlayerLink(match.t1p6name, this.options),
          t1p6username: match.t1p6name,
          t1p6preelo: match.t1p6preelo,
          t1p6score: match.t1p6score,
          t1p6postelo: match.t1p6postelo,
          t1p7playername: this.addPlayerLink(match.t1p7name, this.options),
          t1p7username: match.t1p7name,
          t1p7preelo: match.t1p7preelo,
          t1p7score: match.t1p7score,
          t1p7postelo: match.t1p7postelo,
          t2p1playername: this.addPlayerLink(match.t2p1name, this.options),
          t2p1username: match.t2p1name,
          t2p1preelo: match.t2p1preelo,
          t2p1score: match.t2p1score,
          t2p1postelo: match.t2p1postelo,
          t2p2playername: this.addPlayerLink(match.t2p2name, this.options),
          t2p2username: match.t2p2name,
          t2p2preelo: match.t2p2preelo,
          t2p2score: match.t2p2score,
          t2p2postelo: match.t2p2postelo,
          t2p3playername: this.addPlayerLink(match.t2p3name, this.options),
          t2p3username: match.t2p3name,
          t2p3preelo: match.t2p3preelo,
          t2p3score: match.t2p3score,
          t2p3postelo: match.t2p3postelo,
          t2p4playername: this.addPlayerLink(match.t2p4name, this.options),
          t2p4username: match.t2p4name,
          t2p4preelo: match.t2p4preelo,
          t2p4score: match.t2p4score,
          t2p4postelo: match.t2p4postelo,
          t2p5playername: this.addPlayerLink(match.t2p5name, this.options),
          t2p5username: match.t2p5name,
          t2p5preelo: match.t2p5preelo,
          t2p5score: match.t2p5score,
          t2p5postelo: match.t2p5postelo,
          t2p6playername: this.addPlayerLink(match.t2p6name, this.options),
          t2p6username: match.t2p6name,
          t2p6preelo: match.t2p6preelo,
          t2p6score: match.t2p6score,
          t2p6postelo: match.t2p6postelo,
          t2p7playername: this.addPlayerLink(match.t2p7name, this.options),
          t2p7username: match.t2p7name,
          t2p7preelo: match.t2p7preelo,
          t2p7score: match.t2p7score,
          t2p7postelo: match.t2p7postelo,
        }       
        return this.matchRow;
      })
      
    ).subscribe();    

    this.t1p1name.
    valueChanges.subscribe(value => {     
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p1preeloNgModel = el.ranking;
        }
      })      
    })
  
    this.t1p2name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p2preeloNgModel = el.ranking;                      
        }
      })      
    })
  
    this.t1p3name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p3preeloNgModel = el.ranking;                        
        }
      })      
    })
    this.t1p4name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p4preeloNgModel = el.ranking; 
        }
      })      
    })
    this.t1p5name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p5preeloNgModel = el.ranking;         
        }
      })      
    })
    this.t1p6name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p6preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t1p7name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t1p7preeloNgModel = el.ranking; 
        }
      })      
    })
    this.t2p1name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p1preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t2p2name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p2preeloNgModel = el.ranking;         
        }
      })      
    })  
    this.t2p3name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p3preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t2p4name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p4preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t2p5name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p5preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t2p6name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p6preeloNgModel = el.ranking;          
        }
      })      
    })
    this.t2p7name.
    valueChanges.subscribe(value => {
      this.options.forEach((el:any) => {
        if(el.username == value){
          this.t2p7preeloNgModel = el.ranking;          
        }
      })      
    })   
  }

  applyEmpFilter(ob:MatSelectChange,empfilter:EmpFilter) {
    this.filterDictionary.set(empfilter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));    
    this.dataSourceFilters.filter = jsonString;   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loginTest() {
    this.oAuthService.initImplicitFlow();
  }

  logoutTest() {
    this.oAuthService.logOut();
  }

  private _filter(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.options.filter(option => option.playername.toLowerCase().includes(filterValue));     
    // return this.options.filter(option => option.playername.toLowerCase().indexOf(filterValue) === 0);
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

  onOptionSelectedOne(event) {
    // this.selectedOptionT1p1name = event.option.value;
    // this.t1p1name.setValue(this.selectedOptionT1p1name.playername);
  }

  sendPlayersManually(){
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
    
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name, t1p6name, t1p7name).subscribe({
      next: (res) => {
        if(res.done = true){         
          this.modalHeader = 'SUCCESS'
          this.errorMessage = 'Teams updated!'
          this.modalService.open(
            this.content, 
            { 
              centered: true,
              windowClass: 'success' 
            }
          );

          this.googleApi.getMultipleRanges('B19').subscribe(data =>{      
            const values = data['values'];     
            this.t1cumulative?.setValue(values[0]);       
          })
        }
      }
    })

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', t2p1name, t2p2name, t2p3name, t2p4name, t2p5name, t2p6name, t2p7name).subscribe({
      next: (res) => {        
        this.googleApi.getMultipleRanges('B30').subscribe(data =>{      
          const values = data['values'];     
          this.t2cumulative?.setValue(values[0]);     
          this.notifier.notify('success', 'Confirm Players successful.');  
        })
      }, error: (err) => {
        this.notifier.notify('error', 'Confirm Players error.', err); 
      }
    })
  }

  scoresTwoTeams(){
    const formValues = {
      ...this.scoreTeamOne.value,
      ...this.scoreTeamTwo.value,
      ...this.teamOneRoundsWon.value,
      ...this.teamTwoRoundsWon.value
    }
    // console.log('formValues', formValues)
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
        // console.log('updateRoundsWon res =>', res)    
        this.notifier.notify('success', 'Update Rounds Won Team 1 successful.');       
      },
      error: (err) => {
        console.log('updateRoundsWon err =>', err)
      }
    })

    //TEAM TWO
    this.googleApi.updateRoundsWon('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo','Add+a+Match','B31', t2roundsWonInput).subscribe({
      next: (res) => {
        // console.log('updateRoundsWon res =>', res)
        this.notifier.notify('success', 'Update Rounds Won Team 2 successful.');  
      },
      error: (err) => {
        console.log('updateRoundsWon err =>', err)
      }
    })

    this.googleApi.sendScore('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo','Add+a+Match','C12:C31', t1p1score, t1p2score, t1p3score, t1p4score, t1p5score, t1p6score, t1p7score, t1sumFrags, t1roundsWon, emptyCell, headDesc, t2p1score, t2p2score, t2p3score, t2p4score, t2p5score, t2p6score, t2p7score, t2sumFrags, t2roundsWon).subscribe({
      next: (res) => {
        // console.log('sendScore res =>', res)
        this.notifier.notify('success', 'Send Score successful.'); 
        this.updateELO();
      },
      error: (err) => {
        console.log('sendScore err =>', err)
      }
    })
  }

  // updateSelectedValue(event: any) {

  //   if (event.option) {
  //     this.selectedUsername = event.option.username;
  //     this.selectedPlayername = event.option.playername;
  //     console.log('event', event);
  //     console.log('event.option', event.option);
  //     console.log('event.option.value', event.option.value);
  //     console.log('event.option.value.username', event.option.username);
  //     console.log('event.option.username', event.option.username);
  //     console.log('event.option.playername', event.option.playername);
  //   }
  //   // this.selectedUsername = event.option.value.username;
  //   // this.selectedPlayername = event.option.value.playername;
  // }

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
    // console.log(
    //   't1p1name', t1p1name,
    //   't1p2name', t1p2name,
    //   't1p3name', t1p3name,
    //   't1p4name', t1p4name,
    //   't1p5name', t1p5name,
    //   't1p6name', t1p6name,
    //   't1p7name', t1p7name
    // )   

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name,  t1p6name, t1p7name).subscribe({
        next: (res) => {
          // console.log('update cells A12:A18 res =>', res)
          this.notifier.notify('success', 'Update Team 1 successful.'); 
          this.getInitialEloTeamOne('B12:B19'); 
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', t2p1name, t2p2name, t2p3name, t2p4name, t2p5name,  t2p6name, t2p7name).subscribe({
        next: (res) => {
          // console.log('update cells A23:A29 res =>', res)
          this.notifier.notify('success', 'Update Team 2 successful.'); 
          this.getInitialEloTeamTwo('B23:B30') 
        },
        error: (err) => {
          console.log('update cell err =>', err)
        }
    });       
  }

  // onOptionSelectedOne(event: any) {
  //   console.log('************* event =>', event.option.value)    
  // }
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
      // console.log(
      //   'values[0]', values[0],
      //   'values[1]', values[1],
      //   'values[2]', values[2],
      //   'values[7]', values[7]
      // )
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
      // console.log(
      //   'values[0]', values[0],
      //   'values[1]', values[1],
      //   'values[2]', values[2],
      //   'values[7]', values[7]
      // )
    })
  }

  sendLastWar(){
    this.googleApi.runScriptFunction('sendLastRowToDiscord').subscribe({
      next: (res) => {
        this.notifier.notify('success', 'Send Last War to BOT successful.');
      }, error: (err) => {
        this.notifier.notify('error', 'Something went wrong.');
      }
    })
  }

  balanceTeams(){
    this.notifier.notify('warning', 'TEAMS MIXED done!');
    this.onSubmit();
    this.googleApi.runScriptFunction('balanceTeams').subscribe({
      next: (res) => {
        // console.log('BALANCE res =>', res)
        // this.selectTeams();
       
        this.googleApi.runScriptFunction('selectTeams').subscribe({
          next: (res) => {
            // console.log(' SELECT res =>', res)
            if(res.done == true){
              this.modalHeader = 'SUCCESS'
              this.errorMessage = 'Teams are balanced successfuly!';
              this.modalService.open(
                this.content, 
                { 
                  centered: true,
                  windowClass: 'success' 
                }
              );
            }

              // *** TEAM ONE ***
            this.googleApi.getMultipleRanges('A12:A19').subscribe(data => {
              const t1preview = data['values'];         
              //  console.log('t1preview => =>', t1preview)
               // set value from values from GET
           
               this.t1p1name?.setValue(t1preview[0]); 
               this.t1p2name?.setValue(t1preview[1]); 
               this.t1p3name?.setValue(t1preview[2]); 
               this.t1p4name?.setValue(t1preview[3]); 
               this.t1p5name?.setValue(t1preview[4]);
               this.t1p6name?.setValue(t1preview[5]);
               this.t1p7name?.setValue(t1preview[6]);
         
               // console.log('t1preview', t1preview)
             }, error => {
               console.log('error getPriviewPlayers', error)
            })

            this.googleApi.getMultipleRanges('B12:B19').subscribe( data => {
              const t1preview = data['values'];  
              //Team 1 Initial ELO
              
              this.t1p1preelo?.setValue(t1preview[0]);
              this.t1p2preelo?.setValue(t1preview[1]);
              this.t1p3preelo?.setValue(t1preview[2]);
              this.t1p4preelo?.setValue(t1preview[3]);
              this.t1p5preelo?.setValue(t1preview[4]);
              this.t1p6preelo?.setValue(t1preview[5]);
              this.t1p7preelo?.setValue(t1preview[6]);
              // this.preEloTeamOne.controls['t1p1preelo'].setValue(t1preview[0])
              // this.preEloTeamOne.controls['t1p2preelo'].setValue(t1preview[1])
              // this.preEloTeamOne.controls['t1p3preelo'].setValue(t1preview[2])
              // this.preEloTeamOne.controls['t1p4preelo'].setValue(t1preview[3])
              // this.preEloTeamOne.controls['t1p5preelo'].setValue(t1preview[4])
              // this.preEloTeamOne.controls['t1p6preelo'].setValue(t1preview[5])
              // this.preEloTeamOne.controls['t1p7preelo'].setValue(t1preview[6])
              this.t1cumulative?.setValue(Number(t1preview[7]).toFixed(2));
              // this.preEloTeamOne.controls['t1cumulative'].setValue(Number(t1preview[7]).toFixed(2));
            }, error => {
              console.log("getMultipleRanges('B12:B19')", error)
            })
         
             // *** TEAM TWO ***    
             this.googleApi.getMultipleRanges('A23:A29').subscribe(data => {
              const t2preview = data['values'];    
              // console.log('t1preview => =>', t2preview)
             // TEAM 2 set value from values from GET
            //  this.teamTwoToWar.controls['t2p1name'].setValue(t2preview[0])
            //  this.teamTwoToWar.controls['t2p2name'].setValue(t2preview[1])
            //  this.teamTwoToWar.controls['t2p3name'].setValue(t2preview[2])
            //  this.teamTwoToWar.controls['t2p4name'].setValue(t2preview[3])
            //  this.teamTwoToWar.controls['t2p5name'].setValue(t2preview[4])
            //  this.teamTwoToWar.controls['t2p6name'].setValue(t2preview[5])
            //  this.teamTwoToWar.controls['t2p7name'].setValue(t2preview[6])
               this.t2p1name?.setValue(t2preview[0]);            
               this.t2p2name?.setValue(t2preview[1]); 
               this.t2p3name?.setValue(t2preview[2]); 
               this.t2p4name?.setValue(t2preview[3]); 
               this.t2p5name?.setValue(t2preview[4]);
               this.t2p6name?.setValue(t2preview[5]);
               this.t2p7name?.setValue(t2preview[6]);
               
               // console.log('t2preview', t2preview)
             }, error => {
               console.log('error getPriviewPlayers', error)
             })

             this.googleApi.getMultipleRanges('B23:B30').subscribe(data => {
              const t2preview = data['values']; 
               //Team 2 Initial ELO
               this.t2p1preelo?.setValue(t2preview[0]);
               this.t2p2preelo?.setValue(t2preview[1]);
               this.t2p3preelo?.setValue(t2preview[2]);
               this.t2p4preelo?.setValue(t2preview[3]);
               this.t2p5preelo?.setValue(t2preview[4]);
               this.t2p6preelo?.setValue(t2preview[5]);
               this.t2p7preelo?.setValue(t2preview[6]);
              //  this.preEloTeamTwo.controls['t2p1preelo'].setValue(t2preview[0])
              //  this.preEloTeamTwo.controls['t2p2preelo'].setValue(t2preview[1])
              //  this.preEloTeamTwo.controls['t2p3preelo'].setValue(t2preview[2])
              //  this.preEloTeamTwo.controls['t2p4preelo'].setValue(t2preview[3])
              //  this.preEloTeamTwo.controls['t2p5preelo'].setValue(t2preview[4])
              //  this.preEloTeamTwo.controls['t2p6preelo'].setValue(t2preview[5])
              //  this.preEloTeamTwo.controls['t2p7preelo'].setValue(t2preview[6])
               this.t2cumulative?.setValue(Number(t2preview[7]).toFixed(2));
              //  this.preEloTeamTwo.controls['t2cumulative'].setValue(Number(t2preview[7]).toFixed(2));
             }, error => {
              console.log("getMultipleRanges('B23:B30')", error)
             })
          
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
        // console.log('res =>', res)
        if(res.done == true){
          this.modalHeader = 'SUCCESS'
          this.errorMessage = 'Ranking update!';
          this.modalService.open(
            this.content, 
            { 
              centered: true,
              windowClass: 'success' 
            }
          );
        }
      },
      error: (err) => {
        console.log('err =>', err)
      }
    })
  }

  updateELO(){
    this.googleApi.runScriptFunction('updateELO').subscribe({
      next: (res) => {
        // console.log('updateELO res =>', res)
        // // Clear score from Team One
        // this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C12:C18', '','','','','', '', '')
        // // Clear score from Team Two
        // this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C23:C29', '','','','','', '', '')
        // // Clear players from Team One
        // this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', '','','','','', '', '')
        // // Clear players from Team Two
        // this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', '','','','','', '', '')
        this.googleApi.runScriptFunction('sortPlayers').subscribe({
          next: (res) => {
            console.log('sortPlayer', res);
          },
          error: (err) => {
            console.log('sortPlayers', err);
          }
        })
        this.clearTeam();

        if(res.response.result == false){
          this.modalHeader = 'FAILED';
          this.errorMessage = 'Request failed, propably u forget about add rounds won.';
          this.modalService.open(this.content, { centered: true });
        }
      },
      error: (err) => {
        console.log('updateELO err =>', err)
      }
    })
  }

  getStatistics(){
    this.googleApi.runScriptFunction('getStatistics').subscribe({
      next: (res) => {
        // console.log('res =>', res)
        // console.log('this.notifier', this.notifier)
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
        // console.log('res CLEAR A12:A18 =>', res)       
        this.t1p1name.reset()
        this.t1p2name.reset()
        this.t1p3name.reset()
        this.t1p4name.reset()
        this.t1p5name.reset()
        this.t1p6name.reset()
        this.t1p7name.reset()        

        this.t1p1preelo.reset()
        this.t1p2preelo.reset()
        this.t1p3preelo.reset()
        this.t1p4preelo.reset()
        this.t1p5preelo.reset()
        this.t1p6preelo.reset()
        this.t1p7preelo.reset()

        this.t1p1score.reset()
        this.t1p2score.reset()
        this.t1p3score.reset()
        this.t1p4score.reset()
        this.t1p5score.reset()
        this.t1p6score.reset()
        this.t1p7score.reset()
        this.t1roundsWonInput.reset()

        this.googleApi.clearCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'B19', '=SUMA.JEŻELI(B12:B18,"<>#N/A")').subscribe({
          next: (res) => {
            // console.log('clearCell', res)
            this.t1cumulative.reset()
          }, error: (err) => {
            console.log('clearCell err', err)
          }
        })
      },
      error: (err) => {
        console.log('err clear A12:A18 =>', err)        
      }
    })
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C12:C18', '','','','','', '', '')
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', '','','','','', '', '').subscribe({
      next: (res) => {
        // console.log('res CLEAR A23:A29 =>', res)    
        this.t2p1name.reset()
        this.t2p2name.reset()
        this.t2p3name.reset()
        this.t2p4name.reset()
        this.t2p5name.reset()
        this.t2p6name.reset()
        this.t2p7name.reset()

        this.t2p1preelo.reset()
        this.t2p2preelo.reset()
        this.t2p3preelo.reset()
        this.t2p4preelo.reset()
        this.t2p5preelo.reset()
        this.t2p6preelo.reset()
        this.t2p7preelo.reset()

        this.t2p1score.reset()
        this.t2p2score.reset()
        this.t2p3score.reset()
        this.t2p4score.reset()
        this.t2p5score.reset()
        this.t2p6score.reset()
        this.t2p7score.reset()
        this.t2roundsWonInput.reset()

        this.googleApi.clearCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'B30', '=SUMA.JEŻELI(B23:B29,"<>#N/A")').subscribe({
          next: (res) => {
            // console.log('clearCell', res)
            this.t2cumulative.reset()
          }, error: (err) => {
            console.log('clearCell err', err)
          }
        })
      },
      error: (err) => {
        console.log('err clear A23:A29 =>', err)       
      }
    })
    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'C23:C29', '','','','','', '', '')
  }

  public showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	} 
  
  /// from player-api.service.ts
  public authHeader() : HttpHeaders { 
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }

  refresh(){
    this.oAuthService.setupAutomaticSilentRefresh();
    window.location.reload();
  }

  public getPlayers(name: string): Observable<any> {  
    // this.oAuthService.setupAutomaticSilentRefresh();
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
      );
  } 

  permutate(input: number[]) {
    let result = [];
    for (let i = 0; i < input.length; i++) {
      let rest = this.permutate(input.slice(0, i).concat(input.slice(i + 1)));
      if (!rest.length) {
        result.push([input[i]]);
      } else {
        for (let j = 0; j < rest.length; j++) {
          result.push([input[i]].concat(rest[j]));
        }
      }
    }
    return result;
  }

  splitPermutations(input: number[]) {
    let permutations = this.permutate(input);
    let halfLength = Math.floor(permutations.length / 2);
    return [permutations.slice(0, halfLength), permutations.slice(halfLength)];
  }

  public addPreelo(accumulator:any, a:any) {
    return accumulator + a;
  } 

  public calculateChance(team1PreElo:any, team2PreElo:any){
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((team1PreElo - team2PreElo) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((team2PreElo - team1PreElo) / 400)) * 100; 

    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);

    const arrChance = [];

    arrChance.push(chanceOfWinTeamOne, chanceOfWinTeamTwo);

    return arrChance;
  }
  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }

  updateSelectedValue(event: any) {
    if (event.source.value) {
      this.selectedPlayername = event.source.value.playername;
      // console.log(this.selectedPlayername);
    }
  }

  setSelectedPlayer(option) {
    if (option) {
      this.selectedUsername = option.username;
      this.selectedPlayername = option.playername;
    } else {
      this.selectedUsername = undefined;
      this.selectedPlayername = undefined;
    }
  }

  sendToDiscord(){
    // General Chat
    const webhookUrl = 'https://discord.com/api/webhooks/1075499431207645284/B0aRKfrobBHm2NKwM8Z6HGdkn0dt17xT3N1ssnXwFbyoNYNjgezteQLYuO5VY33MK2nS';
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
    
    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;  

    const chanceFutureTeamOne:any = this.t1cumulative;
    const chanceFutureTeamTwo:any = this.t2cumulative;

    let chanceOfWinTeamOneShow = 0;
    let chanceOfWinTeamTwoShow = 0;

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne.value - chanceFutureTeamTwo.value) / 400)) * 100;       
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo.value - chanceFutureTeamOne.value) / 400)) * 100;

    chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);    

    let nextMatch = "";
    nextMatch += "**NEXT MATCH**, created: " + formattedDate + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + "\n";
    nextMatch += "TEAM 1 Chance for win: " + chanceOfWinTeamTwoShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + "\n";
    nextMatch += "TEAM 2 Chance for win: " + chanceOfWinTeamOneShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "Good Luck & Have Fun!";
    
    const payload = {
      content: nextMatch
    };
    this.http.post(webhookUrl, payload).subscribe({
      next: (res) => {
        this.notifier.notify('success', "Teams Send successful!")
      }, error: (err) => {
        this.notifier.notify('error', 'Something went wrong')
      }
    });  
  } 

  ngOnDestroy() {
    if (this.sumSubscription) {
      this.sumSubscription.unsubscribe();
    }
  }
}