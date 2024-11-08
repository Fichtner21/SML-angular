import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { DashboardComponent } from './dashboard.component';
import { CreateDataComponent } from './create-data/create-data.component';
import { ListDataComponent } from './list-data/list-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { AddClanComponent } from './add-clan/add-clan.component';
import { EditClanComponent } from './edit-clan/edit-clan.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],       
  },
  {
    path: 'list-players',
    component: ListDataComponent
  },
  {
    path: 'list-clans',
    component: EditClanComponent
  },
  {
    path: 'create-player',
    component: CreateDataComponent,
  },  
  {
    path: 'edit-player/:username',
    component: EditDataComponent
  },
  {
    path: 'add-clan',
    component: AddClanComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }