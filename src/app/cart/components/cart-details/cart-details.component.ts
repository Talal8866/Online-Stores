import { Component, Input } from '@angular/core';
import { AuthServiceService } from 'src/app/auth/services/auth.service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {
  constructor(private service_auth: AuthServiceService) { }

  cart_products: any[] = [];
  Shipping: any = 30;
  Discount: any = 0;
  total: any = 0;
  tax: any = 0

  @Input() type: string = "user"

  ngOnInit(): void {
    this.getCartProducts()
  }

  logout() {
    if (this.type === 'user') {
      this.service_auth.logoutuser_service().subscribe(
        (res: any) => {
          alert("You have logged out");
          this.service_auth.setCurrentUser(null); // Clear current user
          console.log(res);
        },
        (error: any) => {
          console.error('Error during user logout:', error);
        }
      );
    } else {
      this.service_auth.logoutshop_service().subscribe(
        (res: any) => {
          alert("You have logged out");
          this.service_auth.setCurrentUser(null); // Clear current user
          console.log(res);
        },
        (error: any) => {
          console.error('Error during shop logout:', error);
        }
      );
    }
  }

  getCartProducts() {
    if ("cart" in localStorage) {
      this.cart_products = JSON.parse(localStorage.getItem("cart")!)
    }
    this.getTotalPrice();
  }

  getTotalPrice() {
    this.total = 0;
    for (let x in this.cart_products) {
      this.total += this.cart_products[x].item.price * this.cart_products[x].item.quantity
    }
    this.getTax()
  }

  add_Quantity(index: number) {
    this.cart_products[index].quantity++;
    this.getTotalPrice();
    localStorage.setItem("cart", JSON.stringify(this.cart_products));
  }

  minus_Quantity(index: number) {
    this.cart_products[index].quantity--;
    this.getTotalPrice();
    localStorage.setItem("cart", JSON.stringify(this.cart_products));
  }

  detectChange() {
    localStorage.setItem("cart", JSON.stringify(this.cart_products));
  }

  deleteProduct(index: number) {
    this.cart_products.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(this.cart_products));
  }

  getTax() {
    let taxRate = 0.05
    this.tax += taxRate * this.total;
  }
}
