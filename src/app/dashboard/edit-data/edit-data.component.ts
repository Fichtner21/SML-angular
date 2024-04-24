import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Country } from 'src/app/models/country.model';
import { PlayersApiService } from 'src/app/services/players-api.service';
import { environment } from 'src/environments/environment';
import {ThemePalette} from '@angular/material/core';
import { switchMap } from 'rxjs/operators';

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
  index:any;
  input:any;

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
        nationality: [''],
        clanhistory: [''],
        ban: [false],
        ban_due: [''],
        ban_expiriess: [''],
        donate_s6: ['']
      })
    }

  ngOnInit() {
    // this.actRoute.params.subscribe((params) => {
    //   this.username = params['username'];
    //   this.service.getPlayerByUsername(this.username).subscribe((res:any) => {
    //     let batchRowValues = res.values;
    //     let players: any[] = [];
    //     for(let i = 1; i < batchRowValues.length; i++){
    //       const rowObject: object = {};
    //       for(let j = 0; j < batchRowValues[i].length; j++){
    //         rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
    //       }
    //       players.push(
    //         {
    //           data: rowObject,
    //           index: i + 1
    //         }
    //       );
    //     }

    //     players.forEach((el:any) => {
    //       if(el.data.username == this.username){
    //         this.data = el.data;
    //         console.log('THIS.data', el.data)
    //         this.updateSheetForm.get('playername')?.setValue(this.data.playername);
    //         this.updateSheetForm.get('username')?.setValue(this.data.username);
    //         this.updateSheetForm.get('ranking')?.setValue(this.data.ranking);
    //         this.updateSheetForm.get('nationality')?.setValue(this.data.nationality);
    //         this.updateSheetForm.get('clanhistory')?.setValue(this.data.clanhistory);
    //         this.updateSheetForm.get('ban')?.patchValue(this.data.ban == 'FALSE' ? false : true);
    //         this.updateSheetForm.get('ban_due')?.setValue(this.data.ban_due);
    //         this.updateSheetForm.get('ban_expiriess')?.setValue(this.data.ban_expiriess);
    //         this.updateSheetForm.get('donate_s6')?.setValue(this.data.donate_s6);
    //       }
    //     })
    //   })
    // })
    this.actRoute.params.subscribe((params) => {
      const username = params['username'];
      this.service.getPlayerByUsername(username).subscribe((res: any) => {
        const player = res.values.find((row: any) => row[1] === username);
        if (player) {
          this.populateForm(player);
        } else {
          console.error('Player not found.');
        }
      });
    });
  }

  populateForm(player: any) {
    console.log('Dane pobrane z serwera:', player);
    this.updateSheetForm.patchValue({
      playername: player[0],
      username: player[1],
      ranking: player[2],
      nationality: player[6],
      clanhistory: player[7],
      ban: player[12] === 'TRUE',
      ban_due: player[33],
      ban_expires: player[34],
      donate_s6: player[52]
    });
  }

  // onSubmit() {
  //   const { value } = this.updateSheetForm;
  //   console.log('value', value);

  //   const playername = this.updateSheetForm.value.playername;
  //   const username = this.updateSheetForm.value.username;
  //   const ranking = this.updateSheetForm.value.ranking;
  //   const percentile = this.updateSheetForm.value.percentile;
  //   const place = this.updateSheetForm.value.place;
  //   const warcount = this.updateSheetForm.value.warcount;
  //   const nationality = this.updateSheetForm.value.nationality;
  //   const clanhistory = this.updateSheetForm.value.clanhistory;
  //   const cup1on1edition1 = this.updateSheetForm.value.cup1on1edition1;
  //   const meeting = this.updateSheetForm.value.meeting;
  //   const cup3on3 = this.updateSheetForm.value.cup3on3;
  //   const active = this.updateSheetForm.value.active;
  //   const ban = this.updateSheetForm.value.ban;
  //   const lastwar = this.updateSheetForm.value.lastwar;
  //   const fpw = this.updateSheetForm.value.fpw;
  //   const fpwmax = this.updateSheetForm.value.fpwmax;
  //   const fpwmin = this.updateSheetForm.value.fpwmin;
  //   const last30days = this.updateSheetForm.value.last30days;
  //   const last365days = this.updateSheetForm.value.last365days;
  //   const lastwarpc = this.updateSheetForm.value.lastwarpc;
  //   const s1wars = this.updateSheetForm.value.s1wars;
  //   const s1fpw = this.updateSheetForm.value.s1fpw;
  //   const streak = this.updateSheetForm.value.streak;
  //   const ban_due = this.updateSheetForm.value.ban_due;

  //   this.service.updatePlayerNEW(playername, username, ranking, percentile, place, warcount, nationality, clanhistory, cup1on1edition1, meeting, cup3on3, active, ban, lastwar, fpw, fpwmax, fpwmin, last30days, last365days, lastwarpc, s1wars, s1fpw, streak, ban_due).subscribe({
  //     next: (res:any) => {
  //       if(res){
  //         alert('Player ' + playername + ' has been edited.')
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   })
  // }
  onSubmit() {
    const {
      playername,
      username,
      ranking,
      clanhistory,
      nationality,
      ban,
      ban_due,
      ban_expires,
      donate_s6
    } = this.updateSheetForm.value;

    this.service.updatePlayerNEW(
      playername,
      username,
      ranking,
      clanhistory,
      nationality,
      ban,
      ban_due,
      ban_expires,
      donate_s6
    ).subscribe({
      next: (res: any) => {
        if (res) {
          alert('Player ' + playername + ' has been edited.');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

}