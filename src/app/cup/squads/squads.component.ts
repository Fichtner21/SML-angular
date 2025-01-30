import { Component, OnInit } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-squads',
  templateUrl: './squads.component.html',
  styleUrls: ['./squads.component.scss']
})
export class SquadsComponent implements OnInit {
  // teams = [
  //   {
  //     logo: 'assets/images/clans/pillsnwhine6.png',
  //     name: `Pills N' Whine`,
  //     players: [
  //       { playername: 'M0NST3R', username: 'm0nst3r', countryFlag: 'assets/images/flags_svg/UK.SVG' },
  //       { playername: 'Kabal', username: 'kabal', countryFlag: 'assets/images/flags_svg/FR.SVG' },
  //       { playername: 'deni', username: 'deni', countryFlag: 'assets/images/flags_svg/RS.SVG' },
  //       { playername: '^Cronic', username: 'Cronic', countryFlag: 'assets/images/flags_svg/GR.SVG' }
  //     ]
  //   },
  //   {
  //     logo: 'https://example.com/logo2.png',
  //     name: 'Team Bravo',
  //     players: [
  //       { name: 'Ahmed Ali', countryFlag: 'https://example.com/flags/egypt.png' },
  //       { name: 'Sophia Chen', countryFlag: 'https://example.com/flags/china.png' },
  //       { name: 'Liam O\'Connor', countryFlag: 'https://example.com/flags/ireland.png' }
  //     ]
  //   }
  // ];
  teams: any[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.tournamentService.getTeamsWithPlayers().subscribe(data => {
      this.teams = data;
      console.log('data', data)
    });
  }

}
