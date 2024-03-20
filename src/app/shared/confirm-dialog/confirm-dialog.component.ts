import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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

export class ConfirmDialogComponent implements OnInit {
  isConfirmButtonDisabled: boolean = false;
  faCheck = faCheck;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Przyjmujemy dane z formularza jako input,    
  ) {}

  ngOnInit() {
    if (this.data.form.teamOneRoundsWon.t1roundsWonInput === undefined || this.data.form.teamOneRoundsWon.t1roundsWonInput === '' || this.data.form.teamOneRoundsWon.t1roundsWonInput === 0) {
      this.isConfirmButtonDisabled = true;
    } else {
      for (let i = 0; i < 7; i++) {
        let player = `t1p${i + 1}name`;
        if (this.data.form[player] === '' || this.data.form.scoreTeamOne[`t1p${i + 1}score`] === '') {
          this.isConfirmButtonDisabled = true;
          break;
        }
      }
    }
  }

  isConfirmButtonEnabled(): boolean {
    // Sprawdzamy, czy wszystkie dane są wprowadzone
    const allPlayersFilled = Object.values(this.data.form).every(value => value !== '');
    // Sprawdzamy, czy obie drużyny mają wpisane rundy
    const roundsFilled = this.data.form.teamOneRoundsWon.t1roundsWonInput !== undefined && this.data.form.teamOneRoundsWon.t1roundsWonInput !== '' &&
                        this.data.form.teamTwoRoundsWon.t2roundsWonInput !== undefined && this.data.form.teamTwoRoundsWon.t2roundsWonInput !== '';
    // Zwracamy, czy oba warunki są spełnione
    return allPlayersFilled && roundsFilled;
  }


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
