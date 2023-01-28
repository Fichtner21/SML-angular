import { Injectable } from '@angular/core';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
   public client_id = '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com';
  public scope = [
    'https://www.googleapis.com/auth/spreadsheets' 
  ];
  public imediate = true;
  constructor() {
    gapi.load('client', () => {
      gapi.client.load('sheets', 'v4', () => {
        // now we can use gapi.client.sheets
        // ...
        async gapi.client.sheets.spreadsheets.get({ spreadsheetId: "spreadsheetId",  });
      });
    });
   }
}

// gapi.client.init({
  // var client_id = '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com',
  // scope = [
  //   'https://www.googleapis.com/auth/spreadsheets' 
  // ],
  // imed
// })