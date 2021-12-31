import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InactiveObjComponent } from './inactive-obj.component';
import { InactiveViewComponent } from './inactive-view/inactive-view.component';
import { InactiveViewResolve } from './inactive-view/resolver/inactive-view.resolver';

const routes: Routes = [
  {
    path: '',
    component: InactiveObjComponent,
  },
  {
    path: ':username',
    component: InactiveViewComponent,
    resolve: { player: InactiveViewResolve }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactiveObjRoutingModule { }
