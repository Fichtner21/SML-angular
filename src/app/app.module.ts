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
import { OAuthModule, OAuthStorage, UrlHelperService, OAuthService } from 'angular-oauth2-oidc';
import { TokenInterceptor } from './token.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { MatTableModule } from '@angular/material/table';
import { MixUsComponent } from './mix-us/mix-us.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HideRowDirective } from './hide-row.directive';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';



export function createTranslateLoader(http: HttpClient): TranslateHttpLoader{
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};



@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,    
    DateFormatPipePipe,     
    LoginComponent, LogoutComponent, TabsComponent, TabComponent, DashboardComponent, MixUsComponent, HideRowDirective
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
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    NotifierModule.withConfig(customNotifierOptions),
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
  OAuthService,
  UrlHelperService,
  // {
  //   provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
  // },
  {
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
  },
  { provide: OAuthStorage, useValue: localStorage },
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
    GoogleSheetsDbService,        
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
