import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent  {

  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isLoggedIn = this.authService.isLoggedInGoogle();
  }

  // Funkcja logowania
  login() {
    this.authService.login();
    this.dialogRef.close(true);
  }

  // Funkcja wylogowywania
  logout() {
    this.authService.logout();
    this.dialogRef.close(false);
  }

  // Zamknięcie okna dialogowego
  close() {
    this.dialogRef.close();
  }

}
