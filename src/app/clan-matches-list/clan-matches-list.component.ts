// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { PlayersApiService } from '../services/players-api.service';

// @Component({
//   selector: 'app-clan-matches-list',
//   templateUrl: './clan-matches-list.component.html',
//   styleUrls: ['./clan-matches-list.component.scss']
// })
// export class ClanMatchesListComponent implements OnInit {

//   matches: any[] = [];
//   paginatedMatches: any[] = [];
//   currentPage: number = 0;
//   pageSize: number = 20;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   constructor(private playersApiService: PlayersApiService) { }

//   ngOnInit(): void {
//     this.playersApiService.getMatchHistoryClans2().subscribe(matches => {
//       // Sort matches by timestamp descending to show the newest match first
//       console.log('matches', matches)
//       this.matches = matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
//       this.updatePaginatedMatches();
//     });
//   }

//   updatePaginatedMatches() {
//     const startIndex = this.currentPage * this.pageSize;
//     this.paginatedMatches = this.matches.slice(startIndex, startIndex + this.pageSize);
//   }

//   changePage(event: any) {
//     this.currentPage = event.pageIndex;
//     this.updatePaginatedMatches();
//   }
// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PlayersApiService } from '../services/players-api.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-clan-matches-list',
  templateUrl: './clan-matches-list.component.html',
  styleUrls: ['./clan-matches-list.component.scss']
})
export class ClanMatchesListComponent implements OnInit {

  matches: any[] = [];
  paginatedMatches: any[] = [];
  currentPage: number = 0;
  pageSize: number = 20;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;

  playerDetailsMap: { [username: string]: any } = {}; // Mapowanie username na szczegóły gracza
  clanDetailsMap: { [clan: string]: any } = {}; // Mapowanie username na szczegóły gracza
  private loadPlayerDetailsSubject = new Subject<string>(); // Subiekt dla debouncowania

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private playersApiService: PlayersApiService) { }

  ngOnInit(): void {
    this.playersApiService.getMatchHistoryClans2().subscribe(matches => {
      this.matches = matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      this.updatePaginatedMatches();

      // Subskrybuj do debouncowanego ładowania szczegółów graczy
      this.loadPlayerDetailsSubject.pipe(debounceTime(300)).subscribe(username => {
        this.loadPlayerDetails(username);
      });

      // Pobierz szczegóły dla wszystkich graczy w meczach
      this.loadAllPlayerDetails();
      console.log('this.matches', this.matches)
    });
  }

  updatePaginatedMatches() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedMatches = this.matches.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(event: any) {
    this.currentPage = event.pageIndex;
    this.updatePaginatedMatches();
  }

  loadAllPlayerDetails() {
    const usernames = new Set<string>();

    // Zbieranie wszystkich nazw użytkowników z obu klanów w każdym meczu
    this.matches.forEach(match => {
      match.clan1players.forEach((player: string) => usernames.add(player));
      match.clan2players.forEach((player: string) => usernames.add(player));
    });

    // Pobierz graczy przy użyciu getPlayersFinal
    this.playersApiService.getPlayersFinal('Players').subscribe(players => {
      players.forEach(player => {
        const username = player.username; // Zakładam, że istnieje pole username
        if (usernames.has(username)) {
          this.playerDetailsMap[username] = player; // Przechowuj szczegóły gracza
        }
      });
      console.log('Szczegóły graczy:', this.playerDetailsMap);
    });
    // Pobierz graczy przy użyciu getPlayersFinal
    this.playersApiService.getPlayersFinal('Clans').subscribe(clans => {
      clans.forEach(clan => {
        const clanName = clan.clan; // Zakładam, że istnieje pole clan
        // Przechowuj szczegóły klanu z nazwą jako klucz
        this.clanDetailsMap[clanName] = clan; 
      });
      console.log('Szczegóły klanów:', this.clanDetailsMap);
      this.updateMatchesWithPlayerDetails();
    });
  }

  loadPlayerDetails(username: string) {
    const details = this.playerDetailsMap[username];
    console.log('Pobieranie szczegółowych danych w getPlayerDetails dla', username, details);
    return details;
  }  

  getPlayerDetails(username: string) {
    return this.playerDetailsMap[username] || {}; // Zwraca szczegóły lub pusty obiekt, jeśli nie znaleziono
  }
  getClanDetails(clanName: string) {
    return this.clanDetailsMap[clanName] || {}; // Zwraca szczegóły klanu lub pusty obiekt, jeśli nie znaleziono
  }

  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
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

  private updateMatchesWithPlayerDetails() {
    this.matches.forEach(match => {
      match.clan1Details = this.clanDetailsMap[match.clan1];
      match.clan2Details = this.clanDetailsMap[match.clan2];
  
      // Oblicz szansę na wygraną dla obu klanów
      if (match.clan1Details && match.clan2Details) {
        const team1PreElo = Number(match.preelo1clan); // Użyj pola preelo z szczegółów klanu
        const team2PreElo = Number(match.preelo2clan); // Użyj pola preelo z szczegółów klanu
        
        const chances = this.calculateChance(team1PreElo, team2PreElo);
        
        // Dodaj wyniki szans do obiektu meczu
        match.chance1team = chances[0];
        match.chance2team = chances[1];
      }
    });
  }
}


