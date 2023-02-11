import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from '../services/players-api.service';
// import {MatListModule} from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';

export interface UserData {
  nr: string;
  name: string;
  username: string;
  ranking: string;
  wars: string;
  active: string;
  ban: string;
}

interface User {
  nr: number;
  username: string;
  ranking: string;
  playername: string;
  flag: string;
}

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-mix-us',
  templateUrl: './mix-us.component.html',
  styleUrls: ['./mix-us.component.scss']
})
export class MixUsComponent implements OnInit {
  public players$: Observable<any[]>;
  form: FormGroup;
  selectedPlayersArray: any[];
  array1: any[] = [];
  array2: any[] = [];
  sum1: any[];
  sum2: any[];
  sumTeam1: any;
  sumTeam2: any; 
  // dataSource: MatTableDataSource<any>;
  // dataSource = new MatTableDataSource<any>([]);
  selectedRows = [];
  dataSource: any;
  public listPlayers$: Observable<any[]>;
  playerRowArray: any[] = [];
  public selectedArr: any[] = [];
  options: any[] = [];
  // 
  players: any;
  displayedColumns: string[] = ['select', 'nr', 'ranking', 'playername','flag'];
  
    
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
  selectedUsers: User[] = [];
  // displayedColumns: string[];
  // dataSource = new MatTableDataSource<PeriodicElement>(this.players$);
  selection = new SelectionModel<UserData>(true, []);

 

  constructor(private googleApi: PlayersApiService, private formBuilder: FormBuilder) { 
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
    this.listPlayers$ = this.players$;
   
    this.listPlayers$.subscribe(data => {
      
      // console.log('data =>', data)
      for(let [index, value] of data.entries()){
        
        const obj = {
          // nr: Number(index) + 1,
          nr: (index + 1).toString(),
          // username: value.username,
          playername: value.playername,
          ranking: value.ranking,
          // active: value.active == 'TRUE' ? true : false,
          // active: value.active,
          // ban: value.ban == 'TRUE' ? true : false,
          // ban: value.ban,
          flag: value.nationality,
          // wars: value.warcount
        }
        // console.log('OBJ', obj)
        this.playerRowArray.push(obj)
        // this.players.push(obj)
      }
      console.log('playerRowArray', this.playerRowArray)
      return this.dataSource = new MatTableDataSource(this.playerRowArray);
      // console.log('PLAYERS', this.players)
      // return players;
    })
  }

  ngOnInit(): void {
   
    const arr = this.playerRowArray;
      
    // this.dataSource = new MatTableDataSource(arr);

    // this.form = this.formBuilder.group({
    //   selectedPlayers: [[]]
    // })

    // this.displayedColumns = ['select','nr', 'username'];

    
    // this.dataSource = new MatTableDataSource(players)
    console.log('this.dataSource', this.dataSource)
    console.log('this.playerRowArray', arr)
  }
  selectUser(user: User) {
    const index = this.selectedUsers.indexOf(user);
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }
 
  // sum(numbers){
  //   let sum = 0;
  //   numbers.forEach(element => {
  //     sum += parseFloat(element.ranking);
  //   });
  //   console.log('SUM', sum)
  //   return sum;
  // }

  addSelectedRows() {
    // this.selected$.subscribe(elements => {
      this.selection.selected.forEach(selectedElement => {
        this.selectedArr.push(selectedElement);
      });
    // });
  }

  // transferSelectedRows() {
  //   this.selectedRows = this.dataSource.data.filter(row => row.selected);
  //   this.selectedRows.forEach(row => {
  //     row.selected = false;
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    this.sumTeam1 = this.sumRanking(array1)
    this.sumTeam2 = this.sumRanking(array2) 

    return [array1, array2];
  }

  public sumRanking(array: any[]):number {
    let sum = 0;  
    array.forEach((el) => {
      sum += parseFloat(el.ranking.replace(/,/g, ''));
    })
    return sum;
  }

  permutate(array: User[], currentPermutation: User[]): User[][] {
    if (array.length === 0) {
      return [currentPermutation];
    }

    let allPermutations: User[][] = [];
    for (let i = 0; i < array.length; i++) {
      let newArray = [...array.slice(0, i), ...array.slice(i + 1)];
      let newPermutation = [...currentPermutation, array[i]];
      allPermutations = [...allPermutations, ...this.permutate(newArray, newPermutation)];
    }

    return allPermutations;
  }

  splitArrayIntoTwo(inputArray: User[]): [User[], User[]] {
    // Przekonwertuj pola ranking na wartości liczbowe
    inputArray.forEach(obj => parseFloat(obj.ranking.replace(/,/g, '')));

    // Wygeneruj wszystkie możliwe permutacje tablicy
    let allPermutations = this.permutate(inputArray, []);

    // Znajdź permutację, której dwie części mają najmniejszą różnicę w sumie rankingów
    let bestSplit: [User[], User[]] = [[], []];
    let bestDifference = Number.MAX_VALUE;
    allPermutations.forEach(permutation => {
      for (let i = 0; i < permutation.length; i++) {
        let array1 = permutation.slice(0, i);
        let array2 = permutation.slice(i);
        let array1Sum = array1.reduce((sum, obj) => sum + parseFloat(obj.ranking.replace(/,/g, '')), 2);
        let array2Sum = array2.reduce((sum, obj) => sum + parseFloat(obj.ranking.replace(/,/g, '')), 2);
        let difference = Math.abs(array1Sum - array2Sum);
        if (difference < bestDifference) {
          bestDifference = difference;
          bestSplit = [array1, array2];
          this.array1 = array1;
          this.array2 = array2;

          this.sumTeam1 = this.sumRanking(array1)
          this.sumTeam2 = this.sumRanking(array2)
        }
      }
    });
    console.log('bestSplit', bestSplit)
  return bestSplit;
  }
}
