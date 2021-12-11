import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { AboutRoutingModule } from "./history-obj-routing.module";
import { HistoryObjComponent } from "./history-obj.component";
import { SingleMatchResolve } from "./single-match/resolver/single-match.resolver";
import { SingleMatchComponent } from "./single-match/single-match.component";

@NgModule({
    declarations: [
      HistoryObjComponent,
      SingleMatchComponent
    ],
    imports: [
        CommonModule,        
        RouterModule,
        AboutRoutingModule,
        NgxPaginationModule
    ],
    providers: [
      SingleMatchResolve
    ]
  })
  export class HistoryObjModule { }