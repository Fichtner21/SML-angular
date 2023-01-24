import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
},
{
  path: 'obj-inactive',
  loadChildren: () => import('./inactive-obj/inactive-obj.module').then(m => m.InactiveObjModule)
}, 
{
  path: 'obj-ranking',
  loadChildren: () => import('./ranking-obj/ranking-obj.module').then(m => m.RankingObjModule)
},
{
  path: 'obj-matches',
  loadChildren: () => import('./history-obj/history-obj.module').then(m => m.HistoryObjModule)
}, 
{
  path: 'about',
  loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
},
{
  path: 'cup',
  loadChildren: () => import('./cup/cup.module').then(m => m.CupModule)
  // component: HomeComponent
},
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{ 
  path: 'login' , 
  component: LoginComponent
},
{ 
  path: 'logout', 
  component: LogoutComponent 
},
{
  path: 'home',
  redirectTo: 'home',
  pathMatch: 'full'
},
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
