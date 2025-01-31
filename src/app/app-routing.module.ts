import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MixUsComponent } from './mix-us/mix-us.component';
import { AddClanMatchComponent } from './add-clan-match/add-clan-match.component';
import { ClanListComponent } from './clan-list/clan-list.component';
import { ClanMatchesListComponent } from './clan-matches-list/clan-matches-list.component';
import { ClanDetailComponent } from './clan-detail/clan-detail.component';
import { UpdateEloComponent } from './update-elo/update-elo.component';
import { DiscordAuthGuard } from './discord-auth.guard';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AdminComponent } from './admin/admin.component';
import { RankingObjAaComponent } from './ranking-obj-aa/ranking-obj-aa.component';
import { UploadComponent } from './upload/upload.component';
import { HistoryObjAaComponent } from './history-obj-aa/history-obj-aa.component';
import { BracketComponent } from './bracket/bracket.component';

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
  path: 'matches-aa',
  component: HistoryObjAaComponent
},
{
  path: 'about',
  loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
},
{
  path: 'cup',
  // loadChildren: () => import('./cup/cup.module').then(m => m.CupModule)
  // component: HomeComponent
  component: BracketComponent
},
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
},
{
  path: 'mix',
  component: MixUsComponent  
},
{ 
  path: 'clan-ranking',
  component: ClanListComponent
},
{
  path: 'clan-matches',
  component: ClanMatchesListComponent
},
{ 
  path: 'clan/:clan', 
  component: ClanDetailComponent 
},
{
  path: 'update-elo',
  component: UpdateEloComponent,
  canActivate: [DiscordAuthGuard]
},
{
  path: 'upload',
  component: UploadComponent
},
{
  path: 'add-clan-war',
  component: AddClanMatchComponent,
  canActivate: [DiscordAuthGuard]
},
{
  path: 'tournament',
  component: BracketComponent
},
{
  path: 'obj-aa',
  component: RankingObjAaComponent,
},
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [DiscordAuthGuard]
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
  path: 'discord-callback',
  component: AuthCallbackComponent
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
