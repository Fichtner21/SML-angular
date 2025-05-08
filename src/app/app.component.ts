import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { PlayersApiService } from './services/players-api.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { faEuro, faHome, faHouse } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { HttpClient } from '@angular/common/http';
import { SeasonService } from './services/season.service';
import { PlayerService } from './services/player.service';
import { LoginModalComponent } from './shared/login-modal/login-modal.component';
import { MatDialog } from '@angular/material/dialog';

interface VoiceMember {
  id: string;
  username: string;
  nickname: string;
  additionalInfo0?: string; // Wartość z indeksu 0
  additionalInfo1?: string; // Wartość z indeksu 1
  additionalInfo6?: string; // Wartość z indeksu 6
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  parentRanking: any;
  title = 'SH MIX';
  players$: Observable<any>;
  matches$: Observable<any>;
  matchesPerMonth$: Observable<any>;
  numOfPlayers$: Observable<any>;
  activityCanvas:any;
  ctx: any;
  house = faHouse;
  home = faHome;
  euro = faEuro;
  paypal = faPaypal;
  // public lang = new FormControl('en');
  currentLanguage: any = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  languageCode = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  monthPlaying: any;
  isMenuOpen = false;
  numberOfMatches = 0;
  historyMatches: any;
  num_Players: any;
  total_wars: any;
  s5_wars: any;
  s6_wars: any;
  s7_wars: any;
  s8_wars: any;
  s9_wars: any;
  s10_wars: any;
  total_clans: any;
  total_clanwars: any;
  progressValue: number;
  tooltipText: string;
  public userCount: number = 0;
  // public players: VoiceMember[] = []; // Lista graczy
  public playersData: any[] = []; // Przechowywanie przetworzonych danych
  season!: number;
  dateRange!: string;
  playerDetails: any;

