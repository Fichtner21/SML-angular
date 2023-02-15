import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from '../services/players-api.service';
// import {MatListModule} from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';
import { NotifierService } from 'angular-notifier';
import { HideRowDirective } from '../hide-row.directive';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faPaperPlane, faStamp } from '@fortawesome/free-solid-svg-icons';

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
  ban: boolean;
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
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;
  isStickyShown = false;
  allSelected: boolean = false;
  sendIcon = faPaperPlane;
  stamp = faStamp;
  // dataSource: MatTableDataSource<any>;
  // dataSource = new MatTableDataSource<any>([]);
  selectedRows = [];
  dataSource: any;
  public listPlayers$: Observable<any[]>;
  playerRowArray: any[] = [];
  public selectedArr: any[] = [];
  options: any[] = [];
  a = [{ranking: "1"}, {ranking: "3"}, {ranking: "5"}, {ranking: "7"}];
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

 

  constructor(private googleApi: PlayersApiService, private formBuilder: FormBuilder, private notifier: NotifierService, private oauthService: OAuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { 
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
          username: value.username,
          playername: value.playername,
          ranking: value.ranking,
          // active: value.active == 'TRUE' ? true : false,
          // active: value.active,
          ban: value.ban == 'TRUE' ? true : false,
          // ban: value.ban,
          flag: value.nationality,
          // wars: value.warcount
        }
        // console.log('OBJ', obj)
        this.playerRowArray.push(obj)
        // this.players.push(obj)
      }
      // console.log('playerRowArray', this.playerRowArray)
      return this.dataSource = new MatTableDataSource(this.playerRowArray);
      // console.log('PLAYERS', this.players)
      // return players;
    })

    this.route.queryParams.subscribe(params => {
      // this.array1 = params['a1'] ? JSON.parse(params['a1']).map(username => ({username})) : [];
      // this.array2 = params['a2'] ? JSON.parse(params['a2']).map(username => ({username})) : [];
      

      // setTimeout(() => {
      //   this.array1 = params['a1'] ? JSON.parse(params['a1']) : [];
      //   this.array2 = params['a2'] ? JSON.parse(params['a2']) : [];
      //   this.dataSource.data.forEach(item => {
      //     // console.log('item con', item)
      //     // check if the username of the item matches a username in array1
      //     let match1 = this.array1.find(arrayItem => arrayItem.username === item.username);
      //     // if there is a match, set the checkbox value to true
      //     if (match1) {
      //       item.checkbox1 = true;
      //     }
      // console.log('selectedUsers', this.selectedUsers);
      //     // check if the username of the item matches a username in array2
      //     let match2 = this.array2.find(arrayItem => arrayItem.username === item.username);
      //     // if there is a match, set the checkbox value to true
      //     if (match2) {
      //       item.checkbox2 = true;
      //     }
      //   });
      // }, 2000)
      
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.array1 = params['a1'] ? JSON.parse(params['a1']).map(username => ({username})) : [];
      // this.array2 = params['a2'] ? JSON.parse(params['a2']).map(username => ({username})) : [];
      if(this.selectedUsers.length > 0){
        this.selectedUsers = [];
      }

      setTimeout(() => {
        this.array1 = params['a1'] ? JSON.parse(params['a1']) : [];
        this.array2 = params['a2'] ? JSON.parse(params['a2']) : [];
        this.dataSource.data.forEach(item => {
          // console.log('item oninit', item)
          // check if the username of the item matches a username in array1
          let match1 = this.array1.find(arrayItem => arrayItem.username === item.username);
          // if there is a match, set the checkbox value to true
          if (match1) {
            // console.log('item1', item)
            // this.selectedUsers = [];
            this.selectedUsers.push(item)
            item.checkbox1 = true;
          }
      
          // check if the username of the item matches a username in array2
          let match2 = this.array2.find(arrayItem => arrayItem.username === item.username);
          // if there is a match, set the checkbox value to true
          if (match2) {
            // console.log('item2', item)
            // this.selectedUsers = [];
            this.selectedUsers.push(item)
            item.checkbox2 = true;
          }
        });
      }, 1000)
      
    });
   
    const arr = this.playerRowArray;
      
    // this.dataSource = new MatTableDataSource(arr);

    // this.form = this.formBuilder.group({
    //   selectedPlayers: [[]]
    // })

    // this.displayedColumns = ['select','nr', 'username'];

    
    // this.dataSource = new MatTableDataSource(players)
    // console.log('this.dataSource', this.dataSource)
    // console.log('this.playerRowArray', arr)
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
    this.notifier.notify('default', 'MIX TEAMS LP has been called');
    objects.sort((a, b) => b.ranking - a.ranking);
    const array1 = [];
    const array2 = [];
    for (let i = 0; i < objects.length; i++) {
      // this.notifier.notify('info', 'Performing operations...');
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
    this.notifier.notify('success', 'MIX TEAMS LP has finished executing');
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
    this.notifier.notify('default', 'MIX TEAMS HP has been called');
    // Przekonwertuj pola ranking na wartości liczbowe
    inputArray.forEach(obj => parseFloat(obj.ranking.replace(/,/g, '')));

    // Wygeneruj wszystkie możliwe permutacje tablicy
    let allPermutations = this.permutate(inputArray, []);

    // Znajdź permutację, której dwie części mają najmniejszą różnicę w sumie rankingów
    let bestSplit: [User[], User[]] = [[], []];
    let bestDifference = Number.MAX_VALUE;
    allPermutations.forEach(permutation => {
      // this.notifier.notify('info', 'Performing operations...');
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
          const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;        
          const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
          this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
          this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2); 
        }
      }
    });
    // console.log('bestSplit', bestSplit)
    this.addArrayToUrl(this.array1, this.array2)
    this.notifier.notify('success', 'MIX TEAMS HP has finished executing');
    return bestSplit;
  }

  splitRanking(objects: User[], startIndex: number, firstArray: User[], secondArray: User[], halfSum: number): [User[], User[]] | null {
    if (startIndex >= objects.length) {
      const sumFirstArray = firstArray.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
      const sumSecondArray = secondArray.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
      if (sumFirstArray === sumSecondArray) {
        return [firstArray, secondArray];
      } else if (Math.abs(sumFirstArray - sumSecondArray) <= halfSum) {
        return [firstArray, secondArray];
      }
      return null;
    }
  
    const currentObject = objects[startIndex];
    const resultWithFirstArray = this.splitRanking(objects, startIndex + 1, [...firstArray, currentObject], secondArray, halfSum);
    if (resultWithFirstArray !== null) {
      return resultWithFirstArray;
    }
  
    const resultWithSecondArray = this.splitRanking(objects, startIndex + 1, firstArray, [...secondArray, currentObject], halfSum);
    if (resultWithSecondArray !== null) {
      return resultWithSecondArray;
    }   
  
    return null;
  }

  optimalSplit(objects: User[]): [User[], User[]] | null {
    const sum = objects.reduce((acc, curr) => acc + parseFloat(curr.ranking.replace(/,/g, '')), 0);
    const halfSum = sum / 2;

    const result = this.splitRanking(objects, 0, [], [], halfSum);

    if (result !== null) {
      this.array1 = result[0];
      this.array2 = result[1];      
    }

    return result;
  }
  
  splitRanking2(array) {
    array.sort((a, b) => parseFloat(b.ranking.replace(',', '')) - parseFloat(a.ranking.replace(',', '')));
    let firstArray = [];
    let secondArray = [];
    let firstArraySum = 0;
    let secondArraySum = 0;
    
    for (let i = 0; i < array.length; i++) {
      let currentRanking = parseFloat(array[i].ranking.replace(',', ''));
      if (firstArraySum <= secondArraySum) {
        firstArray.push(array[i]);
        firstArraySum += currentRanking;
      } else {
        secondArray.push(array[i]);
        secondArraySum += currentRanking;
      }
    }
    this.array1 = firstArray;
    this.array2 = secondArray;

    this.sumTeam1 = this.sumRanking(firstArray)
    this.sumTeam2 = this.sumRanking(secondArray)
    
    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100; 
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100; 
    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2); 
    this.notifier.notify('success', 'MIX TEAMS LP has finished executing');


   
    this.addArrayToUrl(firstArray, secondArray)
    return [firstArray, secondArray];
  }

  addArrayToUrl(a1, a2) {
    // let a1Usernames = a1.map(item => item.username);
    // let a2Usernames = a2.map(item => item.username);
    // this.router.navigate(['mix/'], { queryParams: { a2: JSON.stringify(a2Usernames), a1: JSON.stringify(a1Usernames) } });
    this.router.navigate(['mix/'], { queryParams: { a2: JSON.stringify(a2), a1: JSON.stringify(a1) } });
  }


  public floorPrecised(number:any, precision:any) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number:any, precision:any) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }

  isAuthenticated() {
    return this.oauthService.hasValidIdToken();
  }

  confirmTeams(){
    let t1p4name = '';
    let t1p5name = '';
    let t1p6name = '';
    let t1p7name = '';
    const t1p1name = this.array1[0].username ? this.array1[0].username : '';
    const t1p2name = this.array1[1].username ? this.array1[1].username : '';
    const t1p3name = this.array1[2].username ? this.array1[2].username : '';
    // const t1p4name = (this.array1[3].username != 'undefined') ? this.array1[3].username : '';
    if (this.array1[3]) {
      t1p4name = this.array1[3].username ? this.array1[3].username : '';
    } else {
      t1p4name = '';
    }
    if (this.array1[4]) {
      t1p5name = this.array1[4].username ? this.array1[4].username : '';
    } else {
      t1p5name = '';
    }
    if (this.array1[5]) {
      t1p6name = this.array1[5].username ? this.array1[5].username : '';
    } else {
      t1p6name = '';
    }
    if (this.array1[6]) {
      t1p7name = this.array1[6].username ? this.array1[6].username : '';
    } else {
      t1p7name = '';
    }
    // const t1p5name = this.array1[4].username ? this.array1[4].username : '';
    // const t1p6name = this.array1[5].username ? this.array1[5].username : '';
    // const t1p7name = this.array1[6].username ? this.array1[6].username : '';
    let t2p4name = '';
    let t2p5name = '';
    let t2p6name = '';
    let t2p7name = '';
    const t2p1name = this.array2[0].username ? this.array2[0].username : '';
    const t2p2name = this.array2[1].username ? this.array2[1].username : '';
    const t2p3name = this.array2[2].username ? this.array2[2].username : '';
    if (this.array2[3]) {
      t2p4name = this.array2[3].username ? this.array2[3].username : '';
    } else {
      t2p4name = '';
    }
    if (this.array2[4]) {
      t2p5name = this.array2[4].username ? this.array2[4].username : '';
    } else {
      t2p5name = '';
    }
    if (this.array2[5]) {
      t2p6name = this.array2[5].username ? this.array2[5].username : '';
    } else {
      t2p6name = '';
    }
    if (this.array2[6]) {
      t2p7name = this.array2[6].username ? this.array2[6].username : '';
    } else {
      t2p7name = '';
    }
    // const t2p4name = this.array2[3].username ? this.array2[3].username : '';
    // const t2p5name = this.array2[4].username ? this.array2[4].username : '';
    // const t2p6name = this.array2[5].username ? this.array2[5].username : '';
    // const t2p7name = this.array2[6].username ? this.array2[6].username : '';

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A12:A18', t1p1name, t1p2name, t1p3name, t1p4name, t1p5name, t1p6name, t1p7name).subscribe({
      next: (res) => {
        if(res.done = true){    
          this.notifier.notify('success', 'Team 1 successful added.');          
        }
      }
    })

    this.googleApi.updateCell('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo', 'Add+a+Match', 'A23:A29', t2p1name, t2p2name, t2p3name, t2p4name, t2p5name, t2p6name, t2p7name).subscribe({
      next: (res) => {
        if(res.done = true){    
          this.notifier.notify('success', 'Team 2 successful added.');          
        }        
      }, error: (err) => {
        console.log('err', err);
      }
    })
  }

  toggleSticky() {
    this.isStickyShown = !this.isStickyShown;
  }

  selectAll(event) {
    this.allSelected = event.checked;
    this.playerRowArray.forEach(user => {
      user.selected = event.checked;
    });
  }

  sendToDiscord() {
    const webhookUrl = 'https://discord.com/api/webhooks/1075178845067563138/FpKf7iiu3dhI9NTxyS-VkMNcv4mdq2KORNhNUbkeZnfCgLtDaJSIFxi9Uz5YUTCDPqmX';

    const arr1 = this.array1;
    const arr2 = this.array2;
   
    const t1p1name = (arr1.length > 0 && arr1[0] && arr1[0].playername) ? arr1[0].playername : '';
    const t1p2name = (arr1.length > 1 && arr1[1] && arr1[1].playername) ? arr1[1].playername : '';
    const t1p3name = (arr1.length > 2 && arr1[2] && arr1[2].playername) ? arr1[2].playername : '';
    const t1p4name = (arr1.length > 3 && arr1[3] && arr1[3].playername) ? arr1[3].playername : '';
    const t1p5name = (arr1.length > 4 && arr1[4] && arr1[4].playername) ? arr1[4].playername : '';
    const t1p6name = (arr1.length > 5 && arr1[5] && arr1[5].playername) ? arr1[5].playername : '';
    const t1p7name = (arr1.length > 6 && arr1[6] && arr1[6].playername) ? arr1[6].playername : '';
    const t2p1name = (arr2.length > 0 && arr2[0] && arr2[0].playername) ? arr2[0].playername : '';
    const t2p2name = (arr2.length > 0 && arr2[1] && arr2[1].playername) ? arr2[1].playername : '';
    const t2p3name = (arr2.length > 0 && arr2[2] && arr2[2].playername) ? arr2[2].playername : '';
    const t2p4name = (arr2.length > 0 && arr2[3] && arr2[3].playername) ? arr2[3].playername : '';
    const t2p5name = (arr2.length > 0 && arr2[4] && arr2[4].playername) ? arr2[4].playername : '';
    const t2p6name = (arr2.length > 0 && arr2[5] && arr2[5].playername) ? arr2[5].playername : '';
    const t2p7name = (arr2.length > 0 && arr2[6] && arr2[6].playername) ? arr2[6].playername : '';

    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    
    let nextMatch = "";
    nextMatch += "**NEXT MATCH**, created: " + formattedDate + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + "\n";
    nextMatch += "TEAM 1 Chance for win: " + this.chanceOfWinTeamOneShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + "\n";
    nextMatch += "TEAM 2 Chance for win: " + this.chanceOfWinTeamTwoShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "Good Luck & Have Fun!";
    // console.log('nextM', nextMatch);
    const payload = {
      content: nextMatch
    };
    this.http.post(webhookUrl, payload).subscribe({
      next: (res) => {
        this.notifier.notify('success', "Teams Send successful!")
      }, error: (err) => {
        this.notifier.notify('error', 'Something went wrong')
      }
    });    
  } 

  isValid(): boolean {
    return this.array1 && this.array1.length > 2 && this.array2 && this.array2.length > 2;
  }
}


