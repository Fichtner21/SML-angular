import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentService } from '../services/tournament.service';
import * as $ from 'jquery';
import { TeamModalComponent } from '../shared/team-modal/team-modal.component';


@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent implements OnInit {
  bracketData: any;
  teams: any[] = [];
  selectedTab: number = 5; // 🔹 Ustawia "Cup" jako domyślną zakładkę
  rules = [
    { title: "Registration:", description: "Ends at 15:00 CET on Februar 2, 2025 (Sunday)." },
    { title: "Please provide:", description: "", subpoints: ["🏆 Team name", "👥 Members", "📸 Logo (optional)"] },
    { title: "Cup Format:", description: "Double elimination bracket – Lose a match and have a last chance in the lower bracket." },
    { title: "Match format:", description: "Flexible 3v3-7v7." },
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
    { name: "Winner Elm. match #1", logo: "sh_icon.png"}
    // { name: "Proper Instruction Motivates People", logo: "jkf.jpg" },
    // { name: 'Sixth Sense', logo: "s6.png"}  
  ];
  eliminationTeams = [
    { name: "Proper Instruction Motivates People", logo: "jkf.jpg" },
    { name: "Sixth Sense", logo: "s6.png" },
    // Dodaj 1 lub 2 drużyny więcej do testów:
    { name: "New Challengers", logo: "sh_icon.png" },
    { name: "Elite Squad", logo: "sh_icon.png" }
  ];
  drawnPairs: { team1: any, team2: any }[] = [];
  drawnTeams: any[] = [];
  revealedTeams: number = 0;
  eliminationMatches: { team1: any, team2?: any, stage: string, score1?: number, score2?: number, winner?: any }[] = [];

  constructor(private tournamentService: TournamentService, public dialog: MatDialog) {
    
  }

  ngOnInit(): void {
    // this.tournamentService.getTeamsWithPlayers().subscribe(data => {
    //   this.teams = data;
    //   console.log('data', data)
    // });
  }

  ngAfterViewInit(): void {
    this.loadBracket();
    
  }

  loadBracket(): void {
    this.tournamentService.getBracketData().subscribe((data) => {
    
      if (!data || !data.teams || !data.results) {
        console.error("⚠️ Brak poprawnych danych turniejowych!");
        return;
      }

      this.tournamentService.getTeamsWithPlayers().subscribe((teamsData) => {
        this.teams = teamsData;
        console.log("📢 Pobranie drużyn:", this.teams);
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
        
        save: this.saveMatchResult.bind(this),
        disableToolbar: true,
        disableTeamEdit: true,
        teamWidth: 155,
        scoreWidth: 50,
        matchMargin: 20,
        roundMargin: 40,
        skipSecondaryFinal: true,
        decorator: {
          edit: () => {}, // Wymagane przez `jquery-bracket`
          render: this.renderTeamAvatar
        }
      });

      setTimeout(() => {
        jQuery('.team-name').on('click', (event: any) => {
          const teamName = event.target.innerText.trim();
          this.openTeamModal(teamName);
        });
      }, 500);
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

  saveMatchResult(data: any): void {
    console.log("Sending data to backend:", data);
    this.tournamentService.updateBracketData(data).subscribe(() => {
      console.log('Bracket data saved successfully');
    });
  }

  openTeamModal(teamName: string): void {
    const team = this.teams.find(t => t.name === teamName);
    if (team) {
      this.dialog.open(TeamModalComponent, {
        data: team,
        width: '600px'
      });
    }
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

  drawTeams(): void {
    const shuffledTeams = [...this.teamsDraw].sort(() => Math.random() - 0.5);
    this.drawnPairs = [];
    this.drawnTeams = [];
    this.revealedTeams = 0; // Resetujemy licznik odkrytych drużyn

    for (let i = 0; i < shuffledTeams.length; i += 2) {
      this.drawnPairs.push({ team1: shuffledTeams[i], team2: shuffledTeams[i + 1] });
      this.drawnTeams.push(shuffledTeams[i], shuffledTeams[i + 1]); // Dodajemy drużyny pojedynczo
    }
  }

  revealNextTeam(): void {
    if (this.revealedTeams < this.drawnTeams.length) {
      this.revealedTeams++;
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
