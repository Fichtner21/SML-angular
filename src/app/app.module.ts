import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateFormatPipePipe } from './history-obj/date-format-pipe.pipe';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SafePipe } from './history-obj/safe.pipe';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthService } from './auth.service';
import { SecretComponent } from './about/secret/secret.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { AuthGuard } from './auth.guard';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { NgxLodashPipesModule  } from 'ngx-lodash-pipes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsComponent } from './ranking-obj/tabs/tabs.component';
import { TabComponent } from './ranking-obj/tabs/tab.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TokenInterceptor } from './token.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { NotifierModule } from 'angular-notifier';


export function createTranslateLoader(http: HttpClient): TranslateHttpLoader{
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,    
    DateFormatPipePipe,     
    LoginComponent, LogoutComponent, TabsComponent, TabComponent, DashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,  
    ChartsModule,
    FormsModule,
    GoogleMapsModule,    
    AngularFireModule.initializeApp(environment.firebase, 'spearhead-mix-league'),
    AngularFirestoreModule,
    NgxLodashPipesModule,
    OAuthModule.forRoot(),
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    NotifierModule,
    // provideFirestore(() => getFirestore()),
    NgHttpLoaderModule.forRoot(),      
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      // defaultLanguage: 'en',
    }), FontAwesomeModule, BrowserAnimationsModule,        
  ],
  providers: [{
    provide: API_KEY, 
    useValue: 'AIzaSyD6eJ4T-ztIfyFn-h2oDAGTnNNYhNRziLU',    
  }, 
  AuthService,
  AuthGuard,
  {
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
  },
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
    GoogleSheetsDbService,        
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
