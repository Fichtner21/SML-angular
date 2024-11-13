import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-elo',
  templateUrl: './update-elo.component.html',
  styleUrls: ['./update-elo.component.scss']
})
export class UpdateEloComponent implements OnInit {
  updateEloForm: FormGroup;
  players: any[] = [];
  filteredPlayers: any[] = [];
  teamOnePlayersMix = [];
  teamTwoPlayersMix = [];
  bodyy = 
        {
            "teamOne": {
                "players": [
                    "trigger",
                    "sid",
                    "wint",
                    "tomas",
                    "mr-t0ud",
                    "appelpitje",
                    "spooox"
                ],
                "elos": [
                    1000,
                    1000,
                    1000,
                    1000,
                    1000,
                    1000,
                    1000
                ],
                "combatScores": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                ],
                "roundsWon": 11
            },
            "teamTwo": {
                "players": [
                    "hwk",
                    "kurian",
                    "k4ps",
                    "Mohamed",
                    "wiktor",
                    "f1sh",
                    "belus"
                ],
                "elos": [
                    1000,
                    1000,
                    1000,
                    1000,
                    1000,
                    1000,
                    1000
                ],
                "combatScores": [
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14
                ],
                "roundsWon": 17
            },
            "responsibilityFactor": 22,
            "outperformThreshold": 12
        }
  last10mixes: any[] = [];    
  last10mixesApi = environment.externalApiUrl + 'last-10-matches';
  private apiUrl = 'https://script.googleapis.com/v1/scripts/AKfycbze1jAvHhZwaHX6Hwnz3Vz1p8SYafuHgkuVWEw_OQBDNWFsIHHsnpJ_zCdo72xQAsI:run';
  userRoles: string[] = [];

  rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League players'
  };

  role: string;
  userDataString: any;
  userDataDiscord: any;
  avatarUrl: string | null = null;
  mergedData: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private readonly oAuthService: OAuthService, private notifier: NotifierService, public authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    // this.updateEloForm = this.fb.group({
    //   teamOnePlayers: this.fb.array([
    //     this.createPlayerFormGroup()
    //   ]),
    //   teamTwoPlayers: this.fb.array([
    //     this.createPlayerFormGroup()
    //   ]),
    //   teamOneRoundsWon: [0],
    //   teamTwoRoundsWon: [0]
    // });
    this.updateEloForm = this.fb.group({
      teamOnePlayers: this.fb.array([]), // Pusty array na początku
      teamTwoPlayers: this.fb.array([]), // Pusty array na początku
      teamOneRoundsWon: [0],
      teamTwoRoundsWon: [0]
    });
    
  }

  ngOnInit() {
    this.getPlayersFinal('Players').subscribe(data => {
      this.players = data;
      
      this.mergeData();
    });

    this.getLast10Mixes()
    
    this.getToken().subscribe(token => {
      this.authService.saveToken(token); // Zapisz token w localStorage
    });

    const userId = '649159865213780006'; // Wstaw user ID użytkownika
    const guildId = '716723661909786690'; // Wstaw ID serwera
   
    this.userDataString = localStorage.getItem('userData');
    this.userDataDiscord = this.userDataString ? JSON.parse(this.userDataString) : null;
    
    console.log('userData', this.userDataDiscord)
    if (this.userDataDiscord) {
      const userId = this.userDataDiscord.id;
      const avatarId = this.userDataDiscord.avatar;
      // Przyjmujemy, że format jest PNG; możesz również dodać logikę do obsługi innych formatów
      this.avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
    }

    this.authService.getUserRoles(this.userDataDiscord.id, guildId).subscribe({
      next: (response) => {
        this.userRoles = response.roles;
        console.log('Role użytkownika:', this.userRoles);
        console.log('ROLES NAME', this.getRoleNames())
        console.log('response', response)
        this.role = this.getRoleNames()[0];
        // Ustaw role i dane użytkownika w AuthService
        this.authService.setUserRoles(this.userRoles);
        // this.authService.setUserData(response.user); // Ustaw dane użytkownika
        // console.log('USER DATA', this.authService.getUserData())
      },
      error: (error) => {
        console.error('Błąd podczas pobierania ról użytkownika:', error);
        if (error.status === 404) {
          alert('Guild lub użytkownik nie istnieje.');
        } else {
          alert('Wystąpił błąd podczas pobierania ról.');
        }
      }
    });
    this.cdr.detectChanges();
  }

  mergeData(): void {
    if (this.userDataDiscord && this.players.length > 0) {
      this.mergedData = this.players.map(player => {
        // Sprawdzanie, czy username lub playername pasuje do userDataDiscord
        if (player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name || player.username === this.userDataDiscord.global_name || player.playername === this.userDataDiscord.username) {
          // Tworzenie nowego obiektu z połączonymi danymi
          const mergedPlayer = { ...player, ...this.userDataDiscord, usernameurl: player.username, role: this.role }; // Scalanie obiektów
  
          // Dodanie usernameDiscord, jeśli oba obiekty mają pole username
          if (player.username === this.userDataDiscord.username) {
            mergedPlayer.usernameDiscord = player.username; // Ustawienie usernameDiscord
          }
          console.log('mergedPlayer', mergedPlayer)
          return mergedPlayer; // Zwróć scalony obiekt
        }
        return player; // Zwróć oryginalny obiekt, jeśli nie ma dopasowania
      }).filter(player => player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name); // Filtruj tylko dopasowane obiekty
    }
  }

  getAvatarUrl(player: any): string {
    const avatarId = player.avatar; // Zakładając, że avatar jest częścią obiektu gracza
    const userId = player.id; // Zakładając, że id jest częścią obiektu gracza
    return avatarId ? `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png` : ''; // Zwróć URL avatara lub pusty string
  }

  // getToken powinno zwracać Observable<string>
  getToken(): Observable<string> {
    return this.http.get<any>(`http://localhost:5000/get-token`).pipe(
      map(response => response) // Załóżmy, że token jest w polu `token` w odpowiedzi
    );
  }

  getRoleNames(): string[] {
    return this.userRoles.map(role => this.rolesMap[role]);
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
      playerName: [''],
      username: [''],
      ranking: [''],
      combatScore: [0]
    });
  }

  get teamOnePlayers(): FormArray {
    return this.updateEloForm.get('teamOnePlayers') as FormArray;
  }
  
  get teamTwoPlayers(): FormArray {
    return this.updateEloForm.get('teamTwoPlayers') as FormArray;
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

  // addPlayer(team: 'teamOne' | 'teamTwo') {
  //   const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
  //   if (playersArray.length < 7) {
  //     playersArray.push(this.fb.group({
  //       playerName: [''],
  //       username: [''],
  //       ranking: [''],
  //       combatScore: ['']
  //     }));
  //   }
  // }

  addPlayer(team: 'teamOne' | 'teamTwo') {
    const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
    playersArray.push(this.createPlayerFormGroup());
  }
  
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
  }

  removePlayer(team: 'teamOne' | 'teamTwo', index: number) {
    const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
    playersArray.removeAt(index);
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

  selectPlayer(team: 'teamOne' | 'teamTwo', player: any, index: number) {
    const playerControl = (this.updateEloForm.get(`${team}Players`) as FormArray).at(index);   
  
    const selectedPlayer = {
      playerName: player.playername,
      username: player.username,
      ranking: parseFloat(player.ranking.replace(/,/g, '')), // Ensure ranking is set as a number
      combatScore: player.combatScore || 0
    };
  
    playerControl.setValue(selectedPlayer);    
  }  
  
  addPlayerControl(team: 'teamOne' | 'teamTwo') {
    const teamArray = this.updateEloForm.get(`${team}Players`) as FormArray;
    teamArray.push(this.createPlayerFormGroup());
  }  

  // addPlayerToForm(mix: any) {
  //   const team = mix.team === 1 ? 'teamOne' : 'teamTwo';
  //   const playersArray = this.updateEloForm.get(`${team}Players`) as FormArray;
  
  //   // Sprawdź, czy nie przekroczono limitu graczy
  //   if (playersArray.length < 7) {
  //     const selectedPlayer = {
  //       playerName: mix.playername,
  //       username: mix.username, // Upewnij się, że masz właściwość username w obiekcie mix
  //       ranking: parseFloat(mix.ranking.replace(/,/g, '')), // Upewnij się, że ranking jest liczbą
  //       combatScore: mix.combatScore || 0
  //     };
  
  //     playersArray.push(this.fb.group(selectedPlayer));
  //   } else {
  //     console.warn('Cannot add more than 7 players to a team');
  //   }
  // }
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
          combatScore: mix.combatScore || 0
        };
  
        playersArray.push(this.fb.group(selectedPlayer));
      }
    });
  }
  updateElo() {
    const formValue = this.updateEloForm.value;
  
    const data = {
      teamOne: {
        players: formValue.teamOnePlayers.map(p => p.username),
        elos: formValue.teamOnePlayers.map(p => parseFloat(p.ranking)), // Ensure ranking is treated as a number
        combatScores: formValue.teamOnePlayers.map(p => p.combatScore),
        roundsWon: formValue.teamOneRoundsWon
      },
      teamTwo: {
        players: formValue.teamTwoPlayers.map(p => p.username),
        elos: formValue.teamTwoPlayers.map(p => parseFloat(p.ranking)), // Ensure ranking is treated as a number
        combatScores: formValue.teamTwoPlayers.map(p => p.combatScore),
        roundsWon: formValue.teamTwoRoundsWon
      },
      responsibilityFactor: 22,
      outperformThreshold: 12,
      contributor: this.userDataDiscord.global_name ? this.userDataDiscord.global_name : ''
    };
  
    const body = {
      function: 'calculateELO',
      parameters: [data]      
    };
  
    console.log('body', body);
    console.log('this.authHeader()',this.authHeader())
    // Uncomment the line below to enable the actual HTTP request
    this.http.post(this.apiUrl, body, { headers: this.authHeader() })
    .subscribe(
      response => {
        console.log('ELO updated successfully', response);
        this.notifier.notify('success', `Mix war added!.`);
      },
      error => {
        console.error('Error updating ELO', error);
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