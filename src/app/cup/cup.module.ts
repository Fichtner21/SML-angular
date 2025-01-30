import { NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CupRoutingModule } from './cup-routing.module';
import { CupComponent } from './cup.component';
import { NgttSingleEliminationTreeModule } from '../../../projects/ng-tournament-tree/src/lib/single-elimination-tree/ngtt-single-elimination-tree.module';
import { NgttDoubleEliminationTreeModule } from '../../../projects/ng-tournament-tree/src/lib/double-elimination-tree/ngtt-double-elimination-tree.module';
import { MatchModule } from './match/match.module';
import { NgxLodashPipesModule  } from 'ngx-lodash-pipes';
import { RulesComponent } from './rules/rules.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SquadsComponent } from './squads/squads.component';
// import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CupComponent,
    RulesComponent,
    SquadsComponent,
  ],
  imports: [
    CommonModule,
    CupRoutingModule,
    NgttSingleEliminationTreeModule,
    NgttDoubleEliminationTreeModule,
    MatchModule,
    NgxLodashPipesModule,   
    NgHttpLoaderModule.forRoot(),
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule
    // NgxDocViewerModule
  ], 
})
export class CupModule { }

