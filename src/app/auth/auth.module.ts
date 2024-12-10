import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShopSignupComponent } from './components/shop-signup/shop-signup.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ShopSignupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoginComponent,
    SignupComponent,
    ShopSignupComponent
  ]
})
export class AuthModule { }
