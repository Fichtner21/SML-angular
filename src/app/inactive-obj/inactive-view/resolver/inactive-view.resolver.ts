import { switchMap, take } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from 'rxjs';
import { InactiveObjService } from '../../inactive-obj.service';
import { InactivePlayers } from '../../inactive.model';

@Injectable()
export class InactiveViewResolve implements Resolve<Observable<InactivePlayers>> {
  constructor(private inactiveObjService: InactiveObjService){
    
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.inactiveObjService.players$.pipe(
      take(1),
      switchMap((players: InactivePlayers[]) => {
        return (players.length > 0) ? this.inactiveObjService.getSingleInactivePlayer(route.params['username']).pipe(take(1)) : this.fetchPlayersAndGetSinglePlayer(route.params['username']);
      })
    )
  }

  private fetchPlayersAndGetSinglePlayer(username: string): Observable<InactivePlayers> 
  {
    return this.inactiveObjService.fetchInactivePlayers().pipe(
      switchMap(() => this.inactiveObjService.getSingleInactivePlayer(username).pipe(take(1)))
    )
  }
}