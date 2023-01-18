import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RSA_NO_PADDING } from 'constants';
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
        res.forEach((el:any) => {
          if(el.username == this.username){
            this.data = el;
            this.updateSheetForm.get('playername')?.setValue(this.data.playername);
            this.updateSheetForm.get('username')?.setValue(this.data.username);
            this.updateSheetForm.get('ranking')?.setValue(this.data.ranking);
            this.updateSheetForm.get('percentile')?.setValue(this.data.percentile);
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

    this.service
      .updatePlayer(playername, username, ranking, percentile)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/list-data']);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

}
