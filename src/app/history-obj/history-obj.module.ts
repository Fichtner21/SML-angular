import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { HistoryRoutingModule } from "./history-obj-routing.module";
import { HistoryObjComponent } from "./history-obj.component";
import { SingleMatchResolve } from "./single-match/resolver/single-match.resolver";
import { SingleMatchComponent } from "./single-match/single-match.component";
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SinglePlayerResolve } from "./single-match/resolver/single-player.resolver";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from "@ngx-translate/core";
import { SafePipe } from "./safe.pipe";

// export function createTranslateLoader(http: HttpClient){
//   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
// }

@NgModule({
    declarations: [
      HistoryObjComponent,
      SingleMatchComponent,
      SafePipe
    ],
    imports: [
        CommonModule,        
        RouterModule,
        HistoryRoutingModule,
        NgxPaginationModule,
        NgHttpLoaderModule.forRoot(),
        TranslateModule
    ],
    exports: [
      CommonModule,
      TranslateModule
    ],
    providers: [
      SingleMatchResolve,
      SinglePlayerResolve,
    ]   
  })
  export class HistoryObjModule { 
    static forRoot(): ModuleWithProviders<HistoryObjModule> {
      return {
        ngModule: HistoryObjModule
      }
    }
  }