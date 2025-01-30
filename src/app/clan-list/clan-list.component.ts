// import { Component, OnInit } from '@angular/core';
// import { PlayersApiService } from '../services/players-api.service';
// import { MatDialog } from '@angular/material/dialog';
// import { ChallengeModalComponent } from '../shared/challenge-modal/challenge-modal.component';
// import {faArrowDown, faArrowUp, faMinus } from '@fortawesome/free-solid-svg-icons';

// export interface Clan {
//   id: number | string;
//   ranking: number;
//   clan: string;
//   elo: number;
//   clantag: string;
//   cl: string;
//   wa: string;
//   clan_image: string;
//   flag: string;
//   win: number;
//   loss: number;
//   draw: number;
//   streak: string;
//   members: string[];
// }

interface StreakInfo {
  streakCount: number;
  streakType: string;
}

// @Component({
//   selector: 'app-clan-list',
//   templateUrl: './clan-list.component.html',
//   styleUrls: ['./clan-list.component.scss']
// })
// export class ClanListComponent implements OnInit {
//   clans: any;
//   players: any[] = [];
//   expandedClanIndex: number | null = null;
//   arrowUp = faArrowUp;
//   arrowDown = faArrowDown;
//   arrowMinus = faMinus;
//   filteredClans: any[]; 

//   constructor(private clanService: PlayersApiService, private dialog: MatDialog) {}

//   ngOnInit(): void {
//     this.fetchClans();   
//     this.fetchPlayers(); 
//   }

//   fetchClans(): void {
//     this.clanService.getClans().subscribe((clansData: any) => {
//       const clansArray = clansData.values.slice(1); // Pobieramy dane z pominięciem nagłówka
//       this.clanService.getMatchHistoryClans().subscribe((matchHistory: any) => {
        
//         const matchHistoryData = matchHistory.values.slice(1); // Pobieramy dane meczów z pominięciem nagłówka
  
//         this.clans = clansArray.map((clan: any, index: number) => {
//           const clanName = clan[0];  // Indeks 1, bo pierwszy element to teraz id klanu
  
//           // Obliczamy liczbę zwycięstw, porażek, remisów oraz serię         
//           const streak = this.calculateStreak(clanName, matchHistoryData);
         
//           // Przekształcenie stringa na tablicę i filtracja
//           const membersString = clan[12] || '';
//           const membersArray = membersString.split(',').map(member => member.trim());

//           // Filtrujemy członków, aby nie dodawać lidera klanu (cl) i wa
//           const filteredMembers = membersArray.filter(member => 
//             member !== clan[3] && member !== clan[4]
//           );          
//           // Dodaj dodatkowe informacje o graczu, jeśli nazwa się zgadza
//           const enrichedMembers = filteredMembers.map(member => {
//             const playerDetails = this.players.find(player => player.username === member);
            
//             return {
//               name: member,              
//               playername: playerDetails?.playername || null, // Dodaj playername
//               username: playerDetails?.username || null, // Dodaj username
//               elo: playerDetails?.elo || null, // Dodaj elo
//               placemix: playerDetails?.placemix || null,
//               mixwars: playerDetails?.mixwars || null, // Dodaj mixwars
//               flag: playerDetails?.flag || null, // Dodaj flag
//               active: playerDetails?.active || null, // Dodaj active
//               ban: playerDetails?.ban || null, // Dodaj ban
//               fpw: playerDetails?.fpw || null, // Dodaj fpw  
//               clanwars: playerDetails?.clanwars || null            
//             };
//           });

//           const leaderDetails = this.players.find(player => player.username === clan[3]) || {};                 

//           const waDetails = this.players.find(player => player.username === clan[4]) || {};   
          
//           enrichedMembers.sort((a, b) => {
//             if (a.active === 'TRUE' && b.active === 'FALSE') return -1;
//             if (a.active === 'FALSE' && b.active === 'TRUE') return 1;
//             return 0; // Jeśli obaj są aktywni lub nieaktywni
//           });
  
