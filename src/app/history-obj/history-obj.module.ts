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
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";


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
        TranslateModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        FontAwesomeModule       
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