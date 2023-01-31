import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Country } from 'src/app/models/country.model';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { environment } from 'src/environments/environment';
import {ThemePalette} from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss']
})
export class EditDataComponent implements OnInit {
  updateSheetForm!: FormGroup;
  username: string;
  data: any;
  
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
    { value: 'CH', viewValue: 'Switzerland'},
    { value: 'SK', viewValue: 'Slovakia'},
    { value: 'JO', viewValue: 'Jordan'},
    { value: 'XX', viewValue: 'Unknown' },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private service: PlayersApiService,
    private actRoute: ActivatedRoute,
    private http: HttpClient,
    private readonly oAuthService: OAuthService,
    private router: Router) { 
      this.updateSheetForm = this.formBuilder.group({
        playername: ['', Validators.required],
        username: [''],
        ranking: [''],
        percentile: [''],
        nationality: [''],
        place: [''],
        warcount: [''],        
        clanhistory: [''],
        cup1on1edition1: [''],
        meeting: [''],
        cup3on3: [''],
        active: [''],
        ban: [false],
        lastwar: [''],
        fpw: [''],
        fpwmax: [''],
        fpwmin: [''],
        last30days: [''],
        last365days: [''],
        lastwarpc: [''],
        s1wars: [''],
        s1fpw: [''],
        streak: ['']
      })
      // console.log('FORM', this.updateSheetForm.value.active)
    }

  ngOnInit() {
    // console.log('FORM', this.updateSheetForm)
    this.actRoute.params.subscribe((params) => {     
      this.username = params['username'];    
      this.service.getPlayerByUsername(this.username).subscribe((res:any) => {       
        let batchRowValues = res.values;
        // console.log(batchRowValues);
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){        
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){           
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(
            { 
              data: rowObject,
              index: i + 1
            }
          );
        }  
        
        // console.log('players', players)

        players.forEach((el:any) => {
          if(el.data.username == this.username){
            this.data = el.data;
            // console.log(this.data);
            // console.log(el);
           
            this.updateSheetForm.get('playername')?.setValue(this.data.playername);
            this.updateSheetForm.get('username')?.setValue(this.data.username);
            this.updateSheetForm.get('ranking')?.setValue(this.data.ranking);            
            this.updateSheetForm.patchValue({
              percentile: 
            `=ROZKŁAD.NORMALNY(C${el.index},1000,ODCH.STANDARDOWE(Players!$C$2:$C$154)+0.00001,PRAWDA)`
            })
            this.updateSheetForm.get('place')?.setValue(this.data.place);
            this.updateSheetForm.patchValue({warcount: `=LICZ.JEŻELI('Match History'!A:BK, B${el.index})`})
            this.updateSheetForm.get('nationality')?.setValue(this.data.nationality);
            this.updateSheetForm.get('clanhistory')?.setValue(this.data.clanhistory);
            this.updateSheetForm.get('cup1on1edition1')?.setValue(this.data.cup1on1edition1);
            this.updateSheetForm.get('meeting')?.setValue(this.data.meeting);
            this.updateSheetForm.get('cup3on3')?.setValue(this.data.cup3on3);
            this.updateSheetForm.patchValue({active: `=ORAZ($N${el.index}>=DZIŚ()-30)`});
            this.updateSheetForm.get('ban')?.patchValue(this.data.ban == 'FALSE' ? false : true);
            this.updateSheetForm.get('lastwar')?.setValue(this.data.lastwar);            
            this.updateSheetForm.patchValue({fpw:
              `=(SUMA.JEŻELI('Match History'!B:B,B${el.index},'Match History'!D:D)+SUMA.JEŻELI('Match History'!F:F,B${el.index},'Match History'!H:H)+SUMA.JEŻELI('Match History'!J:J,B${el.index},'Match History'!L:L)+SUMA.JEŻELI('Match History'!N:N,B${el.index},'Match History'!P:P)+SUMA.JEŻELI('Match History'!R:R,B${el.index},'Match History'!T:T)+SUMA.JEŻELI('Match History'!V:V,B${el.index},'Match History'!X:X)+SUMA.JEŻELI('Match History'!Z:Z,B${el.index},'Match History'!AB:AB)+SUMA.JEŻELI('Match History'!AD:AD,B${el.index},'Match History'!AF:AF)+SUMA.JEŻELI('Match History'!AH:AH,B${el.index},'Match History'!AJ:AJ)+SUMA.JEŻELI('Match History'!AL:AL,B${el.index},'Match History'!AN:AN)+SUMA.JEŻELI('Match History'!AV:AV,B${el.index},'Match History'!AX:AX)+SUMA.JEŻELI('Match History'!AZ:AZ,B${el.index},'Match History'!BB:BB)+SUMA.JEŻELI('Match History'!BD:BD,B${el.index},'Match History'!BF:BF)+SUMA.JEŻELI('Match History'!BH:BH,B${el.index},'Match History'!BJ:BJ))/JEŻELI(F${el.index}=0,1,F${el.index})`
            });
            this.updateSheetForm.patchValue({ fpwmax:
              `=ArrayFormula(MAX(MAX(JEŻELI('Match History'!B:B=B${el.index},'Match History'!D:D,)),MAX(JEŻELI('Match History'!F:F=B${el.index},'Match History'!H:H,)),MAX(JEŻELI('Match History'!J:J=B${el.index},'Match History'!L:L,)),MAX(JEŻELI('Match History'!N:N=B${el.index},'Match History'!P:P,)),MAX(JEŻELI('Match History'!R:R=B${el.index},'Match History'!T:T,)),MAX(JEŻELI('Match History'!V:V=B${el.index},'Match History'!X:X,)),MAX(JEŻELI('Match History'!Z:Z=B${el.index},'Match History'!AB:AB,)),MAX(JEŻELI('Match History'!AD:AD=B${el.index},'Match History'!AF:AF,)),MAX(JEŻELI('Match History'!AH:AH=B${el.index},'Match History'!AJ:AJ,)),MAX(JEŻELI('Match History'!AL:AL=B${el.index},'Match History'!AN:AN,)),MAX(JEŻELI('Match History'!AV:AV=B${el.index},'Match History'!AX:AX,)),MAX(JEŻELI('Match History'!AZ:AZ=B${el.index},'Match History'!BB:BB,)),MAX(JEŻELI('Match History'!BD:BD=B${el.index},'Match History'!BF:BF,)),MAX(JEŻELI('Match History'!BH:BH=B${el.index},'Match History'!BJ:BJ,))))`
            })
            this.updateSheetForm.patchValue({ fpwmin:
              `=JEŻELI(F${el.index}=0,0,ArrayFormula(MIN(MIN(JEŻELI('Match History'!B:B=B${el.index},'Match History'!D:D,999)),MIN(JEŻELI('Match History'!F:F=B${el.index},'Match History'!H:H,999)),MIN(JEŻELI('Match History'!J:J=B${el.index},'Match History'!L:L,999)),MIN(JEŻELI('Match History'!N:N=B${el.index},'Match History'!P:P,999)),MIN(JEŻELI('Match History'!R:R=B${el.index},'Match History'!T:T,999)),MIN(JEŻELI('Match History'!V:V=B${el.index},'Match History'!X:X,999)),MIN(JEŻELI('Match History'!Z:Z=B${el.index},'Match History'!AB:AB,999)),MIN(JEŻELI('Match History'!AD:AD=B${el.index},'Match History'!AF:AF,999)),MIN(JEŻELI('Match History'!AH:AH=B${el.index},'Match History'!AJ:AJ,999)),MIN(JEŻELI('Match History'!AL:AL=B${el.index},'Match History'!AN:AN,999)),MIN(JEŻELI('Match History'!AV:AV=B${el.index},'Match History'!AX:AX,999)),MIN(JEŻELI('Match History'!AZ:AZ=B${el.index},'Match History'!BB:BB,999)),MIN(JEŻELI('Match History'!BD:BD=B${el.index},'Match History'!BF:BF,999)),MIN(JEŻELI('Match History'!BH:BH=B${el.index},'Match History'!BJ:BJ,999)))))`
            });
            this.updateSheetForm.patchValue({ last30days:
              `=LICZ.WARUNKI('Match History'!B:B,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!F:F,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!J:J,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!N:N,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!R:R,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!V:V,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!Z:Z,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AD:AD,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AH:AH,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AL:AL,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AV:AV,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!AZ:AZ,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!BD:BD,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)+LICZ.WARUNKI('Match History'!BH:BH,B${el.index},'Match History'!A:A,">="&DZIŚ()-30)`
            })
            this.updateSheetForm.patchValue({ last365days:
              `=LICZ.WARUNKI('Match History'!B:B,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!F:F,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!J:J,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!N:N,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!R:R,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!V:V,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!Z:Z,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AD:AD,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AH:AH,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AL:AL,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AV:AV,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!AZ:AZ,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!BD:BD,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)+LICZ.WARUNKI('Match History'!BH:BH,B${el.index},'Match History'!A:A,">="&DZIŚ()-365)`
            })
            this.updateSheetForm.patchValue({ lastwarpc: 
              `=JEŻELI(F${el.index}=0,0,INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${el.index},'Match History'!A:A,0),PODAJ.POZYCJĘ(B${el.index},INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${el.index},'Match History'!A:A,0),0),0)+3)-INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${el.index},'Match History'!A:A,0),PODAJ.POZYCJĘ(B${el.index},INDEKS('Match History'!B:BK,PODAJ.POZYCJĘ(N${el.index},'Match History'!A:A,0),0),0)+1))`
            })
            this.updateSheetForm.patchValue({s1wars: 
              `=LICZ.WARUNKI('Match History'!B:B,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1), 'Match History'!B:B,B${el.index},'Match History'!A:A,"<="&DATA(2023,3,31))+LICZ.WARUNKI('Match History'!F:F,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!J:J,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!N:N,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!R:R,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!V:V,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!Z:Z,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AD:AD,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AH:AH,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AL:AL,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AV:AV,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!AZ:AZ,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!BD:BD,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))+LICZ.WARUNKI('Match History'!BH:BH,B${el.index},'Match History'!A:A,">="&DATA(2023,1,1))`
            });
            this.updateSheetForm.get('s1fpw')?.setValue(this.data.s1fpw);
            this.updateSheetForm.get('streak')?.setValue(this.data.streak);
          }
        }) 
        // console.log('el', this.data);   
      })
    })
  }

  public authHeader() : HttpHeaders { 
    return new HttpHeaders ({
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    })
  }

  onSubmit() {
    const { value } = this.updateSheetForm;
    console.log('value', value);

    const playername = this.updateSheetForm.value.playername;
    const username = this.updateSheetForm.value.username;
    const ranking = this.updateSheetForm.value.ranking;
    const percentile = this.updateSheetForm.value.percentile;
    const place = this.updateSheetForm.value.place;
    const warcount = this.updateSheetForm.value.warcount;
    const nationality = this.updateSheetForm.value.nationality;
    const clanhistory = this.updateSheetForm.value.clanhistory;
    const cup1on1edition1 = this.updateSheetForm.value.cup1on1edition1;
    const meeting = this.updateSheetForm.value.meeting;
    const cup3on3 = this.updateSheetForm.value.cup3on3;
    const active = this.updateSheetForm.value.active;
    const ban = this.updateSheetForm.value.ban;
    const lastwar = this.updateSheetForm.value.lastwar;
    const fpw = this.updateSheetForm.value.fpw;
    const fpwmax = this.updateSheetForm.value.fpwmax;
    const fpwmin = this.updateSheetForm.value.fpwmin;
    const last30days = this.updateSheetForm.value.last30days;
    const last365days = this.updateSheetForm.value.last365days;
    const lastwarpc = this.updateSheetForm.value.lastwarpc;
    const s1wars = this.updateSheetForm.value.s1wars;
    const s1fpw = this.updateSheetForm.value.s1fpw;
    const streak = this.updateSheetForm.value.streak;
  
      this.service.updatePlayerNEW(playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak).subscribe({
        next: (res:any) => {        
          if(res){
            alert('Player ' + playername + ' has been edited.')
          }     
        },
        error: (error) => {
          console.log(error);
        },
      })
  }

}
