import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RSA_NO_PADDING } from 'constants';
import { Country } from 'src/app/models/country.model';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss']
})
export class EditDataComponent implements OnInit {
  updateSheetForm!: FormGroup;
  username: string;
  data: any;

  public countPlayers:any = [];
  countries: Country[] = [
    { value: 'PL', viewValue: 'Poland' },
    { value: 'EG', viewValue: 'Egypt' },
    { value: 'EU', viewValue: 'European Union' },
    { value: 'DE', viewValue: 'Denmark' },
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

  constructor(
    private formBuilder: FormBuilder,
    private service: PlayersApiService,
    private actRoute: ActivatedRoute,
    private router: Router) { 
      this.updateSheetForm = this.formBuilder.group({
        playername: ['', Validators.required],
        username: [''],
        ranking: [''],
        percentile: [''],
        nationality: [''],
        // place: ['', Validators.minLength(3)],
        // warcount: ['', Validators.minLength(3)],
        // nationality: ['', Validators.minLength(3)],
        // clanhistory: ['-', Validators.minLength(3)],
        // cup1on1edition1: ['-', Validators.minLength(3)],
        // meeting: ['', Validators.minLength(3)],
        // cup3on3: ['', Validators.minLength(3)],
        // active: [false, Validators.required],
        // ban: [false, Validators.required],
        // lastwar: ['', Validators.minLength(3)],
        // fpw: ['', Validators.minLength(3)],
        // fpwmax: ['', Validators.minLength(3)],
        // fpwmin: ['', Validators.minLength(3)],
        // last30days: ['', Validators.minLength(3)],
        // last365days: ['', Validators.minLength(3)],
        // lastwarpc: ['', Validators.minLength(3)],
        // s1wars: ['', Validators.minLength(3)],
        // s1fpw: ['', Validators.minLength(3)],
        // streak: ['', Validators.minLength(3)]
      })
    }

  ngOnInit() {
    this.actRoute.params.subscribe((params) => {
      this.username = params['username'];
      console.log(this.username)
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
            this.updateSheetForm.get('nationality')?.setValue(this.data.nationality);
          }
        }) 
        console.log('el', this.data);   
      })
    })
  }

  onSubmit() {
    const { value } = this.updateSheetForm;
    console.log('value', value);

    const playername = this.updateSheetForm.value.playername;
    const username = this.updateSheetForm.value.username;
    const ranking = this.updateSheetForm.value.ranking;
    const percentile = this.updateSheetForm.value.percentile;
    const nationality = this.updateSheetForm.value.nationality;

    this.service
      .updatePlayer(playername, username, ranking, percentile, nationality)
      // .updatePlayer()
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/list-players']);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

}
