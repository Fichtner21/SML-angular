import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankingObjComponent } from './ranking-obj.component';
import { PlayerViewComponent } from './player-view/player-view.component';

const routes: Routes = [
  {
    path: '',
    component: RankingObjComponent,
  },
  {
    path: ':username',
    component: PlayerViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RankingObjRoutingModule {}