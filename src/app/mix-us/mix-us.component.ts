import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from '../services/players-api.service';

@Component({
  selector: 'app-mix-us',
  templateUrl: './mix-us.component.html',
  styleUrls: ['./mix-us.component.scss']
})
export class MixUsComponent implements OnInit {
  public players$: Observable<any>;
  form: FormGroup;
  selectedPlayersArray: any[];
  array1: any[];
  array2: any[];
 
  constructor(private googleApi: PlayersApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.players$ = this.googleApi.getPlayers('Players').pipe(
      map((response: any) => {             
        let batchRowValues = response.values;
        // console.log('player 1', batchRowValues[1])        
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
    
    this.form = this.formBuilder.group({
      selectedPlayers: [[]]
    })
  }

  onSubmit() {
    this.selectedPlayersArray = this.form.value.selectedPlayers;
    console.log('SELECTED PLAYERS:', this.selectedPlayersArray)
  }



  maxSumArrays(objects) {
    objects.sort((a, b) => b.ranking - a.ranking);
    const array1 = [];
    const array2 = [];
    for (let i = 0; i < objects.length; i++) {
      if (array1.length <= array2.length) {
        array1.push(objects[i]);
      } else {
        array2.push(objects[i]);
      }
    }
 
    this.array1 = array1;
    this.array2 = array2;
    return [array1, array2];
  }

}
