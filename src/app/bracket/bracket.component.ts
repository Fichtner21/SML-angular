import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TournamentService } from '../services/tournament.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss'],
})
export class BracketComponent {
  bracketData: any;

  constructor(private tournamentService: TournamentService) {}

  ngAfterViewInit(): void {
    this.loadBracket();
  }

  loadBracket(): void {
    this.tournamentService.getBracketData().subscribe((data) => {
      console.log("📢 Otrzymane dane z backendu:", data);
    
      if (!data || !data.teams || !data.results) {
        console.error("⚠️ Brak poprawnych danych turniejowych!");
        return;
      }
    
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
    
      console.log("📢 Skonwertowane `bracketData.teams`:", this.bracketData.teams);
    
      (jQuery('#bracket') as any).bracket({
        init: this.bracketData,
        
        save: this.saveMatchResult.bind(this),
        disableToolbar: true,
        disableTeamEdit: true,
        teamWidth: 162,
        scoreWidth: 50,
        matchMargin: 20,
        roundMargin: 40,
        skipSecondaryFinal: true,
        decorator: {
          edit: () => {}, // Wymagane przez `jquery-bracket`
          render: this.renderTeamAvatar
        }
      });
    });
  }

  // renderTeamAvatar(container: any, data: any, score: any, state: string): void {
  //   switch(state) {
  //     case "empty-bye":
  //       container.append("No team");
  //       return;
  //     case "empty-tbd":
  //       container.append("Upcoming");
  //       return;
  //     case "entry-no-score":
  //     case "entry-default-win":
  //     case "entry-complete":
  //       console.log('data', data)
  //       container.append(`<img src="${data.avatar}" class="team-avatar"/> `).append(data.name);
  //       return;
  //   }
  // }

  renderTeamAvatar(container: any, data: any, score: any, state: string): void {
    console.log("🔍 Debug `data` w renderTeamAvatar:", data);
  
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
