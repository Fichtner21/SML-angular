import { switchMap, take } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from 'rxjs';
import { RankObjService } from '../../rank-obj.service';
import { Players } from '../../ranking.model';

@Injectable()
export class PlayerViewResolve implements Resolve<Observable<Players>> {
  constructor(private rankObjService: RankObjService){}

  resolve(route: ActivatedRouteSnapshot) {
    return this.rankObjService.players$.pipe(
      take(1),
      switchMap((players: Players[]) => {
        return (players.length > 0) ? this.rankObjService.getSinglePlayer(route.params['username']).pipe(take(1)) : this.fetchPlayersAndGetSinglePlayer(route.params['username']);
      })
    )
  }

  private fetchPlayersAndGetSinglePlayer(username: string): Observable<Players> 
  {
    return this.rankObjService.fetchPlayers().pipe(
      switchMap(() => this.rankObjService.getSinglePlayer(username).pipe(take(1)))
    )
  }
}