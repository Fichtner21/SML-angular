import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private apiUrl = 'http://localhost:5000/api';
 

  constructor(private http: HttpClient) {}

  getBracketData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bracket`);
  }

  updateBracketData(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bracket`, data);
  }

   // Pobiera drużyny i ich składy
   public getTeamsWithPlayers(): Observable<any> {
    const teams$ = this.http.get<any>(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Cup2!A1:D?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`);
    const players$ = this.http.get<any>(`https://sheets.googleapis.com/v4/spreadsheets/1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo/values/Cup2_Players!A1:D?key=AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU`);

    return forkJoin([teams$, players$]).pipe(
      map(([teamsData, playersData]) => {
        const teams = this.parseTeams(teamsData.values);
        const players = this.parsePlayers(playersData.values);
        
        // Łączenie graczy z drużynami
        return teams.map(team => ({
          ...team,
          players: players.filter(player => player.teamId === team.teamId)
        }));
      })
    );
  }

  // Parsowanie danych drużyn
  private parseTeams(data: any[][]): any[] {
    return data.slice(1).map(row => ({      
      teamId: row[0], // ID drużyny
      name: row[1],   // Nazwa drużyny
      tag: row[2],
      logo: row[3]    // Logo drużyny
    }));
  }

  // Parsowanie danych graczy
  private parsePlayers(data: any[][]): any[] {
    return data.slice(1).map(row => ({
      teamId: row[0],       // ID drużyny
      playername: row[1],   // Wyświetlana nazwa gracza
      username: row[2] || row[1].toLowerCase(), // Username (jeśli brak, to playername jako fallback)
      countryFlag: row[3]   // Flaga kraju
    }));
  }
}
