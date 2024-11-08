import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html'
})
export class ChallengeModalComponent {
  selectedChallenger: string | null = null;
  filteredClans: any[] = [];
  selectedFormats: string[] = []; // Zmienna do przechowywania wybranych formatów
  allFormats: string[] = ['2vs2', '3vs3', '4vs4', '5vs5', 'more']; // Możliwe formaty

  constructor(
    public dialogRef: MatDialogRef<ChallengeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Filter out the challenged clan from the list
    this.filteredClans = this.data.clans.filter(clan => clan.clan !== this.data.challengedClan.clan);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.selectedChallenger) {
      const challengeData = {
        challenger: this.selectedChallenger,
        formats: this.selectedFormats // Przekaż wybrane formaty
      };
      this.dialogRef.close(challengeData);
    }
  }

  toggleFormat(format: string): void {
    const index = this.selectedFormats.indexOf(format);
    if (index === -1) {
      // Jeśli format nie jest zaznaczony, dodaj go
      this.selectedFormats.push(format);
    } else {
      // Jeśli format jest zaznaczony, usuń go
      this.selectedFormats.splice(index, 1);
    }
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.selectedFormats = [...this.allFormats]; // Zaznacz wszystkie
    } else {
      this.selectedFormats = []; // Odznacz wszystkie
    }
  }

  isFormatSelected(format: string): boolean {
    return this.selectedFormats.includes(format); // Sprawdź, czy format jest zaznaczony
  }
}