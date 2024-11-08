
import { Component, OnInit } from '@angular/core';
import { PlayersApiService } from '../../app/services/players-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatchesApiService } from '../services/matches-api.service';
import { OAuthService } from 'angular-oauth2-oidc';

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

  constructor(private playersApiService: PlayersApiService, private fb: FormBuilder, private matchesApiService: MatchesApiService, private readonly oAuthService: OAuthService) {}

  ngOnInit(): void {
    console.log('Access Token:', this.oAuthService.getAccessToken());

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
        return players;
      })
    );

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
    console.log('selectedPlayers', selectedPlayers)
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
      clan2Players: this.clanForm.get('selectedPlayersClan2')!.value
    };

    this.matchesApiService.addClanMatch(matchData).subscribe({
      next: (response: any) => { // Use the defined response type
        if (response.done) {
          this.isSuccess = true;
          this.isError = false;
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

    // this.matchesApiService.addClanMatch(matchData).subscribe(response => {
    //   console.log('Mecz został zapisany:', response);
    // });
  }
}
