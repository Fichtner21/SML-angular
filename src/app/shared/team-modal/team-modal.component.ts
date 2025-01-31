import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss']
})
export class TeamModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public team: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
