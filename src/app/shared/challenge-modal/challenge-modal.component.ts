import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-challenge-modal',
  templateUrl: './challenge-modal.component.html'
})
export class ChallengeModalComponent {
  selectedChallenger: string | null = null;
  filteredClans: any[] = [];

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
      this.dialogRef.close(this.selectedChallenger);
    }
  }
}
