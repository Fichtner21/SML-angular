import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-discord-login-dialog',
  templateUrl: './discord-login-dialog.component.html',
  styleUrls: ['./discord-login-dialog.component.scss']
})
export class DiscordLoginDialogComponent  {

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }
 
  loginWithDiscord() {
    this.authService.loginWithDiscord();
  }

  reject(){
    this.dialog.closeAll()
    this.router.navigate(['/'])
  }
}
