import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentService } from '../services/tournament.service';
import * as $ from 'jquery';
import { TeamModalComponent } from '../shared/team-modal/team-modal.component';
import { AuthService } from '../services/auth.service';
import { TeamMatchModalComponent } from '../shared/team-match-modal/team-match-modal.component';
import { ScreenshotModalComponent } from '../shared/screenshot-modal/screenshot-modal.component';


@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent implements OnInit {
  bracketData: any;
  teams: any[] = [];
  filteredTeams: any[] = []; // 🔹 Lista drużyn BEZ Wildcardów
  selectedTab: number = 4; // 🔹 Ustawia "Cup" jako domyślną zakładkę
  rules = [
    { title: "Registration:", description: "Ends at 15:00 CET on Februar 2, 2025 (Sunday)." },
    { title: "Please provide:", description: "", subpoints: ["🏆 Team name", "👥 Members", "📸 Logo (optional)"] },
    { title: "Cup Format:", description: "Double elimination bracket – Lose a match and have a last chance in the lower bracket." },
    { title: "Match format:", description: "Flexible 3v3-7v7." },
    { title: "Game server", description: "Same game server as we play in league, location: germany, france, belgium, holland, switzerland, poland."},
    { title: "⏳ Time limit:", description: "4 minutes per round." },
    { title: "🔫 Weapons:", description: "", subpoints: ["1 Sniper allowed per team.", "1 Shotgun is allowed if 4v4+."] },
    { title: "🗺️ Map pool:", description: "Hunt, V2, Bridge, AbbeyBeta, Renan, Stlo." },
    { title: "Map selection:", description: "Each team picks its own map – rules apply to bans/picks." },
    { title: 'In case of draw need 3rd or more map, they will play one of two non picked map, non banned map'},
    { title: "🏅 Match scoring:", description: "First to 5 per side of the map. The team with the highest number of rounds wins." },
    { title: "⚖️ Round draw:", description: "Replay the round." },
    { title: "📅 Match schedule:", description: "Each set of matches has a 7-day limit to be played." },
    { title: "📌 Unplayed matches:", description: "If teams fail to organize a date, the match is forced to be played at 20:30 CET on the last day." },
    { title: "⌛ Match delay:", description: "Teams have 15 minutes tolerance to join the server after confirmed time." },
    { title: "📜 No-show rule:", description: "After 15 minutes, the match starts unless the opponent agrees to wait." },
    { title: "🏷️ Clan tags:", description: "All players must use their clan tag during a match." },
    { title: "🚨 Unauthorized player:", description: "If a player is caught playing for another team, the player and the team will be banned from the cup." },
    { title: "📡 Live streaming:", description: "All players must live stream their match (Discord, YouTube, Twitch, etc.)." },
    { title: "⏳ Streaming delay:", description: "If streaming on YouTube/Twitch, a 120-second delay must be applied." },
    { title: "🎟️ Qualifying matches:", description: "If more than 8 teams are registered, qualifying matches will be decided by entry order.", subpoints: [
        "The 8th registered team plays an elimination match against the 9th registered team, etc."
      ]},
    { title: "🏆 Expansion:", description: "If 12-16 teams register, a 16-team tournament will be created." },
    { title: "🔄 Wildcards:", description: "The difference between registered teams and 16 will be filled with wildcards." }
  ];
  teamsDraw = [
    { name: "West Europe Gangbang", logo: "weg2.png" },
    { name: "exclus1ve gaming", logo: "p.png" },
    { name: "Quinas", logo: "quinas.png" },
    { name: "TeamForce", logo: "teamforce.webp" },
    { name: "ĆIPA", logo: "cipa.png" },
    { name: "no name", logo: "no_name.webp" },
    { name: "wanksluts", logo: "wanksluts.png" },    
    { name: "Proper Instruction Motivates People", logo: "jkf.jpg" },
    { name: 'Sixth Sense', logo: "s6.png"},
    { name: 'UpRising I', logo: "UpRising11.png"},  
    { name: 'UpRising II', logo: "UpRising22.png"}, 
    { name: 'Wildcard 1', logo: "w1.webp"}, 
    { name: 'Wildcard 2', logo: "w2.webp"}, 
    { name: 'Wildcard 3', logo: "w3.webp"}, 
    { name: 'Wildcard 4', logo: "w4.webp"}, 
    { name: 'Wildcard 5', logo: "w5.webp"} 
  ];
  eliminationTeams = [
    { name: "Proper Instruction Motivates People", logo: "jkf.jpg" },
    { name: "Sixth Sense", logo: "s6.png" },
    // Dodaj 1 lub 2 drużyny więcej do testów:
    // { name: "New Challengers", logo: "sh_icon.png" },
    // { name: "Elite Squad", logo: "sh_icon.png" }
  ];
  drawnPairs: { team1: any, team2: any }[] = [];
  nextRoundPairs: { team1: any, team2: any }[] = [];
  drawnTeams: any[] = [];
  revealedTeams: number = 0;
  eliminationMatches: { team1: any, team2?: any, stage: string, score1?: number, score2?: number, winner?: any }[] = [];

  userRoles: any;
  canEditScores = false; // 🛑 Domyślnie użytkownik nie może edytować wyników

  // 🔹 Role uprawnione do edycji wyników
  allowedRoles = ["1059920877044629614", "716736352359809095"];
  canSeeDraw = false;
  matches: any[] = [];

  constructor(private tournamentService: TournamentService, public dialog: MatDialog, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.canEditScores = localStorage.getItem('access') === '1';
    this.canSeeDraw = localStorage.getItem('access') === '1'; 
    this.loadBracket();
    this.loadMatches();
  }

  ngAfterViewInit(): void {
    // this.loadBracket();  
    // this.authService.getUserRoles3().subscribe((data) => {
    //   // console.log('AAA', data);
    //   this.userRoles = data;

    //   // ✅ Sprawdzamy, czy użytkownik ma jedną z dozwolonych ról
    //   this.canEditScores = this.userRoles.roles.filter(role => this.allowedRoles.includes(role)).length > 0;
    //   this.loadBracket();      
    // });  

    
    // setTimeout(() => {
    //   jQuery('.teamContainer').on('click', (event: any) => {
    //     console.log('asdasd');
    //     this.openMatchModal(event);
    //   });
    // }, 500);
  }

  loadBracket(): void {
    this.tournamentService.getBracketData().subscribe((data) => {
    
      if (!data || !data.teams || !data.results) {
        console.error("⚠️ Brak poprawnych danych turniejowych!");
        return;
      }

      this.tournamentService.getTeamsWithPlayers().subscribe((teamsData) => {
        this.teams = teamsData;
        this.filteredTeams = this.teams.filter(team => !team.name.startsWith("Wildcard"));
        // console.log("📢 Pobranie drużyn:", this.teams);
      });
    
      // **Konwersja drużyn na obiekty `{name, avatar}`**
      this.bracketData = {
        teams: data.teams.map((match: any[]) => match.map(team => {
          if (typeof team === "string") {
            return {
              name: team,
              avatar: data.avatars?.[team] || "https://mohsh.pl/assets/default-avatar.png"
            };
          }
          return team; // Jeśli już jest `{name, avatar}`, pozostawiamy
        })),
        results: data.results
      };      
    
      (jQuery('#bracket') as any).bracket({
        init: this.bracketData,
        // save: this.canEditScores ? this.saveMatchResult.bind(this) : null, // 🔹 Tylko uprawnieni użytkownicy mogą zapisywać wyniki!
        // save: this.saveMatchResult.bind(this),
        // save: function(){},
        // save: this.canEditScores ? this.saveMatchResult.bind(this) : null,
        save: this.canEditScores ? this.saveMatchResult.bind(this) : this.saveMatchResult.bind(this),
        disableToolbar: true,
        disableTeamEdit: true,
        teamWidth: 135,
        scoreWidth: 50,
        matchMargin: 20,
        roundMargin: 40,
        skipSecondaryFinal: true,
        decorator: {
          edit: () => {}, // Wymagane przez `jquery-bracket`
          render: this.renderTeamAvatar
        }
      });

      // setTimeout(() => {
      //   jQuery('.team-name').on('click', (event: any) => {
      //     const teamName = event.target.innerText.trim();
      //     this.openTeamModal(teamName);
      //   });
      // }, 500);
      setTimeout(() => {
        this.disableScoreEdit();
      }, 500);

      document.querySelectorAll('.team-wrapper').forEach(team => {
        team.addEventListener('click', (event) => this.openMatchModal(event));
      });
    });
  } 

  renderTeamAvatar(container: any, data: any, score: any, state: string): void {   
  
    if (!data || typeof data === "string") {
      container.html(`<span class="team-name">No team</span>`);
      return;
    }
  
    const avatarUrl = data.avatar || "https://mohsh.pl/assets/default-avatar.png";
    const teamName = data.name || "Unknown";
  
    // 🔹 Używamy `.html(...)` zamiast `.append(...)`, aby uniknąć duplikacji
    container.html(`
      <div class="team-wrapper">
        <img src="${avatarUrl}" class="team-avatar" alt="${teamName}">
        <span class="team-name">${teamName}</span>
      </div>
    `);
  }  

  // saveMatchResult(data: any): void {
  //   console.log("Sending data to backend:", data);
  //   this.tournamentService.updateBracketData(data).subscribe(() => {
  //     console.log('Bracket data saved successfully');
  //   });
  // }
  saveMatchResult(data: any): void {
    if (!this.canEditScores) {
      console.warn("⚠️ Brak uprawnień do edytowania wyników!");
      return;
    }

    console.log("Sending data to backend:", data);
    this.tournamentService.updateBracketData(data).subscribe(() => {
      console.log('Bracket data saved successfully');
    });
  }

  disableScoreEdit(): void {
    if (!this.canEditScores) {
      jQuery('.editable').off('click'); // 🛑 Blokujemy możliwość kliknięcia w pola wyników
      jQuery('.editable').css('pointer-events', 'none'); // 🔹 Usuwamy interaktywność
      jQuery('.editable').css('opacity', '0.99'); // 🔹 Wyszarzamy pola wyników
    }
  }

  // openTeamModal(teamName: string): void {
  //   const team = this.teams.find(t => t.name === teamName);
  //   if (team) {
  //     this.dialog.open(TeamModalComponent, {
  //       data: team,
  //       width: '600px'
  //     });
  //   }
  // }

  // openMatchModal(event: any): void {
  //   const clickedElement = (event.target as HTMLElement).closest('.teamContainer'); // Pobieramy cały mecz
  //   if (!clickedElement) return;
  
  //   const teams = clickedElement.querySelectorAll('.team-wrapper');
  //   if (teams.length < 2) return;
  //   const teamOver = clickedElement.querySelectorAll('.team');
  
  //   // Pobieramy dane pierwszej drużyny
  //   const team1Name = teams[0].querySelector('.team-name')?.textContent?.trim();
  //   const team1Logo = teams[0].querySelector('.team-avatar')?.getAttribute('src');
  //   const team1Score = teamOver[0].querySelector('.score')?.textContent.trim();
  //   console.log('team1Score', team1Score)
  
  //   // Pobieramy dane drugiej drużyny
  //   const team2Name = teams[1].querySelector('.team-name')?.textContent?.trim();
  //   const team2Logo = teams[1].querySelector('.team-avatar')?.getAttribute('src');
  //   const team2Score = teamOver[1].querySelector('.score')?.textContent.trim();
  //   console.log('team1Score', team2Score)
  
  //   if (!team1Name || !team1Logo || !team2Name || !team2Logo) return;
  
  //   this.tournamentService.getTeamsWithPlayers().subscribe((teamsData) => {
  //     const team1Data = teamsData.find(t => t.name === team1Name) || { name: team1Name, logo: team1Logo, score: team1Score, players: [] };
  //     const team2Data = teamsData.find(t => t.name === team2Name) || { name: team2Name, logo: team2Logo, score: team2Score, players: [] };
  
  //     const matchData = {
  //       team1: team1Data,
  //       team2: team2Data
  //     };
  
  //     this.dialog.open(TeamMatchModalComponent, {
  //       data: matchData,
  //       width: '600px'
  //     });
  //   });
  // }  

  loadMatches(): void {
    this.tournamentService.getMatchReports().subscribe((data) => {
      this.matches = data;
      console.log("📢 Match reports loaded:", this.matches);
    });
  }

  openMatchModal(event: any): void {
    const clickedElement = (event.target as HTMLElement).closest('.teamContainer'); // Pobieramy cały mecz
    if (!clickedElement) return;
  
    const teams = clickedElement.querySelectorAll('.team-wrapper');
    if (teams.length < 2) return;
    const teamOver = clickedElement.querySelectorAll('.team');
  
    // Pobieramy dane pierwszej drużyny
    const team1Name = teams[0].querySelector('.team-name')?.textContent?.trim();
    const team1Logo = teams[0].querySelector('.team-avatar')?.getAttribute('src');
    const team1Score = teamOver[0].querySelector('.score')?.textContent?.trim();    
  
    // Pobieramy dane drugiej drużyny
    const team2Name = teams[1].querySelector('.team-name')?.textContent?.trim();
    const team2Logo = teams[1].querySelector('.team-avatar')?.getAttribute('src');
    const team2Score = teamOver[1].querySelector('.score')?.textContent?.trim();    
  
    if (!team1Name || !team1Logo || !team2Name || !team2Logo) return;
  
    this.tournamentService.getTeamsWithPlayers().subscribe((teamsData) => {
      const foundTeam1 = teamsData.find(t => t.name === team1Name);
      const foundTeam2 = teamsData.find(t => t.name === team2Name);
  
      const team1Data = {
        name: team1Name,
        logo: team1Logo,
        score: team1Score,
        players: foundTeam1 ? foundTeam1.players : [] // Jeśli znaleziono drużynę, przypisz jej graczy
      };
  
      const team2Data = {
        name: team2Name,
        logo: team2Logo,
        score: team2Score,
        players: foundTeam2 ? foundTeam2.players : []
      };
  
      const matchData = {
        team1: team1Data,
        team2: team2Data
      };      
  
      this.dialog.open(TeamMatchModalComponent, {
        data: matchData,
        width: '600px'
      });
    });
  }
  

  onTabChange(event: any): void {
    if (event.index === 5) { // "Cup" ma index 5
      setTimeout(() => {
        this.loadBracket();
      }, 100);
    }

    if (event.index === 3){
      setTimeout(() => {
        this.generateEliminationBracket();
      }, 500)
    }
  }

 

  // drawTeams(): void {
  //   const wildcardTeams = this.teamsDraw.filter(team => team.name.startsWith("Wildcard"));
  //   const nonWildcardTeams = this.teamsDraw.filter(team => !team.name.startsWith("Wildcard"));

  //   this.drawnPairs = [];
  //   this.drawnTeams = [];
  //   this.revealedTeams = 0; // Resetujemy licznik odkrytych drużyn

  //   const shuffledWildcardTeams = [...wildcardTeams].sort(() => Math.random() - 0.5);
  //   const shuffledNonWildcardTeams = [...nonWildcardTeams].sort(() => Math.random() - 0.5);

  //   const shuffledTeams: any[] = [];

  //   // 🔹 Losujemy pary tak, aby Wildcardy nie były razem
  //   while (shuffledWildcardTeams.length > 0 && shuffledNonWildcardTeams.length > 0) {
  //       shuffledTeams.push(shuffledNonWildcardTeams.pop());
  //       shuffledTeams.push(shuffledWildcardTeams.pop());
  //   }

  //   // 🔹 Jeśli zostały jeszcze drużyny, dodajemy je losowo
  //   while (shuffledNonWildcardTeams.length > 0) {
  //       shuffledTeams.push(shuffledNonWildcardTeams.pop());
  //   }
  //   while (shuffledWildcardTeams.length > 0) {
  //       shuffledTeams.push(shuffledWildcardTeams.pop());
  //   }

  //   // 🔹 Tworzymy pary z losowanych drużyn
  //   for (let i = 0; i < shuffledTeams.length; i += 2) {
  //       this.drawnPairs.push({ team1: shuffledTeams[i], team2: shuffledTeams[i + 1] });
  //       this.drawnTeams.push(shuffledTeams[i], shuffledTeams[i + 1]); // Dodajemy drużyny pojedynczo
  //   }
  // }

  drawTeams(): void {
    const wildcardTeams = this.teamsDraw.filter(team => team.name.startsWith("Wildcard"));
    const nonWildcardTeams = this.teamsDraw.filter(team => !team.name.startsWith("Wildcard"));

    this.drawnPairs = [];
    this.drawnTeams = [];
    this.revealedTeams = 0; // Resetujemy licznik ujawnionych drużyn

    const shuffledWildcardTeams = [...wildcardTeams].sort(() => Math.random() - 0.5);
    const shuffledNonWildcardTeams = [...nonWildcardTeams].sort(() => Math.random() - 0.5);

    const shuffledTeams: any[] = [];

    // 🔹 Tworzymy pary Wildcard + zwykła drużyna
    while (shuffledWildcardTeams.length > 0 && shuffledNonWildcardTeams.length > 0) {
        shuffledTeams.push(shuffledNonWildcardTeams.pop());
        shuffledTeams.push(shuffledWildcardTeams.pop());
    }

    // 🔹 Jeśli zostały jeszcze drużyny, dodajemy je losowo
    while (shuffledNonWildcardTeams.length > 0) {
        shuffledTeams.push(shuffledNonWildcardTeams.pop());
    }
    while (shuffledWildcardTeams.length > 0) {
        shuffledTeams.push(shuffledWildcardTeams.pop());
    }

    // 🔹 Tworzenie par i zabezpieczenie przed Wildcard vs Wildcard
    for (let i = 0; i < shuffledTeams.length; i += 2) {
        // Jeśli ostatnia para to Wildcard vs Wildcard, zamieniamy jednego Wildcarda z drużyną nie-Wildcard
        if (i + 1 < shuffledTeams.length &&
            shuffledTeams[i].name.startsWith("Wildcard") &&
            shuffledTeams[i + 1].name.startsWith("Wildcard")) {

            // Szukamy pierwszej dostępnej drużyny nie-Wildcard do wymiany
            for (let j = i + 2; j < shuffledTeams.length; j++) {
                if (!shuffledTeams[j].name.startsWith("Wildcard")) {
                    // Zamiana Wildcarda z inną drużyną
                    [shuffledTeams[i + 1], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i + 1]];
                    break;
                }
            }
        }

        this.drawnPairs.push({ team1: shuffledTeams[i], team2: shuffledTeams[i + 1] });
        this.drawnTeams.push(shuffledTeams[i], shuffledTeams[i + 1]); // Dodajemy drużyny pojedynczo
    }
  }



  generateNextRound(): void {
    this.nextRoundPairs = [];

    // 🔹 Sprawdzamy, czy wszystkie mecze pierwszej rundy zostały ujawnione
    if (this.revealedTeams < this.drawnTeams.length) {
        return;
    }

    for (let i = 0; i < this.drawnPairs.length; i += 2) {
        if (i + 1 < this.drawnPairs.length) {
            const match1 = this.drawnPairs[i];
            const match2 = this.drawnPairs[i + 1];

            const winner1 = this.determineWinner(match1);
            const winner2 = this.determineWinner(match2);

            this.nextRoundPairs.push({ team1: winner1, team2: winner2 });
        }
    }
}


