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

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private playersApiService: PlayersApiService, private translateService: TranslateService, public _authService: AuthService, private router: Router, private oAuthService: OAuthService) {
    translateService.setDefaultLang(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en');
  }

  languages = [
    { 'languageCode': 'en', 'languageName': 'English' },
    { 'languageCode': 'pl', 'languageName': 'Polski' },
  ]

  ngOnInit(): void {
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
        this.total_wars = response.values[1][1];
        this.num_Players = response.values[1][0];

        return response.values;
      })
    );


    this.players$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {
        return response.values;
      })
    )

    // this.matches$ = this.playersApiService.getPlayers('Match+History').pipe(
    //   map((response: any) => {
    //     // console.log(response.values);
    //     const resValues = response.values;
    //     resValues.shift();
    //     const matchesDate = [];
    //     const startDate = new Date('2024-01-01T00:00:00Z');
    //     const endDate = new Date('2024-03-31T23:59:59Z');

    //     resValues.forEach((el: any) => {
    //       const matchDate = new Date(el[0]).toISOString();
    //       matchesDate.push(matchDate);

    //       // Sprawdzamy, czy data meczu mieści się w zakresie
    //       const matchDateTime = new Date(matchDate).getTime();
    //       if (matchDateTime >= startDate.getTime() && matchDateTime <= endDate.getTime()) {
    //         this.numberOfMatches++;
    //       }
    //     });

    //     return response.values;
    //   })
    // );

    // this.playersApiService.getHistoryMatches().subscribe(matches => {
    //   this.matches$ = matches;
    //   console.log('matches', matches)
    // });

    // console.log('local =>', localStorage.getItem('lang'));
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
}
