import { NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CupRoutingModule } from './cup-routing.module';
import { CupComponent } from './cup.component';
import { NgttSingleEliminationTreeModule } from '../../../projects/ng-tournament-tree/src/lib/single-elimination-tree/ngtt-single-elimination-tree.module';
import { NgttDoubleEliminationTreeModule } from '../../../projects/ng-tournament-tree/src/lib/double-elimination-tree/ngtt-double-elimination-tree.module';
import { MatchModule } from './match/match.module';
import { NgxLodashPipesModule  } from 'ngx-lodash-pipes';
import { RulesComponent } from './rules/rules.component';

@NgModule({
  declarations: [
    CupComponent,
    RulesComponent,
  ],
  imports: [
    CommonModule,
    CupRoutingModule,
    NgttSingleEliminationTreeModule,
    NgttDoubleEliminationTreeModule,
    MatchModule,
    NgxLodashPipesModule
  ],
  
})
export class CupModule { }
