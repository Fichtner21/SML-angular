import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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
   

    this.numOfPlayers$ = this.playersApiService.getPlayers('NumPlayers').pipe(
      map((response: any) => {   
        // console.log('response', response);       
        // console.log('response.values', response.values[0][1]);       
        return Number(response.values[0][2]);       
      })
    )

    this.players$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {         
        return response.values;       
      })
    )
    
    this.matches$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {  
        // console.log(response.values);
        const resValues = response.values;
        resValues.shift();
        const matchesDate = [];
        resValues.forEach((el:any) => {          
          matchesDate.push(new Date(el[0]).toISOString());
        });       
        
        return response.values;       
      })
    )     
    
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
    document.getElementById('nav').classList.toggle('block_class');    
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
