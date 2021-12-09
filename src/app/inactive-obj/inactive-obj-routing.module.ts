import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InactiveObjComponent } from './inactive-obj.component';
import { InactiveViewComponent } from './inactive-view/inactive-view.component';


const routes: Routes = [
  {
    path: '',
    component: InactiveObjComponent,
  },
  {
    path: ':username',
    component: InactiveViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InactiveObjRoutingModule { }
