import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RankingObjComponent } from './ranking-obj/ranking-obj.component';



const routes: Routes = [{
  path: 'home',
  component: HomeComponent,
},
{
  path: 'obj-ranking',
  component: RankingObjComponent,
},
{
  path: 'obj-matches',
  loadChildren: () => import('./history-obj/history-obj.module').then(m => m.HistoryObjModule)
}, 
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
