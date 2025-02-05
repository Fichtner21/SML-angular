import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-screenshot-modal',
  templateUrl: './screenshot-modal.component.html',
  styleUrls: ['./screenshot-modal.component.scss']
})
export class ScreenshotModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ScreenshotModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
