import { switchMap, take } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RankObjService } from 'src/app/ranking-obj/rank-obj.service';
import { Players } from 'src/app/ranking-obj/ranking.model';
import { Observable } from 'rxjs';

@Injectable()
export class SinglePlayerResolve implements Resolve<Observable<Players>>{
  constructor(private fetchSinglePlayer: RankObjService){}

  resolve(route: ActivatedRouteSnapshot){
    return this.fetchSinglePlayer.players$.pipe(
      take(1),
      switchMap((players: Players[]) =>{
        return (players.length > 0) ? this.fetchSinglePlayer.getSinglePlayer(route.params['username']).pipe(take(1)) : this.fetchPlayersAndGetSinglePlayer(route.params['username']);
      })
    )
  }

  private fetchPlayersAndGetSinglePlayer(username: string):
  Observable<Players> {
    return this.fetchSinglePlayer.fetchPlayers().pipe(
      switchMap(() => this.fetchSinglePlayer.getSinglePlayer(username).pipe(take(1)))
    )
  }
}