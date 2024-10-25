import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
// export class EditDataComponent implements OnInit {
//   updateSheetForm!: FormGroup;
//   username: string;
//   data: any;
//   index:any;
//   input:any;

//   task: Task = {
//     name: 'Indeterminate',
//     completed: false,
//     color: 'primary',
//     subtasks: [
//       {name: 'Primary', completed: false, color: 'primary'},
//       {name: 'Accent', completed: false, color: 'accent'},
//       {name: 'Warn', completed: false, color: 'warn'},
//     ],
//   };

//   public countPlayers:any = [];
//   countries: Country[] = [
//     { value: 'PL', viewValue: 'Poland' },
//     { value: 'EG', viewValue: 'Egypt' },
//     { value: 'EU', viewValue: 'European Union' },
//     { value: 'DE', viewValue: 'Germany' },
//     { value: 'NL', viewValue: 'Netherlands' },
//     { value: 'ES', viewValue: 'Estonia' },
//     { value: 'BE', viewValue: 'Belgium' },
//     { value: 'RO', viewValue: 'Romania' },
//     { value: 'FR', viewValue: 'France' },
//     { value: 'UK', viewValue: 'United Kingdom' },
//     { value: 'GR', viewValue: 'Greece' },
//     { value: 'PT', viewValue: 'Portugal' },
//     { value: 'FI', viewValue: 'Finland' },
//     { value: 'SE', viewValue: 'Sweden' },
//     { value: 'CH', viewValue: 'Switzerland'},
//     { value: 'SK', viewValue: 'Slovakia'},
//     { value: 'JO', viewValue: 'Jordan'},
//     { value: 'XX', viewValue: 'Unknown' },
//   ]

//   constructor(
//     private formBuilder: FormBuilder,
//     private service: PlayersApiService,
//     private actRoute: ActivatedRoute,
//     private http: HttpClient,
//     private readonly oAuthService: OAuthService,
//     private router: Router) {
//       this.updateSheetForm = this.formBuilder.group({
//         playername: ['', Validators.required],
//         username: [''],
//         ranking: [''],
//         nationality: [''],
//         clanhistory: [''],
//         ban: [false],
//         ban_due: [''],
//         ban_expiriess: [''],
//         donate_s6: ['']
//       })
//     }

//   ngOnInit() {    
//     this.actRoute.params.subscribe((params) => {
//       console.log('params', params)
//       const username = params['username'];
//       this.service.getPlayerByUsername(username).subscribe((res: any) => {
//         console.log('res', res.values[0])
//         const player = res.values.find((row: any) => row[1] === username);
//         if (player) {
//           this.populateForm(player);
//         } else {
//           console.error('Player not found.');
//         }
//       });
//     });
//   }

//   populateForm(player: any) {
//     console.log('Dane pobrane z serwera:', player);
//     this.updateSheetForm.patchValue({
//       playername: player[0],
//       username: player[1],
//       ranking: player[2],
//       nationality: player[6],
//       clanhistory: player[7],
//       ban: player[12] === 'TRUE',
//       ban_due: player[33],
//       ban_expires: player[34],
//       donate_s6: player[52]
//     });
//   }

  
//   onSubmit() {
//     const {
//       playername,
//       username,
//       ranking,
//       clanhistory,
//       nationality,
//       ban,
//       ban_due,
//       ban_expires,
//       donate_s6
//     } = this.updateSheetForm.value;

//     this.service.updatePlayerNEW(
//       playername,
//       username,
//       ranking,
//       clanhistory,
//       nationality,
//       ban,
//       ban_due,
//       ban_expires,
//       donate_s6
//     ).subscribe({
//       next: (res: any) => {
//         if (res) {
//           alert('Player ' + playername + ' has been edited.');
//         }
//       },
//       error: (error) => {
//         console.log(error);
//       },
//     });
//   }

// }

export class EditDataComponent implements OnInit {
  updateSheetForm!: FormGroup;
  fieldNames: string[] = [];
  data: any[] = [];
  username: string;

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
    { value: 'BR', viewValue: 'Brasil' },
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
    private actRoute: ActivatedRoute
  ) {
    // Initialize the form as an empty FormGroup so that the template doesn't break
    this.updateSheetForm = this.formBuilder.group({});
  }
  ngOnInit() {
    this.actRoute.params.subscribe((params) => {
      this.username = params['username'];
      this.service.getPlayerByUsername(this.username).subscribe((res: any) => {
        console.log(res.values[0])
        this.fieldNames = res.values[0]; // Field names from response
        const playerData = res.values.find((row: any) => row[1] === this.username);

        if (playerData) {
          this.data = playerData; // Player data
          this.createForm(); // Create the form with the dynamic fields
        } else {
          console.error('Player not found.');
        }
      });
    });
  }

  createForm() {
    const formGroup: any = {};
    const activeFields = ['playername', 'ranking', 'clanhistory', 'nationality', 'ban', 'ban_due', 'ban_expires', 'donate_s6', 'donate_s7', 'donate_s8'];
  
    this.fieldNames.forEach((field, index) => {
      // Sprawdzamy, czy pole powinno być edytowalne
      const isActive = activeFields.includes(field);
  
      // Specjalne przetwarzanie dla pola 'ban', które będzie checkboxem
      if (field === 'ban') {
        // Konwertujemy wartość "TRUE" lub "FALSE" na boolean
        const banValue = this.data[index] === 'TRUE';
        
        // Tworzymy checkbox (FormControl z typem boolean)
        formGroup[field] = new FormControl({ value: banValue, disabled: !isActive });
      } else {
        // Normalne pola tekstowe
        formGroup[field] = new FormControl({ value: this.data[index] || '', disabled: !isActive });
      }
    });
  
    this.updateSheetForm = this.formBuilder.group(formGroup);
  }  

  getCountryViewValue(countryCode: string): string {
    const country = this.countries.find(c => c.value === countryCode);
    return country ? country.viewValue : 'Unknown';
  }  

  onSubmit() {
    const formValues = this.updateSheetForm.getRawValue(); // Pobiera wszystkie wartości, w tym disabled fields
    this.service.updatePlayerNEW(this.username, formValues).subscribe({
      next: (res: any) => {
        alert('Player updated successfully.');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}