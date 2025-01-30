import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PlayersApiService } from '../services/players-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmUpdateEloComponent } from '../shared/confirm-update-elo/confirm-update-elo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmUpdateEloAaComponent } from '../shared/confirm-update-elo-aa/confirm-update-elo-aa.component';

@Component({
  selector: 'app-update-elo',
  templateUrl: './update-elo.component.html',
  styleUrls: ['./update-elo.component.scss']
})
export class UpdateEloComponent implements OnInit {
  updateEloForm: FormGroup; //sh
  updateEloFormAA: FormGroup; //aa
  players: any[] = [];
  playersAA: any[] = [];
  filteredPlayers: any[] = [];
  filteredPlayersAA: any[] = [];
  teamOnePlayersMix = [];
  teamOnePlayersMixAA = [];
  teamTwoPlayersMix = [];  
  teamTwoPlayersMixAA = [];  
  last10mixes: any[] = [];    
  last10mixesAA: any[] = [];    
  last10mixesApi = environment.externalApiUrl + 'last-10-matches';
  last10mixesApiAA = environment.externalApiUrl + 'last-10-matches';
  private apiUrl = 'https://script.googleapis.com/v1/scripts/AKfycbz8Cxn1Y0OtkBwaUdHAa_VaB8f5IuFHtMix30Hv76g9Z82k8h90tTcXNzdCfWMTkXIw:run';
  userRoles: string[] = [];
  rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League players'
  };
  role: any;
  userDataString: any;
  userDataDiscord: any;
  avatarUrl: string | null = null;
  mergedData: any[] = [];
  mergedDataAA: any[] = [];
  roleDisplay: any;
  mergedDataPlayer: any;
  mergedDataPlayerAA: any;
  isDataLoaded: boolean = false;  // Flaga kontrolująca załadowanie danych
  isLoading: boolean = true;      // Flaga kontrolująca, czy dane są w trakcie ładowania
  numberPattern: string = '^[0-9]*$'; // Pattern do walidacji liczb
  limitPlayerOne: any;
  limitPlayerOneAA: any;
  limitPlayerTwo: any;
  limitPlayerTwoAA: any;
  samePlayer: string;
  samePlayerAA: string;
  userVerified: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private readonly oAuthService: OAuthService, private notifier: NotifierService, public authService: AuthService, private router: Router, private cdr: ChangeDetectorRef, private playersApiService: PlayersApiService, private snackBar: MatSnackBar, private dialog: MatDialog) {  
    this.updateEloForm = this.fb.group({
      teamOnePlayers: this.fb.array([], [Validators.minLength(3), Validators.maxLength(7)]),
      teamTwoPlayers: this.fb.array([], [Validators.minLength(3), Validators.maxLength(7)]),
      teamOneRoundsWon: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
      teamTwoRoundsWon: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
    }, { validators: this.playersMatchValidator });

    this.updateEloFormAA = this.fb.group({
      teamOnePlayersAA: this.fb.array([], [Validators.minLength(3), Validators.maxLength(7)]),
      teamTwoPlayersAA: this.fb.array([], [Validators.minLength(3), Validators.maxLength(7)]),
      teamOneRoundsWonAA: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
      teamTwoRoundsWonAA: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
    }, { validators: this.playersMatchValidatorAA });    
  }

  ngOnInit() {    
    this.getToken().subscribe(token => {
      this.authService.saveToken(token); // Zapisz token w localStorage
    });   

    this.userVerified = this.authService.getUserDataGoogle();  

    const userId = '649159865213780006'; // Wstaw user ID użytkownika
    const guildId = '716723661909786690'; // Wstaw ID serwera
   
    this.userDataString = localStorage.getItem('userData');
    this.userDataDiscord = this.userDataString ? JSON.parse(this.userDataString) : null;
    
    console.log('userData', this.userDataDiscord)   

    // this.authService.getUserRoles3().subscribe({
    //   next: (response) => {
    //     if (Array.isArray(response.roles)) {
    //       this.userRoles = response.roles; // Pobierz tablicę ról
    //       this.role = this.getRoleNames(); // Ustal rolę do wyświetlenia
    //       this.roleDisplay = this.getDisplayRole(this.userRoles); // Ustal rolę do wyświetlenia
    //     } else {
    //       console.error('Błąd: Pobierane role nie są tablicą.', response);
    //       this.userRoles = [];
    //       this.role = 'Guest'; // Ustaw domyślną rolę
    //     }
    //     this.playersApiService.getPlayersFinal('Players').subscribe(data => {
    //       this.players = data;      
    //       this.mergeData();
    //     });
    //     this.playersApiService.getPlayersFinal('Players_AA').subscribe(data => {
    //       this.playersAA = data;      
    //       this.mergeDataAA();
    //     });
    //     this.cdr.detectChanges();
    //     console.log('Role użytkownika:', this.userRoles);
    //   },
    //   error: (err) => {
    //     console.error('Błąd podczas pobierania ról użytkownika:', err);
    //   }
    // });
    this.authService.getUserRolesPublic().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.roles)) {
          this.userRoles = response.roles; // Pobierz tablicę ról
          this.role = this.getRoleNames(); // Ustal rolę do wyświetlenia
          this.roleDisplay = this.getDisplayRole(this.userRoles); // Ustal rolę do wyświetlenia
        } else {
          console.error('Błąd: Pobierane role nie są tablicą.', response);
          this.userRoles = [];
          this.role = 'Guest'; // Ustaw domyślną rolę
        }
    
        // Pobierz dane graczy z obu arkuszy
        this.playersApiService.getPlayersFinal('Players').subscribe(data => {
          this.players = data;      
          this.mergeData(); // Scal dane
        });
    
        this.playersApiService.getPlayersFinal('Players_AA').subscribe(data => {
          this.playersAA = data;      
          this.mergeDataAA(); // Scal dane
        });
    
        this.cdr.detectChanges(); // Wymuś wykrycie zmian
      },
      error: (err) => {
        console.error('Błąd podczas pobierania ról użytkownika:', err);
      }
    });
    
    this.getLast10Mixes()
    this.cdr.detectChanges();
  }

  mergeData(): void {
    if (this.userDataDiscord && this.players.length > 0) {
      this.mergedData = this.players.map(player => {
        const isMatching = player.username === this.userDataDiscord.username || 
                           player.playername === this.userDataDiscord.global_name || 
                           player.username === this.userDataDiscord.global_name || 
                           player.playername === this.userDataDiscord.username ||
                           player.discord_id === this.userDataDiscord.id;

        if (isMatching) {
          const mergedPlayer = { 
            ...player, 
            ...this.userDataDiscord, 
            usernameurl: player.username, 
            role: this.role, 
            displayRole: this.roleDisplay, 
          };

          // Zapisz mergedPlayer w mergedDataPlayer
          this.mergedDataPlayer = mergedPlayer;

          // Możesz wywołać isAuthorized() po zapisaniu mergedPlayer
          mergedPlayer.authorized = this.isAuthorized();  // Tutaj przypisujemy wartość "authorized"

          // Zmieniamy flage na false, gdy dane są już załadowane
          this.isLoading = false;
          this.isDataLoaded = true;

          return mergedPlayer;
        }
        
        return player;
      }).filter(player => player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name || player.discord_id === this.userDataDiscord.id);
    
      console.log('mergedDataPlayer:', this.mergedDataPlayer);
    }
  }
  
  mergeDataAA(): void {
    if (this.userDataDiscord && this.playersAA.length > 0) {
      this.mergedDataAA = this.playersAA.map(player => {
        const isMatching = player.username === this.userDataDiscord.username || 
                           player.playername === this.userDataDiscord.global_name || 
                           player.username === this.userDataDiscord.global_name || 
                           player.playername === this.userDataDiscord.username ||
                           player.discord_id === this.userDataDiscord.id;

        if (isMatching) {
          const mergedPlayer = { 
            ...player, 
            ...this.userDataDiscord, 
            usernameurl: player.username, 
            role: this.role, 
            displayRole: this.roleDisplay, 
          };

          // Zapisz mergedPlayer w mergedDataPlayer
          this.mergedDataPlayerAA = mergedPlayer;

          // Możesz wywołać isAuthorized() po zapisaniu mergedPlayer
          mergedPlayer.authorized = this.isAuthorizedAA();  // Tutaj przypisujemy wartość "authorized"

          // Zmieniamy flage na false, gdy dane są już załadowane
          this.isLoading = false;
          this.isDataLoaded = true;

          return mergedPlayer;
        }
        
        return player;
      }).filter(player => player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name || player.discord_id === this.userDataDiscord.id);
    
      console.log('mergedDataPlayerAA:', this.mergedDataPlayerAA);
    }
  }
  
  
  getAvatarUrl(player: any): string {
    const avatarId = player.avatar; // Zakładając, że avatar jest częścią obiektu gracza
    const userId = player.id; // Zakładając, że id jest częścią obiektu gracza
    return avatarId ? `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png` : ''; // Zwróć URL avatara lub pusty string
  }

  // getToken powinno zwracać Observable<string>
  getToken(): Observable<string> {
    return this.http.get<any>(`${environment.externalApiUrl}get-token`).pipe(
      map(response => response) // Załóżmy, że token jest w polu `token` w odpowiedzi
    );
  }

  isAuthorized(): boolean {
    if (!this.mergedDataPlayer) {
      return false; // Jeśli mergedDataPlayer nie jest dostępne, zwróć false
    }
    const allowedRoles = ['OWNER','admin', 'League player'];
    const userRole = this.mergedDataPlayer.displayRole || '';
    // console.log('Allowed roles:', allowedRoles);
    // console.log('User role:', userRole);

    const isAuthorized = allowedRoles.includes(userRole);
    // console.log('isAuthorized result:', isAuthorized);
    return isAuthorized;
  }

  isAuthorizedAA(): boolean {
    if (!this.mergedDataPlayerAA) {
      return false; // Jeśli mergedDataPlayer nie jest dostępne, zwróć false
    }
    const allowedRoles = ['OWNER','admin', 'League player'];
    const userRole = this.mergedDataPlayerAA.displayRole || '';
    // console.log('Allowed roles:', allowedRoles);
    // console.log('User role:', userRole);

    const isAuthorized = allowedRoles.includes(userRole);
    // console.log('isAuthorized result:', isAuthorized);
    return isAuthorized;
  }
  
  
  getRoleNames(): string[] {
    // Użyj bezpiecznego dostępu do mapowania ról
    return Array.isArray(this.userRoles)
      ? this.userRoles.map(role => this.rolesMap[role] || 'Unknown role')
      : [];
  }

   // Getter for user data
   get userData() {
    return this.authService.getUserData(); // Return user data from AuthService
  }

  // Getter for user roles
  get userRolesElo() {
    return this.authService.getUserRoles2(); // Return user roles from AuthService
  }

  getLast10Mixes() {
    this.http.get<any>(this.last10mixesApi).subscribe(
      (mixes) => {
        if (mixes.length === 0) {
          console.log('Mixes not available');
        } else {
          this.last10mixes = mixes;
          console.log('mixes', mixes)        
        }
      },
      error => {
        console.error('Error fetching mixes', error);
      }
    );
  }  

  createPlayerFormGroup(): FormGroup {
    return this.fb.group({
      playerName: ['', Validators.required],  // Pole imienia gracza musi być wymagane
      username: ['', Validators.required],    // Pole username musi być wymagane
      ranking: ['', Validators.required],     // Ranking musi być wymagany
      combatScore: [null, [Validators.required, Validators.min(0)]]  // combatScore musi być liczbą >= 0
    });
  }  

  createPlayerFormGroupAA(): FormGroup {
    return this.fb.group({
      playerNameAA: ['', Validators.required],  // Pole imienia gracza musi być wymagane
      usernameAA: ['', Validators.required],    // Pole username musi być wymagane
      rankingAA: ['', Validators.required],     // Ranking musi być wymagany
      combatScoreAA: [null, [Validators.required, Validators.min(0)]]  // combatScore musi być liczbą >= 0
    });
  }  

  get teamOnePlayers(): FormArray {
    return this.updateEloForm.get('teamOnePlayers') as FormArray;
  }
  
  get teamTwoPlayers(): FormArray {
    return this.updateEloForm.get('teamTwoPlayers') as FormArray;
  }

  get teamOnePlayersAA(): FormArray {
    return this.updateEloFormAA.get('teamOnePlayersAA') as FormArray;
  }
  
  get teamTwoPlayersAA(): FormArray {
    return this.updateEloFormAA.get('teamTwoPlayersAA') as FormArray;
  }

  getPlayersFinal(name: string): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    ).pipe(map(response => {
      let batchRowValues = response.values;
      let players: any[] = [];
      for (let i = 1; i < batchRowValues.length; i++) {
        const rowObject: object = {};
        for (let j = 0; j < batchRowValues[i].length; j++) {
          rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
        }
        players.push(rowObject);
      }
      return players;
    }));
  }  

  getPlayersFinalShort(name: string): Observable<any> {
    return this.http.get<any>(
      `https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/${name}?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`
    ).pipe(
      map(response => {
        let batchRowValues = response.values;
        let players: any[] = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          const rowObject: any = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }
        // Zwróć tylko wymagane pola: username, playername, nationality
        return players.map(player => ({
          username: player['username'],  // Zmienna w zależności od Twoich danych
          playername: player['playername'],  // Zmienna w zależności od Twoich danych
          nationality: player['nationality']  // Zmienna w zależności od Twoich danych
        }));
      })
    );
  }  

  addPlayer(team: 'teamOne' | 'teamTwo') {
    const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
  
    // Sprawdzamy, czy liczba graczy nie przekroczyła maksymalnej liczby
    if (playersArray.length < 7) {
      playersArray.push(this.createPlayerFormGroup());
    } else {
      // Możesz dodać logikę wyświetlania komunikatu, jeśli liczba graczy przekroczyła limit
      if(team === 'teamOne'){
        this.limitPlayerOne = 'Max players reached for Team One.';
      } 
      if(team === 'teamTwo'){
        this.limitPlayerTwo = 'Max players reached for Team Two.';
      }      
      // console.log('Max players reached for', team);
    }
  }

  addPlayerAA(team: 'teamOne' | 'teamTwo') {
    const playersArray = this.updateEloFormAA.get(`${team}PlayersAA`) as FormArray;
  
    // Sprawdzamy, czy liczba graczy nie przekroczyła maksymalnej liczby
    if (playersArray.length < 7) {
      playersArray.push(this.createPlayerFormGroupAA());
    } else {
      // Możesz dodać logikę wyświetlania komunikatu, jeśli liczba graczy przekroczyła limit
      if(team === 'teamOne'){
        this.limitPlayerOneAA = 'Max players reached for Team One.';
      } 
      if(team === 'teamTwo'){
        this.limitPlayerTwoAA = 'Max players reached for Team Two.';
      }      
      // console.log('Max players reached for', team);
    }
  }
  
  playerValidation: Validators[] = [(control: FormArray) => {
    const teamOnePlayers = this.updateEloForm.get('teamOnePlayers').value;
    const teamTwoPlayers = this.updateEloForm.get('teamTwoPlayers').value;
  
    // Sprawdzenie, czy gracze w teamOne nie są w teamTwo i odwrotnie
    for (let player of teamOnePlayers) {
      if (teamTwoPlayers.includes(player)) {
        return { playerConflict: true }; // Zwrócenie błędu, jeśli gracz występuje w obu drużynach
      }
    }
    return null;
  }];

  playerValidationAA: Validators[] = [(control: FormArray) => {
    const teamOnePlayers = this.updateEloFormAA.get('teamOnePlayersAA').value;
    const teamTwoPlayers = this.updateEloFormAA.get('teamTwoPlayersAA').value;
  
    // Sprawdzenie, czy gracze w teamOne nie są w teamTwo i odwrotnie
    for (let player of teamOnePlayers) {
      if (teamTwoPlayers.includes(player)) {
        return { playerConflict: true }; // Zwrócenie błędu, jeśli gracz występuje w obu drużynach
      }
    }
    return null;
  }];
  
  clearForm() {
    const teamOnePlayers = this.updateEloForm.get('teamOnePlayers') as FormArray;
    const teamTwoPlayers = this.updateEloForm.get('teamTwoPlayers') as FormArray;
  
    // Usunięcie wszystkich kontrolerów z tablicy
    while (teamOnePlayers.length !== 0) {
      teamOnePlayers.removeAt(0);
    }
  
    while (teamTwoPlayers.length !== 0) {
      teamTwoPlayers.removeAt(0);
    }
  
    // Resetowanie wartości formularza
    this.updateEloForm.reset({
      teamOneRoundsWon: 0,
      teamTwoRoundsWon: 0
    });
    this.samePlayer = '';
    this.updateEloForm.reset();
  }

  clearFormAA() {
    const teamOnePlayers = this.updateEloFormAA.get('teamOnePlayersAA') as FormArray;
    const teamTwoPlayers = this.updateEloFormAA.get('teamTwoPlayersAA') as FormArray;
  
    // Usunięcie wszystkich kontrolerów z tablicy
    while (teamOnePlayers.length !== 0) {
      teamOnePlayers.removeAt(0);
    }
  
    while (teamTwoPlayers.length !== 0) {
      teamTwoPlayers.removeAt(0);
    }
  
    // Resetowanie wartości formularza
    this.updateEloFormAA.reset({
      teamOneRoundsWonAA: 0,
      teamTwoRoundsWonAA: 0
    });
    this.samePlayerAA = '';
    this.updateEloFormAA.reset();
  }

  removePlayer(team: 'teamOne' | 'teamTwo', index: number) {
    const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
    if (playersArray.length > 3) {  // Minimalna liczba graczy w drużynie to 3
      playersArray.removeAt(index);
    } else {
      // Możesz dodać logikę, aby wyświetlić komunikat, jeśli liczba graczy jest mniejsza niż 3
      console.log('Minimum players required in', team);
    }
  }  

  removePlayerAA(team: 'teamOne' | 'teamTwo', index: number) {
    const playersArray = this.updateEloFormAA.get(`${team}PlayersAA`) as FormArray;
    if (playersArray.length > 3) {  // Minimalna liczba graczy w drużynie to 3
      playersArray.removeAt(index);
    } else {
      // Możesz dodać logikę, aby wyświetlić komunikat, jeśli liczba graczy jest mniejsza niż 3
      console.log('Minimum players required in', team);
    }
  }  

  filterPlayers(team: 'teamOne' | 'teamTwo', searchTerm: string) {
    if (!searchTerm) {
      this.filteredPlayers = [];
      return;
    }
    
    this.filteredPlayers = this.players.filter(player => 
      player.playername.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterPlayersAA(team: 'teamOne' | 'teamTwo', searchTerm: string) {
    if (!searchTerm) {
      this.filteredPlayersAA = [];
      return;
    }
    
    this.filteredPlayersAA = this.playersAA.filter(player => 
      player.playername.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectPlayer(team: 'teamOne' | 'teamTwo', player: any, index: number) {
    const playerControl = (this.updateEloForm.get(`${team}Players`) as FormArray).at(index);   
  
    const selectedPlayer = {
      playerName: player.playername,
      username: player.username,
      ranking: parseFloat(player.ranking.replace(/,/g, '')), // Ensure ranking is set as a number
      combatScore: player.combatScore || null
    };
  
    playerControl.setValue(selectedPlayer);    
  }  
  selectPlayerAA(team: 'teamOne' | 'teamTwo', player: any, index: number) {
    const playerControl = (this.updateEloFormAA.get(`${team}PlayersAA`) as FormArray).at(index);   
  
    const selectedPlayer = {
      playerNameAA: player.playername,
      usernameAA: player.username,
      rankingAA: parseFloat(player.ranking.replace(/,/g, '')), // Ensure ranking is set as a number
      combatScoreAA: player.combatScore || null
    };
  
    playerControl.setValue(selectedPlayer);    
  }  
  
  addPlayerControl(team: 'teamOne' | 'teamTwo') {
    const teamArray = this.updateEloForm.get(`${team}Players`) as FormArray;
    teamArray.push(this.createPlayerFormGroup());
  }  

  addPlayerControlAA(team: 'teamOne' | 'teamTwo') {
    const teamArray = this.updateEloFormAA.get(`${team}PlayersAA`) as FormArray;
    teamArray.push(this.createPlayerFormGroupAA());
  }  
  
  addAllPlayersToForm(mixes: any[]) {
    mixes.forEach(mix => {
      const team = mix.team === 1 ? 'teamOne' : 'teamTwo';
      const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
  
      // Sprawdź, czy nie przekroczono limitu graczy
      if (playersArray.length < 7) {
        const selectedPlayer = {
          playerName: mix.playername,
          username: mix.username || '', // Upewnij się, że masz właściwość username w obiekcie mix
          ranking: parseFloat(mix.ranking.replace(/,/g, '')) || 0, // Upewnij się, że ranking jest liczbą
          combatScore: mix.combatScore || null
        };
  
        playersArray.push(this.fb.group(selectedPlayer));
      }
    });
  }
  addAllPlayersToFormAA(mixes: any[]) {
    mixes.forEach(mix => {
      const team = mix.team === 1 ? 'teamOne' : 'teamTwo';
      const playersArray = this.updateEloFormAA.get(`${team}PlayersAA`) as FormArray;
  
      // Sprawdź, czy nie przekroczono limitu graczy
      if (playersArray.length < 7) {
        const selectedPlayer = {
          playerName: mix.playername,
          username: mix.username || '', // Upewnij się, że masz właściwość username w obiekcie mix
          ranking: parseFloat(mix.ranking.replace(/,/g, '')) || 0, // Upewnij się, że ranking jest liczbą
          combatScore: mix.combatScore || null
        };
  
        playersArray.push(this.fb.group(selectedPlayer));
      }
    });
  }

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

   // Walidator, aby liczba graczy w obu drużynach była równa
  playersMatchValidator(group: FormGroup) {
    const teamOnePlayers = group.get('teamOnePlayers').value;
    const teamTwoPlayers = group.get('teamTwoPlayers').value;
    return teamOnePlayers.length === teamTwoPlayers.length ? null : { teamsMismatch: true };
  } 
  playersMatchValidatorAA(group: FormGroup) {
    const teamOnePlayers = group.get('teamOnePlayersAA').value;
    const teamTwoPlayers = group.get('teamTwoPlayersAA').value;
    return teamOnePlayers.length === teamTwoPlayers.length ? null : { teamsMismatch: true };
  } 

  loadDraws(limit: number) {
    this.playersApiService.getDraws(limit).subscribe(
        (data) => {
            console.log('Data received:', data); // Loguj dane tutaj
            this.last10mixes = data; // Przypisz dane do zmiennej
            console.log('Last 10 mixes:', this.last10mixes); // Loguj wynik
        },
        (error) => {
            console.error('Error loading draws:', error);
        }
    );
  }

  updateElo() {
    const formValue = this.updateEloForm.value;
  
    // Przygotowanie danych do wysłania
    const data = {
      teamOne: {
        players: formValue.teamOnePlayers.map(p => p.username),
        elos: formValue.teamOnePlayers.map(p => parseFloat(p.ranking)),
        combatScores: formValue.teamOnePlayers.map(p => p.combatScore),
        roundsWon: formValue.teamOneRoundsWon
      },
      teamTwo: {
        players: formValue.teamTwoPlayers.map(p => p.username),
        elos: formValue.teamTwoPlayers.map(p => parseFloat(p.ranking)),
        combatScores: formValue.teamTwoPlayers.map(p => p.combatScore),
        roundsWon: formValue.teamTwoRoundsWon
      },
      responsibilityFactor: 22,
      outperformThreshold: 12,
      contributor: this.userDataDiscord.global_name || ''
    };
  
    // Otwórz dialog
    const dialogRef = this.dialog.open(ConfirmUpdateEloComponent, {
      width: '600px',
      data: data
    });
  
    // Obsługa wyniku z dialogu
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Jeśli użytkownik potwierdził, wykonaj POST
        this.submitElo(data);
      }
    });
  } 

  updateEloAA() {
    const formValue = this.updateEloFormAA.value;
  console.log('formValue', formValue)
    // Przygotowanie danych do wysłania
    const data = {
      teamOne: {
        players: formValue.teamOnePlayersAA.map(p => p.usernameAA),
        elos: formValue.teamOnePlayersAA.map(p => parseFloat(p.rankingAA)),
        combatScores: formValue.teamOnePlayersAA.map(p => p.combatScoreAA),
        roundsWon: formValue.teamOneRoundsWonAA
      },
      teamTwo: {
        players: formValue.teamTwoPlayersAA.map(p => p.usernameAA),
        elos: formValue.teamTwoPlayersAA.map(p => parseFloat(p.rankingAA)),
        combatScores: formValue.teamTwoPlayersAA.map(p => p.combatScoreAA),
        roundsWon: formValue.teamTwoRoundsWonAA
      },
      responsibilityFactor: 22,
      outperformThreshold: 12,
      contributor: this.userDataDiscord.global_name || ''
    };
  
    // Otwórz dialog
    const dialogRef = this.dialog.open(ConfirmUpdateEloAaComponent, {
      width: '600px',
      data: data
    });
  
    // Obsługa wyniku z dialogu
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Jeśli użytkownik potwierdził, wykonaj POST
        this.submitEloAA(data);
      }
    });
  }

  private submitElo(data: any) {
    const body = {
      function: 'calculateELO',
      parameters: [data]
    };
  console.log('body', body)
    this.http.post(this.apiUrl, body, { headers: this.authHeader() }).subscribe(
      response => {
        this.snackBar.open('War successfully added!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
          duration: 3000
        });
        this.getPlayersFinal('Players').subscribe(data => {
          this.players = data;
          this.mergeData();
        });
      },
      error => {
        this.snackBar.open('Something went wrong, try again!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
          duration: 3000
        });
      }
    );
  } 

  private submitEloAA(data: any) {
    const body = {
      function: 'calculateELOAA',
      parameters: [data]
    };
  console.log('body', body)
    this.http.post(this.apiUrl, body, { headers: this.authHeader() }).subscribe(
      response => {
        this.snackBar.open('War successfully added!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
          duration: 3000
        });
        this.getPlayersFinal('Players').subscribe(data => {
          this.players = data;
          this.mergeData();
        });
      },
      error => {
        this.snackBar.open('Something went wrong, try again!', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
          duration: 3000
        });
      }
    );
  }

  public authHeader(): HttpHeaders {   
    return new HttpHeaders({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`, // Przekaż token w nagłówku
      'Content-Type': 'application/json'
    });
  }
}