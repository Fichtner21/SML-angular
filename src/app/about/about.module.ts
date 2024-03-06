import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { MapsComponent } from './maps/maps.component';
import { DownloadComponent } from './download/download.component';
import { LogComponent } from './log/log.component';
import { WantedComponent } from './wanted/wanted.component';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigComponent } from './config/config.component';
import { MeetingComponent } from './meeting/meeting.component';
import { SecretComponent } from './secret/secret.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { LinksComponent } from './links/links.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ReactiveFormsModule } from '@angular/forms';
import { SlugTransformDirective } from './slug-transform.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RulesComponent } from './rules/rules.component';
import { AboutNavComponent } from './about-nav/about-nav.component';
import { SeasonsComponent } from './seasons/seasons.component';
import { MoviesComponent } from './movies/movies.component';
import { MatToolbarModule } from '@angular/material/toolbar';


export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AboutComponent,
    MapsComponent,
    DownloadComponent,
    LogComponent,
    WantedComponent, ConfigComponent, MeetingComponent, SecretComponent, LinksComponent, RulesComponent, AboutNavComponent, SeasonsComponent, MoviesComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    RouterModule,
    NgHttpLoaderModule.forRoot(),
    TranslateModule,
    GoogleMapsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxGalleryModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule
   ],
  exports: [
    CommonModule,
    TranslateModule,
    SecretComponent
  ]
})
export class AboutModule {
  static forRoot(): ModuleWithProviders<AboutModule> {
    return {
      ngModule: AboutModule
    }
  }
 }
