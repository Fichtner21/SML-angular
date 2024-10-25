import { Component, OnInit } from '@angular/core';
import { PlayersApiService } from '../services/players-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeModalComponent } from '../shared/challenge-modal/challenge-modal.component';
import { HttpClient } from '@angular/common/http';

export interface Clan {
  id: number | string;
  ranking: number;
  clan: string;
  elo: number;
  clantag: string;
  cl: string;
  wa: string;
  clan_image: string;
  flag: string;
  win: number;
  loss: number;
  draw: number;
  streak: string;
  members: string[];
}

interface StreakInfo {
  streakCount: number;
  streakType: string;
}

@Component({
  selector: 'app-clan-list',
  templateUrl: './clan-list.component.html',
  styleUrls: ['./clan-list.component.scss']
})
export class ClanListComponent implements OnInit {
  displayedColumns: string[] = [ 'ranking', 'clan', 'elo', 'clantag', 'cl', 'wa', 'clan_image', 'flag', 'win', 'loss', 'draw', 'streak', 'challenge'];
  clans: Clan[] = [];
  players: any[] = [];
  matchHistoryClans: any[] = [];
  expandedClanIndex: number | null = null;
  clanWaIds = {
    '2fast4u': '649159865213780006',
    'heroes': '716732654585774190'
  };

  constructor(private clanService: PlayersApiService, private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchClans();   
    this.fetchPlayers(); 
  }

  fetchClans(): void {
    this.clanService.getClans().subscribe((clansData: any) => {
      const clansArray = clansData.values.slice(1); // Pobieramy dane z pominięciem nagłówka
      this.clanService.getMatchHistoryClans().subscribe((matchHistory: any) => {
        const matchHistoryData = matchHistory.values.slice(1); // Pobieramy dane meczów z pominięciem nagłówka
  
        this.clans = clansArray.map((clan: any, index: number) => {
          const clanName = clan[0];  // Indeks 1, bo pierwszy element to teraz id klanu
  
          // Obliczamy liczbę zwycięstw, porażek, remisów oraz serię
          // const winCount = this.calculateWins(clanName, matchHistoryData);
          // const lossCount = this.calculateLosses(clanName, matchHistoryData);
          // const drawCount = this.calculateDraws(clanName, matchHistoryData);
          const streak = this.calculateStreak(clanName, matchHistoryData);
         
          // Przekształcenie stringa na tablicę i filtracja
          const membersString = clan[13] || '';
          const membersArray = membersString.split(',').map(member => member.trim());

          // Filtrujemy członków, aby nie dodawać lidera klanu (cl) i wa
          const filteredMembers = membersArray.filter(member => 
            member !== clan[3] && member !== clan[4]
          );

          // Dodaj dodatkowe informacje o graczu, jeśli nazwa się zgadza
          const enrichedMembers = filteredMembers.map(member => {
            const playerDetails = this.players.find(player => player.username === member);
            return {
              name: member,              
              playername: playerDetails?.playername || null, // Dodaj playername
              username: playerDetails?.username || null, // Dodaj username
              elo: playerDetails?.elo || null, // Dodaj elo
              placemix: playerDetails?.placemix || null,
              mixwars: playerDetails?.mixwars || null, // Dodaj mixwars
              flag: playerDetails?.flag || null, // Dodaj flag
              active: playerDetails?.active || null, // Dodaj active
              ban: playerDetails?.ban || null, // Dodaj ban
              fpw: playerDetails?.fpw || null // Dodaj fpw
            };
          });

          const leaderDetails = this.players.find(player => player.username === clan[3]) || {};

          const waDetails = this.players.find(player => player.username === clan[4]) || {};
  
          return {
            ranking: index + 1, // Index w tabeli
            clan: clanName,      // Nazwa klanu
            elo: clan[1],        // ELO klanu (indeks 2, bo dodano kolumnę 'id')
            clantag: clan[2],    // Tag klanu
            cl: {
              name: clan[3],     // Nazwa lidera klanu
              ...leaderDetails    // Rozpakowuje właściwości lidera klanu
            },
            wa: {
              name: clan[4] || 'N/A', // Nazwa gracza oznaczonego jako wa
              ...waDetails           // Rozpakowuje właściwości gracza wa
            },
            clan_image: clan[5] || '', // Obrazek klanu (opcjonalnie)
            flag: clan[6] || '',
            last30days: clan[7],
            last365days: clan[8],
            win: clan[9],
            loss: clan[10],
            draw: clan[11],
            streak: streak, // Obliczona seria
            members: enrichedMembers  // Przekształcenie stringa na tablicę
          };
        });
        console.log('Processed Clans:', this.clans);
      });
    });
  }
  fetchPlayers(): void {
    this.clanService.getPlayersDetails().subscribe((playersData) => {
      this.players = playersData; // Przypisz dane graczy do zmiennej      
    });
  }
  // calculateWins(clanName: string, matchHistory: any[]): number {
  //   return matchHistory.filter(match => {
  //     const isClan1 = match[1] === clanName;
  //     const isClan2 = match[2] === clanName;
  //     const clan1Score = parseInt(match[3]);
  //     const clan2Score = parseInt(match[4]);
  