//           return {
//             ranking: index + 1, // Index w tabeli
//             clan: clanName,      // Nazwa klanu
//             elo: clan[1],        // ELO klanu (indeks 2, bo dodano kolumnę 'id')
//             clantag: clan[2],    // Tag klanu
//             cl: {
//               name: clan[3],     // Nazwa lidera klanu
//               ...leaderDetails    // Rozpakowuje właściwości lidera klanu
//             },
//             wa: {
//               name: clan[4] || 'N/A', // Nazwa gracza oznaczonego jako wa
//               ...waDetails           // Rozpakowuje właściwości gracza wa
//             },
//             clan_image: clan[5] || '', // Obrazek klanu (opcjonalnie)
//             flag: clan[6] || '',
//             last30days: clan[7],
//             last365days: clan[8],
//             win: clan[9],
//             loss: clan[10],
//             draw: clan[11],
//             streak: streak, // Obliczona seria
//             members: enrichedMembers,  // Przekształcenie stringa na tablicę 
//             diff: Number(clan[1]) - Number(clan[13]) ? "" : "", 
//             totalwars: Number(clan[14]),  
//             wa_discord_id: clan[15],
//             desc: clan[16],
//             clanname: clan[17]        
//           };
//         });
//         this.filterClans();
       
//         console.log('Processed Clans:', this.clans);
//       });
//     });
//   }
  
//   fetchPlayers(): void {
//     this.clanService.getPlayersDetails().subscribe((playersData) => {
//       this.players = playersData; // Przypisz dane graczy do zmiennej         
//     });
//   }  
//   filterClans(): void {
//     this.filteredClans = this.clans.filter((clan:any) => clan.totalwars >= 0);    
//   }  
  
//   calculateStreak(clanName: string, matchHistory: any[]): StreakInfo | string {
//     let streakCount = 0;
//     let streakType = ''; // Typ serii (W, L, D)
  
//     for (let i = matchHistory.length - 1; i >= 0; i--) {
//       const match = matchHistory[i];
//       const isClan1 = match[1] === clanName;
//       const isClan2 = match[2] === clanName;
//       const clan1Score = parseInt(match[3]);
//       const clan2Score = parseInt(match[4]);
  
//       if (isClan1 || isClan2) {
//         const clanScore = isClan1 ? clan1Score : clan2Score;
//         const opponentScore = isClan1 ? clan2Score : clan1Score;
  
//         if (clanScore > opponentScore) {
//           if (streakType === 'W' || streakType === '') {
//             streakCount++;
//             streakType = 'W';
//           } else {
//             break; // Koniec serii
//           }
//         } else if (clanScore < opponentScore) {
//           if (streakType === 'L' || streakType === '') {
//             streakCount++;
//             streakType = 'L';
//           } else {
//             break; // Koniec serii
//           }
//         } else {
//           if (streakType === 'D' || streakType === '') {
//             streakCount++;
//             streakType = 'D';
//           } else {
//             break; // Koniec serii
//           }
//         }
//       }
//     }
  
//     // Zwracaj serię tylko jeśli >= 3
//     if (streakCount >= 3) {
//       return {
//         streakCount: streakCount,
//         streakType: streakType
//       };
//     }
  
//     return ''; // Jeśli seria < 3, zwróć null
//   }

//   openChallengeModal(challengedClan: any): void {
//     const dialogRef = this.dialog.open(ChallengeModalComponent, {
//       width: '300px',
//       data: { clans: this.clans, challengedClan: challengedClan }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         // Wysłanie wyzwania z wybranym klanem i formatami
//         this.sendChallenge(challengedClan, result.challenger, result.formats);
//       }
//     });
//   }

//   sendChallenge(challengedClan: any, challengerClan: string, formats: string[]): void {
//     console.log('challengedClan', challengedClan.wa_discord_id)
//     const waId = challengedClan.wa_discord_id;
//     const message = `${challengerClan} has challenged ${challengedClan.clan} in formats: ${formats.join(', ')}`;

