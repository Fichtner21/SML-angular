import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerViewComponent } from '../ranking-obj/player-view/player-view.component';
import { HistoryObjComponent } from './history-obj.component';
import { SingleMatchResolve } from './single-match/resolver/single-match.resolver';
import { SinglePlayerResolve } from './single-match/resolver/single-player.resolver';
import { SingleMatchComponent } from './single-match/single-match.component';

const routes: Routes = [
  { 
    path: '', 
    component: HistoryObjComponent,    
  },
  {
    path: ':idwar',
    component: SingleMatchComponent,
    resolve: { match: SingleMatchResolve }
  },
  {
    path: 'page/:page',
    component: HistoryObjComponent,
  },
  {
    path: ':username',
    component: PlayerViewComponent,
    resolve: { player: SinglePlayerResolve }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
