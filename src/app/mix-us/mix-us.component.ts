import { Component, OnInit, Renderer2, ElementRef, HostListener, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from '../services/players-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';
import { NotifierService } from 'angular-notifier';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faArrowCircleLeft, faArrowCircleRight, faArrowDown, faArrowUp, faFlag, faPaperPlane, faSquareMinus, faStamp, faStar, faStarHalfStroke, faTrash, faUserGroup, faUserMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

export interface UserData {
  nr: string;
  name: string;
  username: string;
  ranking: string;
  wars: string;
  active: string;
  ban: string;
}

interface User {
  nr: number;
  username: string;
  ranking: string;
  playername: string;
  flag: string;
  ban: boolean;
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

interface VoiceMember {
  id: string;
  username: string;
  nickname: string;
}

@Component({
  selector: 'app-mix-us',
  templateUrl: './mix-us.component.html',
  styleUrls: ['./mix-us.component.scss']
})
export class MixUsComponent implements OnInit {
  public players$: Observable<any[]>;
  form: FormGroup;
  selectedPlayersArray: any[];
  array1: any[] = [];
  array2: any[] = [];
  array1AA: any[] = [];
  array2AA: any[] = [];
  sum1: any[];
  sum2: any[];
  sumTeam1: any;
  sumTeam2: any;
  sumTeam1AA: any;
  sumTeam2AA: any;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;
  chanceOfWinTeamOneShowAA: any;
  chanceOfWinTeamTwoShowAA: any;
  isStickyShown = false;
  allSelected: boolean = false;
  sendIcon = faPaperPlane;
  stamp = faStamp;
  arrowDown = faArrowDown;
  people = faUserGroup;
  arrowUp = faArrowUp;
  arrowRightCircle = faArrowCircleRight;
  arrowLeftCircle = faArrowCircleLeft;
  starSolid = faStar;
  starEmpty = faStarHalfStroke;
  faFlag = faFlag;
  squareMinus = faSquareMinus;
  trash = faTrash;
  userMinus = faUserMinus;
  xmark = faXmark;
  mixWay: any = localStorage.getItem('mixway') ? localStorage.getItem('mixway') : '';
  selectedOption: string = "Teams-decide";  
  selectedOption2: string = "";  
  selectedMaps: string[] = [];
  maps = [
    { name: 'The Hunt', probability: 0.2 },
    { name: 'V2', probability: 0.2 },
    { name: 'The Bridge', probability: 0.2 },
    { name: 'Renan', probability: 0.1 },
    { name: 'Stlo', probability: 0.1 },
    { name: 'Navarone', probability: 0.1 },
    { name: 'Dessau', probability: 0.1 },
    { name: 'Harbor', probability: 0.1 },
    { name: 'VSUK Abbey', probability: 0.1 },
    { name: 'The Church Final', probability: 0.05 },
    { name: 'V2 Shelter', probability: 0.05 },
    { name: 'The Bridge OMG', probability: 0.05 },
    { name: 'Stlo4', probability: 0.05 },
    { name: 'The Lost Town', probability: 0.05 },
    { name: 'The Village', probability: 0.05 },
    { name: 'Holland', probability: 0.05 }
  ];
  mapProbabilities = {
    'The Hunt': 20,
    'V2': 20,
    'The Bridge': 20,
    'VSUK Abbey': 10,
    'Stlo': 10,
    'Renan': 10,
    'The Church Final': 10,
    'V2 Shelter': 5,
    'Navarone': 5,
    'Dessau1946': 5,
    'The Bridge OMG': 5,
    'The Lost Town': 5,
    'Stlo4': 5,
    'The Village': 5,
    'Harbor': 5,
    'Holland': 5,
  };
  customSize: number = 50; 
  selectedRows = [];
  dataSource: any;
  dataSourceAA: any;
  public listPlayers$: Observable<any[]>;
  public listPlayersAA$: Observable<any[]>;
  playerRowArray: any[] = [];
  playerRowArrayAA: any[] = [];
  public selectedArr: any[] = [];
  options: any[] = [];
  a = [{ranking: "1"}, {ranking: "3"}, {ranking: "5"}, {ranking: "7"}];
  //
  players: any;
  displayedColumns: string[] = ['select', 'nr', 'ranking', 'playername','flag'];
  selectedChannels = 'Team 1 and Team 2';
  availableChannels = ['Team 1 and Team 2', 'Team 3 and Team 4'];
  showInactivePlayers = false;
  showInactivePlayersAA = false;
  displayNameAA: string = '';
  activeTabIndex: number = 0;

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},     
    ],
  };
  selectedUsers: User[] = [];
  selectedUsersAA: User[] = [];
  // displayedColumns: string[];
  // dataSource = new MatTableDataSource<PeriodicElement>(this.players$);
  selection = new SelectionModel<UserData>(true, []);
  discordUsers: any[] = [];
  
  public channelId = '851888778409672756'; 
  private baseUrl = 'http://localhost:3000';

  users: any[];

  nextMatch:string = "";
  nextMatchAA:string = "";
  nextMatch2:any;
  ip: string = "";
  nextMatchOne: string = "";
  nextMatchTwo: string = "";
  nextMatchThree: string = "";
  nextMatchFour: string = "";
  counter: number = 1;
  delay: number = 120; // Domyślnie 2 minuty (120 sekund)
  interval: number = 60; // Domyślnie 1 minuta (60 sekund)
  isSplitNationalitiesClicked: boolean = false;
  isSplitArrayIntoTwoClicked: boolean = false;
  isSplitNationalitiesClickedAA: boolean = false;
  isSplitArrayIntoTwoClickedAA: boolean = false;
  discordUsersAll: any[] = [];
  isAuthenticated3: boolean = false;
  isLoggedIn: boolean;
  private isTabChange: boolean = false;
  showOverlay: boolean = false; // Kontrola widoczności overlay
  collectedAmount = new BehaviorSubject<number>(0);
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(private googleApi: PlayersApiService, private formBuilder: FormBuilder, private notifier: NotifierService, private oauthService: OAuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public oAuthService: OAuthService, private renderer: Renderer2, private el: ElementRef, public authService: AuthService) {    
    this.authService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated3 = authenticated;
    });

    // this.isLoggedIn = this.authService.isLoggedInGoogle();

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
      }),
    );
    this.listPlayers$ = this.players$;

    this.listPlayers$.subscribe(data => {

      // console.log('data =>', data)
      for(let [index, value] of data.entries()){
        const obj = {          
          nr: (index + 1).toString(),
          username: value.username,
          playername: value.playername,
          ranking: value.ranking,
          active: value.active == 'TRUE' ? true : false,          
          ban: value.ban == 'TRUE' ? true : false,          
          flag: value.nationality,
          discord_id: value.discord_id,
          fpw: value.fpw,
          season_fpw: value.s9fpw,
          wars: value.warcount,
          season_wars: value.s9wars,
          clan: value.clan,
          clan2: value.clan2          
        }
        // console.log('OBJ', obj)
        this.playerRowArray.push(obj)
        // this.players.push(obj)
      }
      // console.log('playerRowArray', this.playerRowArray)
      return this.dataSource = new MatTableDataSource(this.playerRowArray);
      // console.log('PLAYERS', this.players)
      // return players;
    });

    //ALLIED ASSAULT
    this.listPlayersAA$ = this.googleApi.getPlayers('Players_AA').pipe(
      map((response: any) => {
        const [headers, ...rows] = response.values; // Pierwszy wiersz jako nagłówki
        return rows.map((row, index) => {
          const player = headers.reduce((acc, header, colIndex) => {
            acc[header] = row[colIndex];
            return acc;
          }, {} as any);
    
          return {
            nr: (index + 1).toString(),
            username: player.username,
            playername: player.playername,
            ranking: player.ranking,
            active: player.active === 'TRUE',
            ban: player.ban === 'TRUE',
            flag: player.nationality,
            discord_id: player.discord_id,
          };
        });
      })
    );
    
    this.listPlayersAA$.subscribe(data => {
      this.playerRowArrayAA = data;
      this.dataSourceAA = new MatTableDataSource(this.playerRowArrayAA);
    });    
  }

  ngOnInit(): void {
    // this.authService.isAuthenticated$.subscribe(authenticated => {
    //   console.log('User authenticated:', authenticated);      
    // });
 
  
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      console.log('loggedIn', loggedIn)
    });

    this.route.queryParams.subscribe(params => {
      // this.array1 = params['a1'] ? JSON.parse(params['a1']).map(username => ({username})) : [];
      // this.array2 = params['a2'] ? JSON.parse(params['a2']).map(username => ({username})) : [];
      if(this.selectedUsers.length > 0){
        this.selectedUsers = [];
      }

      setTimeout(() => {
        this.array1 = params['a1'] ? JSON.parse(params['a1']) : [];
        this.array2 = params['a2'] ? JSON.parse(params['a2']) : [];

        if (this.dataSource) {
          this.dataSource.data?.forEach(item => {
            // console.log('item oninit', item)
            // check if the username of the item matches a username in array1
            let match1 = this.array1.find(arrayItem => arrayItem.username === item.username);
            // if there is a match, set the checkbox value to true
            if (match1) {
              // console.log('item1', item)
              // this.selectedUsers = [];
              this.selectedUsers.push(item)
              item.checkbox1 = true;
            }

            // check if the username of the item matches a username in array2
            let match2 = this.array2.find(arrayItem => arrayItem.username === item.username);
            // if there is a match, set the checkbox value to true
            if (match2) {
              // console.log('item2', item)
              // this.selectedUsers = [];
              this.selectedUsers.push(item)
              item.checkbox2 = true;
            }
          });
        }
      }, 500)

    });
    
    const arr = this.playerRowArray; 
    
    if (this.activeTabIndex === 1) {
      this.googleApi.getPlayers('NumPlayers').pipe(
        map((response: any) => {
          if (response.values && response.values[2] && response.values[2][0]) {
            return parseFloat(response.values[2][0]); // Konwersja na liczbę
          }
          return 0; // Domyślna wartość
        })
      ).subscribe((value: number) => {
        this.collectedAmount.next(value); // Emituj nową wartość
      });
    }
  }

  checkAuthentication() {
    if (!this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.initLoginFlow(); // Rozpocznij proces logowania
    } else {
      this.authService.isAuthenticatedSubject.next(true);
    }
  }

  configureOAuth() {      
    const authConfig: AuthConfig = {
      issuer: 'https://discord.com', // Adres URL dostawcy OpenID Connect (Discord)
      redirectUri: window.location.origin,
      clientId: '1177014136773820457',
      scope: 'identify', // Uprawnienia wymagane dla autoryzacji Discord
      responseType: 'token'
    };    

    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin();

    console.log('OAuth configured successfully'); 
}

  loginWithDiscord() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  isAuthenticated2() {
    return this.oauthService.hasValidAccessToken();
  }

  // onTabChange(event: MatTabChangeEvent): void {
  //   this.isTabChange = true; // Ustawiamy flagę na true, gdy zmieniana jest zakładka
  //   this.addArrayToUrl(null, null); // Wywołujemy metodę
  //   this.activeTabIndex = event.index; // Aktualizacja indeksu aktywnej zakładki
  //   console.log('Active Tab Index:', this.activeTabIndex);
  //   console.log('Show Overlay:', this.showOverlay);
    
  //   // Resetowanie tablic w zależności od zakładki
  //   if (event.index === 1) {
  //     this.selectedUsers = [];
  //     this.array1AA = [];
  //     this.array2AA = [];
  //     this.showOverlay = true; // Pokaż overlay, gdy przełączamy na zakładkę Tab 2
  //   } else if (event.index === 0) {
  //     this.selectedUsersAA = [];
  //     this.array1 = [];
  //     this.array2 = [];
  //     this.showOverlay = false; // Pokaż overlay, gdy przełączamy na zakładkę Tab 2
  //   }
  // }

  onTabChange(event: MatTabChangeEvent): void {
    this.isTabChange = true; // Ustawiamy flagę na true, gdy zmieniana jest zakładka
    this.addArrayToUrl(null, null); // Wywołujemy metodę
    this.activeTabIndex = event.index; // Aktualizacja indeksu aktywnej zakładki
    console.log('tab', this.activeTabIndex)
    console.log('overlay', this.showOverlay)
    this.showOverlay = event.index === 1;
    // Resetowanie tablic w zależności od zakładki
    if (event.index === 1) {
      this.selectedUsers = [];
      this.array1AA = [];
      this.array2AA = [];
      this.googleApi.getPlayers('NumPlayers').pipe(
        map((response: any) => {
          if (response.values && response.values[2] && response.values[2][0]) {
            return parseFloat(response.values[2][0]); // Konwersja na liczbę
          }
          return 0; // Domyślna wartość
        })
      ).subscribe((value: number) => {
        this.collectedAmount.next(value); // Emituj nową wartość
      });
      // this.showOverlay = true; // Ustawiamy overlay na true dla zakładki Tab 2
    } else if (event.index === 0) {
      this.selectedUsersAA = [];
      this.array1 = [];
      this.array2 = [];
      // this.showOverlay = false; // Ukrywamy overlay dla zakładki Tab 1
    }
  }
  

  selectUser(user: User) {
    const index = this.selectedUsers.indexOf(user);
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
    // console.log('this.selectedUsers', this.selectedUsers)
  }
  selectUserAA(user: User) {
    const index = this.selectedUsersAA.indexOf(user);
    if (index === -1) {
      this.selectedUsersAA.push(user);
    } else {
      this.selectedUsersAA.splice(index, 1);
    }
    // console.log('this.selectedUsers', this.selectedUsers)
  }

  @HostListener('window:scroll', ['$event'])
    onWindowScroll(event: any) {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY >= 100) {
        this.renderer.addClass(this.el.nativeElement, 'sticky');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'sticky');
      }
    }

  addSelectedRows() {
    // this.selected$.subscribe(elements => {
      this.selection.selected.forEach(selectedElement => {
        this.selectedArr.push(selectedElement);
      });
    // });
  } 

  getDiscordUsers() {
    console.log('getDiscordUsers()');
  
    this.http.get<VoiceMember[]>(`${environment.externalApiUrl}voice-members`)
      .subscribe(
        (members) => {
          console.log('members', members);
  
          if (members.length === 0) {
            this.notifier.notify('warning', 'WANT TO PLAY is empty.');
            return;
          }
  
          // Tworzymy mapę dla `playerRowArray` z username, playername i discord_id jako kluczami
          const playerMap = new Map<string, any>();
          this.playerRowArray.forEach((player: any) => {                  
            playerMap.set(player.username, player);
            playerMap.set(player.playername, player);
            if (player.discord_id) {
              playerMap.set(player.discord_id, player);
            }
          });
  
          // Przetwarzamy `members` raz, aby sprawdzić, czy należy dodać gracza
          members.forEach((el) => {
            const player = playerMap.get(el.username) || 
                           playerMap.get(el.nickname) || 
                           playerMap.get(el.id); // Używamy `el.id` do sprawdzenia `discord_id`
  
            if (player && !this.selectedUsers.some((u: any) => 
                u.username === player.username && 
                u.playername === player.playername &&
                u.discord_id === el.id // Sprawdzamy zgodność również z `discord_id`
            )) {
              player.id = el.id; // Przypisujemy `id` z Discorda
              this.notifier.notify('success', `${player.playername} added!.`);
              this.selectedUsers.push(player);
            }
          });
  
          console.log('this.selectedUsers', this.selectedUsers);
        },
        (err) => {
          this.notifier.notify('error', 'Import Players from Discord failed.');
        }
      );
  }  

  sendToVoiceChannels() {
    const newArray1 = this.array1.map((obj: any) => {
      return {
        username: obj.username,
        nickname: obj.nickname,
        id: obj.id
      };
    });

    const newArray2 = this.array2.map((obj: any) => {
      console.log('obj',obj)
      return {
        username: obj.username,
        nickname: obj.nickname,
        id: obj.id
      };
    });

    let channel1Id, channel2Id;

    if (this.selectedChannels === 'Team 1 and Team 2') {
      channel1Id = '851888705307803698';
      channel2Id = '851888741761155136';
    } else {
      channel1Id = '1040385852716630016';
      channel2Id = '1040385893191659680';
    }

    const payload = {
      users1: newArray1,
      users2: newArray2,
      channel1Id: channel1Id,
      channel2Id: channel2Id,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http.post(`${environment.externalApiUrl}move-users-to-channels`, JSON.stringify(payload), httpOptions).subscribe(
      (response) => {
        console.log('Move users to channels success:', response);
      },
      (error) => {
        console.log('PAYLOAD', payload)
        console.error('Move users to channels error:', error);
      }
    );
  }

  // DISCORD.JS ===> REST APPROACH

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 
  applyFilterAA(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAA.filter = filterValue.trim().toLowerCase();
  } 

  public sumRanking(array: any[]):number {
    let sum = 0;
    array.forEach((el) => {
      sum += parseFloat(el.ranking.replace(/,/g, ''));
    })
    return sum;
  }  

  splitArrayIntoTwo(inputArray: User[]): [User[], User[]] {
    this.isSplitArrayIntoTwoClicked = true;
    this.isSplitNationalitiesClicked = false;
    localStorage.setItem('mixway', 'HP');
    this.notifier.notify('default', 'MIX TEAMS HP has been called');  
    
    inputArray.forEach(obj => parseFloat(obj.ranking.replace(/,/g, '')));
  
    let array1: User[] = [];
    let array2: User[] = [];
  
    const sumRanking = (arr: User[]) =>
    arr.reduce((sum, obj) => sum + parseFloat(obj.ranking.replace(/,/g, '')), 0);  
    
    let bestSplit: [User[], User[]] = [[], []];
    let bestDifference = Number.MAX_VALUE;
    let currentDifference = 0;
    for (let i = 1; i < inputArray.length; i++) {
      array1 = inputArray.slice(0, i);
      array2 = inputArray.slice(i);
      const sum1 = sumRanking(array1);
      const sum2 = sumRanking(array2);
      currentDifference = Math.abs(sum1 - sum2);
      if (currentDifference < bestDifference) {
        bestSplit = [array1, array2];
        bestDifference = currentDifference;
      }
    }  
    
    let improved = true;
    while (improved) {
      improved = false;
  
      for (let i = 0; i < bestSplit[0].length; i++) {
        for (let j = 0; j < bestSplit[1].length; j++) {
          const newSplit: [User[], User[]] = [
            [...bestSplit[0].slice(0, i), bestSplit[1][j], ...bestSplit[0].slice(i + 1)],
            [...bestSplit[1].slice(0, j), bestSplit[0][i], ...bestSplit[1].slice(j + 1)]
          ];
          const difference = Math.abs(sumRanking(newSplit[0]) - sumRanking(newSplit[1]));
          if (difference < bestDifference) {
            bestSplit = newSplit;
            bestDifference = difference;
            improved = true;
          }
        }
      }
    }  
    
    const sumTeam1 = sumRanking(bestSplit[0]);
    const sumTeam2 = sumRanking(bestSplit[1]);
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((sumTeam1 - sumTeam2) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((sumTeam2 - sumTeam1) / 400)) * 100;  
    
    this.array1 = bestSplit[0];
    this.array2 = bestSplit[1];
    this.sumTeam1 = sumTeam1;
    this.sumTeam2 = sumTeam2;
    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
    console.log('THIS.ARRAY 1', this.array1)
    console.log('THIS.ARRAY 2', this.array2)   
    const currentDate = new Date().toISOString();
    const newArr1 = this.array1;
    newArr1.forEach(user => {
      user.team = 1;
      user.createdAt = currentDate;
    });

    const newArr2 = this.array2;
    newArr2.forEach(user => {
        user.team = 2;
        user.createdAt = currentDate;
    });

    // Połączenie obu tablic w jedną
    const mergedArray = this.array1.concat(this.array2);

    // this.http.post<any>(`${environment.externalApiUrl}api/save-data`, mergedArray).subscribe(response => {
    //   console.log('Dane zostały wysłane do backendu', response);
    // });
    console.log('mergedArray', mergedArray)
    this.http.post<any>(`${environment.externalApiUrl}api/save-draw`, mergedArray).subscribe(response => {
      console.log('Dane zostały wysłane do backendu', response);
    });
    // Dodaj tablice do URL
    this.addArrayToUrl(this.array1, this.array2);
  
    this.notifier.notify('success', 'MIX TEAMS HP has finished executing');
    return bestSplit;
  }   

  //ALLIED ASSAULT
  splitArrayIntoTwoAA(inputArray: User[]): [User[], User[]] {
    this.isSplitArrayIntoTwoClickedAA = true;
    this.isSplitNationalitiesClickedAA = false;
    localStorage.setItem('mixway', 'HP');
    this.notifier.notify('default', 'MIX TEAMS HP has been called');  
    
    inputArray.forEach(obj => parseFloat(obj.ranking.replace(/,/g, '')));
  
    let array1: User[] = [];
    let array2: User[] = [];
  
    const sumRanking = (arr: User[]) =>
    arr.reduce((sum, obj) => sum + parseFloat(obj.ranking.replace(/,/g, '')), 0);  
    
    let bestSplit: [User[], User[]] = [[], []];
    let bestDifference = Number.MAX_VALUE;
    let currentDifference = 0;
    for (let i = 1; i < inputArray.length; i++) {
      array1 = inputArray.slice(0, i);
      array2 = inputArray.slice(i);
      const sum1 = sumRanking(array1);
      const sum2 = sumRanking(array2);
      currentDifference = Math.abs(sum1 - sum2);
      if (currentDifference < bestDifference) {
        bestSplit = [array1, array2];
        bestDifference = currentDifference;
      }
    }  
    
    let improved = true;
    while (improved) {
      improved = false;
  
      for (let i = 0; i < bestSplit[0].length; i++) {
        for (let j = 0; j < bestSplit[1].length; j++) {
          const newSplit: [User[], User[]] = [
            [...bestSplit[0].slice(0, i), bestSplit[1][j], ...bestSplit[0].slice(i + 1)],
            [...bestSplit[1].slice(0, j), bestSplit[0][i], ...bestSplit[1].slice(j + 1)]
          ];
          const difference = Math.abs(sumRanking(newSplit[0]) - sumRanking(newSplit[1]));
          if (difference < bestDifference) {
            bestSplit = newSplit;
            bestDifference = difference;
            improved = true;
          }
        }
      }
    }  
    
    const sumTeam1 = sumRanking(bestSplit[0]);
    const sumTeam2 = sumRanking(bestSplit[1]);
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((sumTeam1 - sumTeam2) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((sumTeam2 - sumTeam1) / 400)) * 100;  
    
    this.array1AA = bestSplit[0];
    this.array2AA = bestSplit[1];
    this.sumTeam1AA = sumTeam1;
    this.sumTeam2AA = sumTeam2;
    this.chanceOfWinTeamOneShowAA = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShowAA = this.ceilPrecised(chanceOfWinTeamTwo, 2);
    console.log('THIS.ARRAY 1', this.array1AA)
    console.log('THIS.ARRAY 2', this.array2AA)   
    const currentDate = new Date().toISOString();
    const newArr1 = this.array1AA;
    newArr1.forEach(user => {
      user.team = 1;
      user.createdAt = currentDate;
    });

    const newArr2 = this.array2AA;
    newArr2.forEach(user => {
        user.team = 2;
        user.createdAt = currentDate;
    });

    // Połączenie obu tablic w jedną
    const mergedArray = this.array1AA.concat(this.array2AA);

    this.http.post<any>(`${environment.externalApiUrl}api/save-data`, mergedArray).subscribe(response => {
      console.log('Dane zostały wysłane do backendu', response);
    });
    // Dodaj tablice do URL
    this.addArrayToUrl(this.array1AA, this.array2AA);
    this.getContributor();
    this.notifier.notify('success', 'MIX TEAMS HP has finished executing');
    return bestSplit;
  }    

  splitRanking(objects: User[], startIndex: number, firstArray: User[], secondArray: User[], halfSum: number): [User[], User[]] | null {
    if (startIndex >= objects.length) {
      const sumFirstArray = firstArray.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
      const sumSecondArray = secondArray.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
      if (sumFirstArray === sumSecondArray) {
        return [firstArray, secondArray];
      } else if (Math.abs(sumFirstArray - sumSecondArray) <= halfSum) {
        return [firstArray, secondArray];
      }
      return null;
    }

    const currentObject = objects[startIndex];
    const resultWithFirstArray = this.splitRanking(objects, startIndex + 1, [...firstArray, currentObject], secondArray, halfSum);
    if (resultWithFirstArray !== null) {
      return resultWithFirstArray;
    }

    const resultWithSecondArray = this.splitRanking(objects, startIndex + 1, firstArray, [...secondArray, currentObject], halfSum);
    if (resultWithSecondArray !== null) {
      return resultWithSecondArray;
    }

    return null;
  }

  optimalSplit(objects: User[]): [User[], User[]] | null {
    const sum = objects.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
    const halfSum = sum / 2;

    const result = this.splitRanking(objects, 0, [], [], halfSum);

    if (result !== null) {
      this.array1 = result[0];
      this.array2 = result[1];
    }

    return result;
  }

  splitRanking2(array) {
    array.sort((a, b) => parseFloat(b.ranking.replace(',', '')) - parseFloat(a.ranking.replace(',', '')));
    let firstArray = [];
    let secondArray = [];
    let firstArraySum = 0;
    let secondArraySum = 0;

    localStorage.setItem('mixway', 'LP');

    for (let i = 0; i < array.length; i++) {
      let currentRanking = parseFloat(array[i].ranking.replace(',', ''));
      if (firstArraySum <= secondArraySum) {
        firstArray.push(array[i]);
        firstArraySum += currentRanking;
      } else {
        secondArray.push(array[i]);
        secondArraySum += currentRanking;
      }
    }
    this.array1 = firstArray;
    this.array2 = secondArray;

    this.sumTeam1 = this.sumRanking(firstArray)
    this.sumTeam2 = this.sumRanking(secondArray)

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
    this.notifier.notify('success', 'MIX TEAMS LP has finished executing');

    this.addArrayToUrl(firstArray, secondArray)
    // console.log('ARRAY 1:', this.array1);
    // console.log('ARRAY 2:', this.array2);
    return [firstArray, secondArray];
  }  

  groupObjectsByFlag(objects) {
    const groups = {};

    objects.forEach(obj => {
      const flag = obj.flag;
      if (groups[flag]) {
        groups[flag].push(obj);
      } else {
        groups[flag] = [obj];
      }
    });

    return groups;
  }

  combineGroupsIntoArray(groupKeys, groups) {
    const result = [];

    groupKeys.forEach(key => {
      const objects = groups[key];
      if (objects.length > result.length / 2) {
        result.push(...objects);
      } else {
        const remainingSpace = Math.floor((result.length / 2) - objects.length);
        const randomIndex = Math.floor(Math.random() * remainingSpace);
        result.splice(randomIndex, 0, ...objects);
      }
    });

    return result;
  }
  
  // PREVIOUS VERSION DEC 2024
  // splitNationalities(inputArray) {
  //   this.isSplitNationalitiesClicked = true;
  //   this.isSplitArrayIntoTwoClicked = false;
  //   if (inputArray.length % 2 !== 0) {
  //     // console.error("Błąd: Tablica musi mieć parzystą liczbę obiektów.");
  //     this.notifier.notify('error', 'Players must be even')
  //     return;
  //   }
  //   localStorage.setItem('mixway', 'NT');

  //   const groups = this.groupObjectsByFlag(inputArray);
  //   const groupKeys = Object.keys(groups);

  //   const halfLength = Math.floor(inputArray.length / 2);
  //   const firstArray = [];
  //   const secondArray = [];

  //   let i = 0;
  //   while (i < groupKeys.length) {
  //     const flag = groupKeys[i];
  //     const objects = groups[flag];

  //     let j = 0;
  //     while (j < objects.length) {
  //       if (firstArray.length < halfLength) {
  //         firstArray.push(objects[j]);
  //       } else {
  //         secondArray.push(objects[j]);
  //       }
  //       j++;
  //     }
  //     i++;
  //   }

  //   this.array1 = firstArray;
  //   this.array2 = secondArray;
  //   this.sumTeam1 = this.sumRanking(firstArray);
  //   this.sumTeam2 = this.sumRanking(secondArray);

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS NT has finished executing');
  //   console.log('firstArray', firstArray, 'secondArray', secondArray)
  //   this.addArrayToUrl(firstArray, secondArray);
  //   return [firstArray, secondArray];
  // }

  splitNationalities(inputArray) {
    this.isSplitNationalitiesClicked = true;
    this.isSplitArrayIntoTwoClicked = false;
  
    // Sprawdzenie, czy liczba graczy jest parzysta
    if (inputArray.length % 2 !== 0) {
      this.notifier.notify('error', 'Players must be even');
      return;
    }
  
    localStorage.setItem('mixway', 'NT');
  
    // Grupowanie graczy według narodowości
    const groups = this.groupObjectsByFlag(inputArray);
    const groupKeys = Object.keys(groups);
  
    // Liczba graczy w drużynie
    const halfLength = Math.floor(inputArray.length / 2);
    const firstArray = [];
    const secondArray = [];
  
    // Sprawdzenie, która narodowość jest najliczniejsza
    let majorGroupKey = '';
    let maxCount = 0;
  
    groupKeys.forEach(flag => {
      if (groups[flag].length > maxCount) {
        majorGroupKey = flag;
        maxCount = groups[flag].length;
      }
    });
  
    // Jeśli narodowość jest większa niż połowa graczy, przypisujemy ją do jednej drużyny
    const majorGroup = groups[majorGroupKey] || [];
    const otherGroups = groupKeys.filter(flag => flag !== majorGroupKey);
  
    // Przydzielamy graczy z majorGroup do jednej drużyny
    while (majorGroup.length > 0) {
      if (firstArray.length < halfLength) {
        firstArray.push(majorGroup.pop());
      } else {
        secondArray.push(majorGroup.pop());
      }
    }
  
    // Następnie rozdzielamy pozostałych graczy na drużyny
    let i = 0;
    while (i < otherGroups.length) {
      const flag = otherGroups[i];
      const objects = groups[flag];
  
      let j = 0;
      while (j < objects.length) {
        if (firstArray.length < halfLength) {
          firstArray.push(objects[j]);
        } else {
          secondArray.push(objects[j]);
        }
        j++;
      }
      i++;
    }
  
    // Obliczanie sumy rankingu drużyn
    this.array1 = firstArray;
    this.array2 = secondArray;
    this.sumTeam1 = this.sumRanking(firstArray);
    this.sumTeam2 = this.sumRanking(secondArray);
  
    // Obliczanie szans na wygraną
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
    const currentDate = new Date().toISOString();
    const newArr1 = this.array1;
    newArr1.forEach(user => {
      user.team = 1;
      user.createdAt = currentDate;
    });

    const newArr2 = this.array2;
    newArr2.forEach(user => {
        user.team = 2;
        user.createdAt = currentDate;
    });
  
    this.notifier.notify('success', 'MIX TEAMS NT has finished executing');
    console.log('firstArray', firstArray, 'secondArray', secondArray);
    const mergedArray = this.array1.concat(this.array2);
    this.http.post<any>(`${environment.externalApiUrl}api/save-draw`, mergedArray).subscribe(response => {
      console.log('Dane zostały wysłane do backendu', response);
    });
    // Przekazywanie wyników do URL
    this.addArrayToUrl(firstArray, secondArray);
    return [firstArray, secondArray];
  }

  splitNationalitiesAA(inputArray) {
    this.isSplitNationalitiesClickedAA = true;
    this.isSplitArrayIntoTwoClickedAA = false;
  
    // Sprawdzenie, czy liczba graczy jest parzysta
    if (inputArray.length % 2 !== 0) {
      this.notifier.notify('error', 'Players must be even');
      return;
    }
  
    localStorage.setItem('mixway', 'NT');
  
    // Grupowanie graczy według narodowości
    const groups = this.groupObjectsByFlag(inputArray);
    const groupKeys = Object.keys(groups);
  
    // Liczba graczy w drużynie
    const halfLength = Math.floor(inputArray.length / 2);
    const firstArray = [];
    const secondArray = [];
  
    // Sprawdzenie, która narodowość jest najliczniejsza
    let majorGroupKey = '';
    let maxCount = 0;
  
    groupKeys.forEach(flag => {
      if (groups[flag].length > maxCount) {
        majorGroupKey = flag;
        maxCount = groups[flag].length;
      }
    });
  
    // Jeśli narodowość jest większa niż połowa graczy, przypisujemy ją do jednej drużyny
    const majorGroup = groups[majorGroupKey] || [];
    const otherGroups = groupKeys.filter(flag => flag !== majorGroupKey);
  
    // Przydzielamy graczy z majorGroup do jednej drużyny
    while (majorGroup.length > 0) {
      if (firstArray.length < halfLength) {
        firstArray.push(majorGroup.pop());
      } else {
        secondArray.push(majorGroup.pop());
      }
    }
  
    // Następnie rozdzielamy pozostałych graczy na drużyny
    let i = 0;
    while (i < otherGroups.length) {
      const flag = otherGroups[i];
      const objects = groups[flag];
  
      let j = 0;
      while (j < objects.length) {
        if (firstArray.length < halfLength) {
          firstArray.push(objects[j]);
        } else {
          secondArray.push(objects[j]);
        }
        j++;
      }
      i++;
    }
  
    // Obliczanie sumy rankingu drużyn
    this.array1AA = firstArray;
    this.array2AA = secondArray;
    this.sumTeam1AA = this.sumRanking(firstArray);
    this.sumTeam2AA = this.sumRanking(secondArray);
  
    // Obliczanie szans na wygraną
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1AA - this.sumTeam2AA) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2AA - this.sumTeam1AA) / 400)) * 100;
    this.chanceOfWinTeamOneShowAA = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShowAA = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  
    this.notifier.notify('success', 'MIX TEAMS NT has finished executing');
    // console.log('firstArray', firstArray, 'secondArray', secondArray);
  
    // Przekazywanie wyników do URL
    this.addArrayToUrl(firstArray, secondArray);
    this.getContributor();
    return [firstArray, secondArray];
  }

  // addArrayToUrl(a1, a2) {   
  //   this.router.navigate(['mix/'], { queryParams: { a2: JSON.stringify(a2), a1: JSON.stringify(a1) } });   
  // }

  addArrayToUrl(a1: any, a2: any): void {
    if (this.isTabChange) {
      // Jeżeli zmieniono zakładkę, wykonaj uproszczoną nawigację
      this.router.navigate(['mix/']);
      this.isTabChange = false; // Reset flagi po wykonaniu logiki
    } else {
      // W przypadku standardowego wywołania zachowujemy dotychczasowe działanie
      this.router.navigate(['mix/'], {
        queryParams: {
          a1: JSON.stringify(a1),
          a2: JSON.stringify(a2)
        }
      });
    }
  }

  public floorPrecised(number:any, precision:any) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number:any, precision:any) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }

  isAuthenticated() {
    return this.oauthService.hasValidIdToken();
  }

  confirmTeams(){
    // TEAM 1
    let t1p1name = '';
    let t1p2name = '';
    let t1p3name = '';
    let t1p4name = '';
    let t1p5name = '';
    let t1p6name = '';
    let t1p7name = '';

    if (this.array1[0]) {
      t1p1name = this.array1[0].username ? this.array1[0].username : '';
    } else {
      t1p1name = '';
    }
    if (this.array1[1]) {
      t1p2name = this.array1[1].username ? this.array1[1].username : '';
    } else {
      t1p2name = '';
    }
    if (this.array1[2]) {
      t1p3name = this.array1[2].username ? this.array1[2].username : '';
    } else {
      t1p3name = '';
    }
    if (this.array1[3]) {
      t1p4name = this.array1[3].username ? this.array1[3].username : '';
    } else {
      t1p4name = '';
    }
    if (this.array1[4]) {
      t1p5name = this.array1[4].username ? this.array1[4].username : '';
    } else {
      t1p5name = '';
    }
    if (this.array1[5]) {
      t1p6name = this.array1[5].username ? this.array1[5].username : '';
    } else {
      t1p6name = '';
    }
    if (this.array1[6]) {
      t1p7name = this.array1[6].username ? this.array1[6].username : '';
    } else {
      t1p7name = '';
    }

    //TEAM 2
    let t2p1name = '';
    let t2p2name = '';
    let t2p3name = '';
    let t2p4name = '';
    let t2p5name = '';
    let t2p6name = '';
    let t2p7name = '';

    if (this.array2[0]) {
      t2p1name = this.array2[0].username ? this.array2[0].username : '';
    } else {
      t2p1name = '';
    }
    if (this.array2[1]) {
      t2p2name = this.array2[1].username ? this.array2[1].username : '';
    } else {
      t2p2name = '';
    }
    if (this.array2[2]) {
      t2p3name = this.array2[2].username ? this.array2[2].username : '';
    } else {
      t2p4name = '';
    }
    if (this.array2[3]) {
      t2p4name = this.array2[3].username ? this.array2[3].username : '';
    } else {
      t2p4name = '';
    }
    if (this.array2[4]) {
      t2p5name = this.array2[4].username ? this.array2[4].username : '';
    } else {
      t2p5name = '';
    }
    if (this.array2[5]) {
      t2p6name = this.array2[5].username ? this.array2[5].username : '';
    } else {
      t2p6name = '';
    }
    if (this.array2[6]) {
      t2p7name = this.array2[6].username ? this.array2[6].username : '';
    } else {
      t2p7name = '';
    }

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name, t1p6name, t1p7name).subscribe({
      next: (res) => {
        if(res.done = true){
          this.notifier.notify('success', 'Team 1 successful added.');
        }
      }
    })

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', t2p1name, t2p2name, t2p3name, t2p4name, t2p5name, t2p6name, t2p7name).subscribe({
      next: (res) => {
        if(res.done = true){
          this.notifier.notify('success', 'Team 2 successful added.');
        }
      }, error: (err) => {
        console.log('err', err);
      }
    })
  }

  toggleSticky() {
    this.isStickyShown = !this.isStickyShown;
  }

  selectAll(event) {
    this.allSelected = event.checked;
    this.playerRowArray.forEach(user => {
      user.selected = event.checked;
    });
  }

  sendToDiscord() {    
    // Last War and Log
    // const webhookUrl = 'https://discord.com/api/webhooks/1075178845067563138/FpKf7iiu3dhI9NTxyS-VkMNcv4mdq2KORNhNUbkeZnfCgLtDaJSIFxi9Uz5YUTCDPqmX';

    let mixWay = localStorage.getItem('mixway');
    this.nextMatch = '';
    // General Chat
    const webhookUrl = 'https://discord.com/api/webhooks/1075499431207645284/B0aRKfrobBHm2NKwM8Z6HGdkn0dt17xT3N1ssnXwFbyoNYNjgezteQLYuO5VY33MK2nS';

    const arr1 = this.array1;
    const arr2 = this.array2;  

    let maps: string[] = [];

    const stock = ['The Hunt', 'V2', 'The Bridge'];
    const customMp = ['VSUK Abbey', 'Stlo', 'Renan', 'The Church Final'];
    const customLp = ['V2 Shelter', 'Navarone', 'Dessau1946', 'The Bridge OMG', 'The Lost Town', 'Stlo4', 'THe Village', 'Harbor', 'Holland']
    
    if (this.selectedOption === 'Random') {      
      let availableMaps: string[] = [];
      
      if (this.selectedUsers.length === 6) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor'];
      } else if (this.selectedUsers.length >= 8) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor', 'VSUK Abbey', 'Navarone', 'The Church Final'];
      } else if (this.selectedUsers.length >= 10) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Renan', 'VSUK Abbey', 'The Church Final', 'Stlo4', 'V2 Shelter', 'Holland', 'The Bridge OMG', 'The Village'];
      }
      
      maps = this.getExtraRandomMaps(availableMaps, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoStockMaps') {
      // Wybierz dwie mapy ze zbioru stock
      maps = this.getExtraRandomMaps(stock, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoCustomMapsMp') {
      // Wybierz dwie mapy ze zbioru customMp
      maps = this.getExtraRandomMaps(customMp, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoCustomMapsLp') {
      // Wybierz dwie mapy ze zbioru customLp
      maps = this.getExtraRandomMaps(customLp, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'OneStockOneCustomMp') {
      // Wybierz jedną mapę ze zbioru stock i jedną mapę ze zbioru customMp
      const stockMap = this.getRandomElementFromArray(stock);
      const customMap = this.getRandomElementFromArray(customMp);
      maps = [stockMap, customMap];
    } else if (this.selectedOption === 'OneStockOneCustomLp') {
      // Wybierz jedną mapę ze zbioru stock i jedną mapę ze zbioru customLp
      const stockMap = this.getRandomElementFromArray(stock);
      const customMap = this.getRandomElementFromArray(customLp);
      maps = [stockMap, customMap];
    } else if (this.selectedOption === 'Teams-decide') {
      // Dodaj informację o Teams decide do nextMatch
      maps = ['Teams decide'];
    } else if (this.selectedOption === 'extraRandom') {
      let availableMaps: string[] = [];
      
      if (this.selectedUsers.length === 6) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor'];
      } else if (this.selectedUsers.length >= 8) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor', 'VSUK Abbey', 'Navarone', 'The Church Final'];
      } else if (this.selectedUsers.length >= 10) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Renan', 'VSUK Abbey', 'The Church Final', 'Stlo4', 'V2 Shelter', 'Holland', 'The Bridge OMG', 'The Village'];
      }
      
      maps = this.getExtraRandomMaps(availableMaps, 2, this.mapProbabilities);
    }

    const selectRandomPlayer = (arr: {playername: string}[]): string => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex].playername;
    };

    console.log('arr1', arr1)
    console.log('arr2', arr2)

    const t1p1name = (arr1.length > 0 && arr1[0] && arr1[0].playername) ? arr1[0].playername : '';
    const t1p2name = (arr1.length > 1 && arr1[1] && arr1[1].playername) ? arr1[1].playername : '';
    const t1p3name = (arr1.length > 2 && arr1[2] && arr1[2].playername) ? arr1[2].playername : '';
    const t1p4name = (arr1.length > 3 && arr1[3] && arr1[3].playername) ? arr1[3].playername : '';
    const t1p5name = (arr1.length > 4 && arr1[4] && arr1[4].playername) ? arr1[4].playername : '';
    const t1p6name = (arr1.length > 5 && arr1[5] && arr1[5].playername) ? arr1[5].playername : '';
    const t1p7name = (arr1.length > 6 && arr1[6] && arr1[6].playername) ? arr1[6].playername : '';
    const t2p1name = (arr2.length > 0 && arr2[0] && arr2[0].playername) ? arr2[0].playername : '';
    const t2p2name = (arr2.length > 0 && arr2[1] && arr2[1].playername) ? arr2[1].playername : '';
    const t2p3name = (arr2.length > 0 && arr2[2] && arr2[2].playername) ? arr2[2].playername : '';
    const t2p4name = (arr2.length > 0 && arr2[3] && arr2[3].playername) ? arr2[3].playername : '';
    const t2p5name = (arr2.length > 0 && arr2[4] && arr2[4].playername) ? arr2[4].playername : '';
    const t2p6name = (arr2.length > 0 && arr2[5] && arr2[5].playername) ? arr2[5].playername : '';
    const t2p7name = (arr2.length > 0 && arr2[6] && arr2[6].playername) ? arr2[6].playername : '';

    const funnyOneLiners: string[] = 
    // ["Stop crying lady!", 
    // "He didn't choose the camp life, the camp life chose him.", 
    // "A bit drunk, but still better then You!", 
    // "He's not camping, He's just waiting for your s'mores to cook.", 
    // "If you can't beat 'em, cheat 'em!", 
    // "Official? I m coming for You!",
    // "I'm not lost, I'm just exploring the enemy spawn point.", 
    // "This isn't camping, it's strategic resting.", 
    // "I'm not a cheater, I just wanted to know if you can see through walls.", 
    // "I'm not a hacker, I'm just really good at guessing your spot.", 
    // "Volute? We don't need this. Pure game <3."];
    [
      "Quiet down, they might hear your tears!",
      "He’s not camping, he’s just watching your failures unfold.",
      "A little tipsy, but still better than your skills.",
      "I’m not camping, I’m waiting for your invisible move.",
      "Can’t win? Just sneak through the back door.",
      "Official Time for your goodbye!",
      "Lost? I’m just checking out what’s in your base.",
      "This isn’t camping, it’s a controlled pause.",
      "Not cheating, just testing how far you can see me.",
      "I’m not a hacker, I just have a talent for guessing.",
      "Strategy? Nah, just pure fun with the game.",
      "Skintex? No worries, I have gRaBaRz config."
    ]

    const admin = `ADMIN: ${selectRandomPlayer([...arr1, ...arr2])}`;

    const arr = [...arr1, ...arr2]; // łączymy obie tablice w jedną
    let highestRanking = -Infinity; // zaczynamy od bardzo niskiej wartości
    let highestRankingPlayer = '';
    
    for (const player of arr) {
      const ranking = parseInt(player.ranking); // konwertujemy ranking na liczbę
    
      if (ranking > highestRanking) {
        highestRanking = ranking;
        highestRankingPlayer = player.playername;
      }
    }    

    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    const chanceFutureTeamOne = this.sumRanking(arr1)
    const chanceFutureTeamTwo = this.sumRanking(arr2)

    let chanceOfWinTeamOneShow = 0;
    let chanceOfWinTeamTwoShow = 0;

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne - chanceFutureTeamTwo) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo - chanceFutureTeamOne) / 400)) * 100;

    chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);  
    
    this.nextMatch += "**NEXT MATCH**, (" + mixWay + ") created: " + formattedDate + "\n";
    this.nextMatch += "----------" + "\n";
    this.nextMatch += 'MAPS: ' + maps.join(', ') + ' (' + this.selectedOption + ')' + '\n';
    this.nextMatch += "----------" + "\n";
    this.nextMatch += "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + "\n";
    this.nextMatch += "TEAM 1 Chance for win: " + chanceOfWinTeamTwoShow + " %" + "\n";
    this.nextMatch += "----------" + "\n";
    this.nextMatch += "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + "\n";
    this.nextMatch += "TEAM 2 Chance for win: " + chanceOfWinTeamOneShow + " %" + "\n";
    this.nextMatch += "----------" + "\n";
    this.nextMatch += "SS MAKER: **" + highestRankingPlayer + "** " + `${funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]}` + "\n";
    this.nextMatch += "----------" + "\n";
    this.nextMatch += "Good Luck & Have Fun!";  

    // this.nextMatchOne = "**NEXT MATCH**, (" + mixWay + ") created: " + formattedDate + ' MAPS: ' + maps.join(', ') + ' (' + this.selectedOption + ')';
    // this.nextMatchTwo = "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + " Chance for win: " + chanceOfWinTeamTwoShow + " prc.";
    // this.nextMatchThree = "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + " Chance for win: " + chanceOfWinTeamOneShow + " prc.";
    // this.nextMatchFour = "SS MAKER: **" + highestRankingPlayer + "** " + `${funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]}`;   
    
    // console.log('nextM', this.nextMatch);
    // this.getDiscordUserData().subscribe(
    //   data => {
    //     // console.log('Dane użytkowników z Discorda:', data);
    //     this.discordUsersAll = data;
    //     // Tutaj możesz przetworzyć dane i wyświetlić je na stronie       
    //   },
    //   error => {
    //     console.error('Błąd pobierania danych z Discorda:', error);
    //   }
    // );

    // console.log('discordUsersAll', this.discordUsersAll)
    const payload = {
      content: this.nextMatch
    };
    
    this.http.post(webhookUrl, payload).subscribe({
      next: (res) => {
        this.notifier.notify('success', "Teams Send successful!")
      }, error: (err) => {
        this.notifier.notify('error', 'Something went wrong')
      }
    });  
  } 

  sendToDiscordAA() {    
    // Last War and Log
    // const webhookUrl = 'https://discord.com/api/webhooks/1075178845067563138/FpKf7iiu3dhI9NTxyS-VkMNcv4mdq2KORNhNUbkeZnfCgLtDaJSIFxi9Uz5YUTCDPqmX';
    

    // Sprawdź, czy dane istnieją i przekształć je na obiekt
   
    
    let mixWay = localStorage.getItem('mixway');
    this.nextMatchAA = '';
    // General Chat
    const webhookUrl = 'https://discord.com/api/webhooks/1075499431207645284/B0aRKfrobBHm2NKwM8Z6HGdkn0dt17xT3N1ssnXwFbyoNYNjgezteQLYuO5VY33MK2nS';

    const arr1 = this.array1AA;
    const arr2 = this.array2AA;  

    let maps: string[] = [];

    const stock = ['The Hunt', 'V2', 'The Bridge'];
    const customMp = ['VSUK Abbey', 'Stlo', 'Renan', 'The Church Final'];
    const customLp = ['V2 Shelter', 'Navarone', 'Dessau1946', 'The Bridge OMG', 'The Lost Town', 'Stlo4', 'THe Village', 'Harbor', 'Holland']
    
    if (this.selectedOption === 'Random') {      
      let availableMaps: string[] = [];
      
      if (this.selectedUsers.length === 6) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor'];
      } else if (this.selectedUsers.length >= 8) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor', 'VSUK Abbey', 'Navarone', 'The Church Final'];
      } else if (this.selectedUsers.length >= 10) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Renan', 'VSUK Abbey', 'The Church Final', 'Stlo4', 'V2 Shelter', 'Holland', 'The Bridge OMG', 'The Village'];
      }
      
      maps = this.getExtraRandomMaps(availableMaps, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoStockMaps') {
      // Wybierz dwie mapy ze zbioru stock
      maps = this.getExtraRandomMaps(stock, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoCustomMapsMp') {
      // Wybierz dwie mapy ze zbioru customMp
      maps = this.getExtraRandomMaps(customMp, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'TwoCustomMapsLp') {
      // Wybierz dwie mapy ze zbioru customLp
      maps = this.getExtraRandomMaps(customLp, 2, this.mapProbabilities);
    } else if (this.selectedOption === 'OneStockOneCustomMp') {
      // Wybierz jedną mapę ze zbioru stock i jedną mapę ze zbioru customMp
      const stockMap = this.getRandomElementFromArray(stock);
      const customMap = this.getRandomElementFromArray(customMp);
      maps = [stockMap, customMap];
    } else if (this.selectedOption === 'OneStockOneCustomLp') {
      // Wybierz jedną mapę ze zbioru stock i jedną mapę ze zbioru customLp
      const stockMap = this.getRandomElementFromArray(stock);
      const customMap = this.getRandomElementFromArray(customLp);
      maps = [stockMap, customMap];
    } else if (this.selectedOption === 'Teams-decide') {
      // Dodaj informację o Teams decide do nextMatch
      maps = ['Teams decide'];
    } else if (this.selectedOption === 'extraRandom') {
      let availableMaps: string[] = [];
      
      if (this.selectedUsers.length === 6) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor'];
      } else if (this.selectedUsers.length >= 8) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Stlo', 'Renan', 'Dessau1946', 'Harbor', 'VSUK Abbey', 'Navarone', 'The Church Final'];
      } else if (this.selectedUsers.length >= 10) {
        availableMaps = ['The Hunt', 'V2', 'The Bridge', 'Renan', 'VSUK Abbey', 'The Church Final', 'Stlo4', 'V2 Shelter', 'Holland', 'The Bridge OMG', 'The Village'];
      }
      
      maps = this.getExtraRandomMaps(availableMaps, 2, this.mapProbabilities);
    }

    const selectRandomPlayer = (arr: {playername: string}[]): string => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex].playername;
    };

    console.log('arr1', arr1)
    console.log('arr2', arr2)

    const t1p1name = (arr1.length > 0 && arr1[0] && arr1[0].playername) ? arr1[0].playername : '';
    const t1p2name = (arr1.length > 1 && arr1[1] && arr1[1].playername) ? arr1[1].playername : '';
    const t1p3name = (arr1.length > 2 && arr1[2] && arr1[2].playername) ? arr1[2].playername : '';
    const t1p4name = (arr1.length > 3 && arr1[3] && arr1[3].playername) ? arr1[3].playername : '';
    const t1p5name = (arr1.length > 4 && arr1[4] && arr1[4].playername) ? arr1[4].playername : '';
    const t1p6name = (arr1.length > 5 && arr1[5] && arr1[5].playername) ? arr1[5].playername : '';
    const t1p7name = (arr1.length > 6 && arr1[6] && arr1[6].playername) ? arr1[6].playername : '';
    const t2p1name = (arr2.length > 0 && arr2[0] && arr2[0].playername) ? arr2[0].playername : '';
    const t2p2name = (arr2.length > 0 && arr2[1] && arr2[1].playername) ? arr2[1].playername : '';
    const t2p3name = (arr2.length > 0 && arr2[2] && arr2[2].playername) ? arr2[2].playername : '';
    const t2p4name = (arr2.length > 0 && arr2[3] && arr2[3].playername) ? arr2[3].playername : '';
    const t2p5name = (arr2.length > 0 && arr2[4] && arr2[4].playername) ? arr2[4].playername : '';
    const t2p6name = (arr2.length > 0 && arr2[5] && arr2[5].playername) ? arr2[5].playername : '';
    const t2p7name = (arr2.length > 0 && arr2[6] && arr2[6].playername) ? arr2[6].playername : '';

    const funnyOneLiners: string[] = 
    // ["Stop crying lady!", 
    // "He didn't choose the camp life, the camp life chose him.", 
    // "A bit drunk, but still better then You!", 
    // "He's not camping, He's just waiting for your s'mores to cook.", 
    // "If you can't beat 'em, cheat 'em!", 
    // "Official? I m coming for You!",
    // "I'm not lost, I'm just exploring the enemy spawn point.", 
    // "This isn't camping, it's strategic resting.", 
    // "I'm not a cheater, I just wanted to know if you can see through walls.", 
    // "I'm not a hacker, I'm just really good at guessing your spot.", 
    // "Volute? We don't need this. Pure game <3."];
    [
      "Quiet down, they might hear your tears!",
      "He’s not camping, he’s just watching your failures unfold.",
      "A little tipsy, but still better than your skills.",
      "I’m not camping, I’m waiting for your invisible move.",
      "Can’t win? Just sneak through the back door.",
      "Official Time for your goodbye!",
      "Lost? I’m just checking out what’s in your base.",
      "This isn’t camping, it’s a controlled pause.",
      "Not cheating, just testing how far you can see me.",
      "I’m not a hacker, I just have a talent for guessing.",
      "Strategy? Nah, just pure fun with the game.",
      "Skintex? No worries, I have gRaBaRz config."
    ]

    const admin = `ADMIN: ${selectRandomPlayer([...arr1, ...arr2])}`;

    const arr = [...arr1, ...arr2]; // łączymy obie tablice w jedną
    let highestRanking = -Infinity; // zaczynamy od bardzo niskiej wartości
    let highestRankingPlayer = '';
    
    for (const player of arr) {
      const ranking = parseInt(player.ranking); // konwertujemy ranking na liczbę
    
      if (ranking > highestRanking) {
        highestRanking = ranking;
        highestRankingPlayer = player.playername;
      }
    }    

    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    const chanceFutureTeamOne = this.sumRanking(arr1)
    const chanceFutureTeamTwo = this.sumRanking(arr2)

    let chanceOfWinTeamOneShow = 0;
    let chanceOfWinTeamTwoShow = 0;

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne - chanceFutureTeamTwo) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo - chanceFutureTeamOne) / 400)) * 100;

    chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);  
    
    this.nextMatchAA += "**NEXT MATCH MoH:AA**, (" + mixWay + ") created: " + formattedDate + " by " + this.displayNameAA + "\n";
    this.nextMatchAA += "----------" + "\n";
    this.nextMatchAA += 'MAPS: ' + maps.join(', ') + ' (' + this.selectedOption + ')' + '\n';
    this.nextMatchAA += "----------" + "\n";
    this.nextMatchAA += "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + "\n";
    this.nextMatchAA += "TEAM 1 Chance for win: " + chanceOfWinTeamTwoShow + " %" + "\n";
    this.nextMatchAA += "----------" + "\n";
    this.nextMatchAA += "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + "\n";
    this.nextMatchAA += "TEAM 2 Chance for win: " + chanceOfWinTeamOneShow + " %" + "\n";
    this.nextMatchAA += "----------" + "\n";
    this.nextMatchAA += "SS MAKER: **" + highestRankingPlayer + "** " + `${funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]}` + "\n";
    this.nextMatchAA += "----------" + "\n";
    this.nextMatchAA += "Good Luck & Have Fun!";  

    // this.nextMatchOne = "**NEXT MATCH**, (" + mixWay + ") created: " + formattedDate + ' MAPS: ' + maps.join(', ') + ' (' + this.selectedOption + ')';
    // this.nextMatchTwo = "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + " Chance for win: " + chanceOfWinTeamTwoShow + " prc.";
    // this.nextMatchThree = "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + " Chance for win: " + chanceOfWinTeamOneShow + " prc.";
    // this.nextMatchFour = "SS MAKER: **" + highestRankingPlayer + "** " + `${funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]}`;   
    
    // console.log('nextM', this.nextMatch);
    // this.getDiscordUserData().subscribe(
    //   data => {
    //     // console.log('Dane użytkowników z Discorda:', data);
    //     this.discordUsersAll = data;
    //     // Tutaj możesz przetworzyć dane i wyświetlić je na stronie       
    //   },
    //   error => {
    //     console.error('Błąd pobierania danych z Discorda:', error);
    //   }
    // );

    // console.log('discordUsersAll', this.discordUsersAll)
    const payload = {
      content: this.nextMatchAA
    };

    console.log('Payload', payload)
    this.http.post(webhookUrl, payload).subscribe({
      next: (res) => {
        this.notifier.notify('success', "Teams Send successful!")
      }, error: (err) => {
        this.notifier.notify('error', 'Something went wrong')
      }
    });
  
  } 

  getContributor() {
    this.googleApi.getContributorDetails().subscribe(
      (result: string) => {
        // Przypisanie wyniku do zmiennej contributorName
        this.displayNameAA = result;
        console.log(this.displayNameAA); // Możesz wyświetlić wynik, aby sprawdzić
      },
      (error) => {
        console.error('Błąd podczas pobierania danych:', error);
      }
    );
  }

  findMatchingUsers(arr: any[]): any[] {
    const matchingUsers: any[] = [];

    for (const user of arr) {
        for (const discordUserId in this.discordUsersAll) {
            const discordUser = this.discordUsersAll[discordUserId];
            
            // Sprawdź, czy pola username lub nickname z Discorda pasują do username lub playername z arr1/arr2
            if (discordUser.username === user.username || discordUser.nickname === user.playername) {
                matchingUsers.push(discordUser);
                // Możesz tu dodać logikę lub inne operacje, jeśli użytkownik się zgadza
            }
        }
    }

    return matchingUsers;
  }

  getDiscordUserData(){
    return this.http.get(`${environment.externalApiUrl}discord-users`)
  }

  sendMessageRcon() {
    const opoznienieMillis = this.delay * 1000;
    const interwalMillis = this.interval * 1000;
    // Wyślij wiadomość do serwera Node.js
    this.http
      .post(`${environment.externalApiUrl}/send-message-to-node`, 
      { 
        // message: this.nextMatch, 
        message1: this.nextMatchOne,
        message2: this.nextMatchTwo,
        message3: this.nextMatchThree,
        message4: this.nextMatchFour,
        ip: this.ip,
        counter: this.counter,
        delay: opoznienieMillis,
        interval: interwalMillis 
      })
      .subscribe({
        next: (res) => {
          this.notifier.notify('success', "Squads to SH sent successful!")
        }, error: (err) => {
          this.notifier.notify('error', 'Something went wrong')
        }
      })
  }

  isValid(): boolean {
    return this.array1 && this.array1.length > 2 && this.array2 && this.array2.length > 2;
  }

  getRandomElement(array: any[]): any {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

   shuffleArray(array) {
    const newArray = [...array]; // Tworzymy nową kopię tablicy
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Losowo wybieramy indeks do zamiany
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Zamieniamy elementy miejscami
    }
    return newArray;
  }

  getRandomElementsFromArray(array: any[], count: number): any[] {
    if (count >= array.length) {
      return array.slice();
    }
    
    const shuffledArray = array.slice().sort(() => 0.5 - Math.random());
    
    return shuffledArray.slice(0, count);
  }

  getRandomMaps() {
    if (this.selectedOption === 'extraRandom' && this.selectedUsers.length >= 8) {
      const mapArray = Object.keys(this.mapProbabilities);
      const count = 2;
      const probabilities = this.mapProbabilities;
      this.selectedMaps = this.getExtraRandomMaps(mapArray, count, probabilities);
    } else {
      this.selectedMaps = this.getDefaultRandomMaps();
    }
  }

  getDefaultRandomMaps() {
    const totalProbability = this.maps.reduce((sum, map) => sum + map.probability, 0);
    const randomNumber = Math.random() * totalProbability;

    let accumulatedProbability = 0;

    const selectedMaps: string[] = [];

    for (const map of this.maps) {
      accumulatedProbability += map.probability;
      if (randomNumber <= accumulatedProbability) {
        selectedMaps.push(map.name);
        if (selectedMaps.length === 2) {
          break;
        }
      }
    }

    return selectedMaps;
  }

  getExtraRandomMaps(mapArray: string[], count: number, probabilities: {[key: string]: number}): string[] {
    const selectedMaps: string[] = [];
    const availableMaps: string[] = [];
  
    // Wybierz mapy, których prawdopodobieństwo jest większe od 0
    for (const map of mapArray) {
      if (probabilities[map] > 0) {
        availableMaps.push(map);
      }
    }
  
    // Wylosuj mapy z uwzględnieniem prawdopodobieństwa
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableMaps.length);
      const selectedMap = availableMaps[randomIndex];
      selectedMaps.push(selectedMap);
  
      // Zmniejsz prawdopodobieństwo wybranych map do zera, aby nie były wybierane ponownie
      probabilities[selectedMap] = 0;
  
      // Usuń wybraną mapę z dostępnych map
      availableMaps.splice(randomIndex, 1);
    }
  
    return selectedMaps;
  }    

  // Metoda do losowania dwóch map z prawdopodobieństwem
  getRandomElementsWithProbability(array: string[], count: number, probabilityMap: Record<string, number>): string[] {
    const weightedArray: string[] = [];
    Object.entries(probabilityMap).forEach(([map, probability]) => {
      for (let i = 0; i < probability; i++) {
        weightedArray.push(map);
      }
    });

    const shuffledArray = this.shuffleArray(weightedArray);
    return shuffledArray.slice(0, count);
  }

  // Metoda do losowania unikalnych elementów z prawdopodobieństwem
  getUniqueRandomElementsWithProbability(probabilityMap: Record<string, number>, count: number): string[] {
    const weightedArray: string[] = [];
    Object.entries(probabilityMap).forEach(([map, probability]) => {
      for (let i = 0; i < probability; i++) {
        weightedArray.push(map);
      }
    });

    const uniqueMaps: string[] = [];
    while (uniqueMaps.length < count) {
      const randomMap = this.getRandomElementFromArray(weightedArray);
      if (!uniqueMaps.includes(randomMap)) {
        uniqueMaps.push(randomMap);
      }
    }

    return uniqueMaps;
  }

  getRandomElementFromArray(array: any[]): any {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  removePlayer(index: number): void {
    this.selectedUsers.splice(index, 1);
  }

  //Allied Assault
  removePlayerAA(index: number): void {
    this.selectedUsersAA.splice(index, 1);
  }

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  closeOverlay(): void {
    this.tabGroup.selectedIndex = 0; // Przełączenie na zakładkę o indeksie 0
    this.showOverlay = false; // Ukryj overlay
  }
  
}