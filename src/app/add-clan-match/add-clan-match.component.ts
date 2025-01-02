
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlayersApiService } from '../../app/services/players-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MatchesApiService } from '../services/matches-api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-clan-match',
  templateUrl: './add-clan-match.component.html', 
  styleUrls: ['./add-clan-match.component.scss']
})
export class AddClanMatchComponent implements OnInit {
  clans$: Observable<any[]>;
  players$: Observable<any[]>;
  filteredPlayersClan1$: Observable<any[]>;
  filteredPlayersClan2$: Observable<any[]>;
  clanForm: FormGroup;
  isSuccess: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';
  // userRoles: string[] = [];

  rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League players'
  };

  role: any;
  userDataString: any;
  userDataDiscord: any;
  avatarUrl: string | null = null;
  players: any[] = [];
  userRoles: string[] | null = null;  
  roleDisplay: any;
  mergedDataPlayer: any;  
  mergedData: any[] = [];
  isDataLoaded: boolean = false;  // Flaga kontrolująca załadowanie danych
  isLoading: boolean = true;  
  filteredClans$: Observable<string[]>;
  filteredClansAll$: Observable<string[]>;
  mergedPlayer: any;
 
  constructor(private playersApiService: PlayersApiService, private fb: FormBuilder, private matchesApiService: MatchesApiService, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {    
    this.userDataString = localStorage.getItem('userData');
    this.userDataDiscord = this.userDataString ? JSON.parse(this.userDataString) : null;
    console.log('userData', this.userDataDiscord)
    // Pobierz listę klanów
    this.clans$ = this.playersApiService.getClans().pipe(
      map((response: any) => {
        let batchRowValues = response.values;        
        return batchRowValues.slice(1).map((row: string[]) => ({
          clan: row[0],
          elo: row[1],
          clantag: row[2],
          flag: row[6]
        }));
      })
    );

    // Pobierz listę graczy
    this.players$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {
        let batchRowValues = response.values;
        let players: any[] = [];
        for (let i = 1; i < batchRowValues.length; i++) {
          const rowObject: any = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }        
        console.log('players', players)
        this.players = players;
        return players;
      })
    );  

    this.authService.getUserRoles3().subscribe({
      next: (response) => {
        if (Array.isArray(response.roles)) {
          this.userRoles = response.roles; // Pobierz tablicę ról
          this.role = this.getRoleNames(); // Ustal rolę do wyświetlenia
          this.roleDisplay = this.getDisplayRole(this.userRoles); // Ustal rolę do wyświetlenia
        } else {
          console.error('Błąd: Pobierane role nie są tablicą.', response);
          this.userRoles = [];
          this.role = 'Guest'; // Ustaw domyślną rolę
        }
        this.playersApiService.getPlayersFinal('Players').subscribe(data => {
          this.players = data;      
          this.mergeData();
        });
        // this.cdr.detectChanges();
        console.log('Role użytkownika:', this.userRoles);
      },
      error: (err) => {
        console.error('Błąd podczas pobierania ról użytkownika:', err);
      }
    });    
 
    // Inicjalizuj formularz z walidacją
    this.clanForm = this.fb.group({
      selectedClan1: ['', Validators.required],
      selectedClan2: ['', Validators.required],
      selectedPlayersClan1: [[], Validators.required],
      selectedPlayersClan2: [[], Validators.required],
      scoreClan1: ['', Validators.required],
      scoreClan2: ['', Validators.required]
    });

  // Filtruj graczy dla Clan 1
    this.clanForm.get('selectedClan1')!.valueChanges.subscribe(selectedClan1 => {
      console.log('selectedClan1', selectedClan1)
      this.filteredPlayersClan1$ = this.players$.pipe(
        map(players => players.filter(player => player.clan.split(', ').includes(selectedClan1)))
      );
    });

    // Filtruj graczy dla Clan 2
    this.clanForm.get('selectedClan2')!.valueChanges.subscribe(selectedClan2 => {
      this.filteredPlayersClan2$ = this.players$.pipe(
        map(players => players.filter(player => player.clan.split(', ').includes(selectedClan2)))
      );
    });
  }

   // Funkcja obsługująca zaznaczanie graczy w checkboxach
  onCheckBoxChange(event: any, controlName: string, player: any): void {
    const selectedPlayers = this.clanForm.get(controlName)!.value as string[];
    // console.log('selectedPlayers', selectedPlayers)
    if (event.checked) {
      // Dodaj gracza, jeśli został zaznaczony
      selectedPlayers.push(player.username);
    } else {
      // Usuń gracza, jeśli został odznaczony
      const index = selectedPlayers.indexOf(player.username);
      if (index > -1) {
        selectedPlayers.splice(index, 1);
      }
    }
    this.clanForm.get(controlName)!.setValue(selectedPlayers);
  }

  getRoleNames(): string[] {
    return this.userRoles.map(role => this.rolesMap[role]);
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
            clans: player.clan
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
      }).filter(player => player.username === this.userDataDiscord.username || player.playername === this.userDataDiscord.global_name);

      if (this.roleDisplay === 'admin' || this.roleDisplay === 'OWNER') {
        console.log('User role is admin. Showing all clans.');
        this.filteredClans$ = this.clans$;
        this.filteredClansAll$ = this.clans$;
      } else if (this.roleDisplay === 'League player') {
        this.filteredClansAll$ = this.clans$;
        console.log('User role is League player. Filtering clans based on user clans:', this.mergedDataPlayer?.clans);
      
        // Podziel `mergedDataPlayer.clans` na tablicę klanów
        const userClans = this.mergedDataPlayer?.clans.split(',').map(clan => clan.trim());
        console.log('Parsed user clans:', userClans);
      
        this.filteredClans$ = this.clans$.pipe(
          map(clans => {
            const filteredClans = clans.filter(clan => userClans.includes(clan.clan));
            console.log('Available clans:', clans);
            console.log('Filtered clans for OWNER (Clan 1):', filteredClans);
            return filteredClans;
          })
        );
      }
      
      console.log('mergedDataPlayer:', this.mergedDataPlayer);
    }
  }

  onClan1Change(selectedClan1: string): void {
    console.log('Clan 1 selected:', selectedClan1);
  
    this.filteredClansAll$ = this.clans$.pipe(
      map(clans => {
        const filteredClans = clans.filter(clan => clan.clan !== selectedClan1);
        console.log('Filtered clans for Clan 2 (excluding Clan 1):', filteredClans);
        return filteredClans;
      })
    );
  }

  isAuthorized(): boolean {
    if (!this.mergedDataPlayer) {
      return false; // Jeśli mergedDataPlayer nie jest dostępne, zwróć false
    }
    const allowedRoles = ['OWNER','admin', 'League player'];
    const userRole = this.mergedDataPlayer.displayRole || '';
    console.log('Allowed roles:', allowedRoles);
    console.log('User role:', userRole);

    const isAuthorized = allowedRoles.includes(userRole);
    console.log('isAuthorized result:', isAuthorized);
    return isAuthorized;
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

  fetchClans(): void {
    this.clans$ = this.playersApiService.getPlayersFinal('Clans'); // Aktualizacja strumienia danych
    console.log('Clans data reloaded');    
  }

  // Obsługa przesyłania formularza
  onSubmit(): void {
    if (this.clanForm.invalid) {
      this.clanForm.markAllAsTouched(); // Oznacz wszystkie pola jako dotknięte (do walidacji)
      return;
    }

    const matchData = {
      clan1: this.clanForm.get('selectedClan1')!.value,
      clan2: this.clanForm.get('selectedClan2')!.value,
      clan1Score: this.clanForm.get('scoreClan1')!.value,
      clan2Score: this.clanForm.get('scoreClan2')!.value,
      clan1Players: this.clanForm.get('selectedPlayersClan1')!.value,
      clan2Players: this.clanForm.get('selectedPlayersClan2')!.value,
      contributor: this.mergedDataPlayer.usernameurl
    };

    this.matchesApiService.addClanMatch(matchData).subscribe({
      next: (response: any) => { // Use the defined response type
        if (response.done) {
          this.isSuccess = true;
          this.isError = false;
          this.fetchClans()
        } else {
          this.isError = true;
          this.errorMessage = 'Something went wrong!';
        }
      },
      error: (error) => {
        this.isError = true;
        this.errorMessage = 'Błąd przy dodawaniu meczu: ' + error.message;
        this.isSuccess = false;
      }
    });
    console.log('Match DATA', matchData);   
  }
}
