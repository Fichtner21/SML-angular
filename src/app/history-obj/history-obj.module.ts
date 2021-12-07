import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { AboutRoutingModule } from "./history-obj-routing.module";
import { HistoryObjComponent } from "./history-obj.component";

@NgModule({
    declarations: [
      HistoryObjComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        AboutRoutingModule,
        NgxPaginationModule
    ],
  })
  export class HistoryObjModule { }