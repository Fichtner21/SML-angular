import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InactiveObjService } from './inactive-obj.service';
import { InactivePlayers } from './inactive.model';
import { combineLatest, Observable } from 'rxjs';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';
import { map, tap } from 'rxjs/operators';
import { SortByOrderPipe } from '../sort-by-order.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-inactive-obj',
  templateUrl: './inactive-obj.component.html',
  styleUrls: ['./inactive-obj.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SortByOrderPipe]
})
export class InactiveObjComponent implements OnInit {
  public spinkit = Spinkit;
  // players$: Observable<InactivePlayers[]>;
  // public playersInactive$: Observable<any>;
  // public historyMatchesIn$: Observable<any>;
  // public listInactive$: Observable<InactivePlayers[]>;
  // public ngForPlayers:any;
  booleanVar = false;
  booleanVarRank = false;
  booleanVarFpW = false; 
  booleanVarLast = false;
  filterValue = ''; // Domyślna wartość filtra

  public playersTestIn$: Observable<any>;
  public historyMatchesIn$: Observable<any>;
  public lastWarOfPlayerIn$: any;  

  infos = [     
    { 'infoCode': 'less', 'infoName': 'Less' },  
    { 'infoCode': 'more', 'infoName': 'More' },      
  ];

  currentInfo: any = localStorage.getItem('info2') ? localStorage.getItem('info2') : 'more';  
  infoCode = localStorage.getItem('info2') ? localStorage.getItem('info2') : 'more';

  constructor(private playersApiService: PlayersApiService, public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute){}