//     // this.http.post(`${environment.externalApiUrl}send-message-to-wa`, { message, waId }).subscribe(
//     //   response => {
//     //     console.log('Challenge sent successfully:', response);
//     //   },
//     //   error => {
//     //     console.error('Error sending challenge:', error);
//     //   }
//     // );
//   }

//   toggleClanDetails(index: number) {
//     // Jeśli kliknięto ten sam klan, zamknij go, w przeciwnym razie otwórz nowy
//     this.expandedClanIndex = this.expandedClanIndex === index ? null : index;
//   }

//   getActivityGradient(activity: number): string {
//     let percentage = 0;
  
//     // Obliczenia dla przedziałów
//     if (activity === 1) {
//       percentage = 1;  // Minimalny procent dla 1 w przedziale 1-5
//     } else if (activity >= 1 && activity <= 5) {
//       percentage = ((activity - 1) / 4) * 100;  // Dla przedziału 1-5
//     } else if (activity === 6) {
//       percentage = 1;  // Minimalny procent dla 6 w przedziale 6-10
//     } else if (activity >= 6 && activity <= 10) {
//       percentage = ((activity - 6) / 4) * 100;  // Dla przedziału 6-10
//     } else if (activity === 11) {
//       percentage = 1;  // Minimalny procent dla 11 w przedziale 11-20
//     } else if (activity >= 11 && activity <= 20) {
//       percentage = ((activity - 11) / 9) * 100; // Dla przedziału 11-20
//     } else if (activity === 21) {
//       percentage = 1;  // Minimalny procent dla 21 w przedziale 21-40
//     } else if (activity >= 21 && activity <= 40) {
//       percentage = ((activity - 21) / 19) * 100; // Dla przedziału 21-40
//     } else if (activity === 41) {
//       percentage = 1;  // Minimalny procent dla 41 w przedziale 41-60
//     } else if (activity >= 41 && activity <= 60) {
//       percentage = ((activity - 41) / 19) * 100; // Dla przedziału 41-60
//     } else if (activity === 61) {
//       percentage = 1;  // Minimalny procent dla 61 w przedziale 61-90
//     } else if (activity >= 61 && activity <= 90) {
//       percentage = ((activity - 61) / 29) * 100; // Dla przedziału 61-90
//     } else if (activity > 90) {
//       percentage = 100; // Dla wartości powyżej 90
//     }
  
//     const color = this.getActivityColor(activity);
    
//     // Upewnijmy się, że zawsze jest minimalna widoczna wartość dla gradientu
//     return `linear-gradient(to top, ${color} ${percentage + 10}%, gray ${percentage + 5}%)`;
//   }
  
//   getActivityColor(activity: number): string {
//     if (activity === 0) {
//       return '#003200'; // Zielony dla braku aktywności
//     } else if (activity >= 1 && activity <= 5) {
//       return '#050'; // Zielony dla bardzo niskiej aktywności
//     } else if (activity >= 6 && activity <= 10) {
//       return '#00a100'; // Zielony dla umiarkowanej aktywności
//     } else if (activity >= 11 && activity <= 20) {
//       return '#8aff1a'; // Żółto-zielony dla średniej aktywności
//     } else if (activity >= 21 && activity <= 40) {
//       return '#ffff00'; // Żółty dla średniej aktywności
//     } else if (activity >= 41 && activity <= 60) {
//       return 'orange'; // Pomarańczowy dla wyższej aktywności
//     } else if (activity >= 61 && activity <= 90) {
//       return '#ff4500'; // Czerwono-pomarańczowy dla bardzo wysokiej aktywności
//     } else {
//       return '#ff0000'; // Czerwony dla maksymalnej aktywności
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { PlayersApiService } from '../services/players-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeModalComponent } from '../shared/challenge-modal/challenge-modal.component';
import { faArrowDown, faArrowUp, faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clan-list',
  templateUrl: './clan-list.component.html',
  styleUrls: ['./clan-list.component.scss']
})
export class ClanListComponent implements OnInit {
  clans$ = new BehaviorSubject<any[]>([]); // Observable dla danych klanów
  players$ = new BehaviorSubject<any[]>([]); // Observable dla danych graczy
  filteredClans$ = new BehaviorSubject<any[]>([]); // Observable dla filtrowanych klanów
  filteredClansWithoutMatch$ = new BehaviorSubject<any[]>([]); // Observable dla filtrowanych klanów bez granego meczu
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  arrowMinus = faMinus;
  expandedClanIndex: number | null = null;
  expandedClanIndexInactive: number | null = null;
  isVisible = false;
  matchesHistoryClan$: Observable<any>;
  displayedColumns: string[] = ['id', 'date', 'opponent', 'us', 'them', 'points'];

