import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { DashboardComponent } from './dashboard.component';
import { CreateDataComponent } from './create-data/create-data.component';
import { ListDataComponent } from './list-data/list-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';

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
    path: 'create-player',
    component: CreateDataComponent,
  },  
  {
    path: 'edit-player/:username',
    component: EditDataComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }