import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscordLoginDialogComponent } from './shared/discord-login-dialog/discord-login-dialog.component';

@Injectable({
  providedIn: 'root'
})

export class DiscordAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) {}

  private rolesMap: { [key: string]: string } = {
    '1059920877044629614': 'OWNER',
    '716736352359809095': 'admin',
    '915354110302249011': 'League players'
  };

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
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

  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     const userRoles = this.authService.getUserRoles2(); // Zakładam, że masz metodę do pobierania ról użytkownika
  //     const hasAccess = userRoles.some(role => this.rolesMap[role]);

  //     if (hasAccess) {
  //       return true; 
  //     } else {
  //       this.router.navigate(['/dashboard']); 
  //       return false;
  //     }
  //   } else {
  //     this.router.navigate(['/dashboard']); 
  //     return false;
  //   }
  // }
}
