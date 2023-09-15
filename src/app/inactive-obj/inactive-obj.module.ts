import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { InactiveObjRoutingModule } from './inactive-obj-routing.module';
import { InactiveViewComponent } from './inactive-view/inactive-view.component';
import { InactiveObjComponent } from './inactive-obj.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { InactiveViewResolve } from './inactive-view/resolver/inactive-view.resolver';
import { SortByOrderPipe } from '../sort-by-order.pipe';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    InactiveViewComponent,
    InactiveObjComponent,
    SortByOrderPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TranslateModule,
    InactiveObjRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgHttpLoaderModule.forRoot(),
  ],
  providers: [
    InactiveViewResolve,
    DatePipe
  ]
})
export class InactiveObjModule { }