  constructor(private clanService: PlayersApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Pobieramy dane graczy
    this.fetchPlayers();

    // Pobieramy dane klanów i obliczamy ich właściwości
    this.fetchClans();
    // this.loadClanMatches('heroes')
    this.clanService.getClanInfo('heroes').subscribe()
  }

  fetchClans(): void {
    this.clanService.getClans().pipe(
      switchMap((clansData: any) => {
        const clansArray = clansData.values.slice(1); // Pomijamy nagłówki
        return this.clanService.getMatchHistoryClans().pipe(
          map((matchHistory: any) => {
            const matchHistoryData = matchHistory.values.slice(1);
            return clansArray
              .map((clan: any, index: number) => this.processClan(clan, index, matchHistoryData));
          }),
          tap(clans => {
            // Przypisanie klanów do strumienia klanów
            this.clans$.next(clans);
  
            // Filtrujemy klany na te z totalwars > 0 i totalwars = 0
            const clansWithWars = clans.filter(clan => clan.totalwars > 0);
            const clansWithoutWars = clans.filter(clan => clan.totalwars === 0);
  
            // Przypisanie klanów do odpowiednich strumieni
            this.filteredClans$.next(clansWithWars);
            this.filteredClansWithoutMatch$.next(clansWithoutWars);
          })
        );
      })
    ).subscribe();
  }  

  fetchPlayers(): void {
    this.clanService.getPlayersDetails().pipe(
      tap(playersData => this.players$.next(playersData))
    ).subscribe();
  } 

  processClan(clan: any, index: number, matchHistoryData: any[]): any {
    const clanName = clan[0];
    const streak = this.calculateStreak(clanName, matchHistoryData);
  
    const membersString = clan[12] || '';
    const membersArray = membersString.split(',').map(member => member.trim());
  
    // Otrzymujemy informacje o graczach
    const players = this.players$.getValue();    
  
    // Liderzy klanu (cl) oraz osoby odpowiedzialne za WoT (wa)
    const clUsername = clan[3]; // Lider klanu
    const waUsername = clan[4]; // Osoba odpowiedzialna za WoT
  
    // Filtrowanie członków, aby wykluczyć cl i wa
    const enrichedMembers = membersArray
      .filter(member => member !== clUsername && member !== waUsername) // Usuwamy cl i wa
      .map(member => {
        const playerDetails = players.find(player => player.username === member);     
        // console.log('PL det', playerDetails)   
        return {
          name: member,
          playername: playerDetails?.playername || null,
          username: playerDetails?.username || null,
          elo: playerDetails?.elo || null,
          placemix: playerDetails?.placemix || null,
          mixwars: playerDetails?.mixwars || null,
          flag: playerDetails?.flag || null,
          active: playerDetails?.active || null,
          ban: playerDetails?.ban || null,
          fpw: playerDetails?.fpw || null,
          clanwars: playerDetails?.clanwars || null
        };
      });
  
    // Sortowanie graczy, aby aktywni byli na górze, a nieaktywni na dole
    const sortedMembers = enrichedMembers.sort((a, b) => {
      if (a.active === "FALSE" && b.active !== "FALSE") {
        return 1; // a (nieaktywny) pójdzie na dół
      }
      if (a.active !== "FALSE" && b.active === "FALSE") {
        return -1; // b (nieaktywny) pójdzie na dół
      }
      return 0; // jeśli oba są aktywne lub oba nieaktywne, nie zmieniamy ich pozycji
    });
  
    const leaderDetails = players.find(player => player.username === clUsername) || {};
    const waDetails = players.find(player => player.username === waUsername) || {};   
  
    const clanData = {
      ranking: index + 1,
      clan: clanName,
      elo: clan[1],
      clantag: clan[2],
      cl: { name: clan[3], ...leaderDetails },
      wa: { name: clan[4] || 'N/A', ...waDetails },
      clan_image: clan[5] || '',
      flag: clan[6] || '',
      last30days: clan[7],
      last365days: clan[8],
      win: clan[9],
      loss: clan[10],
      draw: clan[11],
      streak: streak,
      members: sortedMembers, // Posortowani członkowie
      diff: Number(clan[1]) - Number(clan[13]),
      totalwars: Number(clan[14]),
      wa_discord_id: clan[15],
      desc: clan[16],
      clanname: clan[17],
      matches: [], // Dodane mecze
    };
  
    console.log('Clan processed:', clanData);
    return clanData;
  }
  

