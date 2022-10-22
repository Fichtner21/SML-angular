import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from './about/secret/secret.model';
import { AuthService } from './auth.service';
import { PlayersApiService } from './services/players-api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public contactPlayers$: Observable<Contact[]>;
  
  constructor(private _authService: AuthService, private router: Router, private playersApiService: PlayersApiService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this._authService.loggedIn()){       
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }      
  }
}
