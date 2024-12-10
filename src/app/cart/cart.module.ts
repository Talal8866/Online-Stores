import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CartDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CartDetailsComponent
  ]
})
export class CartModule { }