determineWinner(match: { team1: any, team2: any }): any {
    const isWildcard1 = match.team1.name.startsWith("Wildcard");
    const isWildcard2 = match.team2.name.startsWith("Wildcard");

    if (isWildcard1 && !isWildcard2) {
        return match.team2;
    } else if (!isWildcard1 && isWildcard2) {
        return match.team1;
    } else {
        return { name: `${match.team1.name} / ${match.team2.name}`, logo: "unknown.png" };
    }
}


  // revealNextTeam(): void {
  //   if (this.revealedTeams < this.drawnTeams.length) {
  //     this.revealedTeams++;
  //   }
  // }

  revealNextTeam(): void {
    if (this.revealedTeams < this.drawnTeams.length) {
        this.revealedTeams++;
    }

    // 🔹 Jeśli wszystkie drużyny zostały ujawnione, generujemy drugą rundę
    if (this.revealedTeams === this.drawnTeams.length) {
        this.generateNextRound();
    }
}


  //ELIMINATION
  generateEliminationBracket(): void {
    this.eliminationMatches = [];

    if (this.eliminationTeams.length === 2) {
      // 🔹 2 drużyny → Finał eliminacyjny
      this.eliminationMatches.push({
        team1: this.eliminationTeams[0],
        team2: this.eliminationTeams[1],
        stage: "Elimination Final",
        score1: null,
        score2: null
      });
    } 
    else if (this.eliminationTeams.length === 3) {
      // 🔹 3 drużyny → Jeden półfinał + finał (1 drużyna automatycznie w finale)
      this.eliminationMatches.push({
        team1: this.eliminationTeams[0],
        team2: this.eliminationTeams[1],
        stage: "Semifinal",
        score1: null,
        score2: null
      });

      this.eliminationMatches.push({
        team1: this.eliminationTeams[2], // Automatycznie w finale
        stage: "Final",
        score1: null,
        score2: null
      });
    } 
    else if (this.eliminationTeams.length === 4) {
      // 🔹 4 drużyny → Pełna drabinka (2 półfinały + finał)
      this.eliminationMatches.push({
        team1: this.eliminationTeams[0],
        team2: this.eliminationTeams[1],
        stage: "Semifinal 1",
        score1: null,
        score2: null
      });

      this.eliminationMatches.push({
        team1: this.eliminationTeams[2],
        team2: this.eliminationTeams[3],
        stage: "Semifinal 2",
        score1: null,
        score2: null
      });

      this.eliminationMatches.push({
        team1: null, // Placeholder na zwycięzców półfinałów
        team2: null,
        stage: "Final",
        score1: null,
        score2: null
      });
    }
  }

  updateScore(match: any, score1: string, score2: string): void {
    match.score1 = score1 !== "" ? parseInt(score1, 10) : null;
    match.score2 = score2 !== "" ? parseInt(score2, 10) : null;

    if (match.score1 !== null && match.score2 !== null) {
      match.winner = match.score1 > match.score2 ? match.team1 : match.team2;
      
      // 🔹 Przesuwamy zwycięzcę do finału, jeśli to półfinał
      if (match.stage.includes("Semifinal")) {
        const finalMatch = this.eliminationMatches.find(m => m.stage === "Final");
        if (finalMatch) {
          if (!finalMatch.team1) {
            finalMatch.team1 = match.winner;
          } else {
            finalMatch.team2 = match.winner;
          }
        }
      }
    }
  }

  openScreenshotModal(imageUrl: string): void {
    this.dialog.open(ScreenshotModalComponent, {
      data: { imageUrl },
      width: '80%',
      maxHeight: '90vh'
    });
  }

  // ngAfterViewInit(): void {
    // this.loadBracket();
    // WORKING EXAMPLE!!
    // Przykładowe dane turniejowe
    // const exampleData = {
    //   teams: [
    //     ["Team 1", "Team 2"],
    //     ["Team 3", "Team 4"]
    //   ],
    //   results: [
    //     [[1, 2], [3, 4]] // Przykładowe wyniki
    //   ]
    // };

    // Inicjalizacja `jquery-bracket`
    // (jQuery('#bracket') as any).bracket({
    //   init: exampleData,
    //   save: function(data: any) {
    //     console.log('Updated data:', data);
    //   }
    // });
  // }
}
