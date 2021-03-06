import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { ConfigComponent } from './config/config.component';
import { DownloadComponent } from './download/download.component';
import { LogComponent } from './log/log.component';
import { MapsComponent } from './maps/maps.component';
import { WantedComponent } from './wanted/wanted.component';


const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
  },    
  {
    path: 'maps',
    component: MapsComponent,
  },
  {
    path: 'download',
    component: DownloadComponent,
  },
  {
    path: 'log',    
    component: LogComponent,
  },
  {
    path: 'wanted',
    component: WantedComponent,
  },
  {
    path: 'config',
    component: ConfigComponent,
  }      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
