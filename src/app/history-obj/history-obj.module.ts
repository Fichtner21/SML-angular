import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { HistoryRoutingModule } from "./history-obj-routing.module";
import { HistoryObjComponent } from "./history-obj.component";
import { SingleMatchResolve } from "./single-match/resolver/single-match.resolver";
import { SingleMatchComponent } from "./single-match/single-match.component";
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SinglePlayerResolve } from "./single-match/resolver/single-player.resolver";

@NgModule({
    declarations: [
      HistoryObjComponent,
      SingleMatchComponent
    ],
    imports: [
        CommonModule,        
        RouterModule,
        HistoryRoutingModule,
        NgxPaginationModule,
        NgHttpLoaderModule.forRoot(),
    ],
    providers: [
      SingleMatchResolve,
      SinglePlayerResolve,
    ]
  })
  export class HistoryObjModule { }