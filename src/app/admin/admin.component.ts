import { Component, OnInit } from '@angular/core';
import { PlayersApiService } from '../services/players-api.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  players$: Observable<any>;
  discordUsers$: Observable<any>;
  playersWithDiscordInfo$: Observable<any[]>;

  constructor(private playersApi: PlayersApiService) {
    this.players$ = this.playersApi.getPlayersFinal('Players');
    this.discordUsers$ = this.playersApi.getDiscordUsers().pipe(
      map((data: any[]) =>
        data.map(user => ({
          discord_id: user.user.id,
          username: user.user.username,
          roles: user.roles, // Zakładamy, że Discord API zwraca role
          joinedAt: user.joinedAt, // Inne przykładowe pole z Discorda
          ...user
        }))
      )
    );
  }

  ngOnInit(): void {
    this.playersWithDiscordInfo$ = this.getPlayersWithDiscordInfo();
  }

  getPlayersWithDiscordInfo(): Observable<any[]> {
    return combineLatest([this.players$, this.discordUsers$]).pipe(
      map(([players, discordUsers]) => {
        // Scalanie graczy z Discordem
        const playersWithDiscord = players.map(player => {
          const discordUser = discordUsers.find(user => user.discord_id === player.discord_id);
          return discordUser
            ? { ...player, discordUser }
            : { ...player, discordUser: null }; // Gdy brak dopasowania
        });

        // Sortowanie: brak dopasowania na dole
        return playersWithDiscord.sort((a, b) => (a.discordUser === null ? 1 : -1));
      })
    );
  }
}
