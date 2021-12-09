import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateFormatPipePipe } from './history-obj/date-format-pipe.pipe';
import { HomeComponent } from './home/home.component';
// import { InactiveObjComponent } from './inactive-obj/inactive-obj.component';
// import { RankingObjComponent } from './ranking-obj/ranking-obj.component';
// import { PlayerViewComponent } from './ranking-obj/player-view/player-view.component';

@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,
    // RankingObjComponent,
    DateFormatPipePipe,
    // InactiveObjComponent,
    // PlayerViewComponent,    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,        
  ],
  providers: [{
    provide: API_KEY, 
    useValue: 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU'
  },
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
    GoogleSheetsDbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