  // constructor(private inactiveObjService: InactiveObjService, private playersApiService: PlayersApiService, private sortbyorder: SortByOrderPipe, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.playersTestIn$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }        
        return players;
      }),
    ); 

    this.historyMatchesIn$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {        
        let batchRowValuesHistory = response.values;
        let historyMatchesIn: any[] = [];
        for(let i = 1; i < batchRowValuesHistory.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValuesHistory[i].length; j++){
            rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
          }
          historyMatchesIn.push(rowObject);
        }        
        return historyMatchesIn;
      }),
    );

    this.lastWarOfPlayerIn$ = combineLatest([this.playersTestIn$, this.historyMatchesIn$]).pipe(
      map(([v1, v2]) => {
        
        let lastWarDateInactive: any;
        let playerRowArrayInactive: any[] = [];
        for( let name of v1){ 
          
          if(name.active == 'TRUE'){
            continue;
          } else {
            lastWarDateInactive = {
              // lastWarDate:this.findPlayerLastWar(name.username, v2),
              username:name.username,
              playername:name.playername,
              cup:this.addTitleCup(name.cup1on1edition1),
              ranking:parseFloat(name.ranking.replace(/,/g,'')),
              // ranking: name.ranking,
              wars:name.warcount,
              flag:name.nationality,          
              // strike: this.smallStrike2(name.username, v2),
              strike: name.lastwarpc,
              // fragsperwar: (fragsToDisplay / name.warcount).toFixed(2) != 'NaN' ? (fragsToDisplay / name.warcount).toFixed(2) : '0',
              // maxfragsperwar: Math.max(...fragsPerPlayerArray) ? Math.max(...fragsPerPlayerArray) : '0',
              // minfragsperwar: Math.min(...fragsPerPlayerArray) ? Math.min(...fragsPerPlayerArray) : '0',
              maxfragsperwar: name.fpwmax,
              minfragsperwar: name.fpwmin,
              s1wars: name.s1wars,
              s2wars: name.s2wars,
              // activity: this.searchPlayerActivity(name.username, v2), 
              activity: name.last30days, 
              // lastyear: this.pastYearActivity(name.username, v2),
              lastyear: name.last365days,
              meeting: name.meeting,
              lastWarDate: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
              fragsperwar: name.fpw,
              active: name.active == 'FALSE' ? false : true,
              ban: name.ban == 'TRUE' ? true : false,
              ban_expiriess: new Date( name.ban_expiriess).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' })          
            };

            playerRowArrayInactive.push(lastWarDateInactive);             
          }                
        }     
        // console.log('playerRowArray', playerRowArrayInactive)
        playerRowArrayInactive.forEach((el) => {
          // console.log('EL: ', el.lastWarDate, ' TYP: ', typeof el.lastWarDate)
        })
        return playerRowArrayInactive;         
      })
    );

    // if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'DESC'){        
    //   this.sortByWarsDesc(this.lastWarOfPlayerIn$);        
    // } else if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'ASC'){
    //   this.sortByWarsAsc(this.lastWarOfPlayerIn$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'DESC'){
    //   this.sortByRankingDesc(this.lastWarOfPlayerIn$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'ASC'){
    //   this.sortByRankingAsc(this.lastWarOfPlayerIn$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'DESC'){
    //   this.sortByFpWDesc(this.lastWarOfPlayerIn$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'ASC'){
    //   this.sortByFpWAsc(this.lastWarOfPlayerIn$);
    // } else {
    //   this.router.navigate(['/obj-inactive'], { queryParams: {  } });
    // }

    // ------------------------------

    // this.players$ = this.inactiveObjService.fetchInactivePlayers();

    // this.playersInactive$ = this.playersApiService.getPlayers('Inactive').pipe(
    //   map((response: any) => {        
    //     let batchRowValues = response.values;
    //     let players: any[] = [];
    //     for(let i = 1; i < batchRowValues.length; i++){
    //       const rowObject: object = {};
    //       for(let j = 0; j < batchRowValues[i].length; j++){
    //         rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //       }
    //       players.push(rowObject);
    //     }
        
    //     return players;
    //   }),
    // );       

    // this.historyMatchesIn$ = this.playersApiService.getPlayers('Match+History').pipe(
    //   map((response: any) => {        
    //     let batchRowValuesHistory = response.values;
    //     let historyMatchesIn: any[] = [];
    //     for(let i = 1; i < batchRowValuesHistory.length; i++){
    //       const rowObject: object = {};
    //       for(let j = 0; j < batchRowValuesHistory[i].length; j++){
    //         rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
    //       }
    //       historyMatchesIn.push(rowObject);
    //     }        
    //     return historyMatchesIn;
    //   }),
    // );

    // this.listInactive$ = combineLatest([this.playersInactive$, this.historyMatchesIn$]).pipe(
    //   map(([inactive, matches]) => {
    //     let playerInactiveRow;
    //     let playerInactiveRowArray: any[] = [];
        
    //     for(let name of inactive){
    //       const foundPlayerArray = this.filterUsername(name.username, matches);
         
    //       //Frags
    //       const fragsPerPlayerArray:any[] = [];

    //       foundPlayerArray.forEach((el) => {            
    //         const destructObjPlayers1 = Object.values(el);
    //         destructObjPlayers1.forEach((item:any[], i) => {
    //           if(item.includes(name.username) ){
    //             fragsPerPlayerArray.push(Number(destructObjPlayers1[i + 2]));
    //           }
    //         })
    //       }) 

    //       // let fragsToDisplay:any;
    //       // if (Array.isArray(fragsPerPlayerArray) && fragsPerPlayerArray.length) {
    //       //   fragsToDisplay = fragsPerPlayerArray.reduce((a, b) => a + b);
    //       // } else {
    //       //   fragsToDisplay = 0;
    //       // }  

    //       playerInactiveRow = {
    //         username: name.username,
    //         playername: name.playername,
    //         ranking: parseFloat(name.ranking.replace(/,/g,'')),            
    //         wars: name.warcount,
    //         flag: name.nationality,
    //         // fragsperwar: (fragsToDisplay / name.warcount).toFixed(2),
    //         fragsperwar: name.fpw,
    //         // lastwar: this.findPlayerLastWar(name.username, matches)
    //         lastwar: new Date(name.lastwar).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
    //       };
        
    //       playerInactiveRowArray.push(playerInactiveRow);
    //     }        
    //     return playerInactiveRowArray;
    //   })
    // );      
       
    // if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'DESC'){        
    //   this.sortByWarsDesc(this.listInactive$);        
    // } else if(this.activatedRoute.snapshot.queryParams['sortByWars'] == 'ASC'){
    //   this.sortByWarsAsc(this.listInactive$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'DESC'){
    //   this.sortByRankingDesc(this.listInactive$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByRanking'] == 'ASC'){
    //   this.sortByRankingAsc(this.listInactive$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'DESC'){
    //   this.sortByFpWDesc(this.listInactive$);
    // } else if(this.activatedRoute.snapshot.queryParams['sortByFpW'] == 'ASC'){
    //   this.sortByFpWAsc(this.listInactive$);
    // } else {
    //   this.router.navigate(['/obj-inactive'], { queryParams: {  } });
    // }
  }

  // public sortByWarsDesc(res:Observable<any>){      
  //   this.booleanVar = !this.booleanVar;
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByWars: 'DESC' } });   
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => Number(b.wars) - Number(a.wars))
  //     )
  //   )       
  // }

  // public sortByWarsAsc(res:Observable<any>){  
  //   this.booleanVar = !this.booleanVar; 
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByWars: 'ASC' } }); 
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => Number(a.wars) - Number(b.wars))
  //     )
  //   )       
  // }

  // public sortByRankingDesc(res:Observable<any>){ 
  //   this.booleanVarRank = !this.booleanVarRank;    
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'DESC' } }); 
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
  //     )
  //   )       
  // }

  // public sortByRankingAsc(res:Observable<any>){   
  //   this.booleanVarRank = !this.booleanVarRank;   
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'ASC' } });   
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
  //     )
  //   )       
  // }

  // public sortByFpWDesc(res:Observable<any>){ 
  //   this.booleanVarFpW = !this.booleanVarFpW; 
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'DESC' } });    
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
  //     )
  //   )       
  // }

  // public sortByFpWAsc(res:Observable<any>){ 
  //   this.booleanVarFpW = !this.booleanVarFpW;  
  //   this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'ASC' } });    
  //   return this.listInactive$ = res.pipe(
  //     map(
  //       res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
  //     )
  //   )       
  // }

  private filterUsername(name:string, matches:any[]){
    return matches.filter(m => {             
      return Object.values(m).includes(name);
     })
  } 

  public findPlayerLastWar(name:string, obj:object) {    
    const findeLastWar:any = Object.values(obj)
      .filter((item) => JSON.stringify(item).includes(name))
      .pop();
    // const findeLastWar = obj.filter((item) => JSON.stringify(item).includes(name)).pop();
    let findLastTimeStamp = '';
    let newTimestampElem = '';
    if (findeLastWar) {
      findLastTimeStamp = findeLastWar.timestamp;
      newTimestampElem = new Date(findLastTimeStamp).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else if (findeLastWar === 'undefined') {
      findLastTimeStamp = 'No match';
    } else if (findeLastWar === null) {
      findLastTimeStamp = 'No match';
    } else {
      findLastTimeStamp = 'No match';
    }
    return newTimestampElem;
  } 

  public addTitleCup(int:string) {
    let cupInfoTitle = '';
    switch (int) {
      case '1': {
        cupInfoTitle = `Winner in 1on1 CUP 1st Edition`;
        break;
      }
      case '2': {
        cupInfoTitle = `2nd place in 1on1 CUP 1st Edition`;
        break;
      }
      case '3': {
        cupInfoTitle = `3rd place in 1on1 CUP 1st Edition`;
        break;
      }
      default:
    }
    return cupInfoTitle;
  }

  infoChange($event){
    this.currentInfo = $event;
    localStorage.setItem('info2', this.currentInfo);
  }

  get isInfo(){
    let is_info = localStorage.getItem('info2');
    if(is_info === 'more'){
      return true;
    }else{
      return false;
    }
  }

  //SORTING
  public sortByWarsDesc(res:Observable<any>){      
    this.booleanVar = !this.booleanVar;   
    this.router.navigate(['/obj-inactive'], { queryParams: {sortByWars: 'DESC' }}); 
    // console.log('this.booleanVar', this.booleanVar);
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(b.wars) - Number(a.wars))
      )
    )       
  }

  public sortByWarsAsc(res:Observable<any>){  
    this.booleanVar = !this.booleanVar;   
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByWars: 'ASC' } }); 
    // console.log('this.booleanVar', this.booleanVar); 
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => Number(a.wars) - Number(b.wars))
      )
    )       
  }

  public sortByRankingDesc(res:Observable<any>){ 
    this.booleanVarRank = !this.booleanVarRank;  
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'DESC' } });    
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.ranking) - parseFloat(a.ranking))
      )
    )       
  }

  public sortByRankingAsc(res:Observable<any>){   
    this.booleanVarRank = !this.booleanVarRank;  
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByRanking: 'ASC' } });     
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.ranking) - parseFloat(b.ranking))
      )
    )       
  }

  public sortByFpWDesc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;    
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'DESC' } }); 
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(b.fragsperwar) - parseFloat(a.fragsperwar))
      )
    )       
  }

  public sortByFpWAsc(res:Observable<any>){ 
    this.booleanVarFpW = !this.booleanVarFpW;     
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByFpW: 'ASC' } }); 
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(
        res => res.sort((a:any,b:any) => parseFloat(a.fragsperwar) - parseFloat(b.fragsperwar))
      )
    )       
  }

  sortByLastWarDateAsc(res: Observable<any>) {
    this.booleanVarLast = !this.booleanVarLast;
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByLastWarDate: 'ASC' } });
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(players => {
        return players.sort((a: any, b: any) => {
          const dateA = this.convertToDate(a.lastWarDate);
          const dateB = this.convertToDate(b.lastWarDate);
          return dateA.getTime() - dateB.getTime();
        });
      })
    );
  }

  sortByLastWarDateDesc(res: Observable<any>) {
    this.booleanVarLast = !this.booleanVarLast;
    this.router.navigate(['/obj-inactive'], { queryParams: { sortByLastWarDate: 'DESC' } });
    return this.lastWarOfPlayerIn$ = res.pipe(
      map(players => {
        return players.sort((a: any, b: any) => {
          const dateA = this.convertToDate(a.lastWarDate);
          const dateB = this.convertToDate(b.lastWarDate);
          return dateB.getTime() - dateA.getTime();
        });
      })
    );
  }
  
  convertToDate(dateString: string): Date {
    const parts = dateString.split(',');
    if (parts.length === 2) {
      const datePart = parts[0].trim();
      const timePart = parts[1].trim();
      const dateParts = datePart.split('.');
      const timeParts = timePart.split(':');
      if (dateParts.length === 3 && timeParts.length === 2) {
        const [day, month, year] = dateParts.map(Number);
        const [hours, minutes] = timeParts.map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hours) && !isNaN(minutes)) {
          return new Date(year, month - 1, day, hours, minutes);
        }
      }
    }
    // Obsługuje nieprawidłowe lub puste dane, zwracając pustą datę.
    return new Date(0);
  }

  getProgressBarColors(lastWarDate: string): { backgroundColor: string; color: string } {
    const currentDate = new Date();
    const lastWarDateObject = this.parseDate(lastWarDate);
    const differenceInDays = this.calculateDifferenceInDays(currentDate, lastWarDateObject);
    let backgroundColor = '';
    let fontColor = '';
  
    if (differenceInDays >= 31 && differenceInDays <= 60) {
      backgroundColor = '#f0f0f0'; /* Jasnoszary */
      fontColor = 'black'; // Czarny kontrastowy kolor czcionki
    } else if (differenceInDays >= 61 && differenceInDays <= 150) {
      backgroundColor = '#ccc'; /* Średni szary */
      fontColor = 'black'; // Czarny kontrastowy kolor czcionki
    } else if (differenceInDays >= 151 && differenceInDays <= 365) {
      backgroundColor = '#999'; /* Ciemnoszary */
      fontColor = 'white'; // Biały kontrastowy kolor czcionki
    } else if (differenceInDays >= 366 && differenceInDays <= 730) {
      backgroundColor = '#666'; /* Bardzo ciemny szary */
      fontColor = 'white'; // Biały kontrastowy kolor czcionki
    } else if (differenceInDays >= 731 && differenceInDays <= 1095) {
      backgroundColor = '#333'; /* Najciemniejszy szary */
      fontColor = 'white'; // Biały kontrastowy kolor czcionki
    } else if (differenceInDays > 1096) {
      backgroundColor = 'red'; /* Kolor czerwony */
      fontColor = 'white'; // Biały kontrastowy kolor czcionki
    }
  
    return { backgroundColor, color: fontColor };
  }
  
  
  // getProgressBarWidth(lastWarDate: string): string {
  //   const currentDate = new Date();
  //   const lastWarDateObject = this.parseDate(lastWarDate);
  //   const differenceInDays = this.calculateDifferenceInDays(currentDate, lastWarDateObject);
  
  //   const percentage = (differenceInDays / 1096) * 100; // Maksymalna liczba dni to 1096
  //   return percentage + '%';
  // }
  
  getProgressBarWidth(lastWarDate: Date): string {
    return '100%';
  }

  // getProgressBarText(lastWarDate: string): string {
  //   const currentDate = new Date();
  //   const lastWarDateObject = this.parseDate(lastWarDate);
  //   const differenceInDays = this.calculateDifferenceInDays(currentDate, lastWarDateObject);
  
  //   const years = Math.floor(differenceInDays / 365);
  //   const months = Math.floor((differenceInDays % 365) / 30); // Założenie, że miesiąc ma 30 dni
  
  //   if (years > 0 && months > 0) {
  //     return `${years} ${years === 1 ? 'rok' : 'lata'} i ${months} ${months === 1 ? 'miesiąc' : 'miesiące'}`;
  //   } else if (years > 0) {
  //     return `${years} ${years === 1 ? 'rok' : 'lata'}`;
  //   } else if (months > 0) {
  //     return `${months} ${months === 1 ? 'miesiąc' : 'miesiące'}`;
  //   } else {
  //     return 'Mniej niż miesiąc';
  //   }
  // }
  
  getProgressBarText(lastWarDate: string): string {
    const currentDate = new Date();
    const lastWarDateObject = this.parseDate(lastWarDate);
    const differenceInDays = this.calculateDifferenceInDays(currentDate, lastWarDateObject);
  
    const years = Math.floor(differenceInDays / 365);
    const months = Math.floor((differenceInDays % 365) / 30); // Założenie, że miesiąc ma 30 dni
    const days = differenceInDays % 30; // Oblicz ilość pozostałych dni
  
    let text = '';
  
    if (years > 0) {
      text += `${years} ${years === 1 ? 'y.' : 'yrs.'}`;
    }
  
    if (months > 0) {
      if (text !== '') {
        text += ' & ';
      }
      text += `${months} ${months === 1 ? 'month' : 'ms.'}`;
    }
  
    if (days > 0) {
      if (text !== '') {
        text += ' & ';
      }
      text += `${days} ${days === 1 ? 'd.' : 'days'}`;
    }
  
    if (text === '') {
      text = 'less then day';
    }
  
    return text;
  }
  

  parseDate(dateString: string): Date {
    // Sprawdzenie różnych możliwych formatów daty
    const dateMatch = dateString.match(/(\d{1,2})\.(\d{1,2})\.(\d{4}),\s?(\d{1,2}):(\d{1,2})/);
  
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1; // Miesiące w JavaScript są indeksowane od 0
      const year = parseInt(dateMatch[3], 10);
      const hours = parseInt(dateMatch[4], 10);
      const minutes = parseInt(dateMatch[5], 10);
  
      return new Date(year, month, day, hours, minutes);
    } else {
      // Jeśli nie można sparsować daty, zwróć pustą datę lub rzucenie błędu
      // Tutaj można dostosować zachowanie w przypadku błędnego formatu daty
      throw new Error("Nieprawidłowy format daty: " + dateString);
    }
  }
  
  calculateDifferenceInDays(date1: Date, date2: Date): number {
    const timeDifference = date1.getTime() - date2.getTime();
    return Math.floor(timeDifference / (1000 * 3600 * 24)); // Obliczanie dni
  }  
  
  // Metoda do filtrowania graczy
  applyFilter() {
    // Przekształć wartość filtra na małe litery
    const filterValueLowerCase = this.filterValue.toLowerCase();
  
    // Filtrowanie graczy na podstawie różnych pól
    this.lastWarOfPlayerIn$ = this.lastWarOfPlayerIn$.pipe(
      map((players: any[]) =>
        players.filter((player: any) => {
          return (
            player.username.toLowerCase().includes(filterValueLowerCase) ||
            player.playername.toLowerCase().includes(filterValueLowerCase) ||
            player.nationality.toLowerCase().includes(filterValueLowerCase)
          );
        })
      )
    );
  }
}
