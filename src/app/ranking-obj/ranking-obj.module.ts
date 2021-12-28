import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { RankingObjComponent } from "./ranking-obj.component";
import { PlayerViewComponent } from "./player-view/player-view.component";
import { RankingObjRoutingModule } from "./ranking-obj-routing.module";
import { NgHttpLoaderModule } from 'ng-http-loader';
import { PlayerViewResolve } from "./player-view/resolver/player-view.resolver";

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
  ],
  providers: [
    PlayerViewResolve,
  ]
})

export class RankingObjModule {}