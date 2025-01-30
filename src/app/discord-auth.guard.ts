import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscordLoginDialogComponent } from './shared/discord-login-dialog/discord-login-dialog.component';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})

export class DiscordAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog, private oAuthService: OAuthService) {}

  private rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League players'
  };

  canActivate(): boolean {
     // Sprawdzanie logowania przez Discord
     const isLoggedInDiscord = this.authService.isLoggedIn();

     // Sprawdzanie logowania przez Google
     const isLoggedInGoogle = this.oAuthService.hasValidAccessToken();
 
     if (isLoggedInDiscord && isLoggedInGoogle) {
      return true; 
    } else {
      this.openLoginDialog();
      // this.router.navigate(['/dashboard']); 
      return false;
    }
  }

  openLoginDialog(): void {
    this.dialog.open(DiscordLoginDialogComponent, {
      width: '400px',
    });
  }
}
