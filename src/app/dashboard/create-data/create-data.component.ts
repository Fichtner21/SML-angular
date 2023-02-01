import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Country } from 'src/app/models/country.model';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { environment } from 'src/environments/environment';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}


@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.scss']
})
export class CreateDataComponent implements OnInit {
  googleSheetForm: FormGroup;
  slugUsername: BehaviorSubject<any>;
  userWarcount: BehaviorSubject<any>;

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
    ],
  };

  public countPlayers:any = [];
  countries: Country[] = [
    { value: 'PL', viewValue: 'Poland' },
    { value: 'EG', viewValue: 'Egypt' },
    { value: 'EU', viewValue: 'European Union' },
    { value: 'DE', viewValue: 'Germany' },
    { value: 'NL', viewValue: 'Netherlands' },
    { value: 'ES', viewValue: 'Estonia' },
    { value: 'BE', viewValue: 'Belgium' },
    { value: 'RO', viewValue: 'Romania' },
    { value: 'FR', viewValue: 'France' },
    { value: 'UK', viewValue: 'United Kingdom' },
    { value: 'GR', viewValue: 'Greece' },
    { value: 'PT', viewValue: 'Portugal' },
    { value: 'FI', viewValue: 'Finland' },
    { value: 'SE', viewValue: 'Sweden' },
    { value: 'XX', viewValue: 'Unknown' },
  ]

  constructor(private playersApiService: PlayersApiService, private formBuilder: FormBuilder, private router: Router) { 
    this.googleSheetForm = this.formBuilder.group({
      playername: formBuilder.control('', [Validators.minLength(3), Validators.maxLength(16)]),
      username: formBuilder.control(''),
      ranking: formBuilder.control('1000'),
      percentile: formBuilder.control(''),
      place: formBuilder.control(''),
      warcount: formBuilder.control(''),
      nationality: formBuilder.control(''),
      clanhistory: formBuilder.control('-'),
      cup1on1edition1: formBuilder.control('-'),
      meeting: formBuilder.control(''),
      cup3on3: formBuilder.control(''),
      active: formBuilder.control(false),
      ban: formBuilder.control(false),
      lastwar: formBuilder.control(''),
      fpw: formBuilder.control(''),
      fpwmax: formBuilder.control(''),
      fpwmin: formBuilder.control(''),
      last30days: formBuilder.control(''),
      last365days: formBuilder.control(''),
      lastwarpc: formBuilder.control(''),
      s1wars: formBuilder.control(''),
      s1fpw: formBuilder.control(''),
      streak: formBuilder.control('')
    })
  }

  ngOnInit(): void {
    this.listPlayersComponent();
   
    setTimeout(() => {
      this.googleSheetForm.patchValue({ name: "abc xyz" });
    }, 2000);

    this.googleSheetForm.get("playername").valueChanges.subscribe(val => {
      this.googleSheetForm.patchValue({ username: val });      
    });    

    this.googleSheetForm.get("username").valueChanges.subscribe(val => {
      this.googleSheetForm.patchValue({warcount: `=LICZ.JEŻELI('Match History'!A:BK, B${this.countPlayers})`});
      this.googleSheetForm.patchValue({active: `=ORAZ($N${this.countPlayers}>=DZIŚ()-30)`});
      this.googleSheetForm.patchValue({percentile: `=ROZKŁAD.NORMALNY(C${this.countPlayers},1000,ODCH.STANDARDOWE(Players!$C$2:$C$150)+0.00001,PRAWDA)`});      
      this.googleSheetForm.patchValue({ lastwarpc: 
        `=JEŻELI(F${this.countPlayers}=0,0,INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${this.countPlayers},'Match History'!A:A,0),PODAJ.POZYCJĘ(B${this.countPlayers},INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${this.countPlayers},'Match History'!A:A,0),0),0)+3)-INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${this.countPlayers},'Match History'!A:A,0),PODAJ.POZYCJĘ(B${this.countPlayers},INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${this.countPlayers},'Match History'!A:A,0),0),0)+1))`
      })
      this.googleSheetForm.patchValue({ last365days:
        `=LICZ.WARUNKI('Match History'!B:B,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!F:F,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!J:J,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!N:N,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!R:R,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!V:V,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!Z:Z,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AD:AD,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AH:AH,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AL:AL,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AV:AV,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AZ:AZ,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!BD:BD,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!BH:BH,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-365)`
      })
      this.googleSheetForm.patchValue({ last30days:
        `=LICZ.WARUNKI('Match History'!B:B,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!F:F,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!J:J,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!N:N,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!R:R,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!V:V,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!Z:Z,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AD:AD,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AH:AH,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AL:AL,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AV:AV,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AZ:AZ,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!BD:BD,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!BH:BH,B${this.countPlayers},'Match History'!A:A,">="&DZIŚ()-30)`
      })
      this.googleSheetForm.patchValue({ fpwmin:
        `=JEŻELI(F${this.countPlayers}=0,0,ArrayFormula(MIN(MIN(JEŻELI('Match History'!B:B=B${this.countPlayers},'Match History'!D:D,999)),MIN(JEŻELI('Match History'!F:F=B${this.countPlayers},'Match History'!H:H,999)),MIN(JEŻELI('Match History'!J:J=B${this.countPlayers},'Match History'!L:L,999)),MIN(JEŻELI('Match History'!N:N=B${this.countPlayers},'Match History'!P:P,999)),MIN(JEŻELI('Match History'!R:R=B${this.countPlayers},'Match History'!T:T,999)),MIN(JEŻELI('Match History'!V:V=B${this.countPlayers},'Match History'!X:X,999)),MIN(JEŻELI('Match History'!Z:Z=B${this.countPlayers},'Match History'!AB:AB,999)),MIN(JEŻELI('Match History'!AD:AD=B${this.countPlayers},'Match History'!AF:AF,999)),MIN(JEŻELI('Match History'!AH:AH=B${this.countPlayers},'Match History'!AJ:AJ,999)),MIN(JEŻELI('Match History'!AL:AL=B${this.countPlayers},'Match History'!AN:AN,999)),MIN(JEŻELI('Match History'!AV:AV=B${this.countPlayers},'Match History'!AX:AX,999)),MIN(JEŻELI('Match History'!AZ:AZ=B${this.countPlayers},'Match History'!BB:BB,999)),MIN(JEŻELI('Match History'!BD:BD=B${this.countPlayers},'Match History'!BF:BF,999)),MIN(JEŻELI('Match History'!BH:BH=B${this.countPlayers},'Match History'!BJ:BJ,999)))))`
      });
      this.googleSheetForm.patchValue({ fpwmax:
        `=ArrayFormula(MAX(MAX(JEŻELI('Match History'!B:B=B${this.countPlayers},'Match History'!D:D,)),MAX(JEŻELI('Match History'!F:F=B${this.countPlayers},'Match History'!H:H,)),MAX(JEŻELI('Match History'!J:J=B${this.countPlayers},'Match History'!L:L,)),MAX(JEŻELI('Match History'!N:N=B${this.countPlayers},'Match History'!P:P,)),MAX(JEŻELI('Match History'!R:R=B${this.countPlayers},'Match History'!T:T,)),MAX(JEŻELI('Match History'!V:V=B${this.countPlayers},'Match History'!X:X,)),MAX(JEŻELI('Match History'!Z:Z=B${this.countPlayers},'Match History'!AB:AB,)),MAX(JEŻELI('Match History'!AD:AD=B${this.countPlayers},'Match History'!AF:AF,)),MAX(JEŻELI('Match History'!AH:AH=B${this.countPlayers},'Match History'!AJ:AJ,)),MAX(JEŻELI('Match History'!AL:AL=B${this.countPlayers},'Match History'!AN:AN,)),MAX(JEŻELI('Match History'!AV:AV=B${this.countPlayers},'Match History'!AX:AX,)),MAX(JEŻELI('Match History'!AZ:AZ=B${this.countPlayers},'Match History'!BB:BB,)),MAX(JEŻELI('Match History'!BD:BD=B${this.countPlayers},'Match History'!BF:BF,)),MAX(JEŻELI('Match History'!BH:BH=B${this.countPlayers},'Match History'!BJ:BJ,))))`
      })
      this.googleSheetForm.patchValue({fpw:
      `=(SUMA.JEŻELI('Match History'!B:B,B${this.countPlayers},'Match History'!D:D)+SUMA.JEŻELI('Match History'!F:F,B${this.countPlayers},'Match History'!H:H)+SUMA.JEŻELI('Match History'!J:J,B${this.countPlayers},'Match History'!L:L)+SUMA.JEŻELI('Match History'!N:N,B${this.countPlayers},'Match History'!P:P)+SUMA.JEŻELI('Match History'!R:R,B${this.countPlayers},'Match History'!T:T)+SUMA.JEŻELI('Match History'!V:V,B${this.countPlayers},'Match History'!X:X)+SUMA.JEŻELI('Match History'!Z:Z,B${this.countPlayers},'Match History'!AB:AB)+SUMA.JEŻELI('Match History'!AD:AD,B${this.countPlayers},'Match History'!AF:AF)+SUMA.JEŻELI('Match History'!AH:AH,B${this.countPlayers},'Match History'!AJ:AJ)+SUMA.JEŻELI('Match History'!AL:AL,B${this.countPlayers},'Match History'!AN:AN)+SUMA.JEŻELI('Match History'!AV:AV,B${this.countPlayers},'Match History'!AX:AX)+SUMA.JEŻELI('Match History'!AZ:AZ,B${this.countPlayers},'Match History'!BB:BB)+SUMA.JEŻELI('Match History'!BD:BD,B${this.countPlayers},'Match History'!BF:BF)+SUMA.JEŻELI('Match History'!BH:BH,B${this.countPlayers},'Match History'!BJ:BJ))/JEŻELI(F${this.countPlayers}=0,1,F${this.countPlayers})`
      });
      this.googleSheetForm.patchValue({s1wars: 
        `=LICZ.WARUNKI('Match History'!B:B,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1), 'Match History'!B:B,B${this.countPlayers},'Match History'!A:A,"<="&DATA(2023,3,31))+LICZ.WARUNKI('Match History'!F:F,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!J:J,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!N:N,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!R:R,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!V:V,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!Z:Z,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AD:AD,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AH:AH,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AL:AL,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AV:AV,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AZ:AZ,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!BD:BD,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!BH:BH,B${this.countPlayers},'Match History'!A:A,">="&DATA(2023,1,1))`
      });
      // this.googleSheetForm.patchValue({
      //   lastwar:
      //  `=INDEKS('Match History'!A:A,ArrayFormula(MAX(MAX(('Match History'!B:B=B${this.countPlayers})*(WIERSZ('Match History'!B:B))),MAX(('Match History'!F:F=B${this.countPlayers})*(WIERSZ('Match History'!F:F))),MAX(('Match History'!J:J=B${this.countPlayers})*(WIERSZ('Match History'!J:J))),MAX(('Match History'!N:N=B${this.countPlayers})*(WIERSZ('Match History'!N:N))),MAX(('Match History'!R:R=B${this.countPlayers})*(WIERSZ('Match History'!R:R))),MAX(('Match History'!V:V=B${this.countPlayers})*(WIERSZ('Match History'!V:V))),MAX(('Match History'!Z:Z=B${this.countPlayers})*(WIERSZ('Match History'!Z:Z))),MAX(('Match History'!AD:AD=B${this.countPlayers})*(WIERSZ('Match History'!AD:AD))),MAX(('Match History'!AH:AH=B${this.countPlayers})*(WIERSZ('Match History'!AH:AH))),MAX(('Match History'!AL:AL=B${this.countPlayers})*(WIERSZ('Match History'!AL:AL))),MAX(('Match History'!AV:AV=B${this.countPlayers})*(WIERSZ('Match History'!AV:AV))),MAX(('Match History'!AZ:AZ=B${this.countPlayers})*(WIERSZ('Match History'!AZ:AZ))),MAX(('Match History'!BD:BD=B${this.countPlayers})*(WIERSZ('Match History'!BD:BD))),MAX(('Match History'!BH:BH=B${this.countPlayers})*(WIERSZ('Match History'!BH:BH))))),1)`
      // })
    });    

    this.googleSheetForm.controls['username'].disable(); 
  }

  get playername() {
    return this.googleSheetForm.get('playername');
  }

  onSubmit(){
    // console.log(this.googleSheetForm.value);
    // this.googleSheetForm.value.warcount = this.slugUsername;
    // console.log(this.googleSheetForm.getRawValue());
    // console.log('this.slugUsername', this.slugUsername);   
    const playername = this.googleSheetForm.value.playername;
    const username = this.googleSheetForm.getRawValue().username;
    const ranking = this.googleSheetForm.value.ranking;
    const percentile = this.googleSheetForm.value.percentile;
    const place = this.googleSheetForm.value.place;
    const warcount = this.googleSheetForm.getRawValue().warcount;
    const nationality = this.googleSheetForm.value.nationality;    
    const clanhistory = this.googleSheetForm.value.clanhistory;
    const cup1on1edition1 = this.googleSheetForm.value.cup1on1edition1;
    const meeting = this.googleSheetForm.value.meeting;
    const cup3on3 = this.googleSheetForm.value.cup3on3;
    const active = this.googleSheetForm.value.active;
    const ban = this.googleSheetForm.value.ban;
    const lastwar = this.googleSheetForm.value.lastwar;
    const fpw = this.googleSheetForm.value.fpw;
    const fpwmax = this.googleSheetForm.value.fpwmax;
    const fpwmin = this.googleSheetForm.value.fpwmin;
    const last30days = this.googleSheetForm.value.last30days;
    const last365days = this.googleSheetForm.value.last365days;
    const lastwarpc = this.googleSheetForm.value.lastwarpc;
    const s1wars= this.googleSheetForm.value.s1wars;
    const s1fpw = this.googleSheetForm.value.s1fpw;
    const streak = this.googleSheetForm.value.streak;

    console.log(
      {
        'playername': playername,
        'username': username,
        'ranking': ranking,
        'percentile': percentile,
        's1wars': s1wars,
        'lastwar': lastwar,
        'fpw': fpw,
        'fpwmax': fpwmax,
        'fpwmin': fpwmin,
        'last30days': last30days,
        'last365days': last365days,
        'nationality': nationality
      }
    )

    const params = {
      spreadsheetId: environment.SPREADSHEET_ID,
      range: 'Players',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS'
    }

    const valueRangeBody = {
      'majorDimension': 'ROWS',
      'values': [playername, username, percentile, ranking]
    }    

    // const spreadsheetId = environment.SPREADSHEET_ID;
    // const tableRange = 'Players';
    const updates =  {
      "values": [
        [playername, username, percentile, ranking]
      ]
    }
    
    this.playersApiService.createPlayer(environment.SPREADSHEET_ID, "USER_ENTERED", playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak).subscribe({      
      next: (res) => {
        console.log(res);
        if(res){
          this.router.navigate(['/obj-ranking'])
        }
      },
      error: (error) => {
        console.log('ERROR =>', error.message);        
      }
    })

    // this.playersApiService.createPlayer(playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak).subscribe({      
    //   next: (res) => {
    //     console.log(res);
    //     if(res){
    //       this.router.navigate(['/obj-ranking'])
    //     }
    //   },
    //   error: (error) => {
    //     console.log('ERROR =>', error.message);        
    //   }
    // })
  }

  listPlayersComponent() {
    this.playersApiService.getPlayers('Players').subscribe({
      next: (res:any[]) => {
        this.countPlayers = Number(res.values.length) + 1;  
        // console.log('this.countPlayers', this.countPlayers)   
      },
      error: (error) => {
        console.log(error);
      }
    })
    // this.playersApiService.listPlayers().subscribe({
    //   next: (res:any[]) => {
    //     this.countPlayers = res.length + 2;      
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // })
  }

  public slugify(str:any){
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
