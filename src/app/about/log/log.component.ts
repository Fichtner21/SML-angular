import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

interface Result {
  name: string;
  death: number;
  kills: number; 
}


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  private _jsonURL = '../../../assets/logs/example.json';
  // public arr = ["was"];
  public arr = [" was rifled by ", " was machine-gunned by ", " was bashed by ", " was gunned down by ", " was sniped by ", " was crushed by ", " was clubbed by ", " was perforated by ", " pumped full of buckshot by "]
  public jsonObj: Observable<any>;
  public results: Result[] = [];

  constructor(private http: HttpClient) {
  this.getJSON().subscribe(data => {
        console.log(data);
        // let jsonString = '[{} {}]';
        // let jsonArray = JSON.parse(data);
        // let jsonWithCommas = JSON.stringify(jsonArray).replace(/}{/g, '},{');
        // console.log("jsonWithCommas", jsonWithCommas)
      }, error => {
        //console.error(error);
      });
    }

  public getJSON(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this._jsonURL);
    // return this.http.get(this._jsonURL, { headers }).pipe(
    //   // catchError(err => {
    //   //   console.error(err);
    //   //   return throwError(err);
    //   // })
    // );
  }



  ngOnInit(): void {
  
    this.getJSON().subscribe((data) => {
      this.processMessages(data, this.arr);
    });
  } 
  
  // processMessages(json: any, arr: string[]): Result[] {
  //   const results: Result[] = [];
  //   console.log('json', json)
  //   json.forEach((item: any) => {
  //     console.log('item', item)
  //     try {
  //       const message = item?.jsonPayload.message;
  //       const messageWords = message?.split(' ') || [];
  //       console.log('message', message);
  //       console.log('messageWords', messageWords)
  
  //       arr.forEach((word: string) => {
  //         const index = messageWords.indexOf(word);
  //         console.log('index', index);
  
  //         if (index !== -1) {
  //           const name = messageWords[index - 1];
  //           const action = word;
  //           const target = messageWords[index + 1];
  
  //           let resultIndex = results.findIndex((result) => result.name === name);
  
  //           if (resultIndex === -1) {
  //             results.push({
  //               name: name,
  //               death: 0,
  //               kills: 0
  //             });
  
  //             resultIndex = results.length - 1;
  //           }
  
  //           if (target === undefined) {
  //             // Someone was killed without a specified target
  //             results[resultIndex].death++;
  //           } else if (action === 'was sniped by' || action === 'was gunned down by' || action === 'pumped full of buckshot by') {
  //             // Someone was killed with a specified target
  //             let targetIndex = results.findIndex((result) => result.name === target);
  
  //             if (targetIndex === -1) {
  //               results.push({
  //                 name: target,
  //                 death: 1,
  //                 kills: 0
  //               });
  
  //               targetIndex = results.length - 1;
  //             } else {
  //               results[targetIndex].death++;
  //             }
  
  //             results[resultIndex].kills++;
  //           } else {
  //             // Someone was killed without a specified target
  //             results[resultIndex].death++;
  //           }
  //         }
  //       });
  //     } catch (e) {
  //       console.error(`Error parsing JSON: ${e}`);
  //     }
  //   });
  
  //   console.log('RESULTS', results);
  //   return results;
  // }

  // processMessages(json: any[], arr: string[]): any[] {
  //   const results: any[] = [];
  
  //   json.forEach((item) => {
  //     const message = item?.jsonPayload?.message;
  //     if (message) {
  //       arr.forEach((pattern) => {
  //         const regex = new RegExp(pattern, 'i');
  //         if (regex.test(message)) {
  //           results.push({
  //             time: item.timestamp,
  //             player: message.split(pattern)[0],
  //             action: pattern.replace(' was ', '').replace(' by', ''),
  //             target: message.split(pattern)[1].trim(),
  //           });
  //         }
  //       });
  //     }
  //   });
  // console.log('results', results)
  //   return results;
  // }

  // processMessages(json: any[], arr: string[]): any[] {
  //   const results: any[] = [];

  //   json.forEach((item) => {
  //     const message = item?.jsonPayload?.message;
  //     if (message) {
  //       arr.forEach((pattern) => {
  //         const regex = new RegExp(pattern, 'i');
  //         if (regex.test(message)) {
  //           const [name, action, target] = message.split(regex);
  //           const killObject = results.find((obj) => obj.name === name) || {
  //             name,
  //             kills: 0,
  //             death: 0,
  //             killedBy: [],
  //             weaponBy: [],
  //           };
  //           if (regex.test(arr[0])) {
  //             killObject.death += 1;
  //           } else {
  //             killObject.kills += 1;
  //           }
  //           if (!killObject.killedBy.includes(target)) {
  //             killObject.killedBy.push(target);
  //           }
  //           if (!killObject.weaponBy.includes(action)) {
  //             killObject.weaponBy.push(action);
  //           }
  //           if (!results.includes(killObject)) {
  //             results.push(killObject);
  //           }
  //         }
  //       });
  //     }
  //   });
  //   console.log('results', results)
  //   return results;
  // }
  processMessages(json: any[], arr: string[]): any[] {
    const results: any[] = [];
    const players: any = {};

    const newJson = JSON.stringify(json);
    console.log('newJson', Object.keys(json))
    console.log('------------');
    // console.log('json', json);

    Object.keys(json)
  
    json.forEach((item) => {
      const message = item?.jsonPayload?.message;
      if (message) {
        arr.forEach((pattern) => {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(message)) {
            const playerName = message.split(pattern)[0].trim();
            const targetName = message.split(pattern)[1].trim();
            const isDeath = pattern.includes(' was ');
            
            if (players[playerName]) {
              if (isDeath) {
                players[playerName].death += 1;
              } else {
                players[playerName].kills += 1;
              }
            } else {
              players[playerName] = {
                name: playerName,
                kills: isDeath ? 0 : 1,
                death: isDeath ? 1 : 0,
                killedBy: {},
                weaponBy: {},
              };
            }
  
            if (players[targetName]) {
              if (isDeath) {
                players[targetName].kills += 1;
                players[playerName].killedBy[targetName] = players[targetName].kills;
                players[playerName].weaponBy[targetName] = pattern;
              } else {
                players[targetName].death += 1;
              }
            } else {
              players[targetName] = {
                name: targetName,
                kills: isDeath ? 1 : 0,
                death: isDeath ? 0 : 1,
                killedBy: {},
                weaponBy: {},
              };
              if (isDeath) {
                players[playerName].killedBy[targetName] = 1;
                players[playerName].weaponBy[targetName] = pattern;
              }
            }
          }
        });
      }
    });
  
    for (const player in players) {
      if (players.hasOwnProperty(player)) {
        results.push(players[player]);
      }
    }
  
    console.log('results', results);
  
    return results;
  }
  
  
}
