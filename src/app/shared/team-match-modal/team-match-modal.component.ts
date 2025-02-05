import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team-match-modal',
  templateUrl: './team-match-modal.component.html',
  styleUrls: ['./team-match-modal.component.scss']
})
export class TeamMatchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TeamMatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public match: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
