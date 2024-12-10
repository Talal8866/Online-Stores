import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { BrowserModule } from '@angular/platform-browser';
import { RoutingModule } from '../routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ShopCardComponent } from './components/shop-card/shop-card.component';
import { AuthStatusService } from './services/auth-status.service';
import { AuthInterceptor } from '../auth/services/authinterceptor.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProductComponent,
    ShopCardComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RoutingModule,
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ProductComponent,
    ShopCardComponent,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule,
    RoutingModule,
    FormsModule
    ],
    providers: [
      AuthStatusService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
      
    ]
})
export class SharedModule { }
