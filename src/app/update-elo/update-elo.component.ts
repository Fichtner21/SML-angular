import { Component, OnInit } from '@angular/core';
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
  private apiUrl = 'https://script.googleapis.com/v1/scripts/AKfycbxg8BwZNZ5np5HqMFDEpjfTAShR4syBl11ys5qw-tcjJBtmhVmopWgU-xIbFnxIrFh9:run';

  constructor(private fb: FormBuilder, private http: HttpClient, private readonly oAuthService: OAuthService, private notifier: NotifierService, private authService: AuthService, private router: Router) {
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
    });

    this.getLast10Mixes()
   
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
      outperformThreshold: 12
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