  // calculateStreak(clanName: string, matchHistory: any[]): string {
  //   let streakCount = 0;
  //   let streakType = '';

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
  //           break;
  //         }
  //       } else if (clanScore < opponentScore) {
  //         if (streakType === 'L' || streakType === '') {
  //           streakCount++;
  //           streakType = 'L';
  //         } else {
  //           break;
  //         }
  //       } else {
  //         if (streakType === 'D' || streakType === '') {
  //           streakCount++;
  //           streakType = 'D';
  //         } else {
  //           break;
  //         }
  //       }
  //     }
  //   }

  //   return streakCount >= 3 ? `${streakCount} ${streakType}` : '';
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
          data: { clans: this.clans$, challengedClan: challengedClan }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Wysłanie wyzwania z wybranym klanem i formatami
            this.sendChallenge(challengedClan, result.challenger, result.formats);
          }
        });
  }
    
  sendChallenge(challengedClan: any, challengerClan: string, formats: string[]): void {
    console.log('challengedClan', challengedClan.wa_discord_id)
    const waId = challengedClan.wa_discord_id;
    const message = `${challengerClan} has challenged ${challengedClan.clan} in formats: ${formats.join(', ')}`;

    // this.http.post(`${environment.externalApiUrl}send-message-to-wa`, { message, waId }).subscribe(
    //   response => {
    //     console.log('Challenge sent successfully:', response);
    //   },
    //   error => {
    //     console.error('Error sending challenge:', error);
    //   }
    // );
  }
    
  // toggleClanDetails(index: number, clanName: string) {
  //   // Jeśli kliknięto ten sam klan, zamknij go, w przeciwnym razie otwórz nowy
  //   this.expandedClanIndex = this.expandedClanIndex === index ? null : index;
  // }

  toggleClanDetails(index: number, clan: any): void {
    if (this.expandedClanIndex === index) {
      // Jeśli klan jest już rozwinięty, zamknij szczegóły
      this.expandedClanIndex = null;
  
      // Wyczyszczenie meczów w tym klanie w filteredClans$
      const updatedClans = [...this.filteredClans$.getValue()];
      updatedClans[index].matches = [];  // Czyścimy mecze
      this.filteredClans$.next(updatedClans); // Zaktualizuj filteredClans$
    } else {
      // Ustaw nowy klan jako rozwinięty
      this.expandedClanIndex = index;
  
      // Pobierz mecze dla klanu z metody getMatchHistoryByClans
      this.clanService.getMatchHistoryByClans(clan).pipe(
        tap(matchHistoryData => {
          const matches = matchHistoryData.map(match => { 
            return {
              id: match.id,
              clan: clan,
              date: match.date, // Data meczu
              opponent: match.opponent, // Przeciwnik
              us: Number(match.us), // Wynik klanu
              them: Number(match.them), // Wynik przeciwnika
              points: match.points, // Różnica punktów
               // Wynik: Win, Loss, Draw
            };
          });
      
          console.log('matches', matches);
      
          // Zaktualizuj pole matches dla tego klanu w filteredClans$
          const updatedClans = [...this.filteredClans$.getValue()];
          updatedClans[index].matches = matches;  // Ustaw mecze w tym klanie
          this.filteredClans$.next(updatedClans); // Zaktualizuj filteredClans$
        })
      ).subscribe();
      
    }
  }      

  toggleClanDetailsInactive(index: number) {
    // Jeśli kliknięto ten sam klan, zamknij go, w przeciwnym razie otwórz nowy
    this.expandedClanIndexInactive = this.expandedClanIndexInactive === index ? null : index;
  }

  getActivityGradient(activity: number): string {
    let percentage = 0;
  
    // Obliczenia dla przedziałów
    if (activity === 1) {
      percentage = 1;  // Minimalny procent dla 1 w przedziale 1-5
    } else if (activity >= 1 && activity <= 5) {
      percentage = ((activity - 1) / 4) * 100;  // Dla przedziału 1-5
    } else if (activity === 6) {
      percentage = 1;  // Minimalny procent dla 6 w przedziale 6-10
    } else if (activity >= 6 && activity <= 10) {
      percentage = ((activity - 6) / 4) * 100;  // Dla przedziału 6-10
    } else if (activity === 11) {
      percentage = 1;  // Minimalny procent dla 11 w przedziale 11-20
    } else if (activity >= 11 && activity <= 20) {
      percentage = ((activity - 11) / 9) * 100; // Dla przedziału 11-20
    } else if (activity === 21) {
      percentage = 1;  // Minimalny procent dla 21 w przedziale 21-40
    } else if (activity >= 21 && activity <= 40) {
      percentage = ((activity - 21) / 19) * 100; // Dla przedziału 21-40
    } else if (activity === 41) {
      percentage = 1;  // Minimalny procent dla 41 w przedziale 41-60
    } else if (activity >= 41 && activity <= 60) {
      percentage = ((activity - 41) / 19) * 100; // Dla przedziału 41-60
    } else if (activity === 61) {
      percentage = 1;  // Minimalny procent dla 61 w przedziale 61-90
    } else if (activity >= 61 && activity <= 90) {
      percentage = ((activity - 61) / 29) * 100; // Dla przedziału 61-90
    } else if (activity > 90) {
      percentage = 100; // Dla wartości powyżej 90
    }
  
    const color = this.getActivityColor(activity);
    
    // Upewnijmy się, że zawsze jest minimalna widoczna wartość dla gradientu
    return `linear-gradient(to top, ${color} ${percentage + 10}%, gray ${percentage + 5}%)`;
  }
  
  getActivityColor(activity: number): string {
    if (activity === 0) {
      return '#003200'; // Zielony dla braku aktywności
    } else if (activity >= 1 && activity <= 5) {
      return '#050'; // Zielony dla bardzo niskiej aktywności
    } else if (activity >= 6 && activity <= 10) {
      return '#00a100'; // Zielony dla umiarkowanej aktywności
    } else if (activity >= 11 && activity <= 20) {
      return '#8aff1a'; // Żółto-zielony dla średniej aktywności
    } else if (activity >= 21 && activity <= 40) {
      return '#ffff00'; // Żółty dla średniej aktywności
    } else if (activity >= 41 && activity <= 60) {
      return 'orange'; // Pomarańczowy dla wyższej aktywności
    } else if (activity >= 61 && activity <= 90) {
      return '#ff4500'; // Czerwono-pomarańczowy dla bardzo wysokiej aktywności
    } else {
      return '#ff0000'; // Czerwony dla maksymalnej aktywności
    }
  }
  toggleVisibility() {
    this.isVisible = !this.isVisible;  // Przełącza widoczność elementu
  }       

  getResultClass(us: number, them: number): string {
    if (us < them) {
      return 'red'; // Klasa CSS dla przegranej
    } else if (us > them) {
      return 'green'; // Klasa CSS dla wygranej
    } else {
      return 'gray'; // Klasa CSS dla remisu
    }
  }
}