  //DISCORD
  isUserLoggedIn = false;
  private loginSubscription: Subscription;
  userRoles: string[] = [];
  rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League player',
    '1161215729421525082': 'New player',
    '1161596242225283083': 'Friend'
  };
  role: any;
  userDataString: any;
  userDataDiscord: any;
  avatarUrl: string | null = null;
  mergedData: any[] = [];
  // players: any[] = [];
  players: any;
  mergedDataPlayer: any;
  isLoggedIn: boolean;
  roleDisplay: any;

  constructor(private playersApiService: PlayersApiService, private translateService: TranslateService, public _authService: AuthService, private router: Router, private oAuthService: OAuthService, private seasonService: SeasonService, private playerService: PlayerService, private authService: AuthService, private cdr: ChangeDetectorRef, private http: HttpClient, private dialog: MatDialog) {
    translateService.setDefaultLang(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en');
    this.isLoggedIn = this.authService.isLoggedInGoogle();
  }

  languages = [
    { 'languageCode': 'en', 'languageName': 'English' },
    { 'languageCode': 'pl', 'languageName': 'Polski' },
  ]

  ngOnInit(): void {
    const seasonInfo = this.seasonService.getSeason();
    this.season = seasonInfo.season;
    this.dateRange = seasonInfo.dateRange;
    this.loginSubscription = this.authService.loginStatus$.subscribe(
      (status) => {
        this.isUserLoggedIn = status;
        // console.log('status', status)

        if(status === true){
      const guildId = '716723661909786690'; // Wstaw ID serwera
   
    this.userDataString = localStorage.getItem('userData');
    this.userDataDiscord = this.userDataString ? JSON.parse(this.userDataString) : null;
    
    // console.log('userData', this.userDataDiscord)
    if (this.userDataDiscord) {
      const userId = this.userDataDiscord.id;
      const avatarId = this.userDataDiscord.avatar;
      // Przyjmujemy, że format jest PNG; możesz również dodać logikę do obsługi innych formatów
      this.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
    }           
          this.authService.getUserRoles3()
          .pipe(
            switchMap((response) => {
              if (Array.isArray(response.roles)) {
                this.userRoles = response.roles; // Ustaw role
                this.role = this.getRoleNames(); // Ustal rolę do wyświetlenia
                this.roleDisplay = this.getDisplayRole(this.userRoles); // Ustal wyświetlaną rolę
                return this.playersApiService.getPlayersFinal('Players'); // Pobierz graczy
              } else {
                console.error('Błąd: Pobierane role nie są tablicą.', response);
                this.userRoles = [];
                this.role = 'Guest'; // Ustaw domyślną rolę
                return of([]); // Zwróć pustą tablicę jako fallback
              }
            })
          )
          .subscribe({
            next: (players) => {
              this.players = players;
              this.mergeData(); // Scal dane
              this.cdr.detectChanges(); // Wymuś wykrywanie zmian
            },
            error: (err) => {
              console.error('Błąd podczas ładowania danych:', err);
            }
          });
        
        }
      }
    );
    
    this.cdr.detectChanges();

    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    // this.translateService.setDefaultLang('en');

    // this.lang.valueChanges.subscribe((lang) => {
    //   this.translateService.use(lang);
    // });

    // this.translateService.onLangChange.subscribe((lang) => {
    //   alert(lang);
    // })
    const overlay = document.getElementById("overlay");

    setTimeout(function () {
      overlay?.classList.add("hidden");
      setTimeout(function () {
        overlay?.classList.remove("hidden");
        overlay?.classList.add("flash");
        setTimeout(function () {
          if(overlay){
            overlay.style.display = "none";
          }
        }, 2000); // Wait for the flash animation to finish
      }, 100);
    }, 5000);

    this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
      map((response: any) => {
        this.s5_wars = response.values[1][2];
        this.s6_wars = response.values[1][3];
        this.s7_wars = response.values[1][4];
        this.s8_wars = response.values[1][5];
        this.s9_wars = response.values[1][6];
        this.s10_wars = response.values[1][7];
        this.total_wars = response.values[1][1];
        this.num_Players = response.values[1][0];

        return response.values;
      })
    );   
   
    const startDate = new Date('2024-07-01');
    const endDate = new Date('2024-09-30');
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const currentDate = new Date();
    const daysLeft = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    this.progressValue = ((totalDays - daysLeft) / totalDays) * 100;
    this.tooltipText = `There are ${daysLeft} days left until the end of the season.`;
  }

  logoutTest() {
    this.oAuthService.logOut();
    this.router.navigate(['/']);
  }

  onLoginClick(): void {
    if (this.isLoggedIn) {
      // Wylogowanie
      this.authService.logout();
    } else {
      // Otworzenie login modal
      this.dialog.open(LoginModalComponent, {
        width: '400px',
        disableClose: false
      }).afterClosed().subscribe(loggedIn => {
        if (loggedIn) {
          this.authService.setLoggedIn(true);  // Po zalogowaniu ustawienie statusu
          console.log('User logged in');
        }
      });
    }
  }  
 
  languageChange($event) {
    // debugger;
    this.currentLanguage = $event;
    this.translateService.use(this.currentLanguage);
    localStorage.setItem('lang', this.currentLanguage);
  }

  public toggleMenu(){
    // document.getElementById('nav').classList.toggle('block_class');
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu() {
    this.isMenuOpen = false;
  }

  get isAdmin(){
    let is_admin = localStorage.getItem('is_admin');
    if(is_admin === 'on'){
      return true;
    }else{
      return false;
    }
  }

  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    this.router.navigate(['/']);
    return true;
  }

  loginDiscord(): void {
    this.authService.loginWithDiscord(); // Call the login method from AuthService
  }

  checkLoginStatus(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn();
    this.cdr.detectChanges();
  }

  logoutDiscord(): void {
    this.authService.logout2();
    this.checkLoginStatus(); // Update login status after logout
  }

  mergeData(): any {
    if (this.userDataDiscord && this.players.length > 0) {
      this.mergedData = this.players.map(player => {
        // Sprawdzanie, czy username lub playername pasuje do userDataDiscord
        
        if (player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name || player.username === this.userDataDiscord.global_name || player.playername === this.userDataDiscord.username || player.discord_id === this.userDataDiscord.id) {
          // Tworzenie nowego obiektu z połączonymi danymi
          const mergedPlayer = { ...player, ...this.userDataDiscord, usernameurl: player.username, role: this.role, clansh: player.clan, displayRole: this.roleDisplay}; // Scalanie obiektów
  
          // Dodanie usernameDiscord, jeśli oba obiekty mają pole username
          if (player.username === this.userDataDiscord.username) {
            mergedPlayer.usernameDiscord = player.username; // Ustawienie usernameDiscord
          }
          // console.log('mergedPlayer', mergedPlayer)
          this.mergedDataPlayer = mergedPlayer; // Zwróć scalony obiekt
          // console.log(this.mergedDataPlayer)
        }
        return player; // Zwróć oryginalny obiekt, jeśli nie ma dopasowania
      }).filter(player => player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name || player.discord_id === this.userDataDiscord.id); // Filtruj tylko dopasowane obiekty
      this.cdr.detectChanges();
    }
  }

  getAvatarUrl(player: any): string {
    const avatarId = player?.avatar; // Zakładając, że avatar jest częścią obiektu gracza
    const userId = player?.id; // Zakładając, że id jest częścią obiektu gracza
  
    if (avatarId) {
      return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`; // Zwróć URL avatara
    } else {
      return 'assets/images/medal_of_hh.png'; // Zwróć domyślny obrazek
    }
  }
  
  // getToken powinno zwracać Observable<string>
  getToken(): Observable<string> {
    return this.http.get<any>(`${environment.externalApiUrl}get-token`).pipe(
      map(response => response) // Załóżmy, że token jest w polu `token` w odpowiedzi
    );
  }

  // getRoleNames(): string[] {
  //   return this.userRoles.map(role => this.rolesMap[role]);
  // }

  getRoleNames(): string[] {
    // Użyj bezpiecznego dostępu do mapowania ról
    return Array.isArray(this.userRoles)
      ? this.userRoles.map(role => this.rolesMap[role] || 'Unknown role')
      : [];
  }

  // getDiscordUsers() {
  //   this.http.get<VoiceMember[]>(`${environment.externalApiUrl}voice-members`).subscribe(
  //     (members) => {
  //       this.userCount = members.length; // Aktualizacja liczby użytkowników
  //       this.players = members; // Przechowywanie listy graczy
  //       console.log('this.players', this.players)
  //       this.playerService.loadPlayers().subscribe(() => {
  //         const playerDetails = this.playerService.addPlayerLink('illusion');
  //         console.log('Player Details:', playerDetails); // Should show player details
  //       });
  //       if (this.userCount === 0) {
  //         this.notifier.notify('warning', 'WANT TO PLAY is empty.');
  //       } else {
  //         this.notifier.notify('success', `${this.userCount} users are currently in the WANT TO PLAY channel.`);
  //       }
  //     },
  //     (err) => {
  //       this.notifier.notify('error', 'Import Players from Discord failed.');
  //     }
  //   );
  // }
  // getDiscordUsers() {
  //   this.http.get<VoiceMember[]>(`${environment.externalApiUrl}voice-members`).subscribe(
  //     (members) => {
  //       this.userCount = members.length; // Update user count
  //       console.log('Discord Members:', members); // Log Discord members
        
  //       // Store the list of players
  //       this.players = members; 
  //       console.log('this.players', this.players);
  
  //       // Load players from your service
  //       this.playerService.loadPlayers().subscribe(() => {
  //         // Get all players matching the Discord members
  //         const matchedPlayers = this.getMatchedPlayers(members);
  //         console.log('Matched Players:', matchedPlayers); // Log matched players
          
  //         if (matchedPlayers.length === 0) {
  //           this.notifier.notify('warning', 'No matching players found.');
  //         } else {
  //           const playerDetails = matchedPlayers.map(player => 
  //             `Player Name: ${player.playername}, `
  //           ); 
  
  //           this.notifier.notify('success', `Current users in the WANT TO PLAY channel: ${playerDetails}`);
  //         }
  //       });
        
  //       if (this.userCount === 0) {
  //         this.notifier.notify('warning', 'WANT TO PLAY is empty.');
  //       }
  //     },
  //     (err) => {
  //       this.notifier.notify('error', 'Import Players from Discord failed.');
  //     }
  //   );
  // }

  getDisplayRole(roles: string[]): string {
    // Priorytet ról od najwyższej do najniższej
    const rolePriority = [
      { id: '1059920877044629614', displayRole: 'OWNER' },
      { id: '716736352359809095', displayRole: 'admin' },
      { id: '915354110302249011', displayRole: 'League player' },
      { id: '1161215729421525082', displayRole: 'New player' },
      { id: '1161596242225283083', displayRole: 'Friend' },
    ];
  
    // Znajdź najwyższą rolę użytkownika
    for (const role of rolePriority) {
      if (roles.includes(role.id)) {
        return role.displayRole;
      }
    }
  
    // Jeśli użytkownik nie ma żadnej z wymienionych ról
    return 'Guest';
  }
  
  
  // Helper method to find matched players
  private getMatchedPlayers(members: VoiceMember[]): any[] {
    return members.reduce((acc: any[], member: VoiceMember) => {
      const foundPlayer = this.playerService.addPlayerLink(member.nickname || member.username);
      if (foundPlayer) {
        acc.push(foundPlayer); // Add matched player to the accumulator
      }
      return acc;
    }, []);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  // getPlayersData() {
  //   this.playersApiService.getPlayers('Players').pipe(
  //     map((response: any) => {       
  //       return response.values.map((item: any[]) => ({
  //         index0: item[0], // Wartość z indeksu 0
  //         index1: item[1],
  //         index6: item[6]  // Wartość z indeksu 6
  //       }));
  //     })
  //   ).subscribe((data) => {
  //     this.playersData = data; // Przechowywanie przetworzonych danych
  //     // console.log('DATA', data)
  //     this.updatePlayersWithData();
  //   });
  // }

  updatePlayersWithData() {
    this.players.forEach(player => {
      // console.log('player', player)
      const matchingData = this.playersData.find(data => data.index1 === player.nickname || player.username);
      // console.log('matchingData', matchingData)
      if (matchingData) {
        player.additionalInfo0 = matchingData.index0; // Wartość z indeksu 0
        player.additionalInfo1 = matchingData.index1; // Wartość z indeksu 1
        player.additionalInfo6 = matchingData.index6; // Wartość z indeksu 6
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}


