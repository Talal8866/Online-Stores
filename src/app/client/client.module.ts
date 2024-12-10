import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from './components/client-details/client-details.component';
import { SharedModule } from '../shared/shared.module';
import { WishlistComponent } from './components/wishlist/wishlist.component';


@NgModule({
  declarations: [
    ClientDetailsComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ClientDetailsComponent,
    WishlistComponent
  ]
})
export class ClientModule { }
