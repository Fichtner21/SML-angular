import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoutingModule2 } from './about-routing.module';
import { AboutComponent } from './about.component';
import { MapsComponent } from './maps/maps.component';
import { DownloadComponent } from './download/download.component';
import { LogComponent } from './log/log.component';
import { WantedComponent } from './wanted/wanted.component';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';


@NgModule({
  declarations: [
    AboutComponent, 
    MapsComponent, 
    DownloadComponent, 
    LogComponent, 
    WantedComponent
  ],
  imports: [
    CommonModule,      
    AboutRoutingModule2,  
    RouterModule,   
    NgHttpLoaderModule.forRoot(),    
  ]
})
export class AboutModule { }
