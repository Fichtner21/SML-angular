import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-confirm-update-elo-aa',
  templateUrl: './confirm-update-elo-aa.component.html',
  styleUrls: ['./confirm-update-elo-aa.component.scss']
})
export class ConfirmUpdateEloAaComponent implements OnInit {

  displayedColumns: string[] = ['player', 'elo', 'Frags'];
  playersData: any[] = [];   

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmUpdateEloAaComponent>,
    private playersApi: PlayersApiService
  ) {
    console.log('DATA', data)
  }

  ngOnInit() {
    this.playersApi.getPlayersFinalShort('Players_AA').subscribe(
      players => {
        this.playersData = players;  // Przypisanie danych do zmiennej
      },
      error => {
        console.error('Błąd podczas pobierania graczy:', error);  // Obsługa błędów
      }
    );
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }  

}
