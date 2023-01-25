import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { RSA_NO_PADDING } from 'constants';
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
        active: [false],
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
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }     

        players.forEach((el:any) => {
          if(el.username == this.username){
            this.data = el;
            this.updateSheetForm.get('playername')?.setValue(this.data.playername);
            this.updateSheetForm.get('username')?.setValue(this.data.username);
            this.updateSheetForm.get('ranking')?.setValue(this.data.ranking);
            this.updateSheetForm.get('percentile')?.setValue(this.data.percentile);
            this.updateSheetForm.get('place')?.setValue(this.data.place);
            this.updateSheetForm.get('warcount')?.setValue(this.data.warcount);
            this.updateSheetForm.get('nationality')?.setValue(this.data.nationality);
            this.updateSheetForm.get('clanhistory')?.setValue(this.data.clanhistory);
            this.updateSheetForm.get('cup1on1edition1')?.setValue(this.data.cup1on1edition1);
            this.updateSheetForm.get('meeting')?.setValue(this.data.meeting);
            this.updateSheetForm.get('cup3on3')?.setValue(this.data.cup3on3);
            this.updateSheetForm.get('active')?.patchValue(this.data.active == 'FALSE' ? false : true);
            this.updateSheetForm.get('ban')?.patchValue(this.data.ban == 'FALSE' ? false : true);
            this.updateSheetForm.get('lastwar')?.setValue(this.data.lastwar);
            this.updateSheetForm.get('fpw')?.setValue(this.data.fpw);
            this.updateSheetForm.get('fpwmax')?.setValue(this.data.fpwmax);
            this.updateSheetForm.get('fpwmin')?.setValue(this.data.fpwmin);
            this.updateSheetForm.get('last30days')?.setValue(this.data.last30days);
            this.updateSheetForm.get('last365days')?.setValue(this.data.last365days);
            this.updateSheetForm.get('lastwarpc')?.setValue(this.data.lastwarpc);
            this.updateSheetForm.get('s1wars')?.setValue(this.data.s1wars);
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
          console.log('res ***', res);
          console.log('username ***', username);     
        },
        error: (error) => {
          console.log(error);
        },
      })
  }

}
