import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProfileComponent } from './shop/components/profile/profile.component';
import { ProductComponent } from './shared/components/product/product.component';
import { AboutUsComponent } from './home/components/about-us/about-us.component';
import { ContentsComponent } from './home/components/contents/contents.component';
import { WishlistComponent } from './client/components/wishlist/wishlist.component';
import { AllShopsComponent } from './shop/components/all-shops/all-shops.component';
import { ShopCardComponent } from './shared/components/shop-card/shop-card.component';
import { ShopSignupComponent } from './auth/components/shop-signup/shop-signup.component';
import { CartDetailsComponent } from './cart/components/cart-details/cart-details.component';
import { EditProfileComponent } from './shop/components/edit-profile/edit-profile.component';
import { AddProductComponent } from './products/components/add-product/add-product.component';
import { AllProductsComponent } from './products/components/all-products/all-products.component';
import { ClientDetailsComponent } from './client/components/client-details/client-details.component';
import { UpdateProductComponent } from './products/components/update-product/update-product.component';
import { ProductDetailsComponent } from './products/components/product-details/product-details.component';

const routes: Routes = [
  { path: "", component: ContentsComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "header", component: HeaderComponent },
  { path: "footer", component: FooterComponent },
  { path: "product", component: ProductComponent },
  { path: "about-us", component: AboutUsComponent },
  { path: "all-shops", component: AllShopsComponent },
  { path: "shop-card", component: ShopCardComponent },
  { path: "profile/:id", component: ProfileComponent },
  { path: "shop-signup", component: ShopSignupComponent },
  { path: "all-products", component: AllProductsComponent },
  { path: "product-details/:productId", component: ProductDetailsComponent },
  { path: "wishlist", component: WishlistComponent, canActivate: [AuthGuard] },
  { path: "add-product", component: AddProductComponent, canActivate: [AuthGuard] },
  { path: "cart-details", component: CartDetailsComponent, canActivate: [AuthGuard] },
  { path: "edit-profile", component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: "client-details", component: ClientDetailsComponent, canActivate: [AuthGuard] },
  { path: "update-product/:id", component: UpdateProductComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }

