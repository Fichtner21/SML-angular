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
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faArrowCircleLeft, faArrowCircleRight, faArrowDown, faArrowsDownToPeople, faArrowUp, faFlag, faPaperPlane, faPeopleGroup, faPersonCirclePlus, faStamp, faStar, faStarHalfStroke, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import * as Discord from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';


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

interface VoiceMember {
  id: string;
  username: string;
  nickname: string;
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
  arrowDown = faArrowDown;
  people = faUserGroup;
  arrowUp = faArrowUp;
  arrowRightCircle = faArrowCircleRight;
  arrowLeftCircle = faArrowCircleLeft;
  starSolid = faStar;
  starEmpty = faStarHalfStroke;
  faFlag = faFlag;
  mixWay: any = localStorage.getItem('mixway') ? localStorage.getItem('mixway') : '';

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
  selectedChannels = 'Team 1 and Team 2';
  availableChannels = ['Team 1 and Team 2', 'Team 3 and Team 4'];

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
  discordUsers: any[] = [];

  public token = 'MTA3NzIyOTg4Njk3MzkzNTcwNw.G8qWP1.nc7-rGU3BotFxISS8JKT2Eh9ESp_HSS9ePp5VU';
  public channelId = '851888778409672756';

  private discordToken = 'MTA3NzIyOTg4Njk3MzkzNTcwNw.G8qWP1.nc7-rGU3BotFxISS8JKT2Eh9ESp_HSS9ePp5VU';
  private baseUrl = 'http://localhost:3000';

  users: any[];

  constructor(private googleApi: PlayersApiService, private formBuilder: FormBuilder, private notifier: NotifierService, private oauthService: OAuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public oAuthService: OAuthService) {
    // const client = new Client({
    //   intents: ['Guilds', 'GuildMembers', 'GuildVoiceStates']
    // });

    // client.on('ready', async () => {
    //   // const channelId = '1234567890'; // podaj ID kanału, dla którego chcesz pobrać listę użytkowników
    //   // const channel = client.channels.cache.get(channelId) as VoiceChannel;
    //   // const voiceMembers = await channel.members;

    //   // voiceMembers.forEach(member => {
    //   //   this.users.push(member.displayName);
    //   // });
    // });

    // client.login('MTA3NzMzNDUyNDE1NDg3NjAyNg.GLV3pj.RPAovzUTCcezSqvAhRDb3TNTWr6GEr6YzHcbMg'); // podaj swój token dostępowy do bota Discord

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
          active: value.active == 'TRUE' ? true : false,
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

        if (this.dataSource) {
          this.dataSource.data?.forEach(item => {
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
        }
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
    // console.log('this.selectedUsers', this.selectedUsers)
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

  getDiscordUsers() {
    this.http.get<VoiceMember[]>('https://mohsh-ds.herokuapp.com/voice-members').subscribe(
      (members) => {
        if(members.length === 0){
          this.notifier.notify('warning', 'WANT TO PLAY is empty.');
        } else {
          members.forEach((el: any) => {
            // console.log('el', el);
            this.playerRowArray.forEach((player: any) => {
              if ((el.username === player.username || el.username === player.playername || el.nickname === player.username || el.nickname === player.playername) &&
                  !this.selectedUsers.some((u: any) => (u.username === player.username && u.playername === player.playername))
              ) {
                player.id = el.id;
                // player.nickname = el.nickname;// Dodajemy pole id z obiektu el do obiektu player

                this.notifier.notify('success', `${player.playername} added!.`);
                this.selectedUsers.push(player);
              }

            });
          });
          // this.notifier.notify('success', 'Players from Discord Imported successful');
          // console.log('this SELECTED USERS:', this.selectedUsers)
        }
      },
      (err) => {
        this.notifier.notify('error', 'Import Players from Discord failed.');
      }
    );
  }

  // sendToVoiceChannels(){
  //   const newArray1 = this.array1.map((obj: any) => {
  //     return {
  //       username: obj.username,
  //       nickname: obj.nickname,
  //       id: obj.id
  //     };
  //   });

  //   const newArray2 = this.array2.map((obj: any) => {
  //     return {
  //       username: obj.username,
  //       nickname: obj.nickname,
  //       id: obj.id
  //     };
  //   });

  //   const channel1Id = '851888705307803698';
  //   const channel2Id = '851888741761155136';
  //   const channel3Id = '1040385852716630016';
  //   const channel4Id = '1040385893191659680';

  //   const payload = {
  //     users1: newArray1,
  //     users2: newArray2,
  //     channel1Id: channel1Id,
  //     channel2Id: channel2Id,
  //   };

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   };

  //   this.http.post(`https://mohsh-ds.herokuapp.com/move-users-to-channels`, JSON.stringify(payload), httpOptions).subscribe(
  //     (response) => {
  //       console.log('Move users to channels success:', response);
  //     },
  //     (error) => {
  //       console.error('Move users to channels error:', error);
  //     }
  //   );
  // }

  sendToVoiceChannels() {
    const newArray1 = this.array1.map((obj: any) => {
      return {
        username: obj.username,
        nickname: obj.nickname,
        id: obj.id
      };
    });

    const newArray2 = this.array2.map((obj: any) => {
      return {
        username: obj.username,
        nickname: obj.nickname,
        id: obj.id
      };
    });

    let channel1Id, channel2Id;

    if (this.selectedChannels === 'Team 1 and Team 2') {
      channel1Id = '851888705307803698';
      channel2Id = '851888741761155136';
    } else {
      channel1Id = '1040385852716630016';
      channel2Id = '1040385893191659680';
    }

    const payload = {
      users1: newArray1,
      users2: newArray2,
      channel1Id: channel1Id,
      channel2Id: channel2Id,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http.post(`https://mohsh-ds.herokuapp.com/move-users-to-channels`, JSON.stringify(payload), httpOptions).subscribe(
      (response) => {
        console.log('Move users to channels success:', response);
      },
      (error) => {
        console.error('Move users to channels error:', error);
      }
    );
  }

  // DISCORD.JS ===> REST APPROACH

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
    localStorage.setItem('mixway', 'HP');
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

    localStorage.setItem('mixway', 'LP');

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
    // console.log('ARRAY 1:', this.array1);
    // console.log('ARRAY 2:', this.array2);
    return [firstArray, secondArray];
  }

  // splitNationalities(array) {
  //   array.sort((a, b) => parseFloat(b.ranking.replace(',', '')) - parseFloat(a.ranking.replace(',', '')));
  //   let firstArray = [];
  //   let secondArray = [];
  //   let firstArraySum = 0;
  //   let secondArraySum = 0;
  //   console.log('ARRAY', array)

  //   const nationalities = [...new Set(array.map(player => player.flag))];
  //   if (nationalities.length > 1) {
  //     // Split players based on nationality
  //     for (let i = 0; i < array.length; i++) {
  //       let currentRanking = parseFloat(array[i].ranking.replace(',', ''));
  //       if (firstArraySum <= secondArraySum) {
  //         if (array[i].flag === nationalities[0]) {
  //           firstArray.push(array[i]);
  //           firstArraySum += currentRanking;
  //         } else {
  //           secondArray.push(array[i]);
  //           secondArraySum += currentRanking;
  //         }
  //       } else {
  //         if (array[i].flag === nationalities[1]) {
  //           secondArray.push(array[i]);
  //           secondArraySum += currentRanking;
  //         } else {
  //           firstArray.push(array[i]);
  //           firstArraySum += currentRanking;
  //         }
  //       }
  //     }
  //   } else {
  //     // If all players have the same nationality, split based on ranking
  //     for (let i = 0; i < array.length; i++) {
  //       let currentRanking = parseFloat(array[i].ranking.replace(',', ''));
  //       if (firstArraySum <= secondArraySum) {
  //         firstArray.push(array[i]);
  //         firstArraySum += currentRanking;
  //       } else {
  //         secondArray.push(array[i]);
  //         secondArraySum += currentRanking;
  //       }
  //     }
  //   }

  //   this.array1 = firstArray;
  //   this.array2 = secondArray;

  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS LP has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   // console.log('ARRAY 1:', this.array1);
  //   // console.log('ARRAY 2:', this.array2);
  //   return [firstArray, secondArray];
  // }

  // splitNationalities(array) {
  //   let flags = {};
  //   let firstArray = [];
  //   let secondArray = [];
  //   localStorage.setItem('mixway', 'NT');

  //   // Liczymy ile obiektów posiada każdą wartość flagi
  //   array.forEach(obj => {
  //     if (!flags[obj.flag]) flags[obj.flag] = 0;
  //     flags[obj.flag]++;
  //   });

  //   // Dla każdej wartości flagi przypisujemy do jednej z dwóch tablic
  //   Object.keys(flags).forEach(flag => {
  //     let count = flags[flag];
  //     let targetArray = firstArray.length <= secondArray.length ? firstArray : secondArray;

  //     for (let i = 0; i < count; i++) {
  //       let obj = array.find(obj => obj.flag === flag);
  //       targetArray.push(obj);
  //       array.splice(array.indexOf(obj), 1);
  //     }
  //   });
  //   this.array1 = firstArray;
  //   this.array2 = secondArray;
  //   // console.log('firstArray', firstArray)
  //   // console.log('secondArray', secondArray)
  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS NT has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   return [firstArray, secondArray];
  // }

  //


  // splitNationalities(inputArray) {
  //   if (inputArray.length % 2 !== 0) {
  //     console.error("Błąd: Tablica musi mieć parzystą liczbę obiektów.");
  //     return;
  //   }

  //   // Podział tablicy wejściowej na dwie równe części
  //   const half = inputArray.length / 2;
  //   const firstHalf = inputArray.slice(0, half);
  //   const secondHalf = inputArray.slice(half);

  //   // Pogrupowanie obiektów według wartości pola flag
  //   const groups = this.groupObjectsByFlag(inputArray);

  //   // Podział grup obiektów na dwie równe części
  //   const groupKeys = Object.keys(groups);
  //   const halfOfGroups = groupKeys.length / 2;
  //   const firstGroups = groupKeys.slice(0, halfOfGroups);
  //   const secondGroups = groupKeys.slice(halfOfGroups);

  //   // Łączenie grup obiektów w tablice wynikowe
  //   const firstArray = this.combineGroupsIntoArray(firstGroups, groups);
  //   const secondArray = this.combineGroupsIntoArray(secondGroups, groups);

  //   this.array1 = firstArray;
  //   this.array2 = secondArray;
  //   // console.log('firstArray', firstArray)
  //   // console.log('secondArray', secondArray)
  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS NT has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   return [firstArray, secondArray];
  // }

  groupObjectsByFlag(objects) {
    const groups = {};

    objects.forEach(obj => {
      const flag = obj.flag;
      if (groups[flag]) {
        groups[flag].push(obj);
      } else {
        groups[flag] = [obj];
      }
    });

    return groups;
  }

  combineGroupsIntoArray(groupKeys, groups) {
    const result = [];

    groupKeys.forEach(key => {
      const objects = groups[key];
      if (objects.length > result.length / 2) {
        result.push(...objects);
      } else {
        const remainingSpace = Math.floor((result.length / 2) - objects.length);
        const randomIndex = Math.floor(Math.random() * remainingSpace);
        result.splice(randomIndex, 0, ...objects);
      }
    });

    return result;
  }

  //

  splitNationalities(inputArray) {
    if (inputArray.length % 2 !== 0) {
      // console.error("Błąd: Tablica musi mieć parzystą liczbę obiektów.");
      this.notifier.notify('error', 'Players must be even')
      return;
    }
    localStorage.setItem('mixway', 'NT');

    const groups = this.groupObjectsByFlag(inputArray);
    const groupKeys = Object.keys(groups);

    const halfLength = Math.floor(inputArray.length / 2);
    const firstArray = [];
    const secondArray = [];

    let i = 0;
    while (i < groupKeys.length) {
      const flag = groupKeys[i];
      const objects = groups[flag];

      let j = 0;
      while (j < objects.length) {
        if (firstArray.length < halfLength) {
          firstArray.push(objects[j]);
        } else {
          secondArray.push(objects[j]);
        }
        j++;
      }
      i++;
    }

    this.array1 = firstArray;
    this.array2 = secondArray;
    this.sumTeam1 = this.sumRanking(firstArray);
    this.sumTeam2 = this.sumRanking(secondArray);

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
    this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
    this.notifier.notify('success', 'MIX TEAMS NT has finished executing');

    this.addArrayToUrl(firstArray, secondArray);
    return [firstArray, secondArray];
  }


  // splitNationalities(array) {
  //   let flags = {};
  //   let firstArray = [];
  //   let secondArray = [];
  //   localStorage.setItem('mixway', 'NT');

  //   // Check if the length of the input array is even
  //   let isEven = array.length % 2 === 0;
  //   if (!isEven) {
  //     // If it is not even, add a dummy object to the array
  //     let dummy = { flag: 'DUMMY_FLAG' };
  //     array.push(dummy);
  //   }

  //   // Liczymy ile obiektów posiada każdą wartość flagi
  //   array.forEach(obj => {
  //     if (!flags[obj.flag]) flags[obj.flag] = 0;
  //     flags[obj.flag]++;
  //   });

  //   // Dla każdej wartości flagi przypisujemy do jednej z dwóch tablic
  //   Object.keys(flags).forEach(flag => {
  //     let count = flags[flag];
  //     let targetArray = firstArray.length <= secondArray.length ? firstArray : secondArray;

  //     for (let i = 0; i < count; i++) {
  //       let obj = array.find(obj => obj.flag === flag);
  //       targetArray.push(obj);
  //       array.splice(array.indexOf(obj), 1);
  //     }
  //   });

  //   // Check if the lengths of the output arrays are different
  //   if (!isEven && firstArray.length !== secondArray.length) {
  //     // If they are different and we added a dummy object, remove it from the longer array and add it to the input array
  //     let longerArray = firstArray.length > secondArray.length ? firstArray : secondArray;
  //     let dummyIndex = longerArray.findIndex(obj => obj.flag === 'DUMMY_FLAG');
  //     let dummy = longerArray[dummyIndex];
  //     longerArray.splice(dummyIndex, 1);
  //     array.splice(array.indexOf(dummy), 1);
  //   }

  //   this.array1 = firstArray;
  //   this.array2 = secondArray;
  //   // console.log('firstArray', firstArray)
  //   // console.log('secondArray', secondArray)
  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS NT has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   return [firstArray, secondArray];
  // }

  // TO JEST PRAWIE OK - OBSŁUGA BŁĘDU
  // splitNationalities(array) {
  //   let flags = {};
  //   let firstArray = [];
  //   let secondArray = [];
  //   localStorage.setItem('mixway', 'NT');

  //   // Check if the length of the input array is even
  //   let isEven = array.length % 2 === 0;
  //   if (!isEven) {
  //     // If it is not even, add a dummy object to the array
  //     let dummy = { flag: 'DUMMY_FLAG' };
  //     array.push(dummy);
  //   }

  //   // Liczymy ile obiektów posiada każdą wartość flagi
  //   array.forEach(obj => {
  //     if (!flags[obj.flag]) flags[obj.flag] = 0;
  //     flags[obj.flag]++;
  //   });

  //   // Check if any flag value appears in more than half of the objects
  //   let invalidFlag = Object.keys(flags).find(flag => flags[flag] > array.length / 2);
  //   if (invalidFlag) {
  //     throw new Error(`More than half of the objects have the same flag value (${invalidFlag})`);
  //   }
  //   // Dla każdej wartości flagi przypisujemy do jednej z dwóch tablic
  //   Object.keys(flags).forEach(flag => {
  //     let count = flags[flag];
  //     let targetArray = firstArray.length <= secondArray.length ? firstArray : secondArray;

  //     for (let i = 0; i < count; i++) {
  //       let obj = array.find(obj => obj.flag === flag);
  //       targetArray.push(obj);
  //       array.splice(array.indexOf(obj), 1);
  //     }
  //   });

  //   // Check if the lengths of the output arrays are different
  //   if (!isEven && firstArray.length !== secondArray.length) {
  //     // If they are different and we added a dummy object, remove it from the longer array and add it to the input array
  //     let longerArray = firstArray.length > secondArray.length ? firstArray : secondArray;
  //     let dummyIndex = longerArray.findIndex(obj => obj.flag === 'DUMMY_FLAG');
  //     let dummy = longerArray[dummyIndex];
  //     longerArray.splice(dummyIndex, 1);
  //     array.splice(array.indexOf(dummy), 1);
  //   }

  //   this.array1 = firstArray;
  //   this.array2 = secondArray;
  //   console.log('firstArray', firstArray)
  //   console.log('secondArray', secondArray)
  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS NT has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   this.addArrayToUrl(firstArray, secondArray)
  //   return [firstArray, secondArray];
  // }







  // splitRanking2(array) {
  //   //NO BLADY and ILLU same team
  //   array.sort((a, b) => parseFloat(b.ranking.replace(',', '')) - parseFloat(a.ranking.replace(',', '')));
  //   let firstArray = [];
  //   let secondArray = [];
  //   let firstArraySum = 0;
  //   let secondArraySum = 0;

  //   for (let i = 0; i < array.length; i++) {
  //     let currentRanking = parseFloat(array[i].ranking.replace(',', ''));
  //     if (firstArraySum <= secondArraySum) {
  //       if (array[i].username === "blady") {
  //         secondArray.push(array[i]);
  //         secondArraySum += currentRanking;
  //       } else {
  //         firstArray.push(array[i]);
  //         firstArraySum += currentRanking;
  //       }
  //     } else {
  //       if (array[i].username === "illusion") {
  //         firstArray.push(array[i]);
  //         firstArraySum += currentRanking;
  //       } else {
  //         secondArray.push(array[i]);
  //         secondArraySum += currentRanking;
  //       }
  //     }
  //   }
  //   this.array1 = firstArray;
  //   this.array2 = secondArray;

  //   this.sumTeam1 = this.sumRanking(firstArray)
  //   this.sumTeam2 = this.sumRanking(secondArray)

  //   const chanceOfWinTeamOne = 1 / (1 + 10 ** ((this.sumTeam1 - this.sumTeam2) / 400)) * 100;
  //   const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((this.sumTeam2 - this.sumTeam1) / 400)) * 100;
  //   this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
  //   this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);
  //   this.notifier.notify('success', 'MIX TEAMS LP has finished executing');

  //   this.addArrayToUrl(firstArray, secondArray)
  //   return [firstArray, secondArray];
  // }


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

    // TEAM 1
    let t1p1name = '';
    let t1p2name = '';
    let t1p3name = '';
    let t1p4name = '';
    let t1p5name = '';
    let t1p6name = '';
    let t1p7name = '';

    if (this.array1[0]) {
      t1p1name = this.array1[0].username ? this.array1[0].username : '';
    } else {
      t1p1name = '';
    }
    if (this.array1[1]) {
      t1p2name = this.array1[1].username ? this.array1[1].username : '';
    } else {
      t1p2name = '';
    }
    if (this.array1[2]) {
      t1p3name = this.array1[2].username ? this.array1[2].username : '';
    } else {
      t1p3name = '';
    }
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

    //TEAM 2
    let t2p1name = '';
    let t2p2name = '';
    let t2p3name = '';
    let t2p4name = '';
    let t2p5name = '';
    let t2p6name = '';
    let t2p7name = '';

    if (this.array2[0]) {
      t2p1name = this.array2[0].username ? this.array2[0].username : '';
    } else {
      t2p1name = '';
    }
    if (this.array2[1]) {
      t2p2name = this.array2[1].username ? this.array2[1].username : '';
    } else {
      t2p2name = '';
    }
    if (this.array2[2]) {
      t2p3name = this.array2[2].username ? this.array2[2].username : '';
    } else {
      t2p4name = '';
    }
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
    // Last War and Log
    // const webhookUrl = 'https://discord.com/api/webhooks/1075178845067563138/FpKf7iiu3dhI9NTxyS-VkMNcv4mdq2KORNhNUbkeZnfCgLtDaJSIFxi9Uz5YUTCDPqmX';

    let mixWay = localStorage.getItem('mixway');

    // General Chat
    const webhookUrl = 'https://discord.com/api/webhooks/1075499431207645284/B0aRKfrobBHm2NKwM8Z6HGdkn0dt17xT3N1ssnXwFbyoNYNjgezteQLYuO5VY33MK2nS';

    const arr1 = this.array1;
    const arr2 = this.array2;

    const selectRandomPlayer = (arr: {playername: string}[]): string => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex].playername;
    };

