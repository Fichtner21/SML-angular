import { CommonModule, DatePipe } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { RankingObjComponent } from "./ranking-obj.component";
import { PlayerViewComponent } from "./player-view/player-view.component";
import { RankingObjRoutingModule } from "./ranking-obj-routing.module";
import { NgHttpLoaderModule } from 'ng-http-loader';
import { PlayerViewResolve } from "./player-view/resolver/player-view.resolver";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from "@angular/common/http";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// export function createTranslateLoader(http: HttpClient){
//   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
// }

@NgModule({
  declarations: [
    RankingObjComponent,
    PlayerViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    RankingObjRoutingModule,
    NgHttpLoaderModule.forRoot(), 
    TranslateModule,
    FontAwesomeModule  
  ],
  exports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    PlayerViewResolve,
    DatePipe
  ]
})

export class RankingObjModule {
  static forRoot(): ModuleWithProviders<RankingObjModule> {
    return {
      ngModule: RankingObjModule
    }
  }
}