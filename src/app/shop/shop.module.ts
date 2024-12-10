import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SharedModule } from '../shared/shared.module';
import { AllShopsComponent } from './components/all-shops/all-shops.component';


@NgModule({
  declarations: [
    ProfileComponent,
    EditProfileComponent,
    AllShopsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ProfileComponent,
    EditProfileComponent,
    AllShopsComponent
  ]
})
export class ShopModule { }
