import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CupComponent } from './cup.component';
import { MatchComponent } from './match/match.component';
import { RulesComponent } from './rules/rules.component';

const routes: Routes = [
  {
    path: '',
    component: CupComponent
    // component: RulesComponent
  },
  {
    path: 'match',
    component: MatchComponent
  },
  {
    path: 'rules',
    component: RulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CupRoutingModule { }
