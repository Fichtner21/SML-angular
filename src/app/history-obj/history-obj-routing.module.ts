import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryObjComponent } from './history-obj.component';
import { SingleMatchComponent } from './single-match/single-match.component';



const routes: Routes = [
  { 
    path: '', 
    component: HistoryObjComponent,
    children: [
      // {
      //   path: 'list',
      //   component: WebsiteListComponent,
      // },
      {
        path: ':idwar',
        component: SingleMatchComponent,
      }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
