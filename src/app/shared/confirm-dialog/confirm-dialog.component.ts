import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';
export interface FormData {
  scoreTeamOne: any;
  scoreTeamTwo: any;
  teamOneRoundsWon: any;
  teamTwoRoundsWon: any;
  t1p1name: any;
  t1p2name: any;
  t1p3name: any;
  t1p4name: any;
  t1p5name: any;
  t1p6name: any;
  t1p7name: any;
  t2p1name: any;
  t2p2name: any;
  t2p3name: any;
  t2p4name: any;
  t2p5name: any;
  t2p6name: any;
  t2p7name: any;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Przyjmujemy dane z formularza jako input,
    private listPlayersService: PlayersApiService
  ) {}

  // getPlayerName(username: string): Observable<string> {
  //   return this.listPlayersService.getPlayers(username).pipe(
  //     switchMap(player => {
  //       const playerName = player.values[0][1]; // Przyjmując, że imię gracza znajduje się na pierwszej pozycji w pierwszej kolumnie
  //       console.log('playerName', playerName)
  //       return of(playerName); // Zwracamy imię gracza
  //     })
  //   );
  // }
  getPlayerData(username: string): any {
    const player = this.data.playerRowArray.find(player => player.username === username);
    return player ? { playername: player.name, nationality: player.nationality } : { playername: '', nationality: '' };
  }


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