  //     // Klan1 wygrał
  //     if (isClan1 && clan1Score > clan2Score) {
  //       return true;
  //     }
  //     // Klan2 wygrał
  //     if (isClan2 && clan2Score > clan1Score) {
  //       return true;
  //     }
  //     return false;
  //   }).length;
  // }
  
  // calculateLosses(clanName: string, matchHistory: any[]): number {
  //   return matchHistory.filter(match => {
  //     const isClan1 = match[1] === clanName;
  //     const isClan2 = match[2] === clanName;
  //     const clan1Score = parseInt(match[3]);
  //     const clan2Score = parseInt(match[4]);
  
  //     // Klan1 przegrał
  //     if (isClan1 && clan1Score < clan2Score) {
  //       return true;
  //     }
  //     // Klan2 przegrał
  //     if (isClan2 && clan2Score < clan1Score) {
  //       return true;
  //     }
  //     return false;
  //   }).length;
  // }
  
  // calculateDraws(clanName: string, matchHistory: any[]): number {
  //   return matchHistory.filter(match => {
  //     const isClan1 = match[1] === clanName;
  //     const isClan2 = match[2] === clanName;
  //     const clan1Score = parseInt(match[3]);
  //     const clan2Score = parseInt(match[4]);
  
  //     // Remis
  //     return (isClan1 || isClan2) && clan1Score === clan2Score;
  //   }).length;
  // }
  
  // calculateStreak(clanName: string, matchHistory: any[]): string {
  //   let streakCount = 0;
  //   let streakType = ''; // Typ serii (W, L, D)
  
  //   for (let i = matchHistory.length - 1; i >= 0; i--) {
  //     const match = matchHistory[i];
  //     const isClan1 = match[1] === clanName;
  //     const isClan2 = match[2] === clanName;
  //     const clan1Score = parseInt(match[3]);
  //     const clan2Score = parseInt(match[4]);
  
  //     if (isClan1 || isClan2) {
  //       const clanScore = isClan1 ? clan1Score : clan2Score;
  //       const opponentScore = isClan1 ? clan2Score : clan1Score;
  
  //       if (clanScore > opponentScore) {
  //         if (streakType === 'W' || streakType === '') {
  //           streakCount++;
  //           streakType = 'W';
  //         } else {
  //           break; // Koniec serii
  //         }
  //       } else if (clanScore < opponentScore) {
  //         if (streakType === 'L' || streakType === '') {
  //           streakCount++;
  //           streakType = 'L';
  //         } else {
  //           break; // Koniec serii
  //         }
  //       } else {
  //         if (streakType === 'D' || streakType === '') {
  //           streakCount++;
  //           streakType = 'D';
  //         } else {
  //           break; // Koniec serii
  //         }
  //       }
  //     }
  //   }
  
  //   // Zwracaj serię tylko jeśli >= 3
  //   if (streakCount >= 3) {
  //     return `${streakCount}${streakType}`;
  //   }
  //   return ''; // Jeśli seria < 3, zwróć pusty string
  // }
  
  calculateStreak(clanName: string, matchHistory: any[]): StreakInfo | string {
    let streakCount = 0;
    let streakType = ''; // Typ serii (W, L, D)
  
    for (let i = matchHistory.length - 1; i >= 0; i--) {
      const match = matchHistory[i];
      const isClan1 = match[1] === clanName;
      const isClan2 = match[2] === clanName;
      const clan1Score = parseInt(match[3]);
      const clan2Score = parseInt(match[4]);
  
      if (isClan1 || isClan2) {
        const clanScore = isClan1 ? clan1Score : clan2Score;
        const opponentScore = isClan1 ? clan2Score : clan1Score;
  
        if (clanScore > opponentScore) {
          if (streakType === 'W' || streakType === '') {
            streakCount++;
            streakType = 'W';
          } else {
            break; // Koniec serii
          }
        } else if (clanScore < opponentScore) {
          if (streakType === 'L' || streakType === '') {
            streakCount++;
            streakType = 'L';
          } else {
            break; // Koniec serii
          }
        } else {
          if (streakType === 'D' || streakType === '') {
            streakCount++;
            streakType = 'D';
          } else {
            break; // Koniec serii
          }
        }
      }
    }
  
    // Zwracaj serię tylko jeśli >= 3
    if (streakCount >= 3) {
      return {
        streakCount: streakCount,
        streakType: streakType
      };
    }
  
    return ''; // Jeśli seria < 3, zwróć null
  }

  openChallengeModal(challengedClan: any): void {
    const dialogRef = this.dialog.open(ChallengeModalComponent, {
      width: '300px',
      data: { clans: this.clans, challengedClan: challengedClan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendChallenge(challengedClan, result);
      }
    });
  }

  sendChallenge(challengedClan: any, challengerClan: string): void {
    const waId = this.clanWaIds[challengedClan.clan];
    const message = `${challengerClan} has challenged ${challengedClan.clan}!`;

    this.http.post('http://localhost:5000/send-message-to-wa', { message, waId }).subscribe(
      response => {
        console.log('Challenge sent successfully:', response);
      },
      error => {
        console.error('Error sending challenge:', error);
      }
    );
  }

  toggleClanDetails(index: number) {
    // Jeśli kliknięto ten sam klan, zamknij go, w przeciwnym razie otwórz nowy
    this.expandedClanIndex = this.expandedClanIndex === index ? null : index;
  }
}
