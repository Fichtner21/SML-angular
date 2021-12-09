import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InactiveObjRoutingModule } from './inactive-obj-routing.module';
import { InactiveViewComponent } from './inactive-view/inactive-view.component';
import { InactiveObjComponent } from './inactive-obj.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    InactiveViewComponent,
    InactiveObjComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    InactiveObjRoutingModule
  ]
})
export class InactiveObjModule { }
