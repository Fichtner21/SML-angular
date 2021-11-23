import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { HomeComponent } from './home/home.component';
import { RankingObjComponent } from './ranking-obj/ranking-obj.component';
import { HistoryObjComponent } from './history-obj/history-obj.component';
import { DateFormatPipePipe } from './history-obj/date-format-pipe.pipe';

import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RankingObjComponent,
    HistoryObjComponent,
    DateFormatPipePipe,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [{
    provide: API_KEY,
    useValue: 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU'
  },
    GoogleSheetsDbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
