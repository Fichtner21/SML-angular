import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { GoogleSheetsDbService } from 'ng-google-sheets-db';

import { environment } from '../environments/environment';
import { PlayersApiService } from './services/players-api.service';
import { Players } from './ranking-obj/ranking.model';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { getLocaleEraNames } from '@angular/common';
import * as Chart from 'chart.js';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { faEuro, faHome, faHouse } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { SeasonService } from './services/season.service';
import { PlayerService } from './services/player.service';

interface VoiceMember {
  id: string;
  username: string;
  nickname: string;
  additionalInfo0?: string; // Wartość z indeksu 0
  additionalInfo1?: string; // Wartość z indeksu 1
  additionalInfo6?: string; // Wartość z indeksu 6
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  parentRanking: any;
  title = 'SH MIX';
  players$: Observable<any>;
  matches$: Observable<any>;
  matchesPerMonth$: Observable<any>;
  numOfPlayers$: Observable<any>;
  activityCanvas:any;
  ctx: any;
  house = faHouse;
  home = faHome;
  euro = faEuro;
  paypal = faPaypal;
  // public lang = new FormControl('en');
  currentLanguage: any = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  languageCode = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  monthPlaying: any;
  isMenuOpen = false;
  numberOfMatches = 0;
  historyMatches: any;
  num_Players: any;
  total_wars: any;
  s5_wars: any;
  s6_wars: any;
  s7_wars: any;
  s8_wars: any;
  progressValue: number;
  tooltipText: string;
  public userCount: number = 0;
  public players: VoiceMember[] = []; // Lista graczy
  public playersData: any[] = []; // Przechowywanie przetworzonych danych
  season!: number;
  dateRange!: string;
  playerDetails: any;

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private playersApiService: PlayersApiService, private translateService: TranslateService, public _authService: AuthService, private router: Router, private oAuthService: OAuthService, private http: HttpClient, private notifier: NotifierService, private seasonService: SeasonService, private playerService: PlayerService) {
    translateService.setDefaultLang(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en');
  }

  languages = [
    { 'languageCode': 'en', 'languageName': 'English' },
    { 'languageCode': 'pl', 'languageName': 'Polski' },
  ]

  ngOnInit(): void {
    // this.getDiscordUsers();
    // this.getPlayersData();
    const seasonInfo = this.seasonService.getSeason();
    this.season = seasonInfo.season;
    this.dateRange = seasonInfo.dateRange;
   
    // this.translateService.setDefaultLang('en');

    // this.lang.valueChanges.subscribe((lang) => {
    //   this.translateService.use(lang);
    // });

    // this.translateService.onLangChange.subscribe((lang) => {
    //   alert(lang);
    // })
    const overlay = document.getElementById("overlay");

    setTimeout(function () {
      overlay?.classList.add("hidden");
      setTimeout(function () {
        overlay?.classList.remove("hidden");
        overlay?.classList.add("flash");
        setTimeout(function () {
          if(overlay){
            overlay.style.display = "none";
          }
        }, 2000); // Wait for the flash animation to finish
      }, 100);
    }, 5000);

    this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
      map((response: any) => {
        this.s5_wars = response.values[1][2];
        this.s6_wars = response.values[1][3];
        this.s7_wars = response.values[1][4];
        this.s8_wars = response.values[1][5];
        this.total_wars = response.values[1][1];
        this.num_Players = response.values[1][0];

        return response.values;
      })
    );

    // this.players$ = this.playersApiService.getPlayers('Players').pipe(
    //   map((response: any) => {       
    //     return response.values;
    //   })
    // )
   
    const startDate = new Date('2024-07-01');
    const endDate = new Date('2024-09-30');
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const currentDate = new Date();
    const daysLeft = Math.floor((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    this.progressValue = ((totalDays - daysLeft) / totalDays) * 100;
    this.tooltipText = `There are ${daysLeft} days left until the end of the season.`;
  }

  logoutTest() {
    this.oAuthService.logOut();
    this.router.navigate(['/']);
  }

  languageChange($event) {
    // debugger;
    this.currentLanguage = $event;
    this.translateService.use(this.currentLanguage);
    localStorage.setItem('lang', this.currentLanguage);
  }

  public toggleMenu(){
    // document.getElementById('nav').classList.toggle('block_class');
    this.isMenuOpen = !this.isMenuOpen;
  }

  public closeMenu() {
    this.isMenuOpen = false;
  }

  get isAdmin(){
    let is_admin = localStorage.getItem('is_admin');
    if(is_admin === 'on'){
      return true;
    }else{
      return false;
    }
  }

  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    this.router.navigate(['/']);
    return true;
  }

  // getDiscordUsers() {
  //   this.http.get<VoiceMember[]>(`${environment.externalApiUrl}voice-members`).subscribe(
  //     (members) => {
  //       this.userCount = members.length; // Aktualizacja liczby użytkowników
  //       this.players = members; // Przechowywanie listy graczy
  //       console.log('this.players', this.players)
  //       this.playerService.loadPlayers().subscribe(() => {
  //         const playerDetails = this.playerService.addPlayerLink('illusion');
  //         console.log('Player Details:', playerDetails); // Should show player details
  //       });
  //       if (this.userCount === 0) {
  //         this.notifier.notify('warning', 'WANT TO PLAY is empty.');
  //       } else {
  //         this.notifier.notify('success', `${this.userCount} users are currently in the WANT TO PLAY channel.`);
  //       }
  //     },
  //     (err) => {
  //       this.notifier.notify('error', 'Import Players from Discord failed.');
  //     }
  //   );
  // }
  // getDiscordUsers() {
  //   this.http.get<VoiceMember[]>(`${environment.externalApiUrl}voice-members`).subscribe(
  //     (members) => {
  //       this.userCount = members.length; // Update user count
  //       console.log('Discord Members:', members); // Log Discord members
        
  //       // Store the list of players
  //       this.players = members; 
  //       console.log('this.players', this.players);
  
  //       // Load players from your service
  //       this.playerService.loadPlayers().subscribe(() => {
  //         // Get all players matching the Discord members
  //         const matchedPlayers = this.getMatchedPlayers(members);
  //         console.log('Matched Players:', matchedPlayers); // Log matched players
          
  //         if (matchedPlayers.length === 0) {
  //           this.notifier.notify('warning', 'No matching players found.');
  //         } else {
  //           const playerDetails = matchedPlayers.map(player => 
  //             `Player Name: ${player.playername}, `
  //           ); 
  
  //           this.notifier.notify('success', `Current users in the WANT TO PLAY channel: ${playerDetails}`);
  //         }
  //       });
        
  //       if (this.userCount === 0) {
  //         this.notifier.notify('warning', 'WANT TO PLAY is empty.');
  //       }
  //     },
  //     (err) => {
  //       this.notifier.notify('error', 'Import Players from Discord failed.');
  //     }
  //   );
  // }
  
  // Helper method to find matched players
  private getMatchedPlayers(members: VoiceMember[]): any[] {
    return members.reduce((acc: any[], member: VoiceMember) => {
      const foundPlayer = this.playerService.addPlayerLink(member.nickname || member.username);
      if (foundPlayer) {
        acc.push(foundPlayer); // Add matched player to the accumulator
      }
      return acc;
    }, []);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  // getPlayersData() {
  //   this.playersApiService.getPlayers('Players').pipe(
  //     map((response: any) => {       
  //       return response.values.map((item: any[]) => ({
  //         index0: item[0], // Wartość z indeksu 0
  //         index1: item[1],
  //         index6: item[6]  // Wartość z indeksu 6
  //       }));
  //     })
  //   ).subscribe((data) => {
  //     this.playersData = data; // Przechowywanie przetworzonych danych
  //     // console.log('DATA', data)
  //     this.updatePlayersWithData();
  //   });
  // }

  updatePlayersWithData() {
    this.players.forEach(player => {
      console.log('player', player)
      const matchingData = this.playersData.find(data => data.index1 === player.nickname || player.username);
      console.log('matchingData', matchingData)
      if (matchingData) {
        player.additionalInfo0 = matchingData.index0; // Wartość z indeksu 0
        player.additionalInfo1 = matchingData.index1; // Wartość z indeksu 1
        player.additionalInfo6 = matchingData.index6; // Wartość z indeksu 6
      }
    });
  }
}