    console.log('arr1', arr1)
    console.log('arr2', arr2)

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

    const funnyOneLiners: string[] = 
    ["He is the sniper on the grassy knoll!", 
    "He didn't choose the camp life, the camp life chose him.", 
    "Headshot! Sorry, wrong game...", 
    "He's not camping, He's just waiting for your s'mores to cook.", 
    "If you can't beat 'em, cheat 'em!", 
    "Official? I m coming for You!",
    "I'm not lost, I'm just exploring the enemy spawn point.", 
    "This isn't camping, it's strategic resting.", 
    "If at first you don't succeed, call for an airstrike.", 
    "I'm not a hacker, I'm just really good at guessing your spot.", 
    "I'm not a camper, I'm a wildlife photographer."];


    const admin = `ADMIN: ${selectRandomPlayer([...arr1, ...arr2])}`;

    const arr = [...arr1, ...arr2]; // łączymy obie tablice w jedną
    let highestRanking = -Infinity; // zaczynamy od bardzo niskiej wartości
    let highestRankingPlayer = '';
    
    for (const player of arr) {
      const ranking = parseInt(player.ranking); // konwertujemy ranking na liczbę
    
      if (ranking > highestRanking) {
        highestRanking = ranking;
        highestRankingPlayer = player.playername;
      }
    }
    

    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    const chanceFutureTeamOne = this.sumRanking(arr1)
    const chanceFutureTeamTwo = this.sumRanking(arr2)

