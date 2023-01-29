import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { CreateDataComponent } from './create-data/create-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { ListDataComponent } from './list-data/list-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SlugTransformDirective } from '../about/slug-transform.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TokenInterceptor } from '../token.interceptor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
  declarations: [  
    CreateDataComponent,
    EditDataComponent,
    ListDataComponent,
    SlugTransformDirective
  ],
  imports: [
    CommonModule,      
    DashboardRoutingModule,  
    RouterModule,   
    NgHttpLoaderModule.forRoot(),  
    TranslateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,  
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule     
   ],
  exports: [
    CommonModule,
    TranslateModule,
    SlugTransformDirective   
  ],
  
   
})
export class DashboardModule { 
  static forRoot(): ModuleWithProviders<DashboardModule> {
    return {
      ngModule: DashboardModule
    }
  }
 }