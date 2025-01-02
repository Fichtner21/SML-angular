import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-confirm-update-elo',
  templateUrl: './confirm-update-elo.component.html',
  styleUrls: ['./confirm-update-elo.component.scss']
})
export class ConfirmUpdateEloComponent implements OnInit {
  displayedColumns: string[] = ['player', 'elo', 'Frags'];
  playersData: any[] = [];   

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmUpdateEloComponent>,
    private playersApi: PlayersApiService
  ) {}

  ngOnInit() {
    this.playersApi.getPlayersFinalShort('Players').subscribe(
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
