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
  title = 'SH MIX';
  players$: Observable<any>;
  matches$: Observable<any>;
  matchesPerMonth$: Observable<any>;
  // public lang = new FormControl('en');
  currentLanguage: any = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';  
  languageCode = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  monthPlaying: any;  

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

    // var itemsGroupedByMonth = function (items) {
    //   var
    //       groups = [[], [], [], [], [], [], [], [], [], [], [], [],],
    //       itemGroupedByMonths = [];
  
    //   for (var i = 0; i < items.length; i++) {
    //     groups[items[i].date.getMonth()].push(items[i]);
    //   }
    //   for (var i = 0; i < groups.length; i++) {
    //     if (groups[i].length) {
    //       itemGroupedByMonths.push({
    //         month: monthLabels[i],
    //         items: groups[i]
    //       });
  
    //     }
    //   }
    //   return itemGroupedByMonths;
    // };
    this.matches$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {  
        // console.log(response.values);
        const resValues = response.values;
        resValues.shift();
        const matchesDate = [];
        resValues.forEach((el:any) => {
          matchesDate.push(new Date(Date.parse(el[0])));
          // console.log('EL =>', el[0]);
        });

        // console.log(matchesDate);
        const monthYearArr = [];
        matchesDate.forEach(el => {
          console.log(el.getMonth() + ': ' + el.getFullYear());
          let monthName = el.getMonth();
          switch (monthName){
            case 8: 
              monthName = 'September';
          }
         
          this.monthPlaying = el.getFullYear() + ': ' + monthName;         
        });

        for(let i = 0; i < matchesDate.length; i++){
          monthYearArr.push([matchesDate[i].getMonth()]);
        }
        
        // matchesDate.map((el) => {
        //   year: el.getFullYear();
        //   month: el.getMonth();
        // });

        // console.log('SUM of Matches:', matchesDate);
        console.log('monthYearArr:', monthYearArr);

        
        
        return response.values;       
      })
    )   
    this.matchesPerMonth$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {  
        
        const resValues = response.values;
        resValues.forEach((el:any) => {
          console.log('EL =>', el);
        })
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
