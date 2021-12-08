import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetflagService {
  public playerFlag = '';

  constructor() { }

  getPlayerFlag(playerFlag) {   
      switch (this.playerFlag) {
        case 'EU': {
          this.playerFlag = `<img src="./assets/flags/_e.gif" title="EU">`;
          break;
        }
        case 'PL': {
          this.playerFlag = `<img src="./assets/flags/pl.gif" title="Poland">`;
          break;
        }      
        default:
         console.log('Nie pasuje');
      }
      return this.playerFlag;
    }
}
