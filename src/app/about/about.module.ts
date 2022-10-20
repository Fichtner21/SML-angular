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
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigComponent } from './config/config.component';
import { MeetingComponent } from './meeting/meeting.component';
import { SecretComponent } from './secret/secret.component';


export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AboutComponent, 
    MapsComponent, 
    DownloadComponent, 
    LogComponent, 
    WantedComponent, ConfigComponent, MeetingComponent, SecretComponent
  ],
  imports: [
    CommonModule,      
    AboutRoutingModule,  
    RouterModule,   
    NgHttpLoaderModule.forRoot(),  
    TranslateModule,     
   ],
  exports: [
    CommonModule,
    TranslateModule,   
    SecretComponent 
  ]
})
export class AboutModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AboutModule
    }
  }
 }
