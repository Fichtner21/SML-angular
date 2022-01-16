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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'SML-angular';
  players$: Observable<any>;
  matches$: Observable<any>;
  // public lang = new FormControl('en');
  currentLanguage: any = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';  
  languageCode = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';  

  constructor(private GoogleSheetsDbService: GoogleSheetsDbService, private playersApiService: PlayersApiService, private translateService: TranslateService) {
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

    this.players$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {  
        return response.values;       
      })
    )
    this.matches$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {  
        return response.values;       
      })
    )   
    
    // console.log('local =>', localStorage.getItem('lang'));
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
}
