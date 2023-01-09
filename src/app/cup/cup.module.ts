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
// import { NgxDocViewerModule } from 'ngx-doc-viewer';

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
    NgxLodashPipesModule,   
    NgHttpLoaderModule.forRoot(),
    HttpClientModule
    // NgxDocViewerModule
  ], 
})
export class CupModule { }