    let chanceOfWinTeamOneShow = 0;
    let chanceOfWinTeamTwoShow = 0;

    const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne - chanceFutureTeamTwo) / 400)) * 100;
    const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo - chanceFutureTeamOne) / 400)) * 100;

    chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
    chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);

    let nextMatch = "";
    nextMatch += "**NEXT MATCH**, (" + mixWay + ") created: " + formattedDate + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 1: " + t1p1name + " " + t1p2name + " " + t1p3name + " " + t1p4name + " " + t1p5name + " " + t1p6name + " " + t1p7name + "\n";
    nextMatch += "TEAM 1 Chance for win: " + chanceOfWinTeamTwoShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "TEAM 2: " + t2p1name + " " + t2p2name + " " + t2p3name + " " + t2p4name + " " + t2p5name + " " + t2p6name + " " + t2p7name + "\n";
    nextMatch += "TEAM 2 Chance for win: " + chanceOfWinTeamOneShow + " %" + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "SS MAKER: **" + highestRankingPlayer + "** " + `${funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]}` + "\n";
    nextMatch += "----------" + "\n";
    nextMatch += "Good Luck & Have Fun!";
    console.log('nextM', nextMatch);
    // const payload = {
    //   content: nextMatch
    // };
    // this.http.post(webhookUrl, payload).subscribe({
    //   next: (res) => {
    //     this.notifier.notify('success', "Teams Send successful!")
    //   }, error: (err) => {
    //     this.notifier.notify('error', 'Something went wrong')
    //   }
    // });
  }

  isValid(): boolean {
    return this.array1 && this.array1.length > 2 && this.array2 && this.array2.length > 2;
  }
}